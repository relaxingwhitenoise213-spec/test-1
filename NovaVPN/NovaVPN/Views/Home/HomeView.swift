//
//  HomeView.swift
//  NovaVPN
//
//  The main screen: status, hero connect button, timer, stats, and the
//  selected location.
//

import SwiftUI

struct HomeView: View {
    @Environment(HomeViewModel.self) private var viewModel
    @Environment(VPNManager.self) private var vpnManager
    @Environment(ServerListViewModel.self) private var serverListViewModel
    @Environment(SubscriptionViewModel.self) private var subscriptionViewModel

    var body: some View {
        @Bindable var viewModel = viewModel

        ZStack {
            GradientBackground(isConnected: viewModel.state.isConnected)

            VStack(spacing: 20) {
                header

                Spacer(minLength: 0)

                ConnectButton(state: viewModel.state) {
                    Task { await viewModel.connectButtonTapped() }
                }

                timer

                if let allowance = viewModel.freeAllowanceText {
                    freeAllowanceBanner(allowance)
                }

                Spacer(minLength: 0)

                ConnectionStatsRow()

                IPAddressCard(
                    caption: viewModel.ipCaption,
                    ip: viewModel.ipText,
                    isProtected: viewModel.state.isConnected
                )

                CountryCard(server: viewModel.selectedServer) {
                    viewModel.showServerList = true
                }
            }
            .padding(.horizontal, 20)
            .padding(.vertical, 12)
        }
        // Route unexpected drops/errors (set asynchronously by the manager)
        // into the alert/paywall surfaces.
        .onChange(of: vpnManager.lastError) { _, newValue in
            if newValue != nil { viewModel.handleConnectionOutcome() }
        }
        .sheet(isPresented: $viewModel.showServerList) {
            ServerListView { server in
                Task { await viewModel.serverPicked(server) }
            }
            .environment(serverListViewModel)
        }
        .sheet(isPresented: $viewModel.showPaywall) {
            SubscriptionView()
                .environment(subscriptionViewModel)
        }
        .alert(
            "Connection Problem",
            isPresented: $viewModel.showErrorAlert,
            presenting: viewModel.presentedError
        ) { error in
            Button("Try Again") {
                Task { await viewModel.retryConnection() }
            }
            Button("Cancel", role: .cancel) {
                viewModel.dismissError()
            }
        } message: { error in
            Text([error.errorDescription, error.recoverySuggestion].compactMap(\.self).joined(separator: " "))
        }
    }

    // MARK: - Pieces

    private var header: some View {
        VStack(spacing: 14) {
            HStack {
                Text("Nova VPN")
                    .font(.system(.title2, design: .rounded).weight(.bold))
                    .foregroundStyle(.white)
                Spacer()
                if !viewModel.isPremium {
                    Button {
                        viewModel.showPaywall = true
                    } label: {
                        HStack(spacing: 5) {
                            Image(systemName: "crown.fill")
                                .font(.caption.weight(.bold))
                            Text("Go Premium")
                                .font(.footnote.weight(.semibold))
                        }
                        .foregroundStyle(.white)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 7)
                        .background(LinearGradient.novaPrimary, in: Capsule())
                    }
                    .buttonStyle(PressableButtonStyle())
                    .accessibilityLabel("Go Premium")
                    .accessibilityHint("Opens subscription options")
                }
            }
            ConnectionStatusView(state: viewModel.state)
        }
    }

    /// Session timer, ticking once per second while connected.
    private var timer: some View {
        TimelineView(.periodic(from: .now, by: 1)) { _ in
            Text(vpnManager.connectionDuration.timerString)
                .font(.system(size: 34, weight: .semibold, design: .rounded))
                .monospacedDigit()
                .foregroundStyle(viewModel.state.isConnected ? .white : .novaTextTertiary)
                .contentTransition(.numericText())
                .accessibilityLabel(
                    viewModel.state.isConnected
                        ? "Connected for \(vpnManager.connectionDuration.shortDurationString)"
                        : "Not connected"
                )
        }
        .opacity(viewModel.state.isConnected ? 1 : 0.55)
        .animation(.easeInOut, value: viewModel.state.isConnected)
    }

    private func freeAllowanceBanner(_ text: String) -> some View {
        Button {
            viewModel.showPaywall = true
        } label: {
            HStack(spacing: 8) {
                Image(systemName: "hourglass")
                    .font(.caption.weight(.semibold))
                Text(text)
                    .font(.footnote.weight(.medium))
                Image(systemName: "chevron.right")
                    .font(.caption2.weight(.bold))
                    .foregroundStyle(.novaTextTertiary)
            }
            .foregroundStyle(.novaTextSecondary)
            .padding(.horizontal, 14)
            .padding(.vertical, 8)
            .background(Color.novaSurface.opacity(0.8), in: Capsule())
        }
        .buttonStyle(PressableButtonStyle())
        .accessibilityHint("Opens upgrade options")
    }
}

#Preview {
    HomeView()
        .previewEnvironment()
}
