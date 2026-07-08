import { describe, it, expect } from "vitest";
import { cn, createId, formatRelativeTime } from "@/lib/utils";

describe("cn", () => {
  it("merges and dedupes tailwind classes", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-sm", false && "hidden", "font-bold")).toBe("text-sm font-bold");
  });
});

describe("createId", () => {
  it("returns unique ids", () => {
    const ids = new Set(Array.from({ length: 100 }, () => createId()));
    expect(ids.size).toBe(100);
  });
});

describe("formatRelativeTime", () => {
  it("describes recent timestamps", () => {
    expect(formatRelativeTime(Date.now() - 5_000)).toMatch(/second|now/);
    expect(formatRelativeTime(Date.now() - 2 * 3_600_000)).toContain("hour");
  });
});
