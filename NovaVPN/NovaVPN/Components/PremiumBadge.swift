//
//  PremiumBadge.swift
//  NovaVPN
//
//  Small "PRO" capsule marking premium locations and features.
//

import SwiftUI

struct PremiumBadge: View {
    var body: some View {
        HStack(spacing: 3) {
            Image(systemName: "crown.fill")
                .font(.system(size: 9, weight: .bold))
            Text("PRO")
                .font(.system(size: 10, weight: .heavy, design: .rounded))
                .kerning(0.5)
        }
        .foregroundStyle(.white)
        .padding(.horizontal, 8)
        .padding(.vertical, 4)
        .background(LinearGradient.novaPrimary, in: Capsule())
        .accessibilityLabel("Premium")
    }
}

#Preview {
    PremiumBadge()
        .padding()
        .background(Color.novaBackground)
}
