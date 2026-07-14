//
//  CountryCard.swift
//  NovaVPN
//
//  Home-screen card showing the selected location; tapping opens the
//  server picker.
//

import SwiftUI

struct CountryCard: View {
    let server: VPNServer
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 14) {
                Text(server.flag)
                    .font(.system(size: 34))
                    .frame(width: 52, height: 52)
                    .background(Color.novaSurfaceLight, in: RoundedRectangle(cornerRadius: 14, style: .continuous))

                VStack(alignment: .leading, spacing: 3) {
                    HStack(spacing: 8) {
                        Text(server.country)
                            .font(.headline)
                            .foregroundStyle(.white)
                        if server.isPremium {
                            PremiumBadge()
                        }
                    }
                    Text(server.city)
                        .font(.subheadline)
                        .foregroundStyle(.novaTextSecondary)
                }

                Spacer(minLength: 8)

                if let ping = server.ping {
                    PingLabel(ping: ping, quality: server.pingQuality)
                }

                Image(systemName: "chevron.right")
                    .font(.footnote.weight(.semibold))
                    .foregroundStyle(.novaTextTertiary)
            }
            .padding(16)
        }
        .buttonStyle(PressableButtonStyle())
        .glassCard(cornerRadius: 22)
        .accessibilityElement(children: .ignore)
        .accessibilityLabel("Selected location: \(server.accessibilitySummary)")
        .accessibilityHint("Opens the location list")
    }
}

/// Latency readout tinted by quality.
struct PingLabel: View {
    let ping: Int
    let quality: VPNServer.PingQuality

    private var color: Color {
        switch quality {
        case .great: return .novaGreen
        case .okay: return .novaAmber
        case .poor: return .novaRed
        case .unknown: return .novaTextTertiary
        }
    }

    var body: some View {
        HStack(spacing: 4) {
            Image(systemName: "wifi")
                .font(.caption2.weight(.bold))
            Text("\(ping) ms")
                .font(.caption.weight(.semibold))
                .monospacedDigit()
        }
        .foregroundStyle(color)
        .accessibilityLabel("Ping \(ping) milliseconds")
    }
}

#Preview {
    CountryCard(server: StaticServerDirectory.catalog[0]) {}
        .padding()
        .background(Color.novaBackground)
}
