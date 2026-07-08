"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AlarmClock, Flag, ListChecks, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import { QuizRunner } from "@/components/quiz/quiz-runner";
import { QUESTIONS } from "@/lib/questions";
import {
  buildMockTest,
  MOCK_DURATION_SECONDS,
  MOCK_QUESTION_COUNT,
  passThreshold,
} from "@/lib/quiz";
import type { SessionQuestion } from "@/types";

const rules = [
  {
    icon: ListChecks,
    title: `${MOCK_QUESTION_COUNT} questions`,
    text: "Randomly drawn from all five handbook chapters, like the real test.",
  },
  {
    icon: AlarmClock,
    title: `${MOCK_DURATION_SECONDS / 60} minutes`,
    text: "The clock starts when you begin. The test submits itself at 0:00.",
  },
  {
    icon: Target,
    title: `${passThreshold(MOCK_QUESTION_COUNT)} of ${MOCK_QUESTION_COUNT} to pass (75%)`,
    text: "No feedback until the end — explanations come with your results.",
  },
  {
    icon: Flag,
    title: "Flag and review",
    text: "Skip freely, flag anything you are unsure of and review before submitting.",
  },
];

export function MockTestScreen() {
  const [session, setSession] = useState<SessionQuestion[] | null>(null);
  const [startedAt, setStartedAt] = useState(0);
  const [round, setRound] = useState(0);

  const start = () => {
    setSession(buildMockTest(QUESTIONS));
    setStartedAt(Date.now());
    setRound((r) => r + 1);
    window.scrollTo({ top: 0 });
  };

  if (session) {
    return (
      <QuizRunner
        key={round}
        session={session}
        mode="mock"
        startedAt={startedAt}
        timed
        exitHref="/"
        onRestart={start}
      />
    );
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center px-4 py-10 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Mock test
        </p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight">
          Ready for exam conditions?
        </h1>
        <p className="mt-2 text-muted-foreground">
          This simulation follows the official Life in the UK Test format.
        </p>

        <ul className="mt-8 space-y-3">
          {rules.map((rule) => (
            <li
              key={rule.title}
              className="flex items-start gap-4 rounded-xl border bg-card p-4"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <rule.icon className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="font-semibold">{rule.title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{rule.text}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" className="flex-1" onClick={start} data-testid="start-mock">
            Start mock test
          </Button>
          <LinkButton href="/" variant="outline" size="lg" className="sm:w-40">
            Not yet
          </LinkButton>
        </div>
      </motion.div>
    </div>
  );
}
