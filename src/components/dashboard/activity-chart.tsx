"use client";

import { useMemo } from "react";
import type { GenerationRecord } from "@/types";

interface ActivityChartProps {
  records: GenerationRecord[];
  days?: number;
}

/** Dependency-free SVG bar chart of generations per day. */
export function ActivityChart({ records, days = 14 }: ActivityChartProps) {
  const data = useMemo(() => {
    const buckets: { label: string; date: string; count: number }[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      buckets.push({
        label: d.toLocaleDateString(undefined, { weekday: "short" }),
        date: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        count: 0,
      });
    }
    const startMs = today.getTime() - (days - 1) * 86_400_000;
    for (const r of records) {
      if (r.createdAt < startMs) continue;
      const idx = Math.floor((r.createdAt - startMs) / 86_400_000);
      if (idx >= 0 && idx < buckets.length) buckets[idx].count += 1;
    }
    return buckets;
  }, [records, days]);

  const max = Math.max(1, ...data.map((d) => d.count));

  return (
    <div>
      <div className="flex h-40 items-end gap-1.5" role="img" aria-label="Generations over the last two weeks">
        {data.map((d, i) => (
          <div key={i} className="group flex flex-1 flex-col items-center justify-end gap-1">
            <span className="text-[10px] font-medium tabular-nums text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
              {d.count}
            </span>
            <div
              className="w-full rounded-t bg-primary/80 transition-all hover:bg-primary"
              style={{ height: `${(d.count / max) * 100}%`, minHeight: d.count > 0 ? 4 : 2 }}
              title={`${d.date}: ${d.count} generation${d.count === 1 ? "" : "s"}`}
            />
            <span className="text-[10px] text-muted-foreground">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
