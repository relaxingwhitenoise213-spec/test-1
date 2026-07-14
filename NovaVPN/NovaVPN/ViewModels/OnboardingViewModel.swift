//
//  OnboardingViewModel.swift
//  NovaVPN
//
//  Paging state for the three-page onboarding flow.
//

import Foundation
import Observation

@MainActor
@Observable
final class OnboardingViewModel {

    let pages = OnboardingPage.all

    /// Index of the visible page, bound to the `TabView`.
    var currentPage = 0

    private let settings: SettingsStore

    init(settings: SettingsStore) {
        self.settings = settings
    }

    var isLastPage: Bool { currentPage >= pages.count - 1 }

    var continueTitle: String { isLastPage ? "Get Started" : "Continue" }

    /// Continue advances; on the last page it completes onboarding.
    func continueTapped() {
        if isLastPage {
            finish()
        } else {
            currentPage += 1
        }
    }

    /// Skip jumps straight past onboarding.
    func skipTapped() {
        finish()
    }

    private func finish() {
        settings.hasCompletedOnboarding = true
    }
}
