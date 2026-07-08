import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind class names, resolving conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Relative time such as "2 hours ago". */
export function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const table: [number, Intl.RelativeTimeFormatUnit][] = [
    [60_000, "second"],
    [3_600_000, "minute"],
    [86_400_000, "hour"],
    [604_800_000, "day"],
    [2_592_000_000, "week"],
    [31_536_000_000, "month"],
    [Infinity, "year"],
  ];
  const divisors = [1000, 60_000, 3_600_000, 86_400_000, 604_800_000, 2_592_000_000, 31_536_000_000];
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  for (let i = 0; i < table.length; i++) {
    if (Math.abs(diff) < table[i][0]) {
      const value = Math.round(-diff / divisors[i]);
      return rtf.format(value, table[i][1]);
    }
  }
  return new Date(timestamp).toLocaleDateString();
}

/** Stable id generator that works in browser and node. */
export function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
