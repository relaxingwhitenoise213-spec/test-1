import "server-only";
import { env } from "@/lib/env";
import { PROVIDERS } from "@/config/providers";
import {
  MIME_BY_FORMAT,
  type ServerTTSProvider,
  type SynthesisRequest,
  type SynthesisResult,
  type VoiceOption,
} from "@/lib/tts/types";

interface ElevenLabsVoicesResponse {
  voices: Array<{
    voice_id: string;
    name: string;
    labels?: Record<string, string>;
    category?: string;
  }>;
}

/**
 * A small curated fallback list so the UI has voices even before the live
 * `/v1/voices` call resolves (or if it is rate-limited).
 */
const FALLBACK_VOICES: Omit<VoiceOption, "provider">[] = [
  { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel", lang: "en-US", gender: "female", category: "Narration" },
  { id: "AZnzlk1XvdvUeBnXmlld", name: "Domi", lang: "en-US", gender: "female", category: "Expressive" },
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Bella", lang: "en-US", gender: "female", category: "Soft" },
  { id: "ErXwobaYiN019PkySvjV", name: "Antoni", lang: "en-US", gender: "male", category: "Warm" },
  { id: "VR6AewLTigWG4xSOukaG", name: "Arnold", lang: "en-US", gender: "male", category: "Deep" },
];

export const elevenLabsProvider: ServerTTSProvider = {
  id: "elevenlabs",
  label: PROVIDERS.elevenlabs.label,

  isConfigured() {
    return Boolean(env.ELEVENLABS_API_KEY);
  },

  async listVoices() {
    if (!env.ELEVENLABS_API_KEY) {
      return FALLBACK_VOICES.map((v) => ({ ...v, provider: "elevenlabs" as const }));
    }
    try {
      const res = await fetch("https://api.elevenlabs.io/v1/voices", {
        headers: { "xi-api-key": env.ELEVENLABS_API_KEY },
        next: { revalidate: 3600 },
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as ElevenLabsVoicesResponse;
      return data.voices.map((v) => ({
        id: v.voice_id,
        name: v.name,
        lang: v.labels?.language ?? "en-US",
        gender: (v.labels?.gender as VoiceOption["gender"]) ?? "neutral",
        category: v.category ?? v.labels?.["use case"] ?? "General",
        provider: "elevenlabs" as const,
      }));
    } catch {
      return FALLBACK_VOICES.map((v) => ({ ...v, provider: "elevenlabs" as const }));
    }
  },

  async synthesize(request: SynthesisRequest): Promise<SynthesisResult> {
    if (!env.ELEVENLABS_API_KEY) {
      throw new Error("ELEVENLABS_API_KEY is not configured.");
    }

    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${request.voiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": env.ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text: request.text,
          model_id: env.ELEVENLABS_MODEL,
          voice_settings: {
            stability: request.settings.stability ?? 0.5,
            similarity_boost: request.settings.similarity ?? 0.75,
          },
        }),
      }
    );

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(
        `ElevenLabs TTS failed (${res.status}): ${detail.slice(0, 300)}`
      );
    }

    return {
      audio: await res.arrayBuffer(),
      mimeType: MIME_BY_FORMAT.mp3,
      format: "mp3",
    };
  },
};
