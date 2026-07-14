//
//  ServerListView.swift
//  NovaVPN
//
//  Searchable list of locations with metrics, premium locks, and
//  pull-to-refresh.
//

import SwiftUI

struct ServerListView: View {
    @Environment(ServerListViewModel.self) private var viewModel
    @Environment(\.dismiss) private var dismiss

    /// Invoked with the tapped server; the Home view model decides whether
    /// to connect or show the paywall.
    let onSelect: (VPNServer) -> Void

    var body: some View {
        @Bindable var viewModel = viewModel

        NavigationStack {
            ZStack {
                Color.novaBackground.ignoresSafeArea()

                if viewModel.filteredServers.isEmpty {
                    ContentUnavailableView.search(text: viewModel.searchText)
                } else {
                    ScrollView {
                        LazyVStack(spacing: 10) {
                            ForEach(viewModel.filteredServers) { server in
                                ServerCell(
                                    server: server,
                                    isSelected: server.id == viewModel.selectedServerID,
                                    isLocked: viewModel.isLocked(server)
                                ) {
                                    onSelect(server)
                                }
                                .sensoryFeedback(.selection, trigger: viewModel.selectedServerID)
                            }
                        }
                        .padding(.horizontal, 16)
                        .padding(.vertical, 8)
                        .animation(.default, value: viewModel.filteredServers)
                    }
                    .refreshable {
                        await viewModel.refresh()
                    }
                }
            }
            .navigationTitle("Locations")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button {
                        dismiss()
                    } label: {
                        Image(systemName: "xmark.circle.fill")
                            .foregroundStyle(.novaTextTertiary)
                    }
                    .accessibilityLabel("Close")
                }
                ToolbarItem(placement: .topBarLeading) {
                    if viewModel.isRefreshing {
                        ProgressView()
                            .tint(.novaTextSecondary)
                            .accessibilityLabel("Refreshing server metrics")
                    }
                }
            }
            .searchable(
                text: $viewModel.searchText,
                placement: .navigationBarDrawer(displayMode: .always),
                prompt: "Search countries"
            )
            .toolbarBackground(Color.novaBackground, for: .navigationBar)
            .toolbarBackground(.visible, for: .navigationBar)
        }
        .presentationDetents([.large, .medium])
        .presentationDragIndicator(.visible)
        .preferredColorScheme(.dark)
    }
}
