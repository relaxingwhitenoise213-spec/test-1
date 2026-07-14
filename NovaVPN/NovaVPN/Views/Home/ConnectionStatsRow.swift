//
//  ConnectionStatsRow.swift
//  NovaVPN
//
//  Download/upload speed tiles plus the current-IP card.
//

import SwiftUI

/// Two glass tiles showing live tunnel throughput. Values come from the
/// `ConnectionMonitor`'s runtime-stat sampling and read 0 when idle.
struct ConnectionStatsRow: View {
    @Environment(ConnectionMonitor.self) private var monitor

    var body: some View {
        HStack(spacing: 12) {
            StatTile(
                symbolName: "arrow.down",
                tint: .novaCyan,
                title: "Download",
                value: monitor.downloadSpeed.speedString
            )
            StatTile(
                symbolName: "arrow.up",
                tint: .novaPurple,
                title: "Upload",
                value: monitor.uploadSpeed.speedString
            )
        }
    }
}

private struct StatTile: View {
    let symbolName: String
    let tint: Color
    let title: String
    let value: String

    var body: some View {
        HStack(spacing: 10) {
            Image(systemName: symbolName)
                .font(.subheadline.weight(.bold))
                .foregroundStyle(tint)
                .frame(width: 32, height: 32)
                .background(tint.opacity(0.15), in: Circle())

            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.caption)
                    .foregroundStyle(.novaTextTertiary)
                Text(value)
                    .font(.subheadline.weight(.semibold))
                    .foregroundStyle(.white)
                    .monospacedDigit()
                    .contentTransition(.numericText())
                    .lineLimit(1)
                    .minimumScaleFactor(0.7)
            }
            Spacer(minLength: 0)
        }
        .padding(12)
        .frame(maxWidth: .infinity)
        .glassCard(cornerRadius: 18)
        .accessibilityElement(children: .ignore)
        .accessibilityLabel("\(title) speed \(value)")
        .accessibilityAddTraits(.updatesFrequently)
    }
}

/// Card showing the (placeholder or tunnel) IP address.
struct IPAddressCard: View {
    let caption: String
    let ip: String
    let isProtected: Bool

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: isProtected ? "shield.checkered" : "shield.slash")
                .font(.title3)
                .foregroundStyle(isProtected ? Color.novaGreen : Color.novaAmber)

            VStack(alignment: .leading, spacing: 2) {
                Text(caption)
                    .font(.caption)
                    .foregroundStyle(.novaTextTertiary)
                Text(ip)
                    .font(.subheadline.weight(.semibold))
                    .foregroundStyle(.white)
                    .monospacedDigit()
                    .contentTransition(.numericText())
            }
            Spacer(minLength: 0)
        }
        .padding(12)
        .glassCard(cornerRadius: 18)
        .accessibilityElement(children: .ignore)
        .accessibilityLabel("\(caption): \(isProtected ? ip : "hidden")")
    }
}

#Preview {
    VStack(spacing: 12) {
        ConnectionStatsRow()
        IPAddressCard(caption: "Your IP is exposed", ip: "· · · . · · · . · · · . · · ·", isProtected: false)
    }
    .padding()
    .background(Color.novaBackground)
    .environment(ConnectionMonitor())
}
