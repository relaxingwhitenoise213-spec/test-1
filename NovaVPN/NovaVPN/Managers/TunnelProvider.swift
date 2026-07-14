//
//  TunnelProvider.swift
//  NovaVPN
//
//  App-side control of the packet tunnel: saving the NetworkExtension
//  configuration, starting/stopping the tunnel, observing status, and
//  querying runtime stats.
//

import Foundation
import NetworkExtension

/// Abstraction over the tunnel control plane.
///
/// `TunnelProvider` is the real NetworkExtension implementation;
/// `SimulatedTunnelProvider` drives previews and the iOS simulator, where
/// packet tunnel extensions cannot run.
@MainActor
protocol TunnelProviding: AnyObject {
    /// Current raw NetworkExtension status.
    var status: NEVPNStatus { get }

    /// Emits every status change (also emits the initial status on
    /// subscription so observers can sync up).
    func statusUpdates() -> AsyncStream<NEVPNStatus>

    /// Loads (or creates) the system VPN configuration. The first call on a
    /// fresh install triggers iOS's "Allow VPN Configurations" prompt.
    func prepare() async throws

    /// Saves the configuration for `server` and starts the tunnel.
    func start(configuration: WireGuardConfiguration, server: VPNServer) async throws

    /// Stops the tunnel.
    func stop() async

    /// Fetches live stats from the tunnel process, if it is running.
    func fetchRuntimeStats() async -> TunnelRuntimeStats?

    /// Human-readable reason for the most recent disconnect, if the system
    /// recorded one (e.g. the extension threw from `startTunnel`).
    func lastDisconnectError() async -> String?
}

/// Production implementation backed by `NETunnelProviderManager`.
@MainActor
final class TunnelProvider: TunnelProviding {

    /// The system-registered manager; loaded lazily and cached.
    private var manager: NETunnelProviderManager?

    var status: NEVPNStatus {
        manager?.connection.status ?? .invalid
    }

    func statusUpdates() -> AsyncStream<NEVPNStatus> {
        AsyncStream { continuation in
            continuation.yield(self.status)
            // NEVPNStatusDidChange posts with the NEVPNConnection as object.
            let token = NotificationCenter.default.addObserver(
                forName: .NEVPNStatusDidChange,
                object: nil,
                queue: .main
            ) { notification in
                guard let connection = notification.object as? NEVPNConnection else { return }
                continuation.yield(connection.status)
            }
            continuation.onTermination = { _ in
                NotificationCenter.default.removeObserver(token)
            }
        }
    }

    func prepare() async throws {
        _ = try await loadOrCreateManager()
    }

    func start(configuration: WireGuardConfiguration, server: VPNServer) async throws {
        let manager = try await loadOrCreateManager()

        // Describe the tunnel to the system and hand the wg-quick config to
        // the extension via providerConfiguration.
        let proto = NETunnelProviderProtocol()
        proto.providerBundleIdentifier = SharedConstants.tunnelBundleIdentifier
        proto.serverAddress = server.hostname
        proto.providerConfiguration = [
            SharedConstants.providerConfigurationKey: configuration.asWgQuickConfig()
        ]

        manager.protocolConfiguration = proto
        manager.localizedDescription = AppConfig.appName
        manager.isEnabled = true

        do {
            try await manager.saveToPreferences()
        } catch {
            throw Self.mapNEError(error)
        }
        // NetworkExtension quirk: a manager saved in this process must be
        // re-loaded before startVPNTunnel, or the start call can fail with
        // "configuration is stale".
        try await manager.loadFromPreferences()

        do {
            try manager.connection.startVPNTunnel()
        } catch {
            throw Self.mapNEError(error)
        }
    }

    func stop() async {
        manager?.connection.stopVPNTunnel()
    }

    func fetchRuntimeStats() async -> TunnelRuntimeStats? {
        guard
            let session = manager?.connection as? NETunnelProviderSession,
            session.status == .connected || session.status == .reasserting
        else { return nil }

        // The response handler is only invoked if the provider replies, so a
        // 2-second timeout guarantees the continuation always resumes and the
        // sampling loop can never wedge on an unresponsive extension.
        return await withCheckedContinuation { (continuation: CheckedContinuation<TunnelRuntimeStats?, Never>) in
            let once = SingleResume<TunnelRuntimeStats?>()
            DispatchQueue.global(qos: .utility).asyncAfter(deadline: .now() + 2) {
                once.resume(continuation, returning: nil)
            }
            do {
                try session.sendProviderMessage(TunnelMessage.getRuntimeStats.data) { response in
                    let stats = response.flatMap { try? TunnelRuntimeStats.decoded(from: $0) }
                    once.resume(continuation, returning: stats)
                }
            } catch {
                once.resume(continuation, returning: nil)
            }
        }
    }

    func lastDisconnectError() async -> String? {
        guard let connection = manager?.connection else { return nil }
        do {
            try await connection.fetchLastDisconnectError()
            return nil
        } catch {
            return error.localizedDescription
        }
    }

