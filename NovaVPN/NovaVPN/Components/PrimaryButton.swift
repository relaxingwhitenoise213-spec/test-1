//
//  PrimaryButton.swift
//  NovaVPN
//
//  The app's primary call-to-action button: gradient fill, rounded,
//  optional loading spinner, springy press feedback.
//

import SwiftUI

struct PrimaryButton: View {
    let title: String
    var systemImage: String? = nil
    var isLoading: Bool = false
    var isEnabled: Bool = true
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 8) {
                if isLoading {
                    ProgressView()
                        .tint(.white)
                } else if let systemImage {
                    Image(systemName: systemImage)
                        .font(.body.weight(.semibold))
                }
                Text(title)
                    .font(.headline)
            }
            .foregroundStyle(.white)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 16)
            .background(LinearGradient.novaPrimary, in: RoundedRectangle(cornerRadius: 18, style: .continuous))
            .opacity(isEnabled && !isLoading ? 1 : 0.55)
        }
        .buttonStyle(PressableButtonStyle())
        .disabled(!isEnabled || isLoading)
        .sensoryFeedback(.impact(weight: .light), trigger: isLoading)
        .accessibilityLabel(title)
        .accessibilityHint(isLoading ? "Loading" : "")
    }
}

/// Scales the label down slightly while pressed for tactile feel.
struct PressableButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.965 : 1)
            .animation(.spring(response: 0.25, dampingFraction: 0.7), value: configuration.isPressed)
    }
}

#Preview {
    VStack(spacing: 16) {
        PrimaryButton(title: "Continue", systemImage: "arrow.right") {}
        PrimaryButton(title: "Purchasing…", isLoading: true) {}
        PrimaryButton(title: "Disabled", isEnabled: false) {}
    }
    .padding()
    .background(Color.novaBackground)
}
