import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerProvider } from "@/lib/tts/registry";
import { PROVIDERS } from "@/config/providers";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import { slugify } from "@/lib/utils";

export const runtime = "nodejs";

const bodySchema = z.object({
  provider: z.enum(["openai", "elevenlabs"]),
  text: z.string().min(1, "Text is required").max(5000),
  voiceId: z.string().min(1, "A voice is required"),
  settings: z.object({
    rate: z.number().min(0.25).max(4).default(1),
    pitch: z.number().min(0).max(2).default(1),
    volume: z.number().min(0).max(1).default(1),
    stability: z.number().min(0).max(1).optional(),
    similarity: z.number().min(0).max(1).optional(),
    format: z.enum(["mp3", "wav", "ogg", "aac"]).default("mp3"),
  }),
});

export async function POST(request: Request) {
  // Rate limiting (security requirement).
  const limit = rateLimit(`tts:${clientKey(request.headers)}`, 20, 60_000);
  if (!limit.success) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please slow down." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((limit.resetAt - Date.now()) / 1000)),
          "X-RateLimit-Remaining": String(limit.remaining),
        },
      }
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { provider: providerId, text, voiceId, settings } = parsed.data;
  const meta = PROVIDERS[providerId];

  if (text.length > meta.maxChars) {
    return NextResponse.json(
      { error: `Text exceeds the ${meta.label} limit of ${meta.maxChars} characters.` },
      { status: 422 }
    );
  }

  const provider = getServerProvider(providerId);
  if (!provider) {
    return NextResponse.json({ error: "Unknown provider." }, { status: 400 });
  }

  if (!provider.isConfigured()) {
    return NextResponse.json(
      {
        error: `${meta.label} is not configured. Add ${meta.envKey} to your environment to enable it.`,
        code: "PROVIDER_NOT_CONFIGURED",
      },
      { status: 501 }
    );
  }

  try {
    const result = await provider.synthesize({ text, voiceId, settings });
    const filename = `${slugify(text)}.${result.format}`;
    return new NextResponse(result.audio, {
      status: 200,
      headers: {
        "Content-Type": result.mimeType,
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "no-store",
        "X-RateLimit-Remaining": String(limit.remaining),
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Speech synthesis failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
