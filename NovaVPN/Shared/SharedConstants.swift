//
//  SharedConstants.swift
//  NovaVPN
//
//  Constants shared between the app and the packet tunnel extension.
//

import Foundation

/// Identifiers that must stay in sync across the app target, the tunnel
/// extension target, and the provisioning profiles.
enum SharedConstants {
    /// App Group shared by the app and the tunnel extension. Used for the
    /// Keychain access group so both processes can read the device's
    /// WireGuard private key.
    static let appGroupIdentifier = "group.com.novavpn.app"

    /// Bundle identifier of the packet tunnel extension. Referenced by
    /// `NETunnelProviderProtocol.providerBundleIdentifier`.
    static let tunnelBundleIdentifier = "com.novavpn.app.PacketTunnel"

    /// Key under which the wg-quick configuration string is stored inside
    /// `NETunnelProviderProtocol.providerConfiguration`.
    static let providerConfigurationKey = "wgQuickConfig"
}
