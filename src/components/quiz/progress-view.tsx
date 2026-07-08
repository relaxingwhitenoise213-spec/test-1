"use client";

import { useMemo, useState } from "react";
import { Award, BarChart3, ListChecks, Target, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { LinkButton } from "@/components/ui/link-button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useProgress } from "@/hooks/use-progress";
import { chapterAccuracy, summariseAttempts } from "@/lib/progress";
import { CHAPTER_IDS, chapterTitle, QUESTIONS } from "@/lib/questions";
import { scorePercent } from "@/lib/quiz";
import { cn, formatRelativeTime } from "@/lib/utils";

const modeLabels = {
  mock: "Mock test",
  practice: "Practice",
  mistakes: "Mistakes review",
} as const;

export function ProgressView() {
  const { attempts, stats, resetAll } = useProgress();
  const [confirmReset, setConfirmReset] = useState(false);

  const summary = useMemo(
    () => summariseAttempts(attempts, stats),
    [attempts, stats]
  );
  const chapters = useMemo(() => {
    const chapterOf = new Map(QUESTIONS.map((q) => [q.id, q.chapter]));
    return chapterAccuracy(stats, chapterOf, CHAPTER_IDS);
  }, [stats]);

  if (summary.questionsAnswered === 0) {
    return (
      <div className="flex flex-col items-center gap-5 rounded-xl border border-dashed px-6 py-16 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
          <BarChart3 className="h-8 w-8" aria-hidden />
        </span>
        <div>
          <h2 className="text-xl font-bold tracking-tight">No progress yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            Your scores, per-chapter accuracy and test history will appear here
            once you answer your first questions.
          </p>
        </div>
        <LinkButton href="/mock-test" size="lg">
          Take your first mock test
        </LinkButton>
      </div>
    );
  }

  const tiles = [
    {
      icon: ListChecks,
      label: "Questions answered",
      value: String(summary.questionsAnswered),
    },
    {
      icon: Target,
      label: "Mock tests taken",
      value: String(summary.mockAttempts),
    },
    {
      icon: Award,
      label: "Best mock score",
      value: summary.mockAttempts ? `${summary.bestScorePercent}%` : "—",
    },
    {
      icon: BarChart3,
      label: "Average mock score",
      value: summary.mockAttempts ? `${summary.averageScorePercent}%` : "—",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Overview tiles */}
      <section aria-label="Overview" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {tiles.map((tile) => (
          <div key={tile.label} className="rounded-xl border bg-card p-4 shadow-sm">
            <tile.icon className="h-4 w-4 text-primary" aria-hidden />
            <p className="mt-2 text-2xl font-extrabold tabular-nums">{tile.value}</p>
            <p className="text-xs text-muted-foreground">{tile.label}</p>
          </div>
        ))}
      </section>

      {/* Chapter accuracy */}
      <section aria-label="Accuracy by chapter">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Accuracy by chapter
        </h2>
        <div className="mt-4 space-y-4 rounded-xl border bg-card p-5">
          {chapters.map((entry) => (
            <div key={entry.chapter}>
              <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
                <span className="font-medium">{chapterTitle(entry.chapter)}</span>
                <span className="tabular-nums text-muted-foreground">
                  {entry.answered > 0
                    ? `${entry.percent}% · ${entry.answered} answered`
                    : "Not started"}
                </span>
              </div>
              <ProgressBar
                value={entry.answered > 0 ? entry.percent : 0}
                tone={entry.percent >= 75 && entry.answered > 0 ? "success" : "primary"}
                label={`${chapterTitle(entry.chapter)} accuracy`}
              />
            </div>
          ))}
          <p className="pt-1 text-xs text-muted-foreground">
            Aim for a steady 75%+ in every chapter before booking the real test.
          </p>
        </div>
      </section>

      {/* History */}
      <section aria-label="Session history">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Recent sessions
        </h2>
        <ul className="mt-4 space-y-2.5">
          {attempts.slice(0, 20).map((attempt) => {
            const percent = scorePercent(attempt.correct, attempt.total);
            return (
              <li
                key={attempt.id}
                className="flex items-center gap-4 rounded-xl border bg-card p-4"
              >
                <span
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-sm font-extrabold tabular-nums",
                    attempt.mode === "mock"
                      ? attempt.passed
                        ? "bg-success/15 text-success"
                        : "bg-destructive/15 text-destructive"
                      : "bg-accent text-accent-foreground"
                  )}
                >
                  {percent}%
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {modeLabels[attempt.mode]}
                    {attempt.chapter ? ` · ${chapterTitle(attempt.chapter)}` : ""}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {attempt.correct} of {attempt.total} correct ·{" "}
                    {formatRelativeTime(attempt.finishedAt)}
                  </p>
                </div>
                {attempt.mode === "mock" && (
                  <Badge variant={attempt.passed ? "success" : "warning"}>
                    {attempt.passed ? "Pass" : "Fail"}
                  </Badge>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {/* Danger zone */}
      <section aria-label="Data">
        <Button
          variant="outline"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => setConfirmReset(true)}
        >
          <Trash2 className="h-4 w-4" />
          Reset all progress
        </Button>
        <p className="mt-2 text-xs text-muted-foreground">
          Progress is stored only in this browser. Nothing is sent to a server.
        </p>
      </section>

      <Dialog
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        title="Reset all progress?"
      >
        <p className="mt-2 text-sm text-muted-foreground">
          This permanently deletes your test history, per-question stats and
          mistakes list from this browser.
        </p>
        <div className="mt-5 flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setConfirmReset(false)}
          >
            Keep my data
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            onClick={() => {
              resetAll();
              setConfirmReset(false);
            }}
          >
            Reset everything
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
