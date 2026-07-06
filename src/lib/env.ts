import { z } from "zod";

/**
 * Centralised, validated environment access.
 *
 * All server-only secrets are optional so the app runs out of the box with the
 * browser Web Speech provider. Cloud providers activate automatically when
 * their key is present. Never import this file from client components.
 */
const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  OPENAI_API_KEY: z.string().min(1).optional(),
  OPENAI_TTS_MODEL: z.string().default("gpt-4o-mini-tts"),
  ELEVENLABS_API_KEY: z.string().min(1).optional(),
  ELEVENLABS_MODEL: z.string().default("eleven_multilingual_v2"),
});

const parsed = serverSchema.safeParse(process.env);

if (!parsed.success) {
  // Fail fast with a readable message during boot rather than at request time.
  console.error(
    "❌ Invalid environment variables:",
    JSON.stringify(parsed.error.flatten().fieldErrors, null, 2)
  );
  throw new Error("Invalid environment configuration. See errors above.");
}

export const env = parsed.data;

/** Public (client-safe) configuration derived from env. */
export const publicEnv = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
};
