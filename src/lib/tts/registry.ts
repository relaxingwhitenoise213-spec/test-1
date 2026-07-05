import "server-only";
import type { ProviderId, ServerTTSProvider } from "@/lib/tts/types";
import { openaiProvider } from "@/lib/tts/providers/openai";
import { elevenLabsProvider } from "@/lib/tts/providers/elevenlabs";

/**
 * Server-side provider registry. New engines (Google, Azure, Polly) can be
 * added by implementing `ServerTTSProvider` and registering them here — no
 * other code needs to change (open/closed principle).
 */
const registry: Partial<Record<ProviderId, ServerTTSProvider>> = {
  openai: openaiProvider,
  elevenlabs: elevenLabsProvider,
};

export function getServerProvider(id: ProviderId): ServerTTSProvider | null {
  return registry[id] ?? null;
}

export function listServerProviders(): ServerTTSProvider[] {
  return Object.values(registry).filter(Boolean) as ServerTTSProvider[];
}
