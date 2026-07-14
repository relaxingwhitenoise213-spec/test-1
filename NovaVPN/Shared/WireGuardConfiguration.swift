//
//  WireGuardConfiguration.swift
//  NovaVPN
//
//  A minimal, dependency-free model of a WireGuard tunnel configuration
//  with wg-quick (INI) parsing and serialization. Used by the app to build
//  configurations and by the packet tunnel extension to consume them.
//

import Foundation

/// Errors thrown while parsing or validating a wg-quick configuration.
enum WireGuardConfigurationError: LocalizedError, Equatable {
    case missingInterface
    case missingPeer
    case invalidKey(String)
    case invalidEndpoint(String)
    case invalidAddress(String)
    case malformedLine(String)

    var errorDescription: String? {
        switch self {
        case .missingInterface: return "The configuration has no [Interface] section."
        case .missingPeer: return "The configuration has no [Peer] section."
        case .invalidKey(let key): return "Invalid WireGuard key: \(key)"
        case .invalidEndpoint(let endpoint): return "Invalid peer endpoint: \(endpoint)"
        case .invalidAddress(let address): return "Invalid interface address: \(address)"
        case .malformedLine(let line): return "Malformed configuration line: \(line)"
        }
    }
}

/// The `[Interface]` section of a WireGuard configuration.
struct InterfaceConfiguration: Equatable {
    /// Base64 Curve25519 private key of this device.
    var privateKey: String
    /// Tunnel-internal addresses in CIDR notation, e.g. `10.8.0.2/32`.
    var addresses: [String]
    /// DNS resolvers to use inside the tunnel.
    var dns: [String]
    /// Optional tunnel MTU. WireGuard's conventional default is 1420.
    var mtu: Int?

    /// The IPv4/IPv6 host parts of `addresses` (CIDR suffix stripped).
    var addressHosts: [String] {
        addresses.map { $0.split(separator: "/").first.map(String.init) ?? $0 }
    }
}

/// A `[Peer]` section of a WireGuard configuration.
struct PeerConfiguration: Equatable {
    /// Base64 Curve25519 public key of the server.
    var publicKey: String
    /// Optional Base64 pre-shared key for post-quantum resistance.
    var presharedKey: String?
    /// Server endpoint as `host:port`.
    var endpoint: String
    /// Routes to send through the tunnel; `0.0.0.0/0, ::/0` = full tunnel.
    var allowedIPs: [String]
    /// Keepalive interval in seconds; keeps NAT mappings alive.
    var persistentKeepAlive: Int?

    /// Host component of `endpoint`.
    var endpointHost: String {
        // IPv6 endpoints are written as [addr]:port.
        if endpoint.hasPrefix("[") , let close = endpoint.firstIndex(of: "]") {
            return String(endpoint[endpoint.index(after: endpoint.startIndex)..<close])
        }
        return endpoint.split(separator: ":").dropLast().joined(separator: ":")
    }

    /// Port component of `endpoint`, defaulting to WireGuard's 51820.
    var endpointPort: UInt16 {
        UInt16(endpoint.split(separator: ":").last.map(String.init) ?? "") ?? 51820
    }
}

/// A complete WireGuard tunnel configuration (one interface, one or more peers).
struct WireGuardConfiguration: Equatable {
    var name: String
    var interface: InterfaceConfiguration
    var peers: [PeerConfiguration]

    // MARK: - Validation

    /// Validates keys, endpoint, and addresses, throwing a descriptive error
    /// for the first problem found.
    func validate() throws {
        guard WireGuardKeyPair.isValidKey(interface.privateKey) else {
            throw WireGuardConfigurationError.invalidKey("PrivateKey")
        }
        guard !interface.addresses.isEmpty else {
            throw WireGuardConfigurationError.invalidAddress("Address is required")
        }
        guard !peers.isEmpty else {
            throw WireGuardConfigurationError.missingPeer
        }
        for peer in peers {
            guard WireGuardKeyPair.isValidKey(peer.publicKey) else {
                throw WireGuardConfigurationError.invalidKey("PublicKey")
            }
            if let preshared = peer.presharedKey, !WireGuardKeyPair.isValidKey(preshared) {
                throw WireGuardConfigurationError.invalidKey("PresharedKey")
            }
            guard !peer.endpointHost.isEmpty else {
                throw WireGuardConfigurationError.invalidEndpoint(peer.endpoint)
            }
        }
    }

    // MARK: - wg-quick serialization