    // MARK: - Private

    /// Loads the existing Nova VPN manager or creates a fresh one. Creating
    /// + saving for the first time triggers the system permission dialog.
    private func loadOrCreateManager() async throws -> NETunnelProviderManager {
        if let manager { return manager }

        let managers: [NETunnelProviderManager]
        do {
            managers = try await NETunnelProviderManager.loadAllFromPreferences()
        } catch {
            throw Self.mapNEError(error)
        }

        let loaded = managers.first ?? NETunnelProviderManager()
        manager = loaded

        // A brand-new manager must be saved once so it exists in the system
        // preferences (this is the moment iOS asks for VPN permission).
        if managers.isEmpty {
            let proto = NETunnelProviderProtocol()
            proto.providerBundleIdentifier = SharedConstants.tunnelBundleIdentifier
            proto.serverAddress = AppConfig.appName
            loaded.protocolConfiguration = proto
            loaded.localizedDescription = AppConfig.appName
            do {
                try await loaded.saveToPreferences()
                try await loaded.loadFromPreferences()
            } catch {
                manager = nil
                throw Self.mapNEError(error)
            }
        }
        return loaded
    }

    /// Maps NetworkExtension errors onto user-presentable `VPNError`s.
    private static func mapNEError(_ error: Error) -> VPNError {
        let nsError = error as NSError
        if nsError.domain == NEVPNErrorDomain,
           let code = NEVPNError.Code(rawValue: nsError.code) {
            switch code {
            case .configurationReadWriteFailed, .configurationInvalid, .configurationDisabled:
                // Read/write failure on save is how a permission denial
                // manifests when the user taps "Don't Allow".
                return .permissionDenied
            case .connectionFailed:
                return .tunnelFailed("The connection attempt failed.")
            case .configurationStale:
                return .tunnelFailed("The VPN configuration was out of date. Please try again.")
            @unknown default:
                return .unknown(error.localizedDescription)
            }
        }
        return .unknown(error.localizedDescription)
    }
}

/// Guards a continuation that may be raced by multiple callbacks
/// (response vs. timeout), guaranteeing exactly one resume.
private final class SingleResume<Value: Sendable>: @unchecked Sendable {
    private let lock = NSLock()
    private var resumed = false

    func resume(_ continuation: CheckedContinuation<Value, Never>, returning value: Value) {
        lock.lock()
        defer { lock.unlock() }
        guard !resumed else { return }
        resumed = true
        continuation.resume(returning: value)
    }
}

/// Simulator/preview implementation with realistic state transitions and
/// synthesized traffic counters. Packet tunnel providers can't run in the
/// iOS simulator, so this keeps the full app flow demonstrable there.
@MainActor
final class SimulatedTunnelProvider: TunnelProviding {

    private(set) var status: NEVPNStatus = .disconnected {
        didSet {
            for continuation in continuations.values {
                continuation.yield(status)
            }
        }
    }

    private var continuations: [UUID: AsyncStream<NEVPNStatus>.Continuation] = [:]
    private var connectedAt: Date?
    private var transitionTask: Task<Void, Never>?

    func statusUpdates() -> AsyncStream<NEVPNStatus> {
        AsyncStream { continuation in
            let id = UUID()
            continuations[id] = continuation
            continuation.yield(self.status)
            continuation.onTermination = { [weak self] _ in
                Task { @MainActor [weak self] in
                    self?.continuations.removeValue(forKey: id)
                }
            }
        }
    }

    func prepare() async throws {
        // No system permission exists in the simulator; nothing to do.
    }

    func start(configuration: WireGuardConfiguration, server: VPNServer) async throws {
        transitionTask?.cancel()
        status = .connecting
        transitionTask = Task { [weak self] in
            try? await Task.sleep(for: .milliseconds(1400))
            guard let self, !Task.isCancelled else { return }
            self.connectedAt = Date()
            self.status = .connected
        }
    }

    func stop() async {
        transitionTask?.cancel()
        status = .disconnecting
        try? await Task.sleep(for: .milliseconds(400))
        connectedAt = nil
        status = .disconnected
    }

    func fetchRuntimeStats() async -> TunnelRuntimeStats? {
        guard status == .connected, let connectedAt else { return nil }
        // Synthesize plausible cumulative counters: ~2.5 MB/s down, 400 KB/s
        // up with a little wobble, plus a handshake ~every 2 minutes.
        let elapsed = Date().timeIntervalSince(connectedAt)
        let wobble = 0.7 + 0.6 * abs(sin(elapsed / 7))
        return TunnelRuntimeStats(
            bytesReceived: Int64(elapsed * 2_500_000 * wobble),
            bytesSent: Int64(elapsed * 400_000 * wobble),
            lastHandshake: Date().addingTimeInterval(-elapsed.truncatingRemainder(dividingBy: 120)),
            errorDescription: nil
        )
    }

    func lastDisconnectError() async -> String? { nil }
}
