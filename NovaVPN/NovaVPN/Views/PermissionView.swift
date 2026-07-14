//
//  PermissionView.swift
//  NovaVPN
//
//  Explains the iOS VPN-configuration prompt before triggering it, then
//  hands off to the Home screen.
//

import SwiftUI

struct PermissionView: View {
    @Environment(VPNManager.self) private var vpnManager
    @Environment(SettingsStore.self) private var settings
    @Environment(ToastCenter.self) private var toastCenter

    @State private var isRequesting = false

    var body: some View {
        ZStack {
            GradientBackground()

            VStack(spacing: 28) {
                Spacer()

                Image(systemName: "checkmark.shield.fill")
                    .font(.system(size: 56, weight: .semibold))
                    .foregroundStyle(.white)
                    .frame(width: 120, height: 120)
                    .background(LinearGradient.novaPrimary, in: Circle())
                    .shadow(color: .novaBlue.opacity(0.5), radius: 28, y: 10)
                    .accessibilityHidden(true)

                VStack(spacing: 12) {
                    Text("One Last Step")
                        .font(.system(.largeTitle, design: .rounded).weight(.bold))
                        .foregroundStyle(.white)

                    Text("iOS will ask you to allow Nova VPN to add a VPN configuration. This is required to protect your traffic — we never see your browsing.")
                        .font(.body)
                        .foregroundStyle(.novaTextSecondary)
                        .multilineTextAlignment(.center)
                        .fixedSize(horizontal: false, vertical: true)
                }
                .padding(.horizontal, 32)

                Spacer()

                VStack(spacing: 10) {
                    PrimaryButton(title: "Allow VPN Configuration", systemImage: "lock.shield", isLoading: isRequesting) {
                        Task { await requestPermission() }
                    }

                    Button("Not Now") {
                        settings.hasRequestedVPNPermission = true
                    }
                    .font(.subheadline.weight(.medium))
                    .foregroundStyle(.novaTextSecondary)
                    .accessibilityHint("Continue without granting permission; you can grant it when connecting")
                }
                .padding(.horizontal, 24)
                .padding(.bottom, 20)
            }
        }
        .preferredColorScheme(.dark)
    }

    /// Triggers the system prompt by registering the VPN configuration.
    /// Denial isn't fatal — connecting later re-prompts.
    private func requestPermission() async {
        isRequesting = true
        defer { isRequesting = false }
        do {
            try await vpnManager.requestPermission()
            toastCenter.show(.success, "You're all set!")
        } catch {
            toastCenter.show(.info, "You can grant VPN access anytime by tapping Connect.")
        }
        vpnManager.acknowledgeError()
        settings.hasRequestedVPNPermission = true
    }
}

#Preview {
    PermissionView()
        .previewEnvironment()
}
