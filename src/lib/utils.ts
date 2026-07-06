import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind class names, resolving conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format seconds as m:ss (or h:mm:ss for long durations). */
export function formatDuration(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return "0:00";
  const seconds = Math.floor(totalSeconds % 60);
  const minutes = Math.floor((totalSeconds / 60) % 60);
  const hours = Math.floor(totalSeconds / 3600);
  const mm = String(minutes).padStart(hours > 0 ? 2 : 1, "0");
  const ss = String(seconds).padStart(2, "0");
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
}

/** Human-readable byte size. */
export function formatBytes(bytes: number): string {
  if (!bytes || bytes < 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
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

/** Trigger a browser download for a Blob. */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Slugify a string for use in filenames. */
export function slugify(input: string, maxLength = 40): string {
  const slug = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, maxLength)
    .replace(/^-|-$/g, "");
  return slug || "speech";
}
