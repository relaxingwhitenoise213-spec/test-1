/** Shared domain types for the Life in the UK Test app. */

export type ChapterId =
  | "values"
  | "uk"
  | "history"
  | "society"
  | "government";

export type QuestionType = "single" | "multi" | "truefalse";

export interface Question {
  id: string;
  chapter: ChapterId;
  type: QuestionType;
  question: string;
  options: string[];
  /** Indices into `options` of the correct answer(s). */
  answers: number[];
  explanation: string;
}

export interface ChapterInfo {
  id: ChapterId;
  title: string;
}

/** A question prepared for a session: options presented in shuffled order. */
export interface SessionQuestion {
  question: Question;
  /** Presentation order: order[i] is the index into question.options shown at position i. */
  order: number[];
}

export type QuizMode = "mock" | "practice" | "mistakes";

/** The user's selection for one question, as indices into question.options. */
export type Selection = number[];

export interface AnsweredQuestion {
  questionId: string;
  chapter: ChapterId;
  selected: Selection;
  correct: boolean;
}

/** A finished quiz session, persisted to localStorage. */
export interface AttemptRecord {
  id: string;
  mode: QuizMode;
  /** Set for practice sessions restricted to one chapter. */
  chapter?: ChapterId;
  total: number;
  correct: number;
  /** Only meaningful for mock tests (pass mark 75%). */
  passed: boolean;
  startedAt: number;
  finishedAt: number;
  /** Ids of the questions answered incorrectly (or left unanswered). */
  wrongIds: string[];
}

/** Lifetime per-question tally, persisted to localStorage. */
export interface QuestionStat {
  seen: number;
  correct: number;
  wrong: number;
}

export type QuestionStats = Record<string, QuestionStat>;
