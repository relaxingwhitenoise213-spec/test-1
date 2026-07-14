//
//  LoadingView.swift
//  NovaVPN
//
//  Full-surface loading indicator with the Nova gradient ring.
//

import SwiftUI

struct LoadingView: View {
    var message: String = "Loading…"

    @State private var spinning = false

    var body: some View {
        VStack(spacing: 18) {
            Circle()
                .trim(from: 0.12, to: 0.9)
                .stroke(LinearGradient.novaPrimary, style: StrokeStyle(lineWidth: 4, lineCap: .round))
                .frame(width: 44, height: 44)
                .rotationEffect(.degrees(spinning ? 360 : 0))
                .onAppear {
                    withAnimation(.linear(duration: 0.9).repeatForever(autoreverses: false)) {
                        spinning = true
                    }
                }

            Text(message)
                .font(.subheadline)
                .foregroundStyle(.novaTextSecondary)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(message)
        .accessibilityAddTraits(.updatesFrequently)
    }
}

#Preview {
    LoadingView(message: "Loading plans…")
        .background(Color.novaBackground)
}
