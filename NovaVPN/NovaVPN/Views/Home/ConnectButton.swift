//
//  ConnectButton.swift
//  NovaVPN
//
//  The hero circular connect/disconnect control with per-state animation:
//  breathing pulse when idle, spinner ring + expanding waves while
//  connecting, steady green glow when connected.
//

import SwiftUI

struct ConnectButton: View {
    let state: VPNState
    let action: () -> Void

    /// Idle breathing animation flag.
    @State private var breathing = false

    private var ringGradient: LinearGradient {
        state.isConnected ? .novaConnected : .novaPrimary
    }

    private var glowColor: Color {
        switch state {
        case .connected: return .novaGreen
        case .failed: return .novaRed
        default: return .novaBlue
        }
    }

    var body: some View {
        Button(action: action) {
            ZStack {
                // Expanding waves while a transition is in flight.
                if state.isTransitioning {
                    ConnectingWaves(color: glowColor)
                }

                // Ambient glow.
                Circle()
                    .fill(glowColor.opacity(state.isConnected ? 0.35 : 0.22))
                    .frame(width: 230, height: 230)
                    .blur(radius: 40)

                // Main body.
                Circle()
                    .fill(.ultraThinMaterial)
                    .frame(width: 200, height: 200)
                    .overlay(Circle().strokeBorder(.white.opacity(0.1), lineWidth: 1))
                    .shadow(color: .black.opacity(0.4), radius: 24, y: 12)

                // Static gradient ring (hidden while the spinner shows).
                Circle()
                    .strokeBorder(ringGradient, lineWidth: 5)
                    .frame(width: 200, height: 200)
                    .opacity(state.isTransitioning ? 0 : 1)

                // Spinner ring during transitions.
                if state.isTransitioning {
                    TimelineView(.animation(minimumInterval: 1.0 / 40.0)) { context in
                        let cycle = context.date.timeIntervalSinceReferenceDate.truncatingRemainder(dividingBy: 1.4) / 1.4
                        Circle()
                            .trim(from: 0.08, to: 0.42)
                            .stroke(ringGradient, style: StrokeStyle(lineWidth: 5, lineCap: .round))
                            .frame(width: 195, height: 195)
                            .rotationEffect(.degrees(cycle * 360))
                    }
                }

                // Power glyph.
                Image(systemName: "power")
                    .font(.system(size: 58, weight: .semibold))
                    .foregroundStyle(state.isConnected ? AnyShapeStyle(LinearGradient.novaConnected) : AnyShapeStyle(Color.white))
                    .contentTransition(.symbolEffect(.replace))
            }
            .scaleEffect(breathing && state == .disconnected ? 1.03 : 1.0)
        }
        .buttonStyle(PressableButtonStyle())
        .frame(width: 250, height: 250)
        .animation(.easeInOut(duration: 0.4), value: state)
        .onAppear {
            withAnimation(.easeInOut(duration: 1.8).repeatForever(autoreverses: true)) {
                breathing = true
            }
        }
        // Haptics: tap feedback plus success/error notifications on outcome.
        .sensoryFeedback(.impact(weight: .medium), trigger: state.isTransitioning)
        .sensoryFeedback(.success, trigger: state.isConnected) { _, connected in connected }
        .sensoryFeedback(.error, trigger: state) { _, new in
            if case .failed = new { return true } else { return false }
        }
        .accessibilityLabel(state.isConnected ? "Disconnect VPN" : "Connect VPN")
        .accessibilityValue(state.accessibilityDescription)
        .accessibilityHint(state.isConnected ? "Double tap to disconnect" : "Double tap to connect")
    }
}

/// Two staggered rings that expand and fade, signalling activity.
private struct ConnectingWaves: View {
    let color: Color
    @State private var animating = false

    var body: some View {
        ZStack {
            ForEach(0..<2, id: \.self) { index in
                Circle()
                    .stroke(color.opacity(0.5), lineWidth: 2)
                    .frame(width: 200, height: 200)
                    .scaleEffect(animating ? 1.35 : 1.0)
                    .opacity(animating ? 0 : 0.7)
                    .animation(
                        .easeOut(duration: 1.6)
                        .repeatForever(autoreverses: false)
                        .delay(Double(index) * 0.8),
                        value: animating
                    )
            }
        }
        .onAppear { animating = true }
        .accessibilityHidden(true)
    }
}

#Preview("States") {
    VStack(spacing: 8) {
        ConnectButton(state: .disconnected) {}
        ConnectButton(state: .connecting) {}
        ConnectButton(state: .connected(since: .now)) {}
    }
    .frame(maxWidth: .infinity, maxHeight: .infinity)
    .background(Color.novaBackground)
}
