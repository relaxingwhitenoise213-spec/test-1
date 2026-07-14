//
//  AppDependencies.swift
//  NovaVPN
//
//  Composition root: builds the object graph once and injects it through
//  the SwiftUI environment. Managers are plain injected instances — no
//  singletons — so every piece can be constructed with test doubles.
//

import Foundation

@MainActor
final class AppDependencies {

    // MARK: Core services
    let settings: SettingsStore
    let toastCenter: ToastCenter
    let usage: UsageService
    let monitor: ConnectionMonitor
    let configurationManager: ConfigurationManager
    let subscription: SubscriptionManager
    let serverStore: ServerStore
    let vpnManager: VPNManager

    // MARK: View models
    let homeViewModel: HomeViewModel
    let serverListViewModel: ServerListViewModel
    let settingsViewModel: SettingsViewModel
    let subscriptionViewModel: SubscriptionViewModel
    let onboardingViewModel: OnboardingViewModel

    init() {
        let settings = SettingsStore()
        let toastCenter = ToastCenter()
        let usage = UsageService()
        let monitor = ConnectionMonitor()
        let configurationManager = ConfigurationManager()
        let subscription = SubscriptionManager()
        let serverStore = ServerStore(directory: StaticServerDirectory(), settings: settings)

        // Packet tunnel providers can't run in the iOS simulator, so preview
        // and simulator builds use a simulated tunnel with realistic state
        // transitions; device builds use the real NetworkExtension stack.
        #if targetEnvironment(simulator)
        let tunnel: any TunnelProviding = SimulatedTunnelProvider()
        #else
        let tunnel: any TunnelProviding = TunnelProvider()
        #endif

        let vpnManager = VPNManager(
            tunnel: tunnel,
            configurationManager: configurationManager,
            monitor: monitor,
            settings: settings,
            usage: usage,
            premiumStatus: subscription
        )

        self.settings = settings
        self.toastCenter = toastCenter
        self.usage = usage
        self.monitor = monitor
        self.configurationManager = configurationManager
        self.subscription = subscription
        self.serverStore = serverStore
        self.vpnManager = vpnManager

        self.homeViewModel = HomeViewModel(
            vpnManager: vpnManager,
            serverStore: serverStore,
            subscription: subscription,
            usage: usage
        )
        self.serverListViewModel = ServerListViewModel(serverStore: serverStore, subscription: subscription)
        self.settingsViewModel = SettingsViewModel(settings: settings, subscription: subscription, toastCenter: toastCenter)
        self.subscriptionViewModel = SubscriptionViewModel(subscription: subscription, toastCenter: toastCenter)
        self.onboardingViewModel = OnboardingViewModel(settings: settings)
    }
}
