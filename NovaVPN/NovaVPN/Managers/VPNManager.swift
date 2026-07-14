//
//  VPNManager.swift
//  NovaVPN
//
//  The orchestrator: owns the VPN state machine and coordinates the tunnel,
//  configuration building, entitlement gating, usage limits, auto-reconnect,
//  handshake health, and network-change reactions.
//

import Foundation
import NetworkExtension
import Observation

/// Supplies the current subscription entitlement. `SubscriptionManager`
/// conforms; injected as a protocol to keep the VPN stack testable and free
/// of StoreKit imports.
@MainActor
protocol PremiumStatusProviding: AnyObject {
    var isPremium: Bool { get }
}

@MainActor
@Observable
final class VPNManager {

    // MARK: Published state

    /// The app-facing state machine. Views render exclusively from this.
    private(set) var state: VPNState = .disconnected

    /// Server of the active (or most recent) session.
    private(set) var activeServer: VPNServer?

    /// Last error, kept for the Home screen's alert.
    var lastError: VPNError?

    // MARK: Dependencies

    private let tunnel: TunnelProviding
    private let configurationManager: ConfigurationManager
    private let monitor: ConnectionMonitor
    private let settings: SettingsStore
    private let usage: UsageService
    private weak var premiumStatus: (any PremiumStatusProviding)?

    // MARK: Internals

    /// True while the user explicitly asked to disconnect, so an incoming
    /// `.disconnected` status isn't treated as a drop.
    private var userRequestedDisconnect = false
    /// True while we're cycling the tunnel ourselves (server switch,
    /// handshake recovery), so transient statuses don't reset the UI.
    private var isCyclingTunnel = false
    private var reconnectAttempt = 0

    private var statusTask: Task<Void, Never>?
    private var pathTask: Task<Void, Never>?
    private var healthTask: Task<Void, Never>?

    init(
        tunnel: TunnelProviding,
        configurationManager: ConfigurationManager,
        monitor: ConnectionMonitor,
        settings: SettingsStore,
        usage: UsageService,
        premiumStatus: any PremiumStatusProviding
    ) {
        self.tunnel = tunnel
        self.configurationManager = configurationManager
        self.monitor = monitor
        self.settings = settings
        self.usage = usage
        self.premiumStatus = premiumStatus

        observeTunnelStatus()
        observeNetworkPath()
    }

    deinit {
        statusTask?.cancel()
        pathTask?.cancel()
        healthTask?.cancel()
    }

    // MARK: - Derived state

    /// Whether auto-reconnect is active (user setting + Premium entitlement).
    var autoReconnectEnabled: Bool {
        settings.autoReconnect && (premiumStatus?.isPremium ?? false)
    }

    /// Elapsed time of the current session.
    var connectionDuration: TimeInterval {
        state.connectedSince.map { Date().timeIntervalSince($0) } ?? 0
    }

    // MARK: - Permission

    /// Registers the VPN configuration with iOS, triggering the system
    /// permission prompt on first run. Safe to call repeatedly.
    func requestPermission() async throws {
        do {
            try await tunnel.prepare()
        } catch let error as VPNError {
            lastError = error
            throw error
        } catch {
            let mapped = VPNError.unknown(error.localizedDescription)
            lastError = mapped
            throw mapped
        }
    }

    // MARK: - Commands

    /// Connects to `server`, enforcing entitlement and free-tier limits.
    func connect(to server: VPNServer) async {
        guard !state.isTransitioning else { return }

        lastError = nil
        let isPremiumUser = premiumStatus?.isPremium ?? false

        // Entitlement gate: free users may only use the free location.
        if server.isPremium && !isPremiumUser {
            fail(with: .premiumRequired)
            return
        }
        // Free-tier daily allowance.
        if !isPremiumUser && usage.remainingToday() <= 0 {
            fail(with: .dailyLimitReached)
            return
        }
        guard monitor.isOnline else {
            fail(with: .networkUnavailable)
            return
        }
        guard server.status != .offline else {
            fail(with: .serverUnavailable(server.country))
            return
        }

        state = .connecting
        activeServer = server
        reconnectAttempt = 0
        userRequestedDisconnect = false

        await startTunnel(to: server)
    }

    /// Clears the last error after the UI has presented it, returning a
    /// `.failed` state machine back to idle.
    func acknowledgeError() {
        lastError = nil
        if case .failed = state {
            state = .disconnected
        }
    }

    /// Disconnects at the user's request.
    func disconnect() async {
        guard state.isConnected || state.isTransitioning else { return }
        userRequestedDisconnect = true
        state = .disconnecting
        await tunnel.stop()
    }

    /// Tears the tunnel down and brings it back up (server switch, handshake
    /// recovery, network change).
    func reconnect() async {
        guard let server = activeServer else { return }
        isCyclingTunnel = true
        defer { isCyclingTunnel = false }

        state = .reconnecting(attempt: max(reconnectAttempt, 1))
        await tunnel.stop()
        // Give NetworkExtension a moment to settle before restarting.
        try? await Task.sleep(for: .milliseconds(600))
        await startTunnel(to: server)
    }

