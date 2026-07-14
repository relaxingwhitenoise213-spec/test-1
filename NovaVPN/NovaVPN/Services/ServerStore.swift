//
//  ServerStore.swift
//  NovaVPN
//
//  Observable catalog state shared by Home and the server list: the loaded
//  servers, live metrics, and the current selection.
//

import Foundation
import Observation

@MainActor
@Observable
final class ServerStore {

    /// All available locations with their latest metrics.
    private(set) var servers: [VPNServer] = []

    /// True while a metrics refresh is running (drives pull-to-refresh UI).
    private(set) var isRefreshing = false

    private let directory: any ServerProviding
    private let settings: SettingsStore

    init(directory: any ServerProviding, settings: SettingsStore) {
        self.directory = directory
        self.settings = settings
    }

    /// The user's selected location. Falls back to the free location so a
    /// fresh install (or a lapsed subscription) always has a valid choice.
    var selectedServer: VPNServer {
        if let id = settings.selectedServerID, let match = servers.first(where: { $0.id == id }) {
            return match
        }
        return servers.first(where: { !$0.isPremium }) ?? servers.first ?? Self.placeholder
    }

    /// Loads the catalog and kicks off a metrics refresh.
    func load() async {
        guard servers.isEmpty else { return }
        servers = await directory.fetchServers()
        await refreshMetrics()
    }

    /// Re-probes ping/load/status for every server.
    func refreshMetrics() async {
        guard !isRefreshing, !servers.isEmpty else { return }
        isRefreshing = true
        defer { isRefreshing = false }
        servers = await directory.refreshMetrics(for: servers)
    }

    /// Persists a new selection.
    func select(_ server: VPNServer) {
        settings.selectedServerID = server.id
    }

    /// Used only before `load()` completes, which resolves in milliseconds;
    /// never visible in practice but keeps `selectedServer` non-optional.
    private static let placeholder = StaticServerDirectory.catalog[1]
}
