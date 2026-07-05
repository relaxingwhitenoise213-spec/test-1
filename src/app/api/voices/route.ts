import { NextResponse } from "next/server";
import { getServerProvider } from "@/lib/tts/registry";
import { PROVIDERS } from "@/config/providers";
import type { ProviderId } from "@/lib/tts/types";

export const runtime = "nodejs";
export const revalidate = 3600;

/** GET /api/voices?provider=openai — list voices for a server provider. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const providerId = searchParams.get("provider") as ProviderId | null;

  if (!providerId || !(providerId in PROVIDERS)) {
    return NextResponse.json({ error: "Unknown provider." }, { status: 400 });
  }

  const provider = getServerProvider(providerId);
  if (!provider) {
    return NextResponse.json(
      { error: "Provider is not a server provider." },
      { status: 400 }
    );
  }

  const voices = await provider.listVoices();
  return NextResponse.json({
    provider: providerId,
    configured: provider.isConfigured(),
    voices,
  });
}
