//
//  KeychainStore.swift
//  NovaVPN
//
//  Thin, dependency-free Keychain wrapper used to persist the device's
//  WireGuard private key. Items are stored in the shared App Group access
//  group so the packet tunnel extension can read them too.
//

import Foundation
import Security

/// Errors surfaced by `KeychainStore`, wrapping raw `OSStatus` codes.
enum KeychainError: LocalizedError {
    case unexpectedStatus(OSStatus)
    case invalidData

    var errorDescription: String? {
        switch self {
        case .unexpectedStatus(let status):
            return "Keychain operation failed (\(status))."
        case .invalidData:
            return "Keychain item contained unreadable data."
        }
    }
}

/// A minimal generic-password Keychain store.
///
/// Values are stored with `kSecAttrAccessibleAfterFirstUnlock` so the tunnel
/// extension can start on boot / in the background without the device being
/// unlocked, which is the standard trade-off for VPN credentials.
struct KeychainStore {
    /// Service namespace for all Nova VPN items.
    private let service = "com.novavpn.app.keychain"
    /// App Group used as the Keychain access group, shared with the tunnel.
    private let accessGroup: String?

    /// - Parameter sharedWithTunnel: when true (default), items are placed in
    ///   the App Group access group. Pass `false` in unit tests or tooling
    ///   that runs without entitlements.
    init(sharedWithTunnel: Bool = true) {
        self.accessGroup = sharedWithTunnel ? SharedConstants.appGroupIdentifier : nil
    }

    // MARK: - API

    func string(for key: String) throws -> String? {
        guard let data = try data(for: key) else { return nil }
        guard let value = String(data: data, encoding: .utf8) else {
            throw KeychainError.invalidData
        }
        return value
    }

    func setString(_ value: String, for key: String) throws {
        try setData(Data(value.utf8), for: key)
    }

    func removeValue(for key: String) throws {
        let status = SecItemDelete(baseQuery(for: key) as CFDictionary)
        guard status == errSecSuccess || status == errSecItemNotFound else {
            throw KeychainError.unexpectedStatus(status)
        }
    }

    // MARK: - Implementation

    private func data(for key: String) throws -> Data? {
        var query = baseQuery(for: key)
        query[kSecReturnData as String] = true
        query[kSecMatchLimit as String] = kSecMatchLimitOne

        var result: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &result)
        switch status {
        case errSecSuccess:
            return result as? Data
        case errSecItemNotFound:
            return nil
        default:
            throw KeychainError.unexpectedStatus(status)
        }
    }

    private func setData(_ data: Data, for key: String) throws {
        var query = baseQuery(for: key)
        let attributes: [String: Any] = [kSecValueData as String: data]

        var status = SecItemUpdate(query as CFDictionary, attributes as CFDictionary)
        if status == errSecItemNotFound {
            query[kSecValueData as String] = data
            query[kSecAttrAccessible as String] = kSecAttrAccessibleAfterFirstUnlock
            status = SecItemAdd(query as CFDictionary, nil)
        }
        guard status == errSecSuccess else {
            throw KeychainError.unexpectedStatus(status)
        }
    }

    private func baseQuery(for key: String) -> [String: Any] {
        var query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: key
        ]
        if let accessGroup {
            query[kSecAttrAccessGroup as String] = accessGroup
        }
        return query
    }
}
