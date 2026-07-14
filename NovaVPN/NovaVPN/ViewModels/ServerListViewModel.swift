//
//  ServerListViewModel.swift
//  NovaVPN
//
//  Search + selection logic for the server picker.
//

import Foundation
import Observation

@MainActor
@Observable
final class ServerListViewModel {

    /// Search bar text.
    var searchText = ""

    private let serverStore: ServerStore
    private let subscription: SubscriptionManager

    init(serverStore: ServerStore, subscription: SubscriptionManager) {
        self.serverStore = serverStore
        self.subscription = subscription
    }

    var isRefreshing: Bool { serverStore.isRefreshing }
    var selectedServerID: String { serverStore.selectedServer.id }

    /// Servers matching the search, free locations first, then by country.
    var filteredServers: [VPNServer] {
        let base = serverStore.servers.sorted {
            if $0.isPremium != $1.isPremium { return !$0.isPremium }
            return $0.country < $1.country
        }
        let query = searchText.trimmingCharacters(in: .whitespaces)
        guard !query.isEmpty else { return base }
        return base.filter {
            $0.country.localizedCaseInsensitiveContains(query)
                || $0.city.localizedCaseInsensitiveContains(query)
                || $0.countryCode.localizedCaseInsensitiveContains(query)
        }
    }

    /// A server is locked when it needs a subscription the user lacks.
    func isLocked(_ server: VPNServer) -> Bool {
        server.isPremium && !subscription.isPremium
    }

    func refresh() async {
        await serverStore.refreshMetrics()
    }
}
