//
//  AppConfig.swift
//  NovaVPN
//
//  App-wide constants: URLs, product identifiers, feature parameters.
//  No secrets belong here — keys and credentials live in the Keychain.
//

import Foundation

enum AppConfig {
    // MARK: App identity
    static let appName = "Nova VPN"
    static let supportEmail = "support@novavpn.app"

    /// Marketing version + build, e.g. "1.0.0 (1)".
    static var versionString: String {
        let info = Bundle.main.infoDictionary
        let version = info?["CFBundleShortVersionString"] as? String ?? "1.0"
        let build = info?["CFBundleVersion"] as? String ?? "1"
        return "\(version) (\(build))"
    }

    // MARK: Links
    static let privacyPolicyURL = URL(string: "https://novavpn.app/privacy")!
    static let termsOfServiceURL = URL(string: "https://novavpn.app/terms")!
    static let supportURL = URL(string: "mailto:support@novavpn.app")!

    // MARK: Free tier
    /// Free users get this much connected time per calendar day.
    static let freeDailyAllowance: TimeInterval = 30 * 60

    // MARK: Reconnection policy
    static let maxReconnectAttempts = 3
    /// Base delay between reconnect attempts; grows linearly per attempt.
    static let reconnectBaseDelay: TimeInterval = 2
}
