//
//  VPNState.swift
//  NovaVPN
//
//  The app-facing VPN connection state machine.
//

import Foundation

/// High-level tunnel state driven by `VPNManager`.
///
/// This is deliberately richer than `NEVPNStatus`: it carries the connection
/// start date for the timer, the reconnect attempt for progress feedback,
/// and a typed error for friendly alerts.
enum VPNState: Equatable {
    case disconnected
    case connecting
    case connected(since: Date)
    case reconnecting(attempt: Int)
    case disconnecting
    case failed(VPNError)

    /// True while the tunnel is fully established.
    var isConnected: Bool {
        if case .connected = self { return true }
        return false
    }

    /// True while a transition is in flight and new commands should be ignored.
    var isTransitioning: Bool {
        switch self {
        case .connecting, .reconnecting, .disconnecting: return true
        case .disconnected, .connected, .failed: return false
        }
    }

    /// The moment the current session was established, if connected.
    var connectedSince: Date? {
        if case .connected(let since) = self { return since }
        return nil
    }

    /// Short status line shown under the connect button.
    var statusText: String {
        switch self {
        case .disconnected: return "Not Connected"
        case .connecting: return "Connecting…"
        case .connected: return "Connected"
        case .reconnecting(let attempt): return "Reconnecting… (\(attempt))"
        case .disconnecting: return "Disconnecting…"
        case .failed: return "Connection Failed"
        }
    }

    /// VoiceOver announcement for the current state.
    var accessibilityDescription: String {
        switch self {
        case .disconnected: return "VPN is disconnected"
        case .connecting: return "VPN is connecting"
        case .connected: return "VPN is connected"
        case .reconnecting: return "VPN is reconnecting"
        case .disconnecting: return "VPN is disconnecting"
        case .failed(let error): return "VPN connection failed. \(error.errorDescription ?? "")"
        }
    }
}
