"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import { QuizRunner } from "@/components/quiz/quiz-runner";
import { useProgress } from "@/hooks/use-progress";
import { getQuestions } from "@/lib/questions";
import { buildPracticeSession } from "@/lib/quiz";
import type { SessionQuestion } from "@/types";

/**
 * Re-drills every question currently on the mistakes list. Answering one
 * correctly removes it from the list (handled by the progress store).
 */
export function MistakesReviewScreen() {
  const { mistakeIds } = useProgress();
  const [session, setSession] = useState<SessionQuestion[] | null>(null);
  const [startedAt, setStartedAt] = useState(0);
  const [round, setRound] = useState(0);

  const start = () => {
    setSession(buildPracticeSession(getQuestions(mistakeIds)));
    setStartedAt(Date.now());
    setRound((r) => r + 1);
    window.scrollTo({ top: 0 });
  };

  if (session) {
    return (
      <QuizRunner
        key={round}
        session={session}
        mode="mistakes"
        startedAt={startedAt}
        exitHref="/mistakes"
        onRestart={mistakeIds.length > 0 ? start : undefined}
      />
    );
  }

  if (mistakeIds.length === 0) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-5 px-4 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-success/10 text-success">
          <CheckCircle2 className="h-8 w-8" aria-hidden />
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">No mistakes to review</h1>
          <p className="mt-2 text-muted-foreground">
            Wrong answers from tests and practice sessions land here so you can
            drill them until they stick.
          </p>
        </div>
        <LinkButton href="/mock-test" size="lg">
          Take a mock test
        </LinkButton>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center px-4 py-10 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-primary">
        Mistakes
      </p>
      <h1 className="mt-1 text-3xl font-extrabold tracking-tight">
        Turn {mistakeIds.length === 1 ? "this mistake" : `${mistakeIds.length} mistakes`}{" "}
        into strengths
      </h1>
      <p className="mt-2 text-muted-foreground">
        Answer a question correctly and it leaves the list. Get them all right
        and you are done.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button size="lg" className="flex-1" onClick={start} data-testid="start-mistakes">
          Start review ({mistakeIds.length})
        </Button>
        <LinkButton href="/mistakes" variant="outline" size="lg" className="sm:w-40">
          Back
        </LinkButton>
      </div>
    </div>
  );
}