    /// Serializes the configuration to wg-quick INI format, the same format
    /// accepted by the official WireGuard apps and `WireGuardKit`.
    func asWgQuickConfig() -> String {
        var lines: [String] = ["[Interface]"]
        lines.append("PrivateKey = \(interface.privateKey)")
        lines.append("Address = \(interface.addresses.joined(separator: ", "))")
        if !interface.dns.isEmpty {
            lines.append("DNS = \(interface.dns.joined(separator: ", "))")
        }
        if let mtu = interface.mtu {
            lines.append("MTU = \(mtu)")
        }
        for peer in peers {
            lines.append("")
            lines.append("[Peer]")
            lines.append("PublicKey = \(peer.publicKey)")
            if let preshared = peer.presharedKey {
                lines.append("PresharedKey = \(preshared)")
            }
            lines.append("AllowedIPs = \(peer.allowedIPs.joined(separator: ", "))")
            lines.append("Endpoint = \(peer.endpoint)")
            if let keepAlive = peer.persistentKeepAlive {
                lines.append("PersistentKeepalive = \(keepAlive)")
            }
        }
        return lines.joined(separator: "\n")
    }

    // MARK: - wg-quick parsing

    /// Parses a wg-quick INI string into a `WireGuardConfiguration`.
    ///
    /// Supports the subset of wg-quick used on Apple platforms: `[Interface]`
    /// with PrivateKey/Address/DNS/MTU and `[Peer]` with PublicKey/
    /// PresharedKey/AllowedIPs/Endpoint/PersistentKeepalive. Comments (`#`)
    /// and blank lines are ignored; keys are case-insensitive.
    static func parse(wgQuickConfig: String, name: String) throws -> WireGuardConfiguration {
        enum Section { case none, interface, peer }

        var section = Section.none
        var privateKey: String?
        var addresses: [String] = []
        var dns: [String] = []
        var mtu: Int?
        var peers: [PeerConfiguration] = []
        var currentPeer: (publicKey: String?, presharedKey: String?, endpoint: String?,
                          allowedIPs: [String], keepAlive: Int?) = (nil, nil, nil, [], nil)

        func flushPeer() throws {
            guard section == .peer else { return }
            guard let publicKey = currentPeer.publicKey, let endpoint = currentPeer.endpoint else {
                throw WireGuardConfigurationError.missingPeer
            }
            peers.append(PeerConfiguration(
                publicKey: publicKey,
                presharedKey: currentPeer.presharedKey,
                endpoint: endpoint,
                allowedIPs: currentPeer.allowedIPs.isEmpty ? ["0.0.0.0/0", "::/0"] : currentPeer.allowedIPs,
                persistentKeepAlive: currentPeer.keepAlive
            ))
            currentPeer = (nil, nil, nil, [], nil)
        }

        for rawLine in wgQuickConfig.split(separator: "\n", omittingEmptySubsequences: false) {
            let line = rawLine.trimmingCharacters(in: .whitespaces)
            guard !line.isEmpty, !line.hasPrefix("#") else { continue }

            switch line.lowercased() {
            case "[interface]":
                try flushPeer()
                section = .interface
                continue
            case "[peer]":
                try flushPeer()
                section = .peer
                continue
            default:
                break
            }

            guard let equals = line.firstIndex(of: "=") else {
                throw WireGuardConfigurationError.malformedLine(line)
            }
            let key = line[..<equals].trimmingCharacters(in: .whitespaces).lowercased()
            let value = line[line.index(after: equals)...].trimmingCharacters(in: .whitespaces)
            let listValues = value
                .split(separator: ",")
                .map { $0.trimmingCharacters(in: .whitespaces) }

            switch (section, key) {
            case (.interface, "privatekey"): privateKey = value
            case (.interface, "address"): addresses.append(contentsOf: listValues)
            case (.interface, "dns"): dns.append(contentsOf: listValues)
            case (.interface, "mtu"): mtu = Int(value)
            case (.interface, "listenport"): break // Valid wg-quick key; unused on iOS.
            case (.peer, "publickey"): currentPeer.publicKey = value
            case (.peer, "presharedkey"): currentPeer.presharedKey = value
            case (.peer, "endpoint"): currentPeer.endpoint = value
            case (.peer, "allowedips"): currentPeer.allowedIPs.append(contentsOf: listValues)
            case (.peer, "persistentkeepalive"): currentPeer.keepAlive = Int(value)
            case (.none, _): throw WireGuardConfigurationError.missingInterface
            default: break // Tolerate unknown keys for forward compatibility.
            }
        }
        try flushPeer()

        guard let resolvedPrivateKey = privateKey else {
            throw WireGuardConfigurationError.missingInterface
        }

        let configuration = WireGuardConfiguration(
            name: name,
            interface: InterfaceConfiguration(
                privateKey: resolvedPrivateKey,
                addresses: addresses,
                dns: dns,
                mtu: mtu
            ),
            peers: peers
        )
        try configuration.validate()
        return configuration
    }
}
