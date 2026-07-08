"use client";

import Link from "next/link";
import { ArrowRight, Award, Flame, ListChecks } from "lucide-react";
import { useProgress } from "@/hooks/use-progress";
import { summariseAttempts } from "@/lib/progress";

/** Compact progress strip on the home page; hidden until there is history. */
export function HomeStats() {
  const { attempts, stats, mistakeIds } = useProgress();
  const summary = summariseAttempts(attempts, stats);

  if (summary.questionsAnswered === 0) return null;

  const tiles = [
    {
      icon: ListChecks,
      label: "Questions answered",
      value: String(summary.questionsAnswered),
    },
    {
      icon: Award,
      label: "Best mock score",
      value: summary.mockAttempts > 0 ? `${summary.bestScorePercent}%` : "—",
    },
    {
      icon: Flame,
      label: "Mock tests passed",
      value:
        summary.mockAttempts > 0
          ? `${summary.mockPasses}/${summary.mockAttempts}`
          : "—",
    },
  ];

  return (
    <section aria-label="Your progress" className="mt-10">
      <div className="grid grid-cols-3 gap-3">
        {tiles.map((tile) => (
          <div
            key={tile.label}
            className="rounded-xl border bg-card p-3 text-center sm:p-4"
          >
            <tile.icon
              className="mx-auto h-4 w-4 text-primary"
              aria-hidden
            />
            <p className="mt-1.5 text-lg font-extrabold tabular-nums sm:text-2xl">
              {tile.value}
            </p>
            <p className="text-xs text-muted-foreground">{tile.label}</p>
          </div>
        ))}
      </div>
      {mistakeIds.length > 0 && (
        <Link
          href="/mistakes"
          className="mt-3 flex items-center justify-between rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm font-medium transition-colors hover:bg-warning/15"
        >
          <span>
            {mistakeIds.length} {mistakeIds.length === 1 ? "question" : "questions"}{" "}
            waiting in your mistakes list
          </span>
          <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
        </Link>
      )}
    </section>
  );
}
