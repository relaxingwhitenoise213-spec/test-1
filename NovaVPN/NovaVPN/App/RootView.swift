//
//  RootView.swift
//  NovaVPN
//
//  Drives the launch flow: Onboarding → Permission → Home.
//

import SwiftUI

struct RootView: View {
    @Environment(SettingsStore.self) private var settings
    @Environment(SubscriptionManager.self) private var subscription
    @Environment(ServerStore.self) private var serverStore
    @Environment(\.scenePhase) private var scenePhase

    private enum FlowStep {
        case onboarding, permission, home
    }

    private var step: FlowStep {
        if !settings.hasCompletedOnboarding { return .onboarding }
        if !settings.hasRequestedVPNPermission { return .permission }
        return .home
    }

    var body: some View {
        ZStack {
            switch step {
            case .onboarding:
                OnboardingView()
                    .transition(.opacity)
            case .permission:
                PermissionView()
                    .transition(.asymmetric(insertion: .move(edge: .trailing).combined(with: .opacity), removal: .opacity))
            case .home:
                MainTabView()
                    .transition(.opacity.combined(with: .scale(scale: 1.02)))
            }
        }
        .animation(.easeInOut(duration: 0.35), value: step)
        .toastOverlay()
        .onChange(of: scenePhase) { _, phase in
            // Returning to the foreground: re-verify entitlements (renewals,
            // refunds, Ask to Buy) and freshen server metrics.
            guard phase == .active else { return }
            Task {
                await subscription.refreshEntitlements()
                await serverStore.refreshMetrics()
            }
        }
    }
}

#Preview {
    RootView()
        .previewEnvironment()
}
