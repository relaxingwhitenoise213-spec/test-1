//
//  MainTabView.swift
//  NovaVPN
//
//  The three main tabs: Home, Locations, Settings.
//

import SwiftUI

struct MainTabView: View {
    @Environment(VPNManager.self) private var vpnManager
    @Environment(ServerStore.self) private var serverStore
    @Environment(HomeViewModel.self) private var homeViewModel
    @Environment(SettingsStore.self) private var settings

    /// Ensures Auto Connect fires once per launch, not per appearance.
    @State private var didAttemptAutoConnect = false

    var body: some View {
        TabView {
            HomeView()
                .tabItem { Label("Home", systemImage: "shield.lefthalf.filled") }

            LocationsTab()
                .tabItem { Label("Locations", systemImage: "globe") }

            SettingsView()
                .tabItem { Label("Settings", systemImage: "gearshape.fill") }
        }
        .tint(.novaBlue)
        .task {
            await serverStore.load()
            if settings.autoConnect && !didAttemptAutoConnect && vpnManager.state == .disconnected {
                didAttemptAutoConnect = true
                await vpnManager.connect(to: serverStore.selectedServer)
                homeViewModel.handleConnectionOutcome()
            }
        }
    }
}

/// The Locations tab reuses the picker list with the same selection flow
/// as the Home sheet.
private struct LocationsTab: View {
    @Environment(HomeViewModel.self) private var homeViewModel
    @Environment(ServerListViewModel.self) private var serverListViewModel

    var body: some View {
        ServerListView { server in
            Task { await homeViewModel.serverPicked(server) }
        }
        .environment(serverListViewModel)
    }
}
