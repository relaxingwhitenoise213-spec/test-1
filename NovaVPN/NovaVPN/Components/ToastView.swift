//
//  ToastView.swift
//  NovaVPN
//
//  Lightweight transient notifications ("toasts") with a shared center
//  injected through the environment.
//

import SwiftUI
import Observation

/// A single toast message.
struct Toast: Equatable, Identifiable {
    enum Style { case info, success, error }

    let id = UUID()
    let style: Style
    let message: String

    var symbolName: String {
        switch style {
        case .info: return "info.circle.fill"
        case .success: return "checkmark.circle.fill"
        case .error: return "exclamationmark.triangle.fill"
        }
    }

    var tint: Color {
        switch style {
        case .info: return .novaBlue
        case .success: return .novaGreen
        case .error: return .novaRed
        }
    }
}

/// App-wide toast dispatcher. Present one toast at a time, auto-dismissing.
@MainActor
@Observable
final class ToastCenter {
    private(set) var current: Toast?
    private var dismissTask: Task<Void, Never>?

    func show(_ style: Toast.Style, _ message: String, duration: TimeInterval = 2.6) {
        dismissTask?.cancel()
        current = Toast(style: style, message: message)
        dismissTask = Task { [weak self] in
            try? await Task.sleep(for: .seconds(duration))
            guard !Task.isCancelled else { return }
            self?.current = nil
        }
    }

    func dismiss() {
        dismissTask?.cancel()
        current = nil
    }
}

/// Renders the current toast at the top of the screen.
struct ToastOverlay: ViewModifier {
    @Environment(ToastCenter.self) private var toastCenter

    func body(content: Content) -> some View {
        content.overlay(alignment: .top) {
            if let toast = toastCenter.current {
                HStack(spacing: 10) {
                    Image(systemName: toast.symbolName)
                        .foregroundStyle(toast.tint)
                    Text(toast.message)
                        .font(.subheadline.weight(.medium))
                        .foregroundStyle(.white)
                        .multilineTextAlignment(.leading)
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 12)
                .glassCard(cornerRadius: 16)
                .padding(.horizontal, 24)
                .padding(.top, 8)
                .transition(.move(edge: .top).combined(with: .opacity))
                .onTapGesture { toastCenter.dismiss() }
                .accessibilityAddTraits(.isStaticText)
                .accessibilityLabel(toast.message)
            }
        }
        .animation(.spring(response: 0.4, dampingFraction: 0.8), value: toastCenter.current)
    }
}

extension View {
    /// Attach once near the root; toasts from `ToastCenter` appear on top.
    func toastOverlay() -> some View {
        modifier(ToastOverlay())
    }
}
