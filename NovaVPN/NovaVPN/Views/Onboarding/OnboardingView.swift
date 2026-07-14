//
//  OnboardingView.swift
//  NovaVPN
//
//  Three-page intro flow with animated illustrations, skip, and continue.
//

import SwiftUI

struct OnboardingView: View {
    @Environment(OnboardingViewModel.self) private var viewModel

    var body: some View {
        @Bindable var viewModel = viewModel

        ZStack {
            GradientBackground()

            VStack(spacing: 0) {
                // Skip
                HStack {
                    Spacer()
                    Button("Skip") {
                        viewModel.skipTapped()
                    }
                    .font(.subheadline.weight(.medium))
                    .foregroundStyle(.novaTextSecondary)
                    .padding(.horizontal, 20)
                    .accessibilityHint("Skips the introduction")
                }
                .padding(.top, 8)

                // Pages
                TabView(selection: $viewModel.currentPage) {
                    ForEach(viewModel.pages) { page in
                        OnboardingPageView(page: page)
                            .tag(page.id)
                    }
                }
                .tabViewStyle(.page(indexDisplayMode: .never))
                .animation(.easeInOut, value: viewModel.currentPage)

                // Custom page dots
                HStack(spacing: 8) {
                    ForEach(viewModel.pages) { page in
                        Capsule()
                            .fill(page.id == viewModel.currentPage ? AnyShapeStyle(LinearGradient.novaPrimary) : AnyShapeStyle(Color.white.opacity(0.2)))
                            .frame(width: page.id == viewModel.currentPage ? 24 : 8, height: 8)
                    }
                }
                .animation(.spring(response: 0.35, dampingFraction: 0.8), value: viewModel.currentPage)
                .padding(.bottom, 28)
                .accessibilityElement(children: .ignore)
                .accessibilityLabel("Page \(viewModel.currentPage + 1) of \(viewModel.pages.count)")

                PrimaryButton(title: viewModel.continueTitle, systemImage: "arrow.right") {
                    viewModel.continueTapped()
                }
                .padding(.horizontal, 24)
                .padding(.bottom, 20)
                .sensoryFeedback(.impact(weight: .light), trigger: viewModel.currentPage)
            }
        }
        .preferredColorScheme(.dark)
    }
}

/// One onboarding page: floating illustration + copy.
struct OnboardingPageView: View {
    let page: OnboardingPage

    /// Drives the gentle float/glow loop.
    @State private var floating = false

    var body: some View {
        VStack(spacing: 28) {
            Spacer(minLength: 0)

            // Animated illustration: layered glowing rings + symbol.
            ZStack {
                Circle()
                    .fill(page.tint.opacity(0.18))
                    .frame(width: 240, height: 240)
                    .blur(radius: 30)
                    .scaleEffect(floating ? 1.1 : 0.95)

                Circle()
                    .strokeBorder(page.tint.opacity(0.35), lineWidth: 1.5)
                    .frame(width: 210, height: 210)
                    .scaleEffect(floating ? 1.04 : 1)

                Circle()
                    .strokeBorder(page.tint.opacity(0.18), lineWidth: 1)
                    .frame(width: 250, height: 250)
                    .scaleEffect(floating ? 0.98 : 1.03)

                Circle()
                    .fill(.ultraThinMaterial)
                    .frame(width: 160, height: 160)
                    .overlay(Circle().strokeBorder(LinearGradient.novaGlassStroke, lineWidth: 1))

                Image(systemName: page.symbolName)
                    .font(.system(size: 64, weight: .medium))
                    .foregroundStyle(page.tint)
                    .symbolEffect(.pulse, options: .repeating)
                    .offset(y: floating ? -6 : 6)
            }
            .animation(.easeInOut(duration: 2.4).repeatForever(autoreverses: true), value: floating)
            .onAppear { floating = true }
            .accessibilityHidden(true)

            VStack(spacing: 12) {
                Text(page.title)
                    .font(.system(.largeTitle, design: .rounded).weight(.bold))
                    .foregroundStyle(.white)

                Text(page.subtitle)
                    .font(.body)
                    .foregroundStyle(.novaTextSecondary)
                    .multilineTextAlignment(.center)
                    .fixedSize(horizontal: false, vertical: true)
            }
            .padding(.horizontal, 32)

            Spacer(minLength: 0)
        }
    }
}

#Preview {
    OnboardingView()
        .previewEnvironment()
}
