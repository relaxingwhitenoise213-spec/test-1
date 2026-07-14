//
//  Color+Theme.swift
//  NovaVPN
//
//  The Nova VPN palette: black / dark gray base with blue gradients and
//  purple accents. Defined in code so the theme is available to previews
//  and the asset catalog stays minimal.
//

import SwiftUI

extension Color {
    // MARK: Base surfaces
    /// Near-black app background.
    static let novaBackground = Color(red: 0.04, green: 0.05, blue: 0.09)
    /// Dark gray elevated surface (cards, sheets).
    static let novaSurface = Color(red: 0.10, green: 0.11, blue: 0.17)
    /// Slightly lighter surface for nested elements.
    static let novaSurfaceLight = Color(red: 0.16, green: 0.17, blue: 0.24)

    // MARK: Accents
    /// Primary blue.
    static let novaBlue = Color(red: 0.25, green: 0.48, blue: 1.00)
    /// Purple accent.
    static let novaPurple = Color(red: 0.55, green: 0.35, blue: 0.98)
    /// Cyan highlight used in gradients.
    static let novaCyan = Color(red: 0.30, green: 0.82, blue: 0.99)

    // MARK: Semantic
    static let novaGreen = Color(red: 0.25, green: 0.84, blue: 0.55)
    static let novaAmber = Color(red: 0.98, green: 0.72, blue: 0.25)
    static let novaRed = Color(red: 0.98, green: 0.35, blue: 0.37)

    // MARK: Text
    static let novaTextPrimary = Color.white
    static let novaTextSecondary = Color.white.opacity(0.65)
    static let novaTextTertiary = Color.white.opacity(0.4)
}

extension LinearGradient {
    /// The signature blue→purple gradient used on primary actions.
    static let novaPrimary = LinearGradient(
        colors: [.novaBlue, .novaPurple],
        startPoint: .topLeading,
        endPoint: .bottomTrailing
    )

    /// Green gradient shown while connected.
    static let novaConnected = LinearGradient(
        colors: [Color(red: 0.15, green: 0.75, blue: 0.50), .novaCyan],
        startPoint: .topLeading,
        endPoint: .bottomTrailing
    )

    /// Subtle stroke gradient for glass card borders.
    static let novaGlassStroke = LinearGradient(
        colors: [.white.opacity(0.35), .white.opacity(0.05)],
        startPoint: .topLeading,
        endPoint: .bottomTrailing
    )
}
