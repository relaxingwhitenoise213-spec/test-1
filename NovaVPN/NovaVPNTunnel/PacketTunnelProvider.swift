//
//  PacketTunnelProvider.swift
//  NovaVPNTunnel
//
//  The NetworkExtension packet tunnel provider that runs the WireGuard
//  data plane in its own process.
//
//  Production note: the actual WireGuard implementation is provided by
//  WireGuardKit (https://git.zx2c4.com/wireguard-apple). That package
//  requires a one-time `wireguard-go-bridge` build-target setup documented
//  in the project README, so it is integrated behind `canImport` — this file
//  compiles and behaves correctly both before and after the package is
//  added. Without WireGuardKit the tunnel reports a descriptive error
//  instead of silently black-holing traffic.
//

import Foundation
import NetworkExtension
import os.log

#if canImport(WireGuardKit)
import WireGuardKit
#endif

/// Errors the tunnel process can fail with. `NEProviderStopReason` covers
/// system-initiated stops; these cover our own failures.
enum PacketTunnelError: LocalizedError {
    case missingConfiguration
    case invalidConfiguration(String)
    case wireGuardBackendUnavailable

    var errorDescription: String? {
        switch self {
        case .missingConfiguration:
            return "The tunnel was started without a WireGuard configuration."
        case .invalidConfiguration(let reason):
            return "The WireGuard configuration is invalid: \(reason)"
        case .wireGuardBackendUnavailable:
            return "WireGuardKit is not linked. Add the WireGuardKit package (see README) to enable real tunneling."
        }
    }
}

final class PacketTunnelProvider: NEPacketTunnelProvider {

    private let log = Logger(subsystem: "com.novavpn.app.PacketTunnel", category: "tunnel")

    /// Parsed configuration for the current session; kept for stats/queries.
    private var activeConfiguration: WireGuardConfiguration?

    /// Most recent tunnel-side error, surfaced through `getRuntimeStats`.
    private var lastErrorDescription: String?

#if canImport(WireGuardKit)
    /// The WireGuard user-space backend (wireguard-go) adapter.
    private lazy var adapter = WireGuardAdapter(with: self) { [weak self] _, message in
        self?.log.debug("WireGuard: \(message, privacy: .public)")
    }
#endif

    // MARK: - NEPacketTunnelProvider

    override func startTunnel(options: [String: NSObject]?) async throws {
        log.info("Starting tunnel")

        let configuration = try loadConfiguration()
        activeConfiguration = configuration

#if canImport(WireGuardKit)
        let tunnelConfiguration = try TunnelConfiguration(
            fromWgQuickConfig: configuration.asWgQuickConfig(),
            called: configuration.name
        )
        try await withCheckedThrowingContinuation { (continuation: CheckedContinuation<Void, Error>) in
            adapter.start(tunnelConfiguration: tunnelConfiguration) { error in
                if let error {
                    continuation.resume(throwing: error)
                } else {
                    continuation.resume()
                }
            }
        }
        log.info("WireGuard adapter started")
#else
        // Apply real network settings derived from the configuration so the
        // code path is exercised end-to-end, then fail with a clear message:
        // completing successfully without a data plane would black-hole the
        // device's traffic.
        try await setTunnelNetworkSettings(makeNetworkSettings(for: configuration))
        lastErrorDescription = PacketTunnelError.wireGuardBackendUnavailable.errorDescription
        log.error("WireGuardKit not linked; refusing to fake a tunnel")
        throw PacketTunnelError.wireGuardBackendUnavailable
#endif
    }

    override func stopTunnel(with reason: NEProviderStopReason) async {
        log.info("Stopping tunnel, reason: \(String(describing: reason), privacy: .public)")
#if canImport(WireGuardKit)
        await withCheckedContinuation { (continuation: CheckedContinuation<Void, Never>) in
            adapter.stop { [weak self] error in
                if let error {
                    self?.log.error("Failed to stop adapter: \(error.localizedDescription, privacy: .public)")
                }
                continuation.resume()
            }
        }
#endif
        activeConfiguration = nil
    }

    /// Typed IPC endpoint for the app (see `TunnelMessage`).
    override func handleAppMessage(_ messageData: Data) async -> Data? {
        guard let message = TunnelMessage(data: messageData) else { return nil }
        switch message {
        case .getRuntimeStats:
            return try? (await currentRuntimeStats()).encoded()
        }
    }

