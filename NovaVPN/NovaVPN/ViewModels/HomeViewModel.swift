//
//  HomeViewModel.swift
//  NovaVPN
//
//  Presentation logic for the Home screen: connect button behavior,
//  IP/stat readouts, error alerts, and paywall triggers.
//

import Foundation
import Observation

@MainActor
@Observable
final class HomeViewModel {

    // MARK: Presentation state

    /// Paywall sheet trigger (premium server tapped, daily limit, upsell).
    var showPaywall = false
    /// Server picker sheet trigger.
    var showServerList = false
    /// Error alert trigger; content comes from `presentedError`.
    var showErrorAlert = false
    private(set) var presentedError: VPNError?

    // MARK: Dependencies

    private let vpnManager: VPNManager
    private let serverStore: ServerStore
    private let subscription: SubscriptionManager
    private let usage: UsageService

    init(
        vpnManager: VPNManager,
        serverStore: ServerStore,
        subscription: SubscriptionManager,
        usage: UsageService
    ) {
        self.vpnManager = vpnManager
        self.serverStore = serverStore
        self.subscription = subscription
        self.usage = usage
    }

    // MARK: Pass-through state for the view

    var state: VPNState { vpnManager.state }
    var selectedServer: VPNServer { serverStore.selectedServer }
    var isPremium: Bool { subscription.isPremium }

    /// The IP shown on the Home card. A placeholder when unprotected (real
    /// public-IP lookup belongs to a backend); the tunnel-internal address
    /// once connected.
    var ipText: String {
        if vpnManager.state.isConnected, let server = vpnManager.activeServer {
            return server.clientAddress.split(separator: "/").first.map(String.init) ?? server.clientAddress
        }
        return "· · · . · · · . · · · . · · ·"
    }

    var ipCaption: String {
        vpnManager.state.isConnected ? "Protected IP" : "Your IP is exposed"
    }

    /// Free-tier banner copy; `nil` for premium users.
    var freeAllowanceText: String? {
        guard !subscription.isPremium else { return nil }
        let remaining = usage.remainingToday()
        return remaining > 0
            ? "\(remaining.shortDurationString) of free time left today"
            : "Free time used up for today"
    }

    // MARK: Intents

    /// The big button: connects when idle, disconnects when active.
    func connectButtonTapped() async {
        switch vpnManager.state {
        case .connected, .connecting, .reconnecting:
            await vpnManager.disconnect()
        case .disconnecting:
            break // Ignore taps during teardown.
        case .disconnected, .failed:
            await vpnManager.connect(to: serverStore.selectedServer)
            handleConnectionOutcome()
        }
    }

    /// Called when the user picks a server in the list.
    func serverPicked(_ server: VPNServer) async {
        if server.isPremium && !subscription.isPremium {
            showPaywall = true
            return
        }
        serverStore.select(server)
        showServerList = false
        await vpnManager.switchServer(to: server)
        handleConnectionOutcome()
    }

    /// Routes a fresh VPN error to the right surface: paywall for
    /// entitlement problems, alert for everything else.
    func handleConnectionOutcome() {
        guard let error = vpnManager.lastError else { return }
        vpnManager.acknowledgeError()
        if error.promptsUpgrade {
            showPaywall = true
        } else {
            presentedError = error
            showErrorAlert = true
        }
    }

    /// Retry action from the error alert.
    func retryConnection() async {
        presentedError = nil
        await vpnManager.connect(to: serverStore.selectedServer)
        handleConnectionOutcome()
    }

    func dismissError() {
        presentedError = nil
    }
}
