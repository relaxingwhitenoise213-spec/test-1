import { describe, expect, it } from "vitest";
import {
  BANK_META,
  CHAPTER_IDS,
  CHAPTERS,
  getQuestion,
  getQuestions,
  isChapterId,
  QUESTIONS,
  questionsForChapter,
} from "@/lib/questions";

/**
 * The question bank is the product. These tests pin its integrity so a bad
 * edit (broken index, duplicate, missing explanation) can never ship.
 * Structural rules are also enforced by the zod schema at import time.
 */

describe("question bank", () => {
  it("contains exactly 150 questions", () => {
    expect(QUESTIONS).toHaveLength(150);
  });

  it("covers all five official chapters, each with enough questions for a session", () => {
    for (const chapter of CHAPTER_IDS) {
      expect(questionsForChapter(chapter).length).toBeGreaterThanOrEqual(6);
    }
    const sum = CHAPTER_IDS.reduce(
      (total, chapter) => total + questionsForChapter(chapter).length,
      0
    );
    expect(sum).toBe(QUESTIONS.length);
  });

  it("has unique ids and unique question texts", () => {
    expect(new Set(QUESTIONS.map((q) => q.id)).size).toBe(QUESTIONS.length);
    expect(new Set(QUESTIONS.map((q) => q.question)).size).toBe(
      QUESTIONS.length
    );
  });

  it("keeps every answer index within its options and free of duplicate options", () => {
    for (const q of QUESTIONS) {
      for (const answer of q.answers) {
        expect(answer, q.id).toBeGreaterThanOrEqual(0);
        expect(answer, q.id).toBeLessThan(q.options.length);
      }
      expect(new Set(q.options).size, q.id).toBe(q.options.length);
      expect(q.explanation.length, q.id).toBeGreaterThan(20);
    }
  });

  it("matches answer counts to question types", () => {
    for (const q of QUESTIONS) {
      if (q.type === "multi") {
        expect(q.answers, q.id).toHaveLength(2);
        expect(q.options, q.id).toHaveLength(4);
      } else {
        expect(q.answers, q.id).toHaveLength(1);
      }
      if (q.type === "truefalse") {
        expect(q.options, q.id).toEqual(["True", "False"]);
      }
    }
  });

  it("declares the official test format", () => {
    expect(BANK_META.testFormat).toEqual({
      questions: 24,
      minutes: 45,
      passMark: 0.75,
    });
    expect(CHAPTERS).toHaveLength(5);
  });

  it("looks up questions by id", () => {
    const first = QUESTIONS[0];
    expect(getQuestion(first.id)).toBe(first);
    expect(getQuestion("nope")).toBeUndefined();
    expect(getQuestions([first.id, "nope"])).toEqual([first]);
  });

  it("validates chapter ids", () => {
    expect(isChapterId("history")).toBe(true);
    expect(isChapterId("physics")).toBe(false);
  });
});
