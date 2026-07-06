/**
 * Shared Text-to-Speech contracts.
 *
 * The application supports multiple TTS engines behind a single interface
 * (adapter pattern). A provider is either:
 *  - "client": runs entirely in the browser (Web Speech API), or
 *  - "server": calls an external API through our `/api/tts` route handler.
 */

export type ProviderId = "web-speech" | "openai" | "elevenlabs";

export type ProviderKind = "client" | "server";

export interface VoiceOption {
  /** Provider-specific voice identifier. */
  id: string;
  /** Human-readable name. */
  name: string;
  /** BCP-47 language tag, e.g. "en-US". */
  lang: string;
  gender?: "male" | "female" | "neutral";
  /** Optional grouping shown in the UI. */
  category?: string;
  /** Provider this voice belongs to. */
  provider: ProviderId;
  /** True when the voice is provided by the local device/browser. */
  local?: boolean;
}

export interface SynthesisSettings {
  /** 0.25 – 4.0, 1 = normal. */
  rate: number;
  /** 0 – 2, 1 = normal (client only). */
  pitch: number;
  /** 0 – 1. */
  volume: number;
  /** ElevenLabs voice stability (0-1). */
  stability?: number;
  /** ElevenLabs similarity boost (0-1). */
  similarity?: number;
  /** Output audio format for server providers. */
  format?: AudioFormat;
}

export type AudioFormat = "mp3" | "wav" | "ogg" | "aac";

export interface SynthesisRequest {
  text: string;
  voiceId: string;
  settings: SynthesisSettings;
}

export interface SynthesisResult {
  /** Raw audio bytes (server providers only). */
  audio: ArrayBuffer;
  mimeType: string;
  format: AudioFormat;
}

/** Server-side provider contract. */
export interface ServerTTSProvider {
  id: ProviderId;
  label: string;
  /** Returns true when the required credentials are configured. */
  isConfigured(): boolean;
  listVoices(): Promise<VoiceOption[]>;
  synthesize(request: SynthesisRequest): Promise<SynthesisResult>;
}

export const DEFAULT_SETTINGS: SynthesisSettings = {
  rate: 1,
  pitch: 1,
  volume: 1,
  stability: 0.5,
  similarity: 0.75,
  format: "mp3",
};

export const MIME_BY_FORMAT: Record<AudioFormat, string> = {
  mp3: "audio/mpeg",
  wav: "audio/wav",
  ogg: "audio/ogg",
  aac: "audio/aac",
};
