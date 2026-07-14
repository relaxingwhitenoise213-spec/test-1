//
//  TunnelMessage.swift
//  NovaVPN
//
//  Typed IPC between the app and the packet tunnel extension via
//  `sendProviderMessage`. JSON keeps the protocol debuggable and versionable.
//

import Foundation

/// Requests the app can send to the running tunnel process.
enum TunnelMessage: String, Codable {
    /// Ask the tunnel for live runtime statistics (`TunnelRuntimeStats`).
    case getRuntimeStats

    var data: Data { Data(rawValue.utf8) }

    init?(data: Data) {
        guard let raw = String(data: data, encoding: .utf8),
              let message = TunnelMessage(rawValue: raw) else { return nil }
        self = message
    }
}

/// Live statistics reported by the tunnel extension.
///
/// With WireGuardKit linked these come from the adapter's runtime
/// configuration (`wg show` equivalent); the fields mirror the WireGuard
/// cross-platform UAPI so no information is lost in translation.
struct TunnelRuntimeStats: Codable, Equatable {
    /// Bytes received through the tunnel since it started.
    var bytesReceived: Int64
    /// Bytes sent through the tunnel since it started.
    var bytesSent: Int64
    /// Time of the most recent WireGuard handshake, if one has completed.
    var lastHandshake: Date?
    /// Human-readable tunnel-side error, if the tunnel is unhealthy.
    var errorDescription: String?

    static let zero = TunnelRuntimeStats(bytesReceived: 0, bytesSent: 0, lastHandshake: nil, errorDescription: nil)

    /// Seconds since the last completed handshake, if any.
    var handshakeAge: TimeInterval? {
        lastHandshake.map { Date().timeIntervalSince($0) }
    }

    /// WireGuard peers are considered stale when no handshake completed in
    /// ~3 minutes (the protocol re-handshakes every 2 minutes under traffic).
    var isHandshakeStale: Bool {
        guard let age = handshakeAge else { return false }
        return age > 180
    }

    func encoded() throws -> Data {
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .iso8601
        return try encoder.encode(self)
    }

    static func decoded(from data: Data) throws -> TunnelRuntimeStats {
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        return try decoder.decode(TunnelRuntimeStats.self, from: data)
    }
}
