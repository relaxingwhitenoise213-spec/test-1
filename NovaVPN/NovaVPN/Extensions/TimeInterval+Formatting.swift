//
//  TimeInterval+Formatting.swift
//  NovaVPN
//
//  Duration and byte formatting used by the connection timer and stats.
//

import Foundation

extension TimeInterval {
    /// `01:23:45`-style connection timer string.
    var timerString: String {
        let total = Int(self.rounded(.down))
        let hours = total / 3600
        let minutes = (total % 3600) / 60
        let seconds = total % 60
        return String(format: "%02d:%02d:%02d", hours, minutes, seconds)
    }

    /// Compact form like "12 min" for usage summaries.
    var shortDurationString: String {
        let formatter = DateComponentsFormatter()
        formatter.allowedUnits = self >= 3600 ? [.hour, .minute] : [.minute]
        formatter.unitsStyle = .short
        return formatter.string(from: max(self, 0)) ?? "0 min"
    }
}

extension Double {
    /// Formats a bytes-per-second rate as "12.4 MB/s".
    var speedString: String {
        let formatter = ByteCountFormatter()
        formatter.countStyle = .binary
        return formatter.string(fromByteCount: Int64(max(self, 0))) + "/s"
    }
}

extension Int64 {
    /// Formats a byte count as "1.2 GB".
    var byteCountString: String {
        ByteCountFormatter.string(fromByteCount: self, countStyle: .binary)
    }
}
