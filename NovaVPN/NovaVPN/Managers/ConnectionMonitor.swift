//
//  ConnectionMonitor.swift
//  NovaVPN
//
//  Watches network path changes and samples tunnel runtime stats
//  (throughput, handshake age) while connected.
//

import Foundation
import Network
import Observation

/// A snapshot of the device's network path.
struct NetworkPathSnapshot: Equatable, Sendable {
    var isOnline: Bool
    var isExpensive: Bool
    var usesWifi: Bool
    var usesCellular: Bool
}

/// Observes `NWPathMonitor` and periodically polls the tunnel for stats.
///
/// `VPNManager` consumes `pathUpdates()` to drive reconnect-on-network-change
/// and offline errors; views read the published throughput numbers.
@MainActor
@Observable
final class ConnectionMonitor {

    // MARK: Published state

    /// Latest network path snapshot.
    private(set) var path = NetworkPathSnapshot(isOnline: true, isExpensive: false, usesWifi: false, usesCellular: false)

    /// Cumulative tunnel counters from the last sample.
    private(set) var stats: TunnelRuntimeStats = .zero

    /// Instantaneous throughput in bytes/second, derived from consecutive samples.
    private(set) var downloadSpeed: Double = 0
    private(set) var uploadSpeed: Double = 0

    var isOnline: Bool { path.isOnline }

    // MARK: Private

    private let monitor = NWPathMonitor()
    private var pathContinuations: [UUID: AsyncStream<NetworkPathSnapshot>.Continuation] = [:]
    private var samplingTask: Task<Void, Never>?
    private var previousSample: (stats: TunnelRuntimeStats, at: Date)?

    /// Interval between runtime stat polls while connected.
    private let sampleInterval: TimeInterval = 3

    init() {
        monitor.pathUpdateHandler = { [weak self] nwPath in
            let snapshot = NetworkPathSnapshot(
                isOnline: nwPath.status == .satisfied,
                isExpensive: nwPath.isExpensive,
                usesWifi: nwPath.usesInterfaceType(.wifi),
                usesCellular: nwPath.usesInterfaceType(.cellular)
            )
            Task { @MainActor [weak self] in
                self?.apply(snapshot)
            }
        }
        monitor.start(queue: DispatchQueue(label: "com.novavpn.app.pathmonitor"))
    }

    /// Emits every network path change (and the current path on subscribe).
    func pathUpdates() -> AsyncStream<NetworkPathSnapshot> {
        AsyncStream { continuation in
            let id = UUID()
            pathContinuations[id] = continuation
            continuation.yield(self.path)
            continuation.onTermination = { [weak self] _ in
                Task { @MainActor [weak self] in
                    self?.pathContinuations.removeValue(forKey: id)
                }
            }
        }
    }

    /// Starts polling `tunnel` for runtime stats until `stopSampling()`.
    func startSampling(from tunnel: TunnelProviding) {
        stopSampling()
        samplingTask = Task { [weak self, weak tunnel] in
            while !Task.isCancelled {
                guard let self, let tunnel else { return }
                if let fresh = await tunnel.fetchRuntimeStats() {
                    self.ingest(fresh)
                }
                try? await Task.sleep(for: .seconds(self.sampleInterval))
            }
        }
    }

    /// Stops polling and clears throughput readouts.
    func stopSampling() {
        samplingTask?.cancel()
        samplingTask = nil
        previousSample = nil
        downloadSpeed = 0
        uploadSpeed = 0
        stats = .zero
    }

    // MARK: - Internals

    private func apply(_ snapshot: NetworkPathSnapshot) {
        guard snapshot != path else { return }
        path = snapshot
        for continuation in pathContinuations.values {
            continuation.yield(snapshot)
        }
    }

    /// Converts cumulative counters into instantaneous rates.
    private func ingest(_ fresh: TunnelRuntimeStats) {
        let now = Date()
        if let previous = previousSample {
            let dt = now.timeIntervalSince(previous.at)
            if dt > 0 {
                downloadSpeed = max(Double(fresh.bytesReceived - previous.stats.bytesReceived) / dt, 0)
                uploadSpeed = max(Double(fresh.bytesSent - previous.stats.bytesSent) / dt, 0)
            }
        }
        previousSample = (fresh, now)
        stats = fresh
    }
}
