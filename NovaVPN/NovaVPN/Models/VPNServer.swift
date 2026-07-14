//
//  VPNServer.swift
//  NovaVPN
//
//  A VPN location/endpoint as displayed and connected to by the app.
//

import Foundation

/// Reachability of a server as reported by metrics refresh.
enum ServerStatus: String, Codable {
    case online
    case degraded
    case offline
    case unknown

    var label: String {
        switch self {
        case .online: return "Online"
        case .degraded: return "Busy"
        case .offline: return "Offline"
        case .unknown: return "—"
        }
    }
}

/// A single VPN location.
///
/// Static identity (country, endpoint, keys) is immutable; live metrics
/// (`ping`, `load`, `status`) are refreshed by a `ServerProviding` source.
struct VPNServer: Identifiable, Hashable, Codable {
    // MARK: Identity
    let id: String
    let country: String
    let countryCode: String
    let city: String
    /// Emoji flag for the location.
    let flag: String

    // MARK: WireGuard endpoint
    /// Public hostname or IP of the WireGuard endpoint.
    let hostname: String
    let port: UInt16
    /// The server's WireGuard public key (Base64).
    let serverPublicKey: String
    /// Client address assigned inside this server's tunnel network (CIDR).
    let clientAddress: String
    /// DNS resolvers pushed to clients of this server.
    let dnsServers: [String]

    // MARK: Entitlement
    /// Premium locations require an active subscription.
    let isPremium: Bool

    // MARK: Live metrics
    var status: ServerStatus
    /// Current load 0...1.
    var load: Double
    /// Round-trip latency in milliseconds; `nil` until measured.
    var ping: Int?

    /// `host:port` endpoint string used in WireGuard configs.
    var endpoint: String { "\(hostname):\(port)" }

    /// Display name like "United States · New York".
    var displayName: String { "\(country) · \(city)" }

    /// Coarse latency bucket used for tinting the ping label.
    enum PingQuality { case great, okay, poor, unknown }
    var pingQuality: PingQuality {
        guard let ping else { return .unknown }
        switch ping {
        case ..<80: return .great
        case ..<180: return .okay
        default: return .poor
        }
    }

    /// VoiceOver summary of the whole row.
    var accessibilitySummary: String {
        var parts = ["\(country), \(city)"]
        if let ping { parts.append("ping \(ping) milliseconds") }
        parts.append("load \(Int(load * 100)) percent")
        parts.append(status.label)
        if isPremium { parts.append("premium location") }
        return parts.joined(separator: ", ")
    }
}
