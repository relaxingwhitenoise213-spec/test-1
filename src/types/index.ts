import type { ProviderId, SynthesisSettings } from "@/lib/tts/types";

/** A persisted record of a single generation, shown in History & Dashboard. */
export interface GenerationRecord {
  id: string;
  title: string;
  text: string;
  provider: ProviderId;
  voiceId: string;
  voiceName: string;
  lang: string;
  settings: SynthesisSettings;
  /** Character count of the source text. */
  characters: number;
  /** Estimated or measured duration in seconds. */
  durationSeconds: number;
  /** Byte size of exported audio, when available. */
  sizeBytes: number;
  createdAt: number;
  favorite: boolean;
}

export type SortKey = "newest" | "oldest" | "longest" | "shortest" | "title";
export type HistoryFilter = "all" | "favorites";
