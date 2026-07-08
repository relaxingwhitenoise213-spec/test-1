"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import { QuizRunner } from "@/components/quiz/quiz-runner";
import { chapterTitle, questionsForChapter } from "@/lib/questions";
import { buildPracticeSession } from "@/lib/quiz";
import { cn } from "@/lib/utils";
import type { ChapterId, SessionQuestion } from "@/types";

interface PracticeScreenProps {
  chapter: ChapterId;
}

export function PracticeScreen({ chapter }: PracticeScreenProps) {
  const pool = useMemo(() => questionsForChapter(chapter), [chapter]);
  const lengthChoices = useMemo(
    () =>
      [10, 25]
        .filter((n) => n < pool.length)
        .concat(pool.length)
        .map((n) => ({ value: n, label: n === pool.length ? `All ${n}` : String(n) })),
    [pool]
  );
  const [length, setLength] = useState<number>(
    lengthChoices[0]?.value ?? pool.length
  );
  const [session, setSession] = useState<SessionQuestion[] | null>(null);
  const [startedAt, setStartedAt] = useState(0);
  const [round, setRound] = useState(0);

  const start = () => {
    setSession(buildPracticeSession(pool, length));
    setStartedAt(Date.now());
    setRound((r) => r + 1);
    window.scrollTo({ top: 0 });
  };

  if (session) {
    return (
      <QuizRunner
        key={round}
        session={session}
        mode="practice"
        chapter={chapter}
        startedAt={startedAt}
        exitHref="/practice"
        onRestart={start}
      />
    );
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center px-4 py-10 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Practice
        </p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-balance">
          {chapterTitle(chapter)}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {pool.length} questions in this chapter. Answer at your own pace —
          you get the correct answer and an explanation after every question.
        </p>

        <div className="mt-8">
          <p className="text-sm font-semibold">How many questions?</p>
          <div
            className="mt-2 grid grid-cols-3 gap-2"
            role="radiogroup"
            aria-label="Number of questions"
          >
            {lengthChoices.map((choice) => (
              <button
                key={choice.value}
                type="button"
                role="radio"
                aria-checked={length === choice.value}
                onClick={() => setLength(choice.value)}
                className={cn(
                  "rounded-xl border-2 px-4 py-3 text-sm font-bold transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  length === choice.value
                    ? "border-primary bg-accent text-accent-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40"
                )}
              >
                {choice.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" className="flex-1" onClick={start} data-testid="start-practice">
            <BookOpen className="h-4 w-4" />
            Start practising
          </Button>
          <LinkButton href="/practice" variant="outline" size="lg" className="sm:w-40">
            Back
          </LinkButton>
        </div>
      </motion.div>
    </div>
  );
}
