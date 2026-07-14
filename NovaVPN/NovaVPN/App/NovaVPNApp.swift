//
//  NovaVPNApp.swift
//  NovaVPN
//
//  App entry point: builds the dependency graph and injects it into the
//  SwiftUI environment.
//

import SwiftUI

@main
struct NovaVPNApp: App {

    /// The composition root, created once for the app's lifetime.
    @State private var dependencies = AppDependencies()

    var body: some Scene {
        WindowGroup {
            RootView()
                // Managers
                .environment(dependencies.settings)
                .environment(dependencies.toastCenter)
                .environment(dependencies.usage)
                .environment(dependencies.monitor)
                .environment(dependencies.subscription)
                .environment(dependencies.serverStore)
                .environment(dependencies.vpnManager)
                // View models
                .environment(dependencies.homeViewModel)
                .environment(dependencies.serverListViewModel)
                .environment(dependencies.settingsViewModel)
                .environment(dependencies.subscriptionViewModel)
                .environment(dependencies.onboardingViewModel)
                // Theme
                .preferredColorScheme(dependencies.settings.appearance.colorScheme)
        }
    }
}
