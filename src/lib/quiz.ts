import type {
  ChapterId,
  Question,
  Selection,
  SessionQuestion,
} from "@/types";

/**
 * Pure quiz engine: building sessions, shuffling and scoring.
 * Everything takes an injectable random source so behaviour is testable.
 */

/** Official test format: 24 questions in 45 minutes, pass mark 75%. */
export const MOCK_QUESTION_COUNT = 24;
export const MOCK_DURATION_SECONDS = 45 * 60;
export const PASS_MARK = 0.75;

export type Rng = () => number;

/** Fisher–Yates shuffle; returns a new array. */
export function shuffle<T>(items: readonly T[], rng: Rng = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Allocate `total` seats across chapters proportionally to bank size using
 * the largest-remainder method, so a mock test mirrors the bank's chapter
 * spread no matter how the bank evolves.
 */
export function allocateByChapter(
  counts: ReadonlyMap<ChapterId, number>,
  total: number
): Map<ChapterId, number> {
  const bankSize = [...counts.values()].reduce((sum, n) => sum + n, 0);
  const allocation = new Map<ChapterId, number>();
  if (bankSize === 0 || total <= 0) return allocation;

  const remainders: { chapter: ChapterId; remainder: number }[] = [];
  let assigned = 0;
  for (const [chapter, count] of counts) {
    const exact = (count / bankSize) * total;
    // Never allocate more than a chapter can supply.
    const base = Math.min(Math.floor(exact), count);
    allocation.set(chapter, base);
    assigned += base;
    remainders.push({ chapter, remainder: exact - base });
  }

  remainders.sort((a, b) => b.remainder - a.remainder);
  let index = 0;
  while (assigned < total && remainders.length > 0) {
    const { chapter } = remainders[index % remainders.length];
    const current = allocation.get(chapter) ?? 0;
    if (current < (counts.get(chapter) ?? 0)) {
      allocation.set(chapter, current + 1);
      assigned++;
    }
    index++;
    // All chapters exhausted — bank smaller than the requested total.
    if (index > remainders.length * total) break;
  }
  return allocation;
}

/** Shuffle a question's options for presentation. True/false keeps its order. */
export function toSessionQuestion(
  question: Question,
  rng: Rng = Math.random
): SessionQuestion {
  const identity = question.options.map((_, i) => i);
  const order = question.type === "truefalse" ? identity : shuffle(identity, rng);
  return { question, order };
}

/** Build a mock test: stratified sample of the bank in random order. */
export function buildMockTest(
  questions: readonly Question[],
  total: number = MOCK_QUESTION_COUNT,
  rng: Rng = Math.random
): SessionQuestion[] {
  const byChapter = new Map<ChapterId, Question[]>();
  for (const q of questions) {
    const list = byChapter.get(q.chapter) ?? [];
    list.push(q);
    byChapter.set(q.chapter, list);
  }
  const counts = new Map<ChapterId, number>(
    [...byChapter.entries()].map(([chapter, list]) => [chapter, list.length])
  );
  const allocation = allocateByChapter(counts, total);

  const picked: Question[] = [];
  for (const [chapter, take] of allocation) {
    picked.push(...shuffle(byChapter.get(chapter) ?? [], rng).slice(0, take));
  }
  return shuffle(picked, rng).map((q) => toSessionQuestion(q, rng));
}

/** Build a practice session from a fixed pool (a chapter, or saved mistakes). */
export function buildPracticeSession(
  pool: readonly Question[],
  limit?: number,
  rng: Rng = Math.random
): SessionQuestion[] {
  const selected = shuffle(pool, rng).slice(0, limit ?? pool.length);
  return selected.map((q) => toSessionQuestion(q, rng));
}

/** A question is correct only if the selected set matches the answer set exactly. */
export function isSelectionCorrect(
  question: Question,
  selected: Selection
): boolean {
  if (selected.length !== question.answers.length) return false;
  const expected = new Set(question.answers);
  return selected.every((index) => expected.has(index));
}

/** True once the user has picked as many options as the question requires. */
export function isSelectionComplete(
  question: Question,
  selected: Selection
): boolean {
  return selected.length === question.answers.length;
}

/** Toggle an option within a selection, respecting the question type. */
export function toggleSelection(
  question: Question,
  selected: Selection,
  optionIndex: number
): Selection {
  if (question.answers.length === 1) {
    // Single-answer questions replace the selection.
    return selected.includes(optionIndex) ? [] : [optionIndex];
  }
  if (selected.includes(optionIndex)) {
    return selected.filter((i) => i !== optionIndex);
  }
  // Cap multi-select at the number of required answers (oldest pick drops).
  const next = [...selected, optionIndex];
  return next.length > question.answers.length ? next.slice(1) : next;
}

export function scorePercent(correct: number, total: number): number {
  return total === 0 ? 0 : Math.round((correct / total) * 100);
}

export function isPass(correct: number, total: number): boolean {
  return total > 0 && correct / total >= PASS_MARK;
}

/** Number of correct answers needed to pass a test of `total` questions. */
export function passThreshold(total: number): number {
  return Math.ceil(total * PASS_MARK);
}

/** Format seconds as a countdown clock, e.g. 45:00, 9:05. */
export function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}
