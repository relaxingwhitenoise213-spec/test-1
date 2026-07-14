//
//  SettingsViewModel.swift
//  NovaVPN
//
//  Settings screen logic: toggles, restore purchases, links, version.
//

import Foundation
import Observation

@MainActor
@Observable
final class SettingsViewModel {

    /// True while Restore Purchases is running.
    private(set) var isRestoring = false

    let settings: SettingsStore
    private let subscription: SubscriptionManager
    private let toastCenter: ToastCenter

    init(settings: SettingsStore, subscription: SubscriptionManager, toastCenter: ToastCenter) {
        self.settings = settings
        self.subscription = subscription
        self.toastCenter = toastCenter
    }

    var isPremium: Bool { subscription.isPremium }

    /// Subtitle for the subscription row, e.g. "Premium · renews Jan 3".
    var subscriptionStatusText: String {
        guard subscription.isPremium else { return "Free plan" }
        if let date = subscription.expirationDate {
            return "Premium · renews \(date.formatted(date: .abbreviated, time: .omitted))"
        }
        return "Premium"
    }

    var versionText: String { AppConfig.versionString }

    /// Auto-reconnect is a Premium capability; the toggle is disabled (with
    /// an upsell hint) for free users.
    var canUseAutoReconnect: Bool { subscription.isPremium }

    func restorePurchases() async {
        guard !isRestoring else { return }
        isRestoring = true
        defer { isRestoring = false }
        do {
            try await subscription.restore()
            toastCenter.show(
                subscription.isPremium ? .success : .info,
                subscription.isPremium ? "Premium restored. Welcome back!" : "No purchases to restore."
            )
        } catch {
            toastCenter.show(.error, error.localizedDescription)
        }
    }
}