    // MARK: - Configuration

    /// Reads and parses the wg-quick config placed in
    /// `providerConfiguration` by the app's `ConfigurationManager`.
    private func loadConfiguration() throws -> WireGuardConfiguration {
        guard
            let proto = protocolConfiguration as? NETunnelProviderProtocol,
            let wgQuickConfig = proto.providerConfiguration?[SharedConstants.providerConfigurationKey] as? String
        else {
            throw PacketTunnelError.missingConfiguration
        }
        do {
            return try WireGuardConfiguration.parse(
                wgQuickConfig: wgQuickConfig,
                name: proto.serverAddress ?? "NovaVPN"
            )
        } catch {
            throw PacketTunnelError.invalidConfiguration(error.localizedDescription)
        }
    }

    /// Builds `NEPacketTunnelNetworkSettings` from a WireGuard configuration:
    /// tunnel addresses, DNS, MTU, and routes derived from AllowedIPs.
    /// (When WireGuardKit is linked, its adapter performs the equivalent
    /// internally; this is used by the fallback path.)
    private func makeNetworkSettings(for configuration: WireGuardConfiguration) -> NEPacketTunnelNetworkSettings {
        let remoteAddress = configuration.peers.first?.endpointHost ?? "0.0.0.0"
        let settings = NEPacketTunnelNetworkSettings(tunnelRemoteAddress: remoteAddress)

        // Split interface addresses into IPv4/IPv6.
        var ipv4Addresses: [String] = []
        var ipv6Addresses: [String] = []
        for host in configuration.interface.addressHosts {
            if host.contains(":") { ipv6Addresses.append(host) } else { ipv4Addresses.append(host) }
        }
        if !ipv4Addresses.isEmpty {
            let ipv4 = NEIPv4Settings(
                addresses: ipv4Addresses,
                subnetMasks: ipv4Addresses.map { _ in "255.255.255.255" }
            )
            let routesAll = configuration.peers.flatMap(\.allowedIPs).contains("0.0.0.0/0")
            ipv4.includedRoutes = routesAll ? [.default()] : []
            settings.ipv4Settings = ipv4
        }
        if !ipv6Addresses.isEmpty {
            let ipv6 = NEIPv6Settings(
                addresses: ipv6Addresses,
                networkPrefixLengths: ipv6Addresses.map { _ in 128 }
            )
            let routesAll = configuration.peers.flatMap(\.allowedIPs).contains("::/0")
            ipv6.includedRoutes = routesAll ? [.default()] : []
            settings.ipv6Settings = ipv6
        }
        if !configuration.interface.dns.isEmpty {
            let dns = NEDNSSettings(servers: configuration.interface.dns)
            dns.matchDomains = [""] // Resolve all domains through the tunnel.
            settings.dnsSettings = dns
        }
        settings.mtu = NSNumber(value: configuration.interface.mtu ?? 1420)
        return settings
    }

    // MARK: - Stats

    /// Gathers live stats for the app's `ConnectionMonitor`.
    private func currentRuntimeStats() async -> TunnelRuntimeStats {
#if canImport(WireGuardKit)
        // Query the adapter's runtime configuration (UAPI `wg show` output)
        // and pull transfer counters plus the latest handshake time.
        let runtime: String? = await withCheckedContinuation { continuation in
            adapter.getRuntimeConfiguration { continuation.resume(returning: $0) }
        }
        var stats = TunnelRuntimeStats.zero
        stats.errorDescription = lastErrorDescription
        guard let runtime else { return stats }
        for line in runtime.split(separator: "\n") {
            let parts = line.split(separator: "=", maxSplits: 1).map(String.init)
            guard parts.count == 2 else { continue }
            switch parts[0] {
            case "rx_bytes": stats.bytesReceived += Int64(parts[1]) ?? 0
            case "tx_bytes": stats.bytesSent += Int64(parts[1]) ?? 0
            case "last_handshake_time_sec":
                if let seconds = TimeInterval(parts[1]), seconds > 0 {
                    let handshake = Date(timeIntervalSince1970: seconds)
                    if stats.lastHandshake.map({ handshake > $0 }) ?? true {
                        stats.lastHandshake = handshake
                    }
                }
            default: break
            }
        }
        return stats
#else
        var stats = TunnelRuntimeStats.zero
        stats.errorDescription = lastErrorDescription
        return stats
#endif
    }
}
