import type {
  AttemptRecord,
  ChapterId,
  QuestionStat,
  QuestionStats,
} from "@/types";
import { scorePercent } from "@/lib/quiz";

/** Pure helpers for aggregating locally stored progress. */

export const STORAGE_KEYS = {
  attempts: "liuk:attempts",
  stats: "liuk:question-stats",
  mistakes: "liuk:mistakes",
} as const;

export function emptyStat(): QuestionStat {
  return { seen: 0, correct: 0, wrong: 0 };
}

/** Record one answered question into the lifetime stats map. */
export function applyAnswer(
  stats: QuestionStats,
  questionId: string,
  correct: boolean
): QuestionStats {
  const current = stats[questionId] ?? emptyStat();
  return {
    ...stats,
    [questionId]: {
      seen: current.seen + 1,
      correct: current.correct + (correct ? 1 : 0),
      wrong: current.wrong + (correct ? 0 : 1),
    },
  };
}

/**
 * Maintain the review list: a wrong answer adds the question, a later
 * correct answer clears it.
 */
export function applyMistake(
  mistakes: readonly string[],
  questionId: string,
  correct: boolean
): string[] {
  if (correct) return mistakes.filter((id) => id !== questionId);
  return mistakes.includes(questionId) ? [...mistakes] : [...mistakes, questionId];
}

export interface ChapterAccuracy {
  chapter: ChapterId;
  answered: number;
  correct: number;
  percent: number;
}

export function chapterAccuracy(
  stats: QuestionStats,
  questionChapters: ReadonlyMap<string, ChapterId>,
  chapters: readonly ChapterId[]
): ChapterAccuracy[] {
  const totals = new Map<ChapterId, { answered: number; correct: number }>(
    chapters.map((c) => [c, { answered: 0, correct: 0 }])
  );
  for (const [questionId, stat] of Object.entries(stats)) {
    const chapter = questionChapters.get(questionId);
    if (!chapter) continue;
    const entry = totals.get(chapter);
    if (!entry) continue;
    entry.answered += stat.seen;
    entry.correct += stat.correct;
  }
  return chapters.map((chapter) => {
    const { answered, correct } = totals.get(chapter) ?? {
      answered: 0,
      correct: 0,
    };
    return { chapter, answered, correct, percent: scorePercent(correct, answered) };
  });
}

export interface OverallProgress {
  mockAttempts: number;
  mockPasses: number;
  bestScorePercent: number;
  averageScorePercent: number;
  questionsAnswered: number;
}

export function summariseAttempts(
  attempts: readonly AttemptRecord[],
  stats: QuestionStats
): OverallProgress {
  const mocks = attempts.filter((a) => a.mode === "mock");
  const percents = mocks.map((a) => scorePercent(a.correct, a.total));
  const questionsAnswered = Object.values(stats).reduce(
    (sum, s) => sum + s.seen,
    0
  );
  return {
    mockAttempts: mocks.length,
    mockPasses: mocks.filter((a) => a.passed).length,
    bestScorePercent: percents.length ? Math.max(...percents) : 0,
    averageScorePercent: percents.length
      ? Math.round(percents.reduce((sum, p) => sum + p, 0) / percents.length)
      : 0,
    questionsAnswered,
  };
}
