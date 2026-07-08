import { z } from "zod";
import bank from "@/data/questions.json";
import type { ChapterId, ChapterInfo, Question } from "@/types";

/**
 * The question bank lives in `src/data/questions.json` so it can be reused
 * outside this app (e.g. in a native build). It is validated once at module
 * load so a malformed edit fails loudly in dev, test and build.
 */

const chapterIdSchema = z.enum([
  "values",
  "uk",
  "history",
  "society",
  "government",
]);

const questionSchema = z
  .object({
    id: z.string().min(1),
    chapter: chapterIdSchema,
    type: z.enum(["single", "multi", "truefalse"]),
    question: z.string().min(1),
    options: z.array(z.string().min(1)).min(2).max(4),
    answers: z.array(z.number().int().nonnegative()).min(1).max(2),
    explanation: z.string().min(1),
  })
  .superRefine((q, ctx) => {
    const fail = (message: string) => ctx.addIssue({ code: "custom", message });
    if (q.answers.some((a) => a >= q.options.length)) {
      fail(`${q.id}: answer index out of range`);
    }
    if (new Set(q.answers).size !== q.answers.length) {
      fail(`${q.id}: duplicate answer indices`);
    }
    if (q.type === "truefalse" && q.options.length !== 2) {
      fail(`${q.id}: true/false questions need exactly 2 options`);
    }
    if (q.type === "multi" && (q.options.length !== 4 || q.answers.length !== 2)) {
      fail(`${q.id}: multi questions need 4 options and exactly 2 answers`);
    }
    if (q.type !== "multi" && q.answers.length !== 1) {
      fail(`${q.id}: expected exactly 1 correct answer`);
    }
  });

const bankSchema = z.object({
  meta: z.object({
    name: z.string(),
    version: z.string(),
    source: z.string(),
    testFormat: z.object({
      questions: z.number().int().positive(),
      minutes: z.number().int().positive(),
      passMark: z.number().gt(0).lte(1),
    }),
    chapters: z
      .array(z.object({ id: chapterIdSchema, title: z.string().min(1) }))
      .length(5),
  }),
  questions: z.array(questionSchema).min(1),
});

const parsed = bankSchema.parse(bank);

export const BANK_META = parsed.meta;
export const QUESTIONS: Question[] = parsed.questions;
export const CHAPTERS: ChapterInfo[] = parsed.meta.chapters;

export const CHAPTER_IDS = CHAPTERS.map((c) => c.id);

const questionById = new Map(QUESTIONS.map((q) => [q.id, q]));

export function getQuestion(id: string): Question | undefined {
  return questionById.get(id);
}

export function getQuestions(ids: readonly string[]): Question[] {
  return ids
    .map((id) => questionById.get(id))
    .filter((q): q is Question => q !== undefined);
}

export function questionsForChapter(chapter: ChapterId): Question[] {
  return QUESTIONS.filter((q) => q.chapter === chapter);
}

export function chapterTitle(chapter: ChapterId): string {
  return CHAPTERS.find((c) => c.id === chapter)?.title ?? chapter;
}

export function isChapterId(value: string): value is ChapterId {
  return CHAPTER_IDS.includes(value as ChapterId);
}
