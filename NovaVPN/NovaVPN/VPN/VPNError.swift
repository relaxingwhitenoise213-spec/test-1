//
//  VPNError.swift
//  NovaVPN
//
//  Typed, user-presentable VPN errors.
//

import Foundation

/// Every failure the VPN stack can surface to the UI, with friendly copy.
enum VPNError: LocalizedError, Equatable {
    /// The user declined the iOS "Allow VPN Configurations" prompt.
    case permissionDenied
    /// The device has no usable network path.
    case networkUnavailable
    /// The selected server is offline or unreachable.
    case serverUnavailable(String)
    /// A premium location was selected without an active subscription.
    case premiumRequired
    /// The free daily usage allowance is exhausted.
    case dailyLimitReached
    /// The generated WireGuard configuration failed validation.
    case configurationInvalid(String)
    /// The tunnel process reported a failure.
    case tunnelFailed(String)
    /// Anything unexpected.
    case unknown(String)

    var errorDescription: String? {
        switch self {
        case .permissionDenied:
            return "VPN permission was declined."
        case .networkUnavailable:
            return "You appear to be offline."
        case .serverUnavailable(let name):
            return "\(name) is unavailable right now."
        case .premiumRequired:
            return "This location requires Nova Premium."
        case .dailyLimitReached:
            return "You've used today's free allowance."
        case .configurationInvalid(let reason):
            return "Configuration error: \(reason)"
        case .tunnelFailed(let reason):
            return "The tunnel stopped: \(reason)"
        case .unknown(let reason):
            return reason
        }
    }

    var recoverySuggestion: String? {
        switch self {
        case .permissionDenied:
            return "Nova VPN needs permission to add a VPN configuration. Tap Connect to try again, then choose Allow."
        case .networkUnavailable:
            return "Check your Wi‑Fi or cellular connection and try again."
        case .serverUnavailable:
            return "Pick another location or try again in a moment."
        case .premiumRequired:
            return "Upgrade to unlock all locations, or switch to the United Kingdom."
        case .dailyLimitReached:
            return "Upgrade to Premium for unlimited usage, or come back tomorrow."
        case .configurationInvalid, .tunnelFailed, .unknown:
            return "Please try again. If the problem persists, contact support."
        }
    }

    /// Errors that are best resolved by showing the paywall.
    var promptsUpgrade: Bool {
        switch self {
        case .premiumRequired, .dailyLimitReached: return true
        default: return false
        }
    }
}
