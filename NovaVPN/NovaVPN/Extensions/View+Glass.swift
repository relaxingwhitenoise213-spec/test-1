//
//  View+Glass.swift
//  NovaVPN
//
//  Glassmorphism helpers shared by cards and sheets.
//

import SwiftUI

/// A frosted-glass card: material fill, gradient hairline border, soft shadow.
private struct GlassCardModifier: ViewModifier {
    var cornerRadius: CGFloat

    func body(content: Content) -> some View {
        content
            .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: cornerRadius, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                    .strokeBorder(LinearGradient.novaGlassStroke, lineWidth: 1)
            )
            .shadow(color: .black.opacity(0.35), radius: 18, x: 0, y: 10)
    }
}

extension View {
    /// Wraps the view in the app's standard glass card treatment.
    func glassCard(cornerRadius: CGFloat = 24) -> some View {
        modifier(GlassCardModifier(cornerRadius: cornerRadius))
    }
}
