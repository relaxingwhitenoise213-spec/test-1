//
//  SubscriptionViewModel.swift
//  NovaVPN
//
//  Paywall logic: plan selection, purchase, restore, and outcome routing.
//

import Foundation
import StoreKit
import Observation

@MainActor
@Observable
final class SubscriptionViewModel {

    /// The plan currently highlighted; defaults to yearly (best value).
    var selectedProductID: String = ProductID.yearly.rawValue

    /// Purchase/restore failure surfaced as an alert.
    var errorMessage: String?
    var showError = false

    /// Set when a purchase completes so the paywall can celebrate + dismiss.
    private(set) var didUnlockPremium = false

    private let subscription: SubscriptionManager
    private let toastCenter: ToastCenter

    init(subscription: SubscriptionManager, toastCenter: ToastCenter) {
        self.subscription = subscription
        self.toastCenter = toastCenter
    }

    // MARK: Pass-through state

    var productsState: SubscriptionManager.ProductsState { subscription.productsState }
    var products: [Product] { subscription.products }
    var isPurchasing: Bool { subscription.isPurchasing }
    var isPremium: Bool { subscription.isPremium }

    var selectedProduct: Product? {
        products.first { $0.id == selectedProductID } ?? products.last
    }

    /// Feature bullets displayed as cards on the paywall.
    struct Feature: Identifiable {
        let id = UUID()
        let symbolName: String
        let title: String
        let subtitle: String
    }

    let features: [Feature] = [
        Feature(symbolName: "globe", title: "All Locations", subtitle: "Every region, everywhere"),
        Feature(symbolName: "infinity", title: "Unlimited Usage", subtitle: "No daily time limits"),
        Feature(symbolName: "bolt.fill", title: "Fast Servers", subtitle: "Priority high-speed routes"),
        Feature(symbolName: "arrow.triangle.2.circlepath", title: "Auto Reconnect", subtitle: "Seamless network switching")
    ]

    // MARK: Intents

    func reloadProducts() async {
        await subscription.loadProducts()
    }

    /// Continue button: purchases the selected plan.
    func purchaseSelected() async {
        guard let product = selectedProduct else { return }
        do {
            let unlocked = try await subscription.purchase(product)
            if unlocked {
                didUnlockPremium = true
                toastCenter.show(.success, "Premium unlocked. Enjoy Nova VPN!")
            }
            // Cancelled purchases fall through silently by design.
        } catch {
            present(error)
        }
    }

    func restore() async {
        do {
            try await subscription.restore()
            if subscription.isPremium {
                didUnlockPremium = true
                toastCenter.show(.success, "Premium restored.")
            } else {
                toastCenter.show(.info, "No purchases to restore.")
            }
        } catch {
            present(error)
        }
    }

    /// Reset the unlock flag after the paywall dismisses.
    func consumeUnlockEvent() {
        didUnlockPremium = false
    }

    private func present(_ error: Error) {
        errorMessage = error.localizedDescription
        showError = true
    }
}
