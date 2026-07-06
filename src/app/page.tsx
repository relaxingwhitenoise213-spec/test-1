import type { Metadata } from "next";
import { Studio } from "@/components/studio/studio";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

export default function StudioPage() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-primary/10 to-transparent bg-grid" />
      <section className="mx-auto max-w-6xl px-4 pt-10 pb-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
            Multi-provider · WCAG accessible · Free in your browser
          </span>
          <h1 className="mt-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            {siteConfig.tagline}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-pretty text-muted-foreground">
            Convert any text into natural, expressive speech. Pick a voice, tune
            the delivery, and listen or export — all in one clean studio.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <Studio />
      </section>
    </div>
  );
}
