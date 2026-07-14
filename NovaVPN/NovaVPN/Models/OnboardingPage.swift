//
//  OnboardingPage.swift
//  NovaVPN
//
//  Content model for the three onboarding pages.
//

import SwiftUI

/// A single onboarding page: copy plus the pieces of its animated illustration.
struct OnboardingPage: Identifiable, Equatable {
    let id: Int
    let title: String
    let subtitle: String
    /// SF Symbol at the center of the illustration.
    let symbolName: String
    /// Accent used for the illustration's gradient halo.
    let tint: Color

    static let all: [OnboardingPage] = [
        OnboardingPage(
            id: 0,
            title: "Fast VPN",
            subtitle: "WireGuard®-powered tunnels engineered for speed. Stream, browse, and download without slowing down.",
            symbolName: "bolt.fill",
            tint: .novaBlue
        ),
        OnboardingPage(
            id: 1,
            title: "Private Browsing",
            subtitle: "Your traffic is encrypted end to end. No activity logs, no trackers, no compromises.",
            symbolName: "lock.shield.fill",
            tint: .novaPurple
        ),
        OnboardingPage(
            id: 2,
            title: "Unlimited Access",
            subtitle: "Connect from anywhere with servers across the globe, ready whenever you are.",
            symbolName: "globe.americas.fill",
            tint: .novaCyan
        )
    ]
}
