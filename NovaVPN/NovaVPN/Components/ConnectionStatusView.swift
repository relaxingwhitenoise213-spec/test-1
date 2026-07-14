//
//  ConnectionStatusView.swift
//  NovaVPN
//
//  Capsule status pill reflecting the VPN state (dot + label).
//

import SwiftUI

struct ConnectionStatusView: View {
    let state: VPNState

    private var dotColor: Color {
        switch state {
        case .connected: return .novaGreen
        case .connecting, .reconnecting, .disconnecting: return .novaAmber
        case .disconnected: return .novaTextTertiary
        case .failed: return .novaRed
        }
    }

    var body: some View {
        HStack(spacing: 8) {
            ZStack {
                // Soft halo pulse behind the dot while transitioning.
                if state.isTransitioning {
                    Circle()
                        .fill(dotColor.opacity(0.4))
                        .frame(width: 16, height: 16)
                        .modifier(PulseEffect())
                }
                Circle()
                    .fill(dotColor)
                    .frame(width: 8, height: 8)
            }
            Text(state.statusText)
                .font(.subheadline.weight(.medium))
                .foregroundStyle(.white.opacity(0.85))
                .contentTransition(.numericText())
        }
        .padding(.horizontal, 14)
        .padding(.vertical, 8)
        .background(.ultraThinMaterial, in: Capsule())
        .overlay(Capsule().strokeBorder(.white.opacity(0.12), lineWidth: 1))
        .animation(.easeInOut(duration: 0.3), value: state)
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(state.accessibilityDescription)
        .accessibilityAddTraits(.updatesFrequently)
    }
}

/// Repeating scale/fade pulse for attention dots.
private struct PulseEffect: ViewModifier {
    @State private var pulsing = false

    func body(content: Content) -> some View {
        content
            .scaleEffect(pulsing ? 1.6 : 0.9)
            .opacity(pulsing ? 0.2 : 0.8)
            .onAppear {
                withAnimation(.easeInOut(duration: 0.9).repeatForever(autoreverses: true)) {
                    pulsing = true
                }
            }
    }
}

#Preview {
    VStack(spacing: 12) {
        ConnectionStatusView(state: .disconnected)
        ConnectionStatusView(state: .connecting)
        ConnectionStatusView(state: .connected(since: .now))
        ConnectionStatusView(state: .failed(.networkUnavailable))
    }
    .padding()
    .background(Color.novaBackground)
}
