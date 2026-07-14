//
//  SettingsStore.swift
//  NovaVPN
//
//  Observable, UserDefaults-backed user preferences.
//

import SwiftUI
import Observation

/// User-selectable appearance. "Dark" is the app's signature look and the
/// default; "System" and "Light" are offered for accessibility.
enum AppearancePreference: String, CaseIterable, Identifiable {
    case dark, system, light

    var id: String { rawValue }

    var label: String {
        switch self {
        case .dark: return "Dark"
        case .system: return "System"
        case .light: return "Light"
        }
    }

    var colorScheme: ColorScheme? {
        switch self {
        case .dark: return .dark
        case .light: return .light
        case .system: return nil
        }
    }
}

/// All persisted user preferences.
///
/// A hand-rolled `@Observable` store (rather than scattered `@AppStorage`)
/// so preferences are injectable, observable from managers, and testable
/// with an isolated `UserDefaults` suite.
@MainActor
@Observable
final class SettingsStore {
    private let defaults: UserDefaults

    private enum Key {
        static let hasCompletedOnboarding = "settings.hasCompletedOnboarding"
        static let appearance = "settings.appearance"
        static let autoConnect = "settings.autoConnect"
        static let autoReconnect = "settings.autoReconnect"
        static let killSwitch = "settings.killSwitch"
        static let selectedServerID = "settings.selectedServerID"
    }

    init(defaults: UserDefaults = .standard) {
        self.defaults = defaults
        hasCompletedOnboarding = defaults.bool(forKey: Key.hasCompletedOnboarding)
        appearance = AppearancePreference(rawValue: defaults.string(forKey: Key.appearance) ?? "") ?? .dark
        autoConnect = defaults.bool(forKey: Key.autoConnect)
        autoReconnect = defaults.object(forKey: Key.autoReconnect) as? Bool ?? true
        killSwitch = defaults.bool(forKey: Key.killSwitch)
        selectedServerID = defaults.string(forKey: Key.selectedServerID)
    }

    /// Set once the user finishes or skips onboarding.
    var hasCompletedOnboarding: Bool {
        didSet { defaults.set(hasCompletedOnboarding, forKey: Key.hasCompletedOnboarding) }
    }

    /// Dark mode preference.
    var appearance: AppearancePreference {
        didSet { defaults.set(appearance.rawValue, forKey: Key.appearance) }
    }

    /// Connect automatically when the app launches.
    var autoConnect: Bool {
        didSet { defaults.set(autoConnect, forKey: Key.autoConnect) }
    }

    /// Re-establish the tunnel after unexpected drops (Premium feature).
    var autoReconnect: Bool {
        didSet { defaults.set(autoReconnect, forKey: Key.autoReconnect) }
    }

    /// Kill switch toggle. UI only for now: enforcing it requires
    /// on-demand rules + `includeAllNetworks`, planned for a later release.
    var killSwitch: Bool {
        didSet { defaults.set(killSwitch, forKey: Key.killSwitch) }
    }

    /// Persisted selection so the app reopens on the same location.
    var selectedServerID: String? {
        didSet { defaults.set(selectedServerID, forKey: Key.selectedServerID) }
    }
}
