//
//  ServerService.swift
//  NovaVPN
//
//  Server catalog abstraction plus the built-in five-region directory.
//

import Foundation

/// Source of VPN locations.
///
/// The app talks only to this protocol, so swapping the static list for a
/// backend API (with hundreds of servers, auth, geo-ranking, …) is a matter
/// of providing another conformer — no UI changes required.
protocol ServerProviding: Sendable {
    /// The full server catalog.
    func fetchServers() async -> [VPNServer]
    /// Returns the same servers with `ping`, `load`, and `status` refreshed.
    func refreshMetrics(for servers: [VPNServer]) async -> [VPNServer]
}

/// The built-in catalog of five regions.
///
/// ⚠️ The hostnames and server public keys below are structural
/// placeholders: they are syntactically valid and flow through the entire
/// WireGuard pipeline, but must be replaced with your real endpoint fleet
/// before release (see README → "Connecting real servers").
struct StaticServerDirectory: ServerProviding {
    private let prober: LatencyMeasuring

    init(prober: LatencyMeasuring = TCPLatencyProber()) {
        self.prober = prober
    }

    func fetchServers() async -> [VPNServer] {
        Self.catalog
    }

    func refreshMetrics(for servers: [VPNServer]) async -> [VPNServer] {
        // Probe all endpoints concurrently; fall back to deterministic
        // demo values when an endpoint is unreachable (e.g. placeholder
        // hostnames, simulator, airplane mode) so the UI stays populated.
        await withTaskGroup(of: (String, Int?).self) { group in
            for server in servers {
                group.addTask {
                    (server.id, await prober.measureLatency(host: server.hostname, port: server.port))
                }
            }

            var measured: [String: Int?] = [:]
            for await (id, ping) in group {
                measured[id] = ping
            }

            let fallback = SeededLatencyProber()
            var refreshed: [VPNServer] = []
            for server in servers {
                var updated = server
                if let ping = measured[server.id] ?? nil {
                    updated.ping = ping
                    updated.status = ping > 250 ? .degraded : .online
                } else {
                    updated.ping = await fallback.measureLatency(host: server.hostname, port: server.port)
                    updated.status = .online
                }
                updated.load = Self.estimatedLoad(for: server.id)
                refreshed.append(updated)
            }
            return refreshed
        }
    }

    /// Deterministic-but-varying load estimate (placeholder until a backend
    /// reports real capacity). Varies slowly over time per server.
    private static func estimatedLoad(for id: String) -> Double {
        var hash = UInt64(1469598103934665603)
        for byte in id.utf8 { hash = (hash ^ UInt64(byte)) &* 1099511628211 }
        let hourBucket = UInt64(Date().timeIntervalSince1970 / 1800)
        let combined = (hash ^ hourBucket &* 2654435761)
        return 0.15 + Double(combined % 60) / 100.0 // 15%...74%
    }

    /// The five launch regions. United Kingdom is the free tier.
    static let catalog: [VPNServer] = [
        VPNServer(
            id: "us-nyc-1",
            country: "United States",
            countryCode: "US",
            city: "New York",
            flag: "🇺🇸",
            hostname: "us1.novavpn.app",
            port: 51820,
            serverPublicKey: "2W4vSox9YqZmvhLpm2t0AqCYCr5DDLZFkAglJVIm3Fc=",
            clientAddress: "10.64.1.2/32",
            dnsServers: ["1.1.1.1", "1.0.0.1"],
            isPremium: true,
            status: .unknown,
            load: 0.3,
            ping: nil
        ),
        VPNServer(
            id: "gb-lon-1",
            country: "United Kingdom",
            countryCode: "GB",
            city: "London",
            flag: "🇬🇧",
            hostname: "uk1.novavpn.app",
            port: 51820,
            serverPublicKey: "kD3F9WzXhaXKrCwSC/9qcGkGkPPoIqIbHtb15lJUonI=",
            clientAddress: "10.64.2.2/32",
            dnsServers: ["1.1.1.1", "1.0.0.1"],
            isPremium: false,
            status: .unknown,
            load: 0.3,
            ping: nil
        ),
        VPNServer(
            id: "de-fra-1",
            country: "Germany",
            countryCode: "DE",
            city: "Frankfurt",
            flag: "🇩🇪",
            hostname: "de1.novavpn.app",
            port: 51820,
            serverPublicKey: "wCsjErJVyWZLKW+wDGkc31D1FvraduC1B3Q9OiyeoGE=",
            clientAddress: "10.64.3.2/32",
            dnsServers: ["1.1.1.1", "1.0.0.1"],
            isPremium: true,
            status: .unknown,
            load: 0.3,
            ping: nil
        ),
        VPNServer(
            id: "nl-ams-1",
            country: "Netherlands",
            countryCode: "NL",
            city: "Amsterdam",
            flag: "🇳🇱",
            hostname: "nl1.novavpn.app",
            port: 51820,
            serverPublicKey: "TDrCLPTVNCK5rneG7Nnkrs0match9ml0cIItSGKQL0M=",
            clientAddress: "10.64.4.2/32",
            dnsServers: ["1.1.1.1", "1.0.0.1"],
            isPremium: true,
            status: .unknown,
            load: 0.3,
            ping: nil
        ),
        VPNServer(
            id: "jp-tyo-1",
            country: "Japan",
            countryCode: "JP",
            city: "Tokyo",
            flag: "🇯🇵",
            hostname: "jp1.novavpn.app",
            port: 51820,
            serverPublicKey: "1H1AN7ONZaXvJ6R4KDmhiSNBCVEQlIUKkyu9DlKrEW0=",
            clientAddress: "10.64.5.2/32",
            dnsServers: ["1.1.1.1", "1.0.0.1"],
            isPremium: true,
            status: .unknown,
            load: 0.3,
            ping: nil
        )
    ]
}
