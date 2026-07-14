//
//  SubscriptionCard.swift
//  NovaVPN
//
//  Selectable plan card on the paywall (monthly / yearly).
//

import SwiftUI
import StoreKit

struct SubscriptionCard: View {
    let product: Product
    let isSelected: Bool
    let action: () -> Void

    /// "Best Value" badge for the yearly plan.
    private var badge: String? {
        ProductID(rawValue: product.id)?.badge
    }

    /// Localized per-period suffix, e.g. "/ month".
    private var periodSuffix: String {
        guard let unit = product.subscription?.subscriptionPeriod.unit else { return "" }
        switch unit {
        case .day: return "/ day"
        case .week: return "/ week"
        case .month: return "/ month"
        case .year: return "/ year"
        @unknown default: return ""
        }
    }

    /// Free-trial line when an intro offer exists, e.g. "7 days free".
    private var trialText: String? {
        guard let offer = product.subscription?.introductoryOffer,
              offer.paymentMode == .freeTrial else { return nil }
        return "\(offer.period.debugLabel) free, then \(product.displayPrice)\(periodSuffix)"
    }

    var body: some View {
        Button(action: action) {
            HStack(spacing: 14) {
                Image(systemName: isSelected ? "checkmark.circle.fill" : "circle")
                    .font(.title3)
                    .foregroundStyle(isSelected ? AnyShapeStyle(LinearGradient.novaPrimary) : AnyShapeStyle(Color.novaTextTertiary))

                VStack(alignment: .leading, spacing: 3) {
                    HStack(spacing: 8) {
                        Text(product.displayName)
                            .font(.headline)
                            .foregroundStyle(.white)
                        if let badge {
                            Text(badge)
                                .font(.system(size: 10, weight: .heavy, design: .rounded))
                                .padding(.horizontal, 8)
                                .padding(.vertical, 3)
                                .background(Color.novaGreen, in: Capsule())
                                .foregroundStyle(.black)
                        }
                    }
                    Text(trialText ?? product.description)
                        .font(.caption)
                        .foregroundStyle(.novaTextSecondary)
                        .lineLimit(2)
                }

                Spacer(minLength: 8)

                VStack(alignment: .trailing, spacing: 2) {
                    Text(product.displayPrice)
                        .font(.title3.weight(.bold))
                        .foregroundStyle(.white)
                    Text(periodSuffix)
                        .font(.caption2)
                        .foregroundStyle(.novaTextTertiary)
                }
            }
            .padding(16)
            .background(
                RoundedRectangle(cornerRadius: 20, style: .continuous)
                    .fill(isSelected ? Color.novaSurfaceLight : Color.novaSurface.opacity(0.7))
            )
            .overlay(
                RoundedRectangle(cornerRadius: 20, style: .continuous)
                    .strokeBorder(
                        isSelected ? AnyShapeStyle(LinearGradient.novaPrimary) : AnyShapeStyle(Color.white.opacity(0.08)),
                        lineWidth: isSelected ? 1.5 : 1
                    )
            )
        }
        .buttonStyle(PressableButtonStyle())
        .animation(.spring(response: 0.3, dampingFraction: 0.8), value: isSelected)
        .accessibilityElement(children: .ignore)
        .accessibilityLabel("\(product.displayName), \(product.displayPrice) \(periodSuffix)\(badge.map { ", \($0)" } ?? "")")
        .accessibilityValue(isSelected ? "Selected" : "")
        .accessibilityAddTraits(isSelected ? .isSelected : [])
    }
}

private extension Product.SubscriptionPeriod {
    /// "7 days", "1 week", "1 month"… for trial copy.
    var debugLabel: String {
        let unitName: String
        switch unit {
        case .day: unitName = value == 1 ? "day" : "days"
        case .week: unitName = value == 1 ? "week" : "weeks"
        case .month: unitName = value == 1 ? "month" : "months"
        case .year: unitName = value == 1 ? "year" : "years"
        @unknown default: unitName = ""
        }
        return "\(value) \(unitName)"
    }
}
