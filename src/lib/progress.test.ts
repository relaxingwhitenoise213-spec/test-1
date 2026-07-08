import { describe, expect, it } from "vitest";
import {
  applyAnswer,
  applyMistake,
  chapterAccuracy,
  summariseAttempts,
} from "@/lib/progress";
import type { AttemptRecord, ChapterId } from "@/types";

describe("applyAnswer", () => {
  it("accumulates seen/correct/wrong per question", () => {
    let stats = applyAnswer({}, "q1", true);
    stats = applyAnswer(stats, "q1", false);
    stats = applyAnswer(stats, "q2", false);
    expect(stats.q1).toEqual({ seen: 2, correct: 1, wrong: 1 });
    expect(stats.q2).toEqual({ seen: 1, correct: 0, wrong: 1 });
  });
});

describe("applyMistake", () => {
  it("adds on wrong, removes on correct, avoids duplicates", () => {
    let mistakes = applyMistake([], "q1", false);
    mistakes = applyMistake(mistakes, "q1", false);
    expect(mistakes).toEqual(["q1"]);
    mistakes = applyMistake(mistakes, "q2", false);
    expect(mistakes).toEqual(["q1", "q2"]);
    mistakes = applyMistake(mistakes, "q1", true);
    expect(mistakes).toEqual(["q2"]);
  });
});

describe("chapterAccuracy", () => {
  it("aggregates per chapter and reports untouched chapters as zero", () => {
    const chapterOf = new Map<string, ChapterId>([
      ["q1", "history"],
      ["q2", "history"],
      ["q3", "uk"],
    ]);
    const stats = {
      q1: { seen: 2, correct: 2, wrong: 0 },
      q2: { seen: 2, correct: 0, wrong: 2 },
      q3: { seen: 1, correct: 1, wrong: 0 },
    };
    const rows = chapterAccuracy(stats, chapterOf, ["history", "uk", "values"]);
    expect(rows).toEqual([
      { chapter: "history", answered: 4, correct: 2, percent: 50 },
      { chapter: "uk", answered: 1, correct: 1, percent: 100 },
      { chapter: "values", answered: 0, correct: 0, percent: 0 },
    ]);
  });
});

describe("summariseAttempts", () => {
  const attempt = (over: Partial<AttemptRecord>): AttemptRecord => ({
    id: "a",
    mode: "mock",
    total: 24,
    correct: 18,
    passed: true,
    startedAt: 0,
    finishedAt: 1,
    wrongIds: [],
    ...over,
  });

  it("summarises mock attempts only, ignoring practice for scores", () => {
    const summary = summariseAttempts(
      [
        attempt({ id: "1", correct: 18 }),
        attempt({ id: "2", correct: 12, passed: false }),
        attempt({ id: "3", mode: "practice", correct: 5, total: 10, passed: false }),
      ],
      { q1: { seen: 3, correct: 2, wrong: 1 } }
    );
    expect(summary.mockAttempts).toBe(2);
    expect(summary.mockPasses).toBe(1);
    expect(summary.bestScorePercent).toBe(75);
    expect(summary.averageScorePercent).toBe(63); // (75 + 50) / 2 = 62.5 → 63
    expect(summary.questionsAnswered).toBe(3);
  });

  it("handles the empty state", () => {
    const summary = summariseAttempts([], {});
    expect(summary).toEqual({
      mockAttempts: 0,
      mockPasses: 0,
      bestScorePercent: 0,
      averageScorePercent: 0,
      questionsAnswered: 0,
    });
  });
});