    /// Switches location: updates selection, and if a session is active,
    /// cycles the tunnel onto the new server.
    func switchServer(to server: VPNServer) async {
        let wasActive = state.isConnected || state.isTransitioning
        activeServer = server
        settings.selectedServerID = server.id
        if wasActive {
            let isPremiumUser = premiumStatus?.isPremium ?? false
            if server.isPremium && !isPremiumUser {
                await disconnect()
                fail(with: .premiumRequired)
                return
            }
            await reconnect()
        }
    }

    // MARK: - Tunnel plumbing

    private func startTunnel(to server: VPNServer) async {
        do {
            let configuration = try configurationManager.configuration(for: server)
            try await tunnel.start(configuration: configuration, server: server)
            // Success is reported asynchronously via the status stream.
        } catch let error as VPNError {
            fail(with: error)
        } catch {
            fail(with: .unknown(error.localizedDescription))
        }
    }

    private func fail(with error: VPNError) {
        lastError = error
        state = .failed(error)
    }

    // MARK: - Status observation

    private func observeTunnelStatus() {
        statusTask = Task { [weak self] in
            guard let self else { return }
            for await status in self.tunnel.statusUpdates() {
                self.handle(status: status)
            }
        }
    }

    private func handle(status: NEVPNStatus) {
        switch status {
        case .connected:
            reconnectAttempt = 0
            if !state.isConnected {
                state = .connected(since: Date())
                usage.beginSession()
                monitor.startSampling(from: tunnel)
                startHealthChecks()
            }

        case .connecting:
            guard !isCyclingTunnel else { return }
            if case .reconnecting = state { return }
            state = .connecting

        case .reasserting:
            state = .reconnecting(attempt: max(reconnectAttempt, 1))

        case .disconnecting:
            if !isCyclingTunnel {
                state = .disconnecting
            }

        case .disconnected, .invalid:
            let wasEstablished = state.isConnected
            if wasEstablished {
                usage.endSession()
            }
            monitor.stopSampling()
            stopHealthChecks()

            if isCyclingTunnel {
                // Our own stop during reconnect; startTunnel follows.
                return
            }
            if userRequestedDisconnect {
                userRequestedDisconnect = false
                state = .disconnected
                return
            }
            // Unexpected drop or failed attempt.
            if case .failed = state {
                return // Keep the specific error we already set.
            }
            Task { [weak self] in
                await self?.handleUnexpectedDrop(wasEstablished: wasEstablished)
            }

        @unknown default:
            break
        }
    }

    /// Auto-reconnect policy for drops we didn't initiate.
    private func handleUnexpectedDrop(wasEstablished: Bool) async {
        if autoReconnectEnabled, activeServer != nil, monitor.isOnline,
           reconnectAttempt < AppConfig.maxReconnectAttempts {
            reconnectAttempt += 1
            state = .reconnecting(attempt: reconnectAttempt)
            try? await Task.sleep(for: .seconds(AppConfig.reconnectBaseDelay * Double(reconnectAttempt)))
            await reconnect()
        } else if wasEstablished {
            state = .disconnected
            if let reason = await tunnel.lastDisconnectError() {
                lastError = .tunnelFailed(reason)
            }
        } else {
            let reason = await tunnel.lastDisconnectError()
            fail(with: .tunnelFailed(reason ?? "The connection attempt did not complete."))
        }
    }

    // MARK: - Network path reactions

    private func observeNetworkPath() {
        pathTask = Task { [weak self] in
            guard let self else { return }
            var previous: NetworkPathSnapshot?
            for await snapshot in self.monitor.pathUpdates() {
                defer { previous = snapshot }
                guard let previous else { continue }

                if self.state.isConnected {
                    if !snapshot.isOnline {
                        // Path lost entirely; WireGuard will silently stall,
                        // so surface it and let auto-reconnect take over
                        // when the network returns.
                        self.state = .reconnecting(attempt: 1)
                    } else if !previous.isOnline || previous.usesWifi != snapshot.usesWifi {
                        // Network came back or Wi‑Fi⇄cellular migration:
                        // cycle the tunnel so the endpoint re-binds promptly.
                        await self.reconnect()
                    }
                } else if case .reconnecting = self.state, snapshot.isOnline, !previous.isOnline {
                    await self.reconnect()
                }
            }
        }
    }

    // MARK: - Session health (handshake + free-tier limit)

    private func startHealthChecks() {
        stopHealthChecks()
        healthTask = Task { [weak self] in
            while !Task.isCancelled {
                try? await Task.sleep(for: .seconds(15))
                guard let self, self.state.isConnected else { continue }

                // Handshake monitoring: a stale handshake means the peer is
                // unreachable even though the interface is up.
                if self.monitor.stats.isHandshakeStale {
                    await self.reconnect()
                    continue
                }
                // Free-tier daily allowance enforcement.
                if !(self.premiumStatus?.isPremium ?? false), self.usage.remainingToday() <= 0 {
                    await self.disconnect()
                    self.lastError = .dailyLimitReached
                }
            }
        }
    }

    private func stopHealthChecks() {
        healthTask?.cancel()
        healthTask = nil
    }
}
