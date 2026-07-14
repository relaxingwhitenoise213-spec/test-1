//
//  UsageService.swift
//  NovaVPN
//
//  Tracks free-tier daily usage. Placeholder policy: time-based allowance
//  tracked on-device; a backend can take over enforcement later.
//

import Foundation
import Observation

/// Accumulates connected time per calendar day for the free tier.
@MainActor
@Observable
final class UsageService {
    private let defaults: UserDefaults
    private let calendar = Calendar.current

    private enum Key {
        static let dayStamp = "usage.dayStamp"
        static let secondsUsed = "usage.secondsUsed"
    }

    /// Seconds of completed sessions today (excludes the in-flight session).
    private(set) var usedToday: TimeInterval = 0

    /// Start of the current session, when one is active.
    private var sessionStart: Date?

    init(defaults: UserDefaults = .standard) {
        self.defaults = defaults
        rollOverIfNeeded()
        usedToday = defaults.double(forKey: Key.secondsUsed)
    }

    /// Remaining free allowance, accounting for any in-flight session.
    func remainingToday(now: Date = Date()) -> TimeInterval {
        rollOverIfNeeded(now: now)
        let inFlight = sessionStart.map { now.timeIntervalSince($0) } ?? 0
        return max(AppConfig.freeDailyAllowance - usedToday - inFlight, 0)
    }

    /// Call when a tunnel session becomes established.
    func beginSession(at date: Date = Date()) {
        rollOverIfNeeded(now: date)
        sessionStart = date
    }

    /// Call when the tunnel disconnects; banks the elapsed time.
    func endSession(at date: Date = Date()) {
        guard let start = sessionStart else { return }
        sessionStart = nil
        rollOverIfNeeded(now: date)
        usedToday += max(date.timeIntervalSince(start), 0)
        persist()
    }

    // MARK: - Persistence

    /// Resets the counter when the calendar day changes.
    private func rollOverIfNeeded(now: Date = Date()) {
        let today = dayStamp(for: now)
        if defaults.string(forKey: Key.dayStamp) != today {
            defaults.set(today, forKey: Key.dayStamp)
            defaults.set(0.0, forKey: Key.secondsUsed)
            usedToday = 0
        }
    }

    private func persist() {
        defaults.set(usedToday, forKey: Key.secondsUsed)
    }

    private func dayStamp(for date: Date) -> String {
        let parts = calendar.dateComponents([.year, .month, .day], from: date)
        return "\(parts.year ?? 0)-\(parts.month ?? 0)-\(parts.day ?? 0)"
    }
}
