"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { applyAnswer, applyMistake, STORAGE_KEYS } from "@/lib/progress";
import type {
  AnsweredQuestion,
  AttemptRecord,
  QuestionStats,
} from "@/types";

interface ProgressContextValue {
  attempts: AttemptRecord[];
  stats: QuestionStats;
  mistakeIds: string[];
  /** Persist a finished session and fold its answers into the stats. */
  recordAttempt: (
    attempt: AttemptRecord,
    answers: readonly AnsweredQuestion[]
  ) => void;
  resetAll: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [attempts, setAttempts] = useLocalStorage<AttemptRecord[]>(
    STORAGE_KEYS.attempts,
    []
  );
  const [stats, setStats] = useLocalStorage<QuestionStats>(
    STORAGE_KEYS.stats,
    {}
  );
  const [mistakeIds, setMistakeIds] = useLocalStorage<string[]>(
    STORAGE_KEYS.mistakes,
    []
  );

  const recordAttempt = useCallback(
    (attempt: AttemptRecord, answers: readonly AnsweredQuestion[]) => {
      setAttempts((prev) => [attempt, ...prev].slice(0, 100));
      setStats((prev) => {
        let next = prev;
        for (const answer of answers) {
          next = applyAnswer(next, answer.questionId, answer.correct);
        }
        return next;
      });
      setMistakeIds((prev) => {
        let next: string[] = [...prev];
        for (const answer of answers) {
          next = applyMistake(next, answer.questionId, answer.correct);
        }
        return next;
      });
    },
    [setAttempts, setStats, setMistakeIds]
  );

  const resetAll = useCallback(() => {
    setAttempts([]);
    setStats({});
    setMistakeIds([]);
  }, [setAttempts, setStats, setMistakeIds]);

  const value = useMemo(
    () => ({ attempts, stats, mistakeIds, recordAttempt, resetAll }),
    [attempts, stats, mistakeIds, recordAttempt, resetAll]
  );

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress(): ProgressContextValue {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
}
