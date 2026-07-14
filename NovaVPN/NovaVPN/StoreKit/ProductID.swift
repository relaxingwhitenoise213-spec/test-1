//
//  ProductID.swift
//  NovaVPN
//
//  App Store product identifiers. Must match App Store Connect and
//  Configuration/NovaVPN.storekit.
//

import Foundation

enum ProductID: String, CaseIterable {
    case monthly = "vpn.monthly"
    case yearly = "vpn.yearly"

    static var all: [String] { allCases.map(\.rawValue) }

    /// Badge shown on the paywall card.
    var badge: String? {
        switch self {
        case .monthly: return nil
        case .yearly: return "Best Value"
        }
    }
}
