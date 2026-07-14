//
//  PingService.swift
//  NovaVPN
//
//  Latency measurement for server endpoints.
//

import Foundation
import Network

/// Measures round-trip latency to a host. Abstracted so the UI can be
/// driven by a real prober in production and a deterministic one in
/// previews/tests.
protocol LatencyMeasuring: Sendable {
    /// Returns latency in milliseconds, or `nil` if the host is unreachable
    /// within the timeout.
    func measureLatency(host: String, port: UInt16) async -> Int?
}

/// Real prober: times a TCP handshake to the endpoint using
/// `NWConnection`. ICMP isn't available to sandboxed iOS apps, so a
/// connect-time measurement is the standard approach.
struct TCPLatencyProber: LatencyMeasuring {
    /// Give up after this many seconds.
    var timeout: TimeInterval = 2

    func measureLatency(host: String, port: UInt16) async -> Int? {
        guard let nwPort = NWEndpoint.Port(rawValue: port) else { return nil }
        let started = ContinuationClock()

        return await withTaskGroup(of: Int?.self) { group in
            group.addTask {
                await connectOnce(host: host, port: nwPort, clock: started)
            }
            group.addTask {
                try? await Task.sleep(for: .seconds(timeout))
                return nil
            }
            // First finished child wins (either a measurement or the timeout).
            let result = await group.next() ?? nil
            group.cancelAll()
            return result
        }
    }

    private func connectOnce(host: String, port: NWEndpoint.Port, clock: ContinuationClock) async -> Int? {
        let connection = NWConnection(host: NWEndpoint.Host(host), port: port, using: .tcp)
        defer { connection.cancel() }

        return await withCheckedContinuation { continuation in
            // `resume` must be called exactly once; state changes can fire
            // multiple times (preparing → ready / failed).
            let guardBox = ResumeOnce()
            connection.stateUpdateHandler = { state in
                switch state {
                case .ready:
                    guardBox.resume(continuation, returning: clock.elapsedMilliseconds)
                case .failed, .cancelled:
                    guardBox.resume(continuation, returning: nil)
                default:
                    break
                }
            }
            connection.start(queue: .global(qos: .utility))
        }
    }
}

/// Wall-clock stopwatch safe to read from any thread.
private struct ContinuationClock: Sendable {
    private let start = DispatchTime.now()
    var elapsedMilliseconds: Int {
        Int((DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)
    }
}

/// Ensures a `CheckedContinuation` resumes exactly once across racy callbacks.
private final class ResumeOnce: @unchecked Sendable {
    private let lock = NSLock()
    private var resumed = false

    func resume(_ continuation: CheckedContinuation<Int?, Never>, returning value: Int?) {
        lock.lock()
        defer { lock.unlock() }
        guard !resumed else { return }
        resumed = true
        continuation.resume(returning: value)
    }
}

/// Deterministic prober used in previews, the simulator, and as a fallback
/// while the sample endpoints in `StaticServerDirectory` are placeholders.
/// Values are stable per host so the UI doesn't flicker between refreshes.
struct SeededLatencyProber: LatencyMeasuring {
    func measureLatency(host: String, port: UInt16) async -> Int? {
        // Small artificial delay so refresh spinners are visible.
        try? await Task.sleep(for: .milliseconds(300))
        var hash = UInt64(5381)
        for byte in host.utf8 { hash = hash &* 33 &+ UInt64(byte) }
        return 18 + Int(hash % 160)
    }
}
