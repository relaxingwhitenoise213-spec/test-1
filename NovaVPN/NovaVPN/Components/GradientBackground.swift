//
//  GradientBackground.swift
//  NovaVPN
//
//  The app's ambient background: near-black base with slowly drifting
//  blue/purple glows that shift green while connected.
//

import SwiftUI

struct GradientBackground: View {
    /// Tints the glow toward green when the tunnel is up.
    var isConnected: Bool = false

    /// Drives the slow drift of the glow blobs.
    @State private var drift = false

    private var primaryGlow: Color { isConnected ? .novaGreen : .novaBlue }
    private var secondaryGlow: Color { isConnected ? .novaCyan : .novaPurple }

    var body: some View {
        ZStack {
            Color.novaBackground

            // Soft radial glows, heavily blurred, drifting diagonally.
            Circle()
                .fill(primaryGlow.opacity(0.35))
                .frame(width: 420, height: 420)
                .blur(radius: 120)
                .offset(x: drift ? -110 : -30, y: drift ? -260 : -180)

            Circle()
                .fill(secondaryGlow.opacity(0.30))
                .frame(width: 380, height: 380)
                .blur(radius: 110)
                .offset(x: drift ? 140 : 60, y: drift ? 240 : 320)

            // A faint vignette keeps edges dark for contrast.
            RadialGradient(
                colors: [.clear, .black.opacity(0.45)],
                center: .center,
                startRadius: 180,
                endRadius: 520
            )
        }
        .ignoresSafeArea()
        .animation(.easeInOut(duration: 1.2), value: isConnected)
        .onAppear {
            withAnimation(.easeInOut(duration: 9).repeatForever(autoreverses: true)) {
                drift = true
            }
        }
        .accessibilityHidden(true)
    }
}

#Preview("Disconnected") {
    GradientBackground()
}

#Preview("Connected") {
    GradientBackground(isConnected: true)
}
