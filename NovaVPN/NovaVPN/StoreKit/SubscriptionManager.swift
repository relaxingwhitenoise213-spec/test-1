//
//  SubscriptionManager.swift
//  NovaVPN
//
//  StoreKit 2 subscriptions: product loading, purchase, restore,
//  transaction verification, and live entitlement tracking.
//

import Foundation
import StoreKit
import Observation

/// User-presentable purchase failures.
enum PurchaseError: LocalizedError {
    case verificationFailed
    case pendingApproval
    case productUnavailable
    case underlying(String)

    var errorDescription: String? {
        switch self {
        case .verificationFailed:
            return "The App Store receipt could not be verified."
        case .pendingApproval:
            return "Your purchase is awaiting approval (Ask to Buy). Premium unlocks automatically once approved."
        case .productUnavailable:
            return "This subscription isn't available right now."
        case .underlying(let message):
            return message
        }
    }
}

@MainActor
@Observable
final class SubscriptionManager: PremiumStatusProviding {

    /// Loading lifecycle for the paywall.
    enum ProductsState: Equatable {
        case idle
        case loading
        case loaded
        case failed(String)
    }

    // MARK: Published state

    private(set) var productsState: ProductsState = .idle
    /// Available subscriptions, cheapest first (monthly, yearly).
    private(set) var products: [Product] = []
    /// True when the user has an active premium entitlement.
    private(set) var isPremium = false
    /// Product ID of the active subscription, if any.
    private(set) var activeProductID: String?
    /// Expiration/renewal date of the active subscription, if any.
    private(set) var expirationDate: Date?
    /// True while a purchase or restore is in flight (drives loading UI).
    private(set) var isPurchasing = false

    // MARK: Private

    /// Lifetime listener for transactions that arrive outside the purchase
    /// flow: renewals, Ask to Buy approvals, refunds, other devices.
    private var updatesTask: Task<Void, Never>?

    init() {
        updatesTask = Task { [weak self] in
            for await update in Transaction.updates {
                guard let self else { break }
                if let transaction = try? Self.verified(update) {
                    await transaction.finish()
                    await self.refreshEntitlements()
                }
            }
        }
        Task { [weak self] in
            await self?.refreshEntitlements()
            await self?.loadProducts()
        }
    }

    deinit {
        updatesTask?.cancel()
    }

    // MARK: - Products

    /// Loads products from the App Store. Retries are surfaced to the UI via
    /// `productsState` so the paywall can offer a retry button offline.
    func loadProducts() async {
        guard productsState != .loading else { return }
        productsState = .loading
        do {
            let loaded = try await Product.products(for: ProductID.all)
            products = loaded.sorted { $0.price < $1.price }
            productsState = products.isEmpty ? .failed("Subscriptions are not available right now.") : .loaded
        } catch {
            productsState = .failed(Self.friendlyStoreMessage(for: error))
        }
    }

    // MARK: - Purchase

    /// Purchases a product. Returns `true` if premium is now unlocked.
    /// A cancelled purchase returns `false` without throwing.
    func purchase(_ product: Product) async throws -> Bool {
        guard !isPurchasing else { return false }
        isPurchasing = true
        defer { isPurchasing = false }

        let result: Product.PurchaseResult
        do {
            result = try await product.purchase()
        } catch {
            throw PurchaseError.underlying(Self.friendlyStoreMessage(for: error))
        }

        switch result {
        case .success(let verification):
            let transaction: Transaction
            do {
                transaction = try Self.verified(verification)
            } catch {
                throw PurchaseError.verificationFailed
            }
            await transaction.finish()
            await refreshEntitlements()
            return isPremium

        case .userCancelled:
            // Not an error: the user simply backed out.
            return false

        case .pending:
            // Ask to Buy / SCA: entitlement arrives later via Transaction.updates.
            throw PurchaseError.pendingApproval

        @unknown default:
            return false
        }
    }

    // MARK: - Restore

    /// Restores purchases. `AppStore.sync()` forces a sync with the App
    /// Store (may prompt for credentials); entitlements refresh afterwards.
    func restore() async throws {
        guard !isPurchasing else { return }
        isPurchasing = true
        defer { isPurchasing = false }
        do {
            try await AppStore.sync()
        } catch {
            throw PurchaseError.underlying(Self.friendlyStoreMessage(for: error))
        }
        await refreshEntitlements()
    }

    // MARK: - Entitlements

    /// Rebuilds premium status from `Transaction.currentEntitlements` —
    /// StoreKit 2's on-device, cryptographically verified source of truth.
    /// Works offline from the local transaction cache.
    func refreshEntitlements() async {
        var premium = false
        var productID: String?
        var expiry: Date?

        for await entitlement in Transaction.currentEntitlements {
            guard let transaction = try? Self.verified(entitlement) else { continue }
            guard transaction.productType == .autoRenewable, transaction.revocationDate == nil else { continue }
            if let expirationDate = transaction.expirationDate, expirationDate <= Date() { continue }

            premium = true
            productID = transaction.productID
            expiry = transaction.expirationDate
        }

        isPremium = premium
        activeProductID = productID
        expirationDate = expiry
    }

    // MARK: - Helpers

    /// Unwraps a verification result, rejecting anything that fails
    /// StoreKit 2's signature check.
    private static func verified<T>(_ result: VerificationResult<T>) throws -> T {
        switch result {
        case .verified(let value):
            return value
        case .unverified:
            throw PurchaseError.verificationFailed
        }
    }

    /// Maps StoreKit errors to friendly copy (notably offline).
    private static func friendlyStoreMessage(for error: Error) -> String {
        if let storeKitError = error as? StoreKitError {
            switch storeKitError {
            case .networkError:
                return "You appear to be offline. Check your connection and try again."
            case .notAvailableInStorefront:
                return "This subscription isn't available in your region."
            case .userCancelled:
                return "Purchase cancelled."
            default:
                break
            }
        }
        return error.localizedDescription
    }
}
