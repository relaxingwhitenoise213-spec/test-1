//
//  ServerCell.swift
//  NovaVPN
//
//  A row in the server list: flag, country, metrics, premium badge,
//  selection state.
//

import SwiftUI

struct ServerCell: View {
    let server: VPNServer
    let isSelected: Bool
    /// Whether the current user may connect to this server.
    let isLocked: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 14) {
                Text(server.flag)
                    .font(.system(size: 30))
                    .frame(width: 46, height: 46)
                    .background(Color.novaSurfaceLight, in: RoundedRectangle(cornerRadius: 12, style: .continuous))

                VStack(alignment: .leading, spacing: 4) {
                    HStack(spacing: 8) {
                        Text(server.country)
                            .font(.body.weight(.semibold))
                            .foregroundStyle(.white)
                        if server.isPremium {
                            PremiumBadge()
                        }
                    }
                    HStack(spacing: 10) {
                        Text(server.city)
                        LoadIndicator(load: server.load)
                        Text(server.status.label)
                    }
                    .font(.caption)
                    .foregroundStyle(.novaTextSecondary)
                }

                Spacer(minLength: 8)

                VStack(alignment: .trailing, spacing: 6) {
                    if let ping = server.ping {
                        PingLabel(ping: ping, quality: server.pingQuality)
                    } else {
                        Text("—")
                            .font(.caption)
                            .foregroundStyle(.novaTextTertiary)
                    }

                    if isLocked {
                        Image(systemName: "lock.fill")
                            .font(.caption)
                            .foregroundStyle(.novaTextTertiary)
                    } else if isSelected {
                        Image(systemName: "checkmark.circle.fill")
                            .font(.body)
                            .foregroundStyle(.novaGreen)
                            .transition(.scale.combined(with: .opacity))
                    }
                }
            }
            .padding(14)
            .background(
                RoundedRectangle(cornerRadius: 18, style: .continuous)
                    .fill(isSelected ? Color.novaSurfaceLight : Color.novaSurface.opacity(0.7))
            )
            .overlay(
                RoundedRectangle(cornerRadius: 18, style: .continuous)
                    .strokeBorder(
                        isSelected ? AnyShapeStyle(LinearGradient.novaPrimary) : AnyShapeStyle(Color.white.opacity(0.07)),
                        lineWidth: isSelected ? 1.5 : 1
                    )
            )
        }
        .buttonStyle(PressableButtonStyle())
        .animation(.spring(response: 0.35, dampingFraction: 0.8), value: isSelected)
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(server.accessibilitySummary)
        .accessibilityValue(isSelected ? "Selected" : "")
        .accessibilityHint(isLocked ? "Premium required. Opens upgrade options." : "Selects this location")
    }
}

/// Tiny horizontal capacity bar for server load.
struct LoadIndicator: View {
    /// Load 0...1.
    let load: Double

    private var color: Color {
        switch load {
        case ..<0.5: return .novaGreen
        case ..<0.75: return .novaAmber
        default: return .novaRed
        }
    }

    var body: some View {
        HStack(spacing: 4) {
            GeometryReader { proxy in
                ZStack(alignment: .leading) {
                    Capsule().fill(Color.white.opacity(0.12))
                    Capsule()
                        .fill(color)
                        .frame(width: proxy.size.width * min(max(load, 0), 1))
                }
            }
            .frame(width: 34, height: 4)
            Text("\(Int(load * 100))%")
                .monospacedDigit()
        }
        .accessibilityLabel("Load \(Int(load * 100)) percent")
    }
}

#Preview {
    VStack(spacing: 10) {
        ServerCell(server: StaticServerDirectory.catalog[1], isSelected: true, isLocked: false) {}
        ServerCell(server: StaticServerDirectory.catalog[0], isSelected: false, isLocked: true) {}
    }
    .padding()
    .background(Color.novaBackground)
}
