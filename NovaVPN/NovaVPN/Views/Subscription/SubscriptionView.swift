//
//  SubscriptionView.swift
//  NovaVPN
//
//  The paywall: feature cards, plan selection, purchase/restore, legal.
//

import SwiftUI
import StoreKit

struct SubscriptionView: View {
    @Environment(SubscriptionViewModel.self) private var viewModel
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        @Bindable var viewModel = viewModel

        NavigationStack {
            ZStack {
                GradientBackground()

                ScrollView {
                    VStack(spacing: 24) {
                        header
                        featureGrid
                        plans
                    }
                    .padding(20)
                    .padding(.bottom, 140) // Clear the pinned CTA.
                }
                .scrollIndicators(.hidden)

                // Pinned continue button + footer links.
                VStack(spacing: 12) {
                    Spacer()
                    footer
                }
            }
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button {
                        dismiss()
                    } label: {
                        Image(systemName: "xmark.circle.fill")
                            .font(.title3)
                            .foregroundStyle(.novaTextTertiary)
                    }
                    .accessibilityLabel("Close")
                }
            }
        }
        // Celebrate + dismiss once premium unlocks (purchase or restore).
        .sensoryFeedback(.success, trigger: viewModel.didUnlockPremium) { _, unlocked in unlocked }
        .onChange(of: viewModel.didUnlockPremium) { _, unlocked in
            if unlocked {
                viewModel.consumeUnlockEvent()
                dismiss()
            }
        }
        .alert("Purchase Failed", isPresented: $viewModel.showError) {
            Button("OK", role: .cancel) {}
        } message: {
            Text(viewModel.errorMessage ?? "Something went wrong.")
        }
        .preferredColorScheme(.dark)
    }

    // MARK: - Pieces

    private var header: some View {
        VStack(spacing: 12) {
            Image(systemName: "crown.fill")
                .font(.system(size: 34, weight: .bold))
                .foregroundStyle(.white)
                .frame(width: 84, height: 84)
                .background(LinearGradient.novaPrimary, in: Circle())
                .shadow(color: .novaPurple.opacity(0.5), radius: 24, y: 8)
                .accessibilityHidden(true)

            Text("Go Premium")
                .font(.system(.largeTitle, design: .rounded).weight(.bold))
                .foregroundStyle(.white)

            Text("Unlock every location, unlimited time,\nand our fastest servers.")
                .font(.subheadline)
                .foregroundStyle(.novaTextSecondary)
                .multilineTextAlignment(.center)
        }
        .padding(.top, 8)
    }

    private var featureGrid: some View {
        LazyVGrid(columns: [GridItem(.flexible(), spacing: 12), GridItem(.flexible())], spacing: 12) {
            ForEach(viewModel.features) { feature in
                VStack(alignment: .leading, spacing: 8) {
                    Image(systemName: feature.symbolName)
                        .font(.body.weight(.semibold))
                        .foregroundStyle(LinearGradient.novaPrimary)
                    Text(feature.title)
                        .font(.subheadline.weight(.semibold))
                        .foregroundStyle(.white)
                    Text(feature.subtitle)
                        .font(.caption)
                        .foregroundStyle(.novaTextSecondary)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(14)
                .glassCard(cornerRadius: 18)
                .accessibilityElement(children: .combine)
            }
        }
    }

    @ViewBuilder
    private var plans: some View {
        switch viewModel.productsState {
        case .idle, .loading:
            LoadingView(message: "Loading plans…")
                .frame(height: 160)

        case .failed(let message):
            VStack(spacing: 12) {
                Text(message)
                    .font(.subheadline)
                    .foregroundStyle(.novaTextSecondary)
                    .multilineTextAlignment(.center)
                Button("Try Again") {
                    Task { await viewModel.reloadProducts() }
                }
                .font(.subheadline.weight(.semibold))
                .foregroundStyle(.novaBlue)
            }
            .frame(maxWidth: .infinity)
            .padding(20)
            .glassCard(cornerRadius: 18)

        case .loaded:
            VStack(spacing: 12) {
                ForEach(viewModel.products, id: \.id) { product in
                    SubscriptionCard(
                        product: product,
                        isSelected: product.id == viewModel.selectedProduct?.id
                    ) {
                        viewModel.selectedProductID = product.id
                    }
                    .sensoryFeedback(.selection, trigger: viewModel.selectedProductID)
                }
            }
        }
    }

    private var footer: some View {
        VStack(spacing: 12) {
            PrimaryButton(
                title: viewModel.isPremium ? "You're Premium" : "Continue",
                isLoading: viewModel.isPurchasing,
                isEnabled: viewModel.selectedProduct != nil && !viewModel.isPremium
            ) {
                Task { await viewModel.purchaseSelected() }
            }

            HStack(spacing: 18) {
                Button("Restore Purchases") {
                    Task { await viewModel.restore() }
                }
                .disabled(viewModel.isPurchasing)

                Link("Privacy", destination: AppConfig.privacyPolicyURL)
                Link("Terms", destination: AppConfig.termsOfServiceURL)
            }
            .font(.caption.weight(.medium))
            .foregroundStyle(.novaTextSecondary)
        }
        .padding(.horizontal, 20)
        .padding(.top, 16)
        .padding(.bottom, 8)
        .background(.ultraThinMaterial)
    }
}

#Preview {
    SubscriptionView()
        .previewEnvironment()
}
