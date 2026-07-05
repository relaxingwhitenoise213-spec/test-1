import { describe, it, expect } from "vitest";
import { formatDuration, formatBytes, slugify, cn } from "@/lib/utils";

describe("formatDuration", () => {
  it("formats seconds and minutes", () => {
    expect(formatDuration(0)).toBe("0:00");
    expect(formatDuration(65)).toBe("1:05");
    expect(formatDuration(9)).toBe("0:09");
  });
  it("formats hours", () => {
    expect(formatDuration(3661)).toBe("1:01:01");
  });
  it("guards against invalid input", () => {
    expect(formatDuration(-5)).toBe("0:00");
    expect(formatDuration(Number.NaN)).toBe("0:00");
  });
});

describe("formatBytes", () => {
  it("formats byte scales", () => {
    expect(formatBytes(0)).toBe("0 B");
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(1024)).toBe("1.0 KB");
    expect(formatBytes(1_048_576)).toBe("1.0 MB");
  });
});

describe("slugify", () => {
  it("produces filesystem-safe slugs", () => {
    expect(slugify("Hello, World!")).toBe("hello-world");
    expect(slugify("   ")).toBe("speech");
  });
  it("truncates to the max length", () => {
    expect(slugify("a".repeat(100)).length).toBeLessThanOrEqual(40);
  });
});

describe("cn", () => {
  it("merges and dedupes tailwind classes", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-sm", false && "hidden", "font-bold")).toBe("text-sm font-bold");
  });
});
