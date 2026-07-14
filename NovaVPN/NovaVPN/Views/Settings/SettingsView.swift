//
//  SettingsView.swift
//  NovaVPN
//
//  Preferences, subscription management, support links, and app info.
//

import SwiftUI
import StoreKit

struct SettingsView: View {
    @Environment(SettingsViewModel.self) private var viewModel
    @Environment(SubscriptionViewModel.self) private var subscriptionViewModel
    @Environment(\.openURL) private var openURL
    @Environment(\.requestReview) private var requestReview

    @State private var showPaywall = false

    var body: some View {
        @Bindable var settings = viewModel.settings

        NavigationStack {
            List {
                subscriptionSection
                vpnSection(settings: $settings)
                appearanceSection(settings: $settings)
                supportSection
                aboutSection
            }
            .scrollContentBackground(.hidden)
            .background(Color.novaBackground)
            .navigationTitle("Settings")
            .toolbarBackground(Color.novaBackground, for: .navigationBar)
            .toolbarBackground(.visible, for: .navigationBar)
        }
        .sheet(isPresented: $showPaywall) {
            SubscriptionView()
                .environment(subscriptionViewModel)
        }
        .preferredColorScheme(viewModel.settings.appearance.colorScheme)
    }

    // MARK: - Sections

    private var subscriptionSection: some View {
        Section("Subscription") {
            Button {
                showPaywall = true
            } label: {
                HStack(spacing: 12) {
                    Image(systemName: "crown.fill")
                        .foregroundStyle(LinearGradient.novaPrimary)
                    VStack(alignment: .leading, spacing: 2) {
                        Text(viewModel.isPremium ? "Nova Premium" : "Upgrade to Premium")
                            .foregroundStyle(.white)
                        Text(viewModel.subscriptionStatusText)
                            .font(.caption)
                            .foregroundStyle(.novaTextSecondary)
                    }
                    Spacer()
                    Image(systemName: "chevron.right")
                        .font(.caption.weight(.semibold))
                        .foregroundStyle(.novaTextTertiary)
                }
            }
            .accessibilityHint("Opens subscription options")

            Button {
                Task { await viewModel.restorePurchases() }
            } label: {
                HStack {
                    Text("Restore Purchases")
                        .foregroundStyle(.novaBlue)
                    Spacer()
                    if viewModel.isRestoring {
                        ProgressView().tint(.novaTextSecondary)
                    }
                }
            }
            .disabled(viewModel.isRestoring)
        }
        .listRowBackground(Color.novaSurface)
    }

    private func vpnSection(settings: Bindable<SettingsStore>) -> some View {
        Section {
            Toggle("Auto Connect", isOn: settings.autoConnect)
                .tint(.novaBlue)

            Toggle(isOn: settings.autoReconnect) {
                HStack(spacing: 8) {
                    Text("Auto Reconnect")
                    if !viewModel.canUseAutoReconnect {
                        PremiumBadge()
                    }
                }
            }
            .tint(.novaBlue)
            .disabled(!viewModel.canUseAutoReconnect)

            Toggle("Kill Switch", isOn: settings.killSwitch)
                .tint(.novaBlue)
        } header: {
            Text("VPN")
        } footer: {
            Text("Auto Connect starts the VPN when the app opens. Kill Switch UI is a preview — traffic blocking ships in a future update.")
                .font(.caption)
        }
        .listRowBackground(Color.novaSurface)
    }

    private func appearanceSection(settings: Bindable<SettingsStore>) -> some View {
        Section("Appearance") {
            Picker("Theme", selection: settings.appearance) {
                ForEach(AppearancePreference.allCases) { preference in
                    Text(preference.label).tag(preference)
                }
            }
            .pickerStyle(.segmented)
        }
        .listRowBackground(Color.novaSurface)
    }

    private var supportSection: some View {
        Section("Support") {
            Button {
                openURL(AppConfig.supportURL)
            } label: {
                Label("Contact Support", systemImage: "envelope")
            }

            Button {
                requestReview()
            } label: {
                Label("Rate Nova VPN", systemImage: "star")
            }

            Link(destination: AppConfig.privacyPolicyURL) {
                Label("Privacy Policy", systemImage: "hand.raised")
            }

            Link(destination: AppConfig.termsOfServiceURL) {
                Label("Terms of Service", systemImage: "doc.text")
            }
        }
        .listRowBackground(Color.novaSurface)
        .foregroundStyle(.white)
        .labelStyle(SettingsLabelStyle())
    }

    private var aboutSection: some View {
        Section {
            HStack {
                Text("Version")
                Spacer()
                Text(viewModel.versionText)
                    .foregroundStyle(.novaTextSecondary)
                    .monospacedDigit()
            }
        }
        .listRowBackground(Color.novaSurface)
    }
}

/// Tinted icon + white title used by the support rows.
private struct SettingsLabelStyle: LabelStyle {
    func makeBody(configuration: Configuration) -> some View {
        HStack(spacing: 12) {
            configuration.icon
                .foregroundStyle(Color.novaBlue)
                .frame(width: 24)
            configuration.title
                .foregroundStyle(.white)
        }
    }
}

#Preview {
    SettingsView()
        .previewEnvironment()
}
