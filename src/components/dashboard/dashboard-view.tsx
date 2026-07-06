"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  AudioLines,
  Type,
  FileAudio,
  Gauge,
  Clock,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/dashboard/stat-card";
import { ActivityChart } from "@/components/dashboard/activity-chart";
import { useHistory } from "@/hooks/use-history";
import { PROVIDERS } from "@/config/providers";
import { formatDuration, formatRelativeTime } from "@/lib/utils";

/** Illustrative monthly character allowance for the Free plan. */
const FREE_QUOTA = 100_000;

export function DashboardView() {
  const { records } = useHistory();

  const stats = useMemo(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const chars = records.reduce((sum, r) => sum + r.characters, 0);
    const monthChars = records
      .filter((r) => r.createdAt >= monthStart)
      .reduce((sum, r) => sum + r.characters, 0);
    const duration = records.reduce((sum, r) => sum + r.durationSeconds, 0);
    const downloadable = records.filter((r) => PROVIDERS[r.provider].downloadable).length;

    const voiceCounts = new Map<string, number>();
    for (const r of records) voiceCounts.set(r.voiceName, (voiceCounts.get(r.voiceName) ?? 0) + 1);
    const topVoice = [...voiceCounts.entries()].sort((a, b) => b[1] - a[1])[0];

    return {
      total: records.length,
      chars,
      monthChars,
      duration,
      downloadable,
      remaining: Math.max(0, FREE_QUOTA - monthChars),
      quotaPct: Math.min(100, Math.round((monthChars / FREE_QUOTA) * 100)),
      topVoice: topVoice?.[0] ?? "—",
    };
  }, [records]);

  const recent = records.slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={AudioLines} label="Total generations" value={stats.total.toLocaleString()} />
        <StatCard
          icon={Type}
          label="Characters used"
          value={stats.chars.toLocaleString()}
          sublabel={`${stats.monthChars.toLocaleString()} this month`}
        />
        <StatCard icon={FileAudio} label="Exportable files" value={stats.downloadable.toLocaleString()} />
        <StatCard
          icon={Clock}
          label="Audio produced"
          value={formatDuration(stats.duration)}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <CardTitle>Activity (last 14 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityChart records={records} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5 text-primary" /> Monthly quota
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold tabular-nums">
                {stats.remaining.toLocaleString()}
              </span>
              <Badge variant={stats.quotaPct > 90 ? "warning" : "secondary"}>
                {stats.quotaPct}% used
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              characters remaining on the Free plan
            </p>
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${stats.quotaPct}%` }}
              />
            </div>
            <div className="flex items-center justify-between pt-1 text-sm">
              <span className="text-muted-foreground">Top voice</span>
              <span className="font-medium">{stats.topVoice}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Recent activity</CardTitle>
          <Link
            href="/history"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <Sparkles className="h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                No generations yet. Head to the Studio to create your first one.
              </p>
              <Link
                href="/"
                className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Open Studio
              </Link>
            </div>
          ) : (
            <ul className="divide-y">
              {recent.map((r) => (
                <li key={r.id} className="flex items-center gap-3 py-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                    <AudioLines className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{r.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.voiceName} · {PROVIDERS[r.provider].label} · {formatRelativeTime(r.createdAt)}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                    {r.characters.toLocaleString()} chars
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
