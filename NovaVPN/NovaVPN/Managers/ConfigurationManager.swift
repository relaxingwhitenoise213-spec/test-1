//
//  ConfigurationManager.swift
//  NovaVPN
//
//  Builds WireGuard configurations for servers and owns the device key pair.
//

import Foundation

/// Creates per-server WireGuard configurations.
///
/// The device's Curve25519 private key is generated once on first use and
/// stored in the shared Keychain access group, where the packet tunnel
/// extension can also read it. It never leaves the Keychain unencrypted at
/// rest and is never logged.
@MainActor
final class ConfigurationManager {
    private let keychain: KeychainStore
    private static let privateKeyKeychainKey = "wireguard.device.privateKey"

    /// Cached in memory after first load to avoid repeated Keychain round trips.
    private var cachedKeyPair: WireGuardKeyPair?

    init(keychain: KeychainStore = KeychainStore()) {
        self.keychain = keychain
    }

    /// Returns the device key pair, generating and persisting one if needed.
    func deviceKeyPair() throws -> WireGuardKeyPair {
        if let cachedKeyPair { return cachedKeyPair }

        if let stored = try keychain.string(for: Self.privateKeyKeychainKey),
           let keyPair = WireGuardKeyPair.from(base64PrivateKey: stored) {
            cachedKeyPair = keyPair
            return keyPair
        }

        let keyPair = WireGuardKeyPair.generate()
        try keychain.setString(keyPair.privateKey, for: Self.privateKeyKeychainKey)
        cachedKeyPair = keyPair
        return keyPair
    }

    /// The public key to register with the backend when provisioning this
    /// device on real servers.
    func devicePublicKey() throws -> String {
        try deviceKeyPair().publicKey
    }

    /// Builds a validated full-tunnel WireGuard configuration for a server.
    func configuration(for server: VPNServer) throws -> WireGuardConfiguration {
        let keyPair: WireGuardKeyPair
        do {
            keyPair = try deviceKeyPair()
        } catch {
            throw VPNError.configurationInvalid("Unable to access the device key: \(error.localizedDescription)")
        }

        let configuration = WireGuardConfiguration(
            name: server.displayName,
            interface: InterfaceConfiguration(
                privateKey: keyPair.privateKey,
                addresses: [server.clientAddress],
                dns: server.dnsServers,
                mtu: 1420
            ),
            peers: [
                PeerConfiguration(
                    publicKey: server.serverPublicKey,
                    presharedKey: nil,
                    endpoint: server.endpoint,
                    // Full tunnel: route all IPv4 + IPv6 traffic.
                    allowedIPs: ["0.0.0.0/0", "::/0"],
                    // Keep NAT mappings alive so the tunnel survives idle periods.
                    persistentKeepAlive: 25
                )
            ]
        )

        do {
            try configuration.validate()
        } catch {
            throw VPNError.configurationInvalid(error.localizedDescription)
        }
        return configuration
    }
}
