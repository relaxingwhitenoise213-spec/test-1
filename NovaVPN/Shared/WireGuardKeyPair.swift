//
//  WireGuardKeyPair.swift
//  NovaVPN
//
//  Curve25519 key handling for WireGuard.
//

import Foundation
import CryptoKit

/// A WireGuard key pair backed by CryptoKit's Curve25519 implementation.
///
/// WireGuard keys are 32-byte Curve25519 points exchanged as Base64 strings.
/// `Curve25519.KeyAgreement` produces exactly the key material WireGuard
/// expects, so no third-party crypto is required to generate device keys.
struct WireGuardKeyPair {
    /// Base64-encoded 32-byte private key.
    let privateKey: String
    /// Base64-encoded 32-byte public key derived from `privateKey`.
    let publicKey: String

    /// Generates a fresh key pair using the system CSPRNG.
    static func generate() -> WireGuardKeyPair {
        let key = Curve25519.KeyAgreement.PrivateKey()
        return WireGuardKeyPair(
            privateKey: key.rawRepresentation.base64EncodedString(),
            publicKey: key.publicKey.rawRepresentation.base64EncodedString()
        )
    }

    /// Recreates a key pair from a stored Base64 private key.
    /// - Returns: `nil` if the string is not a valid 32-byte Curve25519 key.
    static func from(base64PrivateKey: String) -> WireGuardKeyPair? {
        guard
            let raw = Data(base64Encoded: base64PrivateKey),
            raw.count == 32,
            let key = try? Curve25519.KeyAgreement.PrivateKey(rawRepresentation: raw)
        else { return nil }

        return WireGuardKeyPair(
            privateKey: base64PrivateKey,
            publicKey: key.publicKey.rawRepresentation.base64EncodedString()
        )
    }

    /// Validates that a string is a plausible WireGuard key
    /// (Base64 that decodes to exactly 32 bytes).
    static func isValidKey(_ base64: String) -> Bool {
        guard let data = Data(base64Encoded: base64) else { return false }
        return data.count == 32
    }
}
