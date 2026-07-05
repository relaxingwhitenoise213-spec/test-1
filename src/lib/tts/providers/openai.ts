import "server-only";
import { env } from "@/lib/env";
import { PROVIDERS } from "@/config/providers";
import {
  MIME_BY_FORMAT,
  type ServerTTSProvider,
  type SynthesisRequest,
  type SynthesisResult,
  type VoiceOption,
  type AudioFormat,
} from "@/lib/tts/types";

/** OpenAI's fixed catalogue of TTS voices. */
const OPENAI_VOICES: Omit<VoiceOption, "provider">[] = [
  { id: "alloy", name: "Alloy", lang: "en-US", gender: "neutral", category: "Balanced" },
  { id: "ash", name: "Ash", lang: "en-US", gender: "male", category: "Expressive" },
  { id: "ballad", name: "Ballad", lang: "en-US", gender: "male", category: "Warm" },
  { id: "coral", name: "Coral", lang: "en-US", gender: "female", category: "Warm" },
  { id: "echo", name: "Echo", lang: "en-US", gender: "male", category: "Balanced" },
  { id: "fable", name: "Fable", lang: "en-US", gender: "neutral", category: "Narration" },
  { id: "nova", name: "Nova", lang: "en-US", gender: "female", category: "Bright" },
  { id: "onyx", name: "Onyx", lang: "en-US", gender: "male", category: "Deep" },
  { id: "sage", name: "Sage", lang: "en-US", gender: "female", category: "Calm" },
  { id: "shimmer", name: "Shimmer", lang: "en-US", gender: "female", category: "Bright" },
];

/** Map our generic format to OpenAI's `response_format`. */
const FORMAT_MAP: Record<AudioFormat, string> = {
  mp3: "mp3",
  wav: "wav",
  ogg: "opus",
  aac: "aac",
};

export const openaiProvider: ServerTTSProvider = {
  id: "openai",
  label: PROVIDERS.openai.label,

  isConfigured() {
    return Boolean(env.OPENAI_API_KEY);
  },

  async listVoices() {
    return OPENAI_VOICES.map((v) => ({ ...v, provider: "openai" as const }));
  },

  async synthesize(request: SynthesisRequest): Promise<SynthesisResult> {
    if (!env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured.");
    }
    const format = request.settings.format ?? "mp3";

    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: env.OPENAI_TTS_MODEL,
        voice: request.voiceId,
        input: request.text,
        response_format: FORMAT_MAP[format],
        speed: Math.min(4, Math.max(0.25, request.settings.rate)),
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new Error(
        `OpenAI TTS failed (${response.status}): ${detail.slice(0, 300)}`
      );
    }

    return {
      audio: await response.arrayBuffer(),
      mimeType: MIME_BY_FORMAT[format],
      format,
    };
  },
};
