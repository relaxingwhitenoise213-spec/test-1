import { describe, it, expect } from "vitest";
import { analyzeText, AVERAGE_WPM } from "@/lib/text-stats";

describe("analyzeText", () => {
  it("returns zeroes for empty input", () => {
    const s = analyzeText("");
    expect(s.characters).toBe(0);
    expect(s.words).toBe(0);
    expect(s.sentences).toBe(0);
    expect(s.estimatedSeconds).toBe(0);
  });

  it("counts characters including and excluding spaces", () => {
    const s = analyzeText("a b c");
    expect(s.characters).toBe(5);
    expect(s.charactersNoSpaces).toBe(3);
  });

  it("counts words and sentences", () => {
    const s = analyzeText("Hello world. How are you? Fine!");
    expect(s.words).toBe(6);
    expect(s.sentences).toBe(3);
  });

  it("counts paragraphs split by blank lines", () => {
    const s = analyzeText("First para.\n\nSecond para.\n\nThird.");
    expect(s.paragraphs).toBe(3);
  });

  it("estimates duration from the words-per-minute rate", () => {
    const words = Array.from({ length: AVERAGE_WPM }, () => "word").join(" ");
    const s = analyzeText(words);
    // AVERAGE_WPM words should take ~60 seconds.
    expect(Math.round(s.estimatedSeconds)).toBe(60);
  });
});
