"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, ChevronDown, RotateCcw, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { ScoreRing } from "@/components/quiz/score-ring";
import { chapterTitle } from "@/lib/questions";
import { formatClock, passThreshold, scorePercent } from "@/lib/quiz";
import { cn } from "@/lib/utils";
import type {
  AnsweredQuestion,
  AttemptRecord,
  ChapterId,
  QuizMode,
  SessionQuestion,
} from "@/types";

interface ResultsViewProps {
  mode: QuizMode;
  session: SessionQuestion[];
  attempt: AttemptRecord;
  answers: AnsweredQuestion[];
  exitHref: string;
  onRestart?: () => void;
}

export function ResultsView({
  mode,
  session,
  attempt,
  answers,
  exitHref,
  onRestart,
}: ResultsViewProps) {
  const [filter, setFilter] = useState<"all" | "wrong">("all");

  const questionById = useMemo(
    () => new Map(session.map((sq) => [sq.question.id, sq.question])),
    [session]
  );
  const percent = scorePercent(attempt.correct, attempt.total);
  const passed = attempt.passed;
  const wrongCount = attempt.total - attempt.correct;
  const durationSeconds = Math.round(
    (attempt.finishedAt - attempt.startedAt) / 1000
  );

  const byChapter = useMemo(() => {
    const map = new Map<ChapterId, { total: number; correct: number }>();
    for (const answer of answers) {
      const entry = map.get(answer.chapter) ?? { total: 0, correct: 0 };
      entry.total += 1;
      entry.correct += answer.correct ? 1 : 0;
      map.set(answer.chapter, entry);
    }
    return [...map.entries()];
  }, [answers]);

  const visibleAnswers =
    filter === "all" ? answers : answers.filter((a) => !a.correct);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
      {/* Verdict */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center text-center"
        data-testid="results"
      >
        <ScoreRing
          percent={percent}
          tone={mode === "mock" ? (passed ? "success" : "destructive") : "primary"}
        >
          <span className="text-4xl font-extrabold tabular-nums tracking-tight">
            {percent}%
          </span>
          <span className="text-sm text-muted-foreground">
            {attempt.correct} of {attempt.total}
          </span>
        </ScoreRing>

        {mode === "mock" ? (
          <>
            <h1
              className={cn(
                "mt-6 text-3xl font-extrabold tracking-tight",
                passed ? "text-success" : "text-destructive"
              )}
            >
              {passed ? "Pass" : "Fail"}
            </h1>
            <p className="mt-2 max-w-md text-muted-foreground">
              {passed
                ? "Great work — this score would pass the official test. Keep practising until you pass consistently."
                : `You need ${passThreshold(attempt.total)} of ${attempt.total} (75%) to pass. Review your mistakes below and try again.`}
            </p>
          </>
        ) : (
          <>
            <h1 className="mt-6 text-3xl font-extrabold tracking-tight">
              Session complete
            </h1>
            <p className="mt-2 max-w-md text-muted-foreground">
              {wrongCount === 0
                ? "Perfect — every answer correct."
                : `${wrongCount} ${wrongCount === 1 ? "question" : "questions"} to review. Wrong answers are added to your Mistakes list.`}
            </p>
          </>
        )}

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <Badge variant="success">
            <Check className="h-3 w-3" /> {attempt.correct} correct
          </Badge>
          {wrongCount > 0 && (
            <Badge variant="warning">
              <X className="h-3 w-3" /> {wrongCount} wrong
            </Badge>
          )}
          <Badge variant="outline">Time: {formatClock(durationSeconds)}</Badge>
        </div>
      </motion.section>

      {/* Chapter breakdown */}
      {byChapter.length > 1 && (
        <section className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            By chapter
          </h2>
          <div className="mt-3 space-y-3">
            {byChapter.map(([chapter, stats]) => (
              <div key={chapter}>
                <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
                  <span className="font-medium">{chapterTitle(chapter)}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {stats.correct}/{stats.total}
                  </span>
                </div>
                <ProgressBar
                  value={scorePercent(stats.correct, stats.total)}
                  tone={stats.correct === stats.total ? "success" : "primary"}
                  label={`${chapterTitle(chapter)} score`}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Answer review */}
      <section className="mt-10">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Answers
          </h2>
          <div className="flex rounded-lg border p-0.5" role="tablist" aria-label="Filter answers">
            {(
              [
                ["all", `All (${answers.length})`],
                ["wrong", `Incorrect (${wrongCount})`],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={filter === value}
                onClick={() => setFilter(value)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                  filter === value
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 space-y-2.5">
          {visibleAnswers.length === 0 && (
            <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
              Nothing to show — no incorrect answers. 🎉
            </p>
          )}
          {visibleAnswers.map((answer) => {
            const question = questionById.get(answer.questionId);
            if (!question) return null;
            const yourAnswer =
              answer.selected.length > 0
                ? answer.selected.map((i) => question.options[i]).join(" · ")
                : "Not answered";
            const correctAnswer = question.answers
              .map((i) => question.options[i])
              .join(" · ");
            return (
              <details
                key={answer.questionId}
                className="group rounded-xl border bg-card open:shadow-sm"
              >
                <summary className="flex cursor-pointer list-none items-center gap-3 p-4 [&::-webkit-details-marker]:hidden">
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                      answer.correct
                        ? "bg-success/15 text-success"
                        : "bg-destructive/15 text-destructive"
                    )}
                    aria-hidden
                  >
                    {answer.correct ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                  </span>
                  <span className="flex-1 text-sm font-medium leading-snug">
                    {question.question}
                  </span>
                  <ChevronDown
                    className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                    aria-hidden
                  />
                </summary>
                <div className="border-t px-4 py-3 text-sm">
                  {!answer.correct && (
                    <p>
                      <span className="font-semibold text-destructive">
                        Your answer:{" "}
                      </span>
                      {yourAnswer}
                    </p>
                  )}
                  <p className={cn(!answer.correct && "mt-1")}>
                    <span className="font-semibold text-success">
                      Correct answer:{" "}
                    </span>
                    {correctAnswer}
                  </p>
                  <p className="mt-2 leading-relaxed text-muted-foreground">
                    {question.explanation}
                  </p>
                  <Badge variant="secondary" className="mt-3">
                    {chapterTitle(question.chapter)}
                  </Badge>
                </div>
              </details>
            );
          })}
        </div>
      </section>

      {/* Actions */}
      <section className="mt-10 flex flex-col gap-3 sm:flex-row">
        {onRestart && (
          <Button size="lg" className="flex-1" onClick={onRestart} data-testid="restart">
            <RotateCcw className="h-4 w-4" />
            {mode === "mock" ? "Take another test" : "Practise again"}
          </Button>
        )}
        {wrongCount > 0 && mode !== "mistakes" && (
          <LinkButton href="/mistakes" variant="secondary" size="lg" className="flex-1">
            Review mistakes
          </LinkButton>
        )}
        <LinkButton href={exitHref} variant="outline" size="lg" className="flex-1">
          Done
        </LinkButton>
      </section>
    </div>
  );
}
