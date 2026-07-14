# Nova VPN

A production-quality native iOS VPN app built with SwiftUI for iOS 17+.
WireGuard® tunneling via Apple's NetworkExtension framework, StoreKit 2
subscriptions, MVVM architecture, full Swift Concurrency.

![Platform](https://img.shields.io/badge/platform-iOS%2017%2B-blue)
![Swift](https://img.shields.io/badge/Swift-5.9%2B-orange)
![Xcode](https://img.shields.io/badge/Xcode-16%2B-blueviolet)

## Highlights

- **SwiftUI + MVVM** — `@Observable` view models, environment injection, a
  single composition root (`AppDependencies`), no singletons.
- **Real VPN plumbing** — `NETunnelProviderManager` control plane, a packet
  tunnel extension, wg-quick config parsing/serialization, Curve25519 key
  generation via CryptoKit, Keychain storage shared with the extension.
- **Connection lifecycle** — connect / disconnect / reconnect, status
  mapping, connection timer, auto-reconnect with backoff (Premium),
  handshake staleness recovery, Wi‑Fi ⇄ cellular migration handling.
- **StoreKit 2** — product loading, purchase, restore, cryptographic
  transaction verification, live entitlements (`Transaction.updates`),
  offline handling, Ask to Buy, local `.storekit` config for testing.
- **Freemium** — free tier limited to the United Kingdom plus a daily time
  allowance; Premium unlocks all regions, unlimited usage, auto-reconnect.
- **Design** — dark glassmorphism, blue/purple gradients, animated connect
  button, onboarding, paywall, haptics (`.sensoryFeedback`), VoiceOver
  labels, Dynamic Type–friendly text styles.

## Project layout

```
NovaVPN/
├── NovaVPN.xcodeproj
├── Configuration/
│   └── NovaVPN.storekit          # Local StoreKit testing configuration
├── NovaVPN/                      # App target
│   ├── App/                      # Entry point, DI root, launch flow
│   ├── Models/                   # VPNServer, OnboardingPage
│   ├── ViewModels/               # One per screen (MVVM)
│   ├── Views/                    # Home, Servers, Settings, Subscription, Onboarding
│   ├── Components/               # PrimaryButton, ServerCell, Toast, …
│   ├── Managers/                 # VPNManager, TunnelProvider, ConfigurationManager, ConnectionMonitor
│   ├── Services/                 # Server catalog, ping, usage, stores
│   ├── StoreKit/                 # SubscriptionManager, ProductID
│   ├── VPN/                      # VPNState, VPNError
│   ├── Utilities/                # AppConfig, SettingsStore
│   ├── Extensions/               # Theme, glass, formatting helpers
│   └── Resources/                # Asset catalog (icon + accent placeholders)
├── NovaVPNTunnel/                # Packet tunnel extension target
│   └── PacketTunnelProvider.swift
└── Shared/                       # Compiled into BOTH targets
    ├── WireGuardConfiguration.swift   # wg-quick model + parser
    ├── WireGuardKeyPair.swift         # Curve25519 keys (CryptoKit)
    ├── TunnelMessage.swift            # App ⇄ extension IPC
    ├── KeychainStore.swift            # Shared keychain access
    └── SharedConstants.swift          # App group / bundle IDs
```

## Getting started

1. **Open** `NovaVPN/NovaVPN.xcodeproj` in Xcode 16 or later.
2. **Set your team**: select the *NovaVPN* and *NovaVPNTunnel* targets →
   Signing & Capabilities → choose your development team.
3. **Bundle identifiers**: the project uses `com.novavpn.app` and
   `com.novavpn.app.PacketTunnel`. If you change them, keep the extension ID
   prefixed by the app ID and update `SharedConstants.tunnelBundleIdentifier`
   plus the app group in both `.entitlements` files and
   `SharedConstants.appGroupIdentifier`.
4. **Capabilities** (already configured in the entitlements): *Network
   Extensions → Packet Tunnel* and *App Groups* (`group.com.novavpn.app`)
   on **both** targets. Your Apple Developer account needs the Network
   Extension capability.
5. **Run**. The scheme is pre-wired to `Configuration/NovaVPN.storekit`, so
   subscriptions are fully testable in the simulator with no App Store
   Connect setup.

### Simulator vs. device

Apple does not support packet tunnel extensions in the iOS simulator. The
composition root therefore injects a `SimulatedTunnelProvider`
(simulator/previews) that reproduces the full state machine — connecting,
connected, stats, disconnect — while device builds use the real
`TunnelProvider` backed by `NETunnelProviderManager`. No app code changes
between the two; it's the same `TunnelProviding` protocol.

## Enabling real WireGuard tunneling

The repository compiles and runs out of the box with no third-party
dependencies. The WireGuard **data plane** (the encrypted packet pump) comes
from Apple-blessed [WireGuardKit](https://git.zx2c4.com/wireguard-apple),
which requires a small one-time setup because its Go bridge must be built
by an Xcode target:

1. **Add the package**: File → Add Package Dependencies →
   `https://git.zx2c4.com/wireguard-apple` → add **WireGuardKit** to the
   *NovaVPNTunnel* target.
2. **Add the bridge build target** (per the package's README): in the
   project, add an external build system target named
   `WireGuardGoBridge<iOS>` pointing at the package's
   `Sources/WireGuardKitGo` directory (`make` build tool), and make
   *NovaVPNTunnel* depend on it. Go ≥ 1.20 must be installed
   (`brew install go`).
3. **Build.** `PacketTunnelProvider` already contains the complete
   WireGuardKit integration behind `#if canImport(WireGuardKit)` — adapter
   start/stop, runtime stats, handshake reporting. It activates
   automatically once the package is present. Until then, starting the
   tunnel on a device fails fast with a descriptive error instead of
   black-holing traffic.

### Connecting real servers

`StaticServerDirectory` ships the five launch regions (🇺🇸 🇬🇧 🇩🇪 🇳🇱 🇯🇵) with
**placeholder endpoints and server public keys** — syntactically valid so
the entire pipeline (key validation, config generation, tunnel start) is
exercised. To go live:

1. Stand up WireGuard servers and replace each server's `hostname`, `port`,
   `serverPublicKey`, `clientAddress`, and `dnsServers` in
   `NovaVPN/Services/ServerService.swift`.
2. Register device public keys with your servers. The device key pair is
   generated on first use and stored in the shared Keychain;
   `ConfigurationManager.devicePublicKey()` returns the value to upload
   during provisioning.
3. For a fleet, implement `ServerProviding` against your backend API and
   swap it in `AppDependencies` — the UI needs no changes.

## StoreKit 2 setup

- Product IDs: `vpn.monthly` ($4.99/mo) and `vpn.yearly` ($39.99/yr with a
  1-week free trial), defined in `Configuration/NovaVPN.storekit` for local
  testing.
- For TestFlight/production, create the same auto-renewable subscriptions
  (one group) in App Store Connect.
- Entitlements are derived from `Transaction.currentEntitlements` (works
  offline) and kept live via `Transaction.updates` — renewals, refunds, and
  Ask to Buy approvals apply without relaunching.

## App flow

```
Launch → Onboarding (3 pages) → VPN Permission → Home
                                                  ├── Connect / Disconnect
                                                  ├── Locations (search, ping, load, premium locks)
                                                  ├── Settings (appearance, auto-connect, kill switch UI, restore, legal)
                                                  └── Paywall (monthly / yearly, restore)
```

## Production checklist

- [ ] Replace placeholder server endpoints/keys (`ServerService.swift`)
- [ ] Replace app icon placeholder in `Resources/Assets.xcassets`
- [ ] Point `AppConfig` URLs at your real privacy policy / terms / support
- [ ] Create subscriptions in App Store Connect matching `ProductID`
- [ ] Ship a real public-IP lookup (the Home card is a placeholder by design)
- [ ] Implement kill-switch enforcement (`includeAllNetworks` + on-demand
      rules) if you enable the toggle beyond UI
- [ ] Review the free-tier allowance policy (`AppConfig.freeDailyAllowance`)

## License notes

"WireGuard" and the "WireGuard" logo are registered trademarks of
Jason A. Donenfeld. This project is not affiliated with or endorsed by the
WireGuard project; review the trademark policy before shipping.
