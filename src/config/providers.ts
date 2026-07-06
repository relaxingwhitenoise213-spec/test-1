import type { ProviderId, ProviderKind, AudioFormat } from "@/lib/tts/types";

export interface ProviderMeta {
  id: ProviderId;
  label: string;
  kind: ProviderKind;
  description: string;
  /** Whether generated audio can be downloaded as a file. */
  downloadable: boolean;
  /** Supported export formats (server providers). */
  formats: AudioFormat[];
  /** Which synthesis controls this provider honours. */
  supports: {
    rate: boolean;
    pitch: boolean;
    volume: boolean;
    stability: boolean;
    similarity: boolean;
  };
  /** Env var required to enable a server provider. */
  envKey?: string;
  /** Max characters per request. */
  maxChars: number;
}

export const PROVIDERS: Record<ProviderId, ProviderMeta> = {
  "web-speech": {
    id: "web-speech",
    label: "Browser (Web Speech)",
    kind: "client",
    description:
      "Uses your device's built-in speech engine. Instant, private and free — no API key required. Playback only (no file export).",
    downloadable: false,
    formats: [],
    supports: { rate: true, pitch: true, volume: true, stability: false, similarity: false },
    maxChars: 32_000,
  },
  openai: {
    id: "openai",
    label: "OpenAI TTS",
    kind: "server",
    description:
      "High-quality neural voices via the OpenAI Audio API. Produces downloadable audio files.",
    downloadable: true,
    formats: ["mp3", "wav", "aac", "ogg"],
    supports: { rate: true, pitch: false, volume: false, stability: false, similarity: false },
    envKey: "OPENAI_API_KEY",
    maxChars: 4096,
  },
  elevenlabs: {
    id: "elevenlabs",
    label: "ElevenLabs",
    kind: "server",
    description:
      "Ultra-realistic voices with fine-grained emotion controls (stability & similarity). Produces downloadable audio files.",
    downloadable: true,
    formats: ["mp3"],
    supports: { rate: false, pitch: false, volume: false, stability: true, similarity: true },
    envKey: "ELEVENLABS_API_KEY",
    maxChars: 5000,
  },
};

export const PROVIDER_LIST = Object.values(PROVIDERS);
export const DEFAULT_PROVIDER: ProviderId = "web-speech";
