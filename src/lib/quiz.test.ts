import { describe, expect, it } from "vitest";
import {
  allocateByChapter,
  buildMockTest,
  buildPracticeSession,
  formatClock,
  isPass,
  isSelectionComplete,
  isSelectionCorrect,
  MOCK_QUESTION_COUNT,
  passThreshold,
  scorePercent,
  shuffle,
  toggleSelection,
  toSessionQuestion,
} from "@/lib/quiz";
import { QUESTIONS } from "@/lib/questions";
import type { ChapterId, Question } from "@/types";

/** Deterministic RNG (mulberry32) so shuffle-dependent tests are stable. */
function seededRng(seed: number): () => number {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const singleQuestion: Question = {
  id: "t1",
  chapter: "uk",
  type: "single",
  question: "?",
  options: ["a", "b", "c", "d"],
  answers: [2],
  explanation: "x",
};

const multiQuestion: Question = {
  id: "t2",
  chapter: "uk",
  type: "multi",
  question: "?",
  options: ["a", "b", "c", "d"],
  answers: [0, 3],
  explanation: "x",
};

describe("shuffle", () => {
  it("returns a permutation without mutating the input", () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8];
    const copy = [...input];
    const result = shuffle(input, seededRng(1));
    expect(input).toEqual(copy);
    expect([...result].sort((a, b) => a - b)).toEqual(copy);
  });

  it("is deterministic for a fixed seed", () => {
    expect(shuffle([1, 2, 3, 4, 5], seededRng(42))).toEqual(
      shuffle([1, 2, 3, 4, 5], seededRng(42))
    );
  });
});

describe("allocateByChapter", () => {
  it("allocates exactly the requested total, proportionally", () => {
    const counts = new Map<ChapterId, number>([
      ["values", 10],
      ["uk", 6],
      ["history", 60],
      ["society", 37],
      ["government", 37],
    ]);
    const allocation = allocateByChapter(counts, 24);
    const total = [...allocation.values()].reduce((a, b) => a + b, 0);
    expect(total).toBe(24);
    // The biggest chapter gets the most questions.
    expect(allocation.get("history")).toBeGreaterThanOrEqual(
      allocation.get("society") ?? 0
    );
    // Every chapter is represented in a 24-question test.
    for (const value of allocation.values()) {
      expect(value).toBeGreaterThanOrEqual(1);
    }
  });

  it("never allocates more than a chapter holds", () => {
    const counts = new Map<ChapterId, number>([
      ["values", 2],
      ["uk", 2],
    ]);
    const allocation = allocateByChapter(counts, 24);
    expect(allocation.get("values")).toBeLessThanOrEqual(2);
    expect(allocation.get("uk")).toBeLessThanOrEqual(2);
  });
});

describe("buildMockTest", () => {
  it("builds 24 unique questions from the real bank", () => {
    const session = buildMockTest(QUESTIONS, MOCK_QUESTION_COUNT, seededRng(7));
    expect(session).toHaveLength(24);
    const ids = new Set(session.map((sq) => sq.question.id));
    expect(ids.size).toBe(24);
    const chapters = new Set(session.map((sq) => sq.question.chapter));
    expect(chapters.size).toBe(5);
  });

  it("presents every option exactly once per question", () => {
    const session = buildMockTest(QUESTIONS, MOCK_QUESTION_COUNT, seededRng(9));
    for (const sq of session) {
      expect([...sq.order].sort((a, b) => a - b)).toEqual(
        sq.question.options.map((_, i) => i)
      );
    }
  });
});

describe("buildPracticeSession", () => {
  it("respects the requested length and keeps true/false order fixed", () => {
    const session = buildPracticeSession(QUESTIONS, 10, seededRng(3));
    expect(session).toHaveLength(10);
    const tf = buildPracticeSession(
      QUESTIONS.filter((q) => q.type === "truefalse"),
      undefined,
      seededRng(3)
    );
    for (const sq of tf) {
      expect(sq.order).toEqual([0, 1]);
    }
  });
});

describe("toSessionQuestion", () => {
  it("keeps a valid permutation of option indices", () => {
    const sq = toSessionQuestion(singleQuestion, seededRng(11));
    expect([...sq.order].sort((a, b) => a - b)).toEqual([0, 1, 2, 3]);
  });
});

describe("selection logic", () => {
  it("single-answer selection replaces previous pick and toggles off", () => {
    expect(toggleSelection(singleQuestion, [], 1)).toEqual([1]);
    expect(toggleSelection(singleQuestion, [1], 3)).toEqual([3]);
    expect(toggleSelection(singleQuestion, [3], 3)).toEqual([]);
  });

  it("multi selection caps at two picks, dropping the oldest", () => {
    expect(toggleSelection(multiQuestion, [], 0)).toEqual([0]);
    expect(toggleSelection(multiQuestion, [0], 1)).toEqual([0, 1]);
    expect(toggleSelection(multiQuestion, [0, 1], 2)).toEqual([1, 2]);
    expect(toggleSelection(multiQuestion, [0, 1], 1)).toEqual([0]);
  });

  it("scores by exact set match — partial credit is wrong", () => {
    expect(isSelectionCorrect(singleQuestion, [2])).toBe(true);
    expect(isSelectionCorrect(singleQuestion, [1])).toBe(false);
    expect(isSelectionCorrect(singleQuestion, [])).toBe(false);
    expect(isSelectionCorrect(multiQuestion, [0, 3])).toBe(true);
    expect(isSelectionCorrect(multiQuestion, [3, 0])).toBe(true);
    expect(isSelectionCorrect(multiQuestion, [0])).toBe(false);
    expect(isSelectionCorrect(multiQuestion, [0, 1])).toBe(false);
  });

  it("knows when a selection is complete", () => {
    expect(isSelectionComplete(singleQuestion, [])).toBe(false);
    expect(isSelectionComplete(singleQuestion, [0])).toBe(true);
    expect(isSelectionComplete(multiQuestion, [0])).toBe(false);
    expect(isSelectionComplete(multiQuestion, [0, 1])).toBe(true);
  });
});

describe("pass rules (official 75%)", () => {
  it("passes at 18/24 and fails at 17/24", () => {
    expect(isPass(18, 24)).toBe(true);
    expect(isPass(17, 24)).toBe(false);
    expect(passThreshold(24)).toBe(18);
  });

  it("computes rounded percentages", () => {
    expect(scorePercent(18, 24)).toBe(75);
    expect(scorePercent(0, 0)).toBe(0);
    expect(scorePercent(1, 3)).toBe(33);
  });
});

describe("formatClock", () => {
  it("formats minutes and seconds", () => {
    expect(formatClock(2700)).toBe("45:00");
    expect(formatClock(65)).toBe("1:05");
    expect(formatClock(0)).toBe("0:00");
    expect(formatClock(-10)).toBe("0:00");
  });
});
