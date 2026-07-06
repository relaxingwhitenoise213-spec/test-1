/**
 * Pure text-analysis helpers used by the editor and stats bar.
 * Kept framework-free so they can be unit-tested in isolation.
 */

export interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  /** Estimated spoken duration in seconds. */
  estimatedSeconds: number;
}

/** Average speaking rate used for duration estimates (words per minute). */
export const AVERAGE_WPM = 150;

export function analyzeText(text: string, wpm = AVERAGE_WPM): TextStats {
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
  const sentences = trimmed
    ? (trimmed.match(/[^.!?…]+[.!?…]+(\s|$)|[^.!?…]+$/g) || []).length
    : 0;
  const paragraphs = trimmed
    ? trimmed.split(/\n{2,}/).filter((p) => p.trim().length > 0).length
    : 0;

  return {
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, "").length,
    words,
    sentences,
    paragraphs,
    estimatedSeconds: words > 0 ? (words / wpm) * 60 : 0,
  };
}
