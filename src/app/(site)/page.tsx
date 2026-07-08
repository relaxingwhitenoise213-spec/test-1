import type { Metadata } from "next";
import { AlarmClock, ListChecks, Target } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { ChapterCard } from "@/components/quiz/chapter-card";
import { HomeStats } from "@/components/quiz/home-stats";
import { siteConfig } from "@/config/site";
import { CHAPTERS, QUESTIONS, questionsForChapter } from "@/lib/questions";
import {
  MOCK_DURATION_SECONDS,
  MOCK_QUESTION_COUNT,
  passThreshold,
} from "@/lib/quiz";

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

const formatTiles = [
  {
    icon: ListChecks,
    value: String(MOCK_QUESTION_COUNT),
    label: "questions per test",
  },
  {
    icon: AlarmClock,
    value: `${MOCK_DURATION_SECONDS / 60} min`,
    label: "time limit",
  },
  {
    icon: Target,
    value: "75%",
    label: `to pass (${passThreshold(MOCK_QUESTION_COUNT)} of ${MOCK_QUESTION_COUNT})`,
  },
];

export default function HomePage() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 bg-gradient-to-b from-primary/10 to-transparent bg-grid" />

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-4 pt-12 text-center sm:px-6 sm:pt-16">
        <span className="inline-flex items-center rounded-full border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
          Updated for the 2026 test · {QUESTIONS.length} practice questions · Free
        </span>
        <h1 className="mt-4 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">
          Pass the Life in the UK Test
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground sm:text-lg">
          Timed mock tests in the real exam format, chapter-by-chapter practice
          with instant explanations, and a mistakes list that makes your weak
          spots impossible to ignore.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <LinkButton href="/mock-test" size="lg" data-testid="cta-mock">
            Start a mock test
          </LinkButton>
          <LinkButton href="/practice" variant="outline" size="lg">
            Practise by chapter
          </LinkButton>
        </div>

        {/* Official format */}
        <div className="mt-12 grid grid-cols-3 gap-3">
          {formatTiles.map((tile) => (
            <div
              key={tile.label}
              className="rounded-xl border bg-card p-4 shadow-sm"
            >
              <tile.icon className="mx-auto h-5 w-5 text-primary" aria-hidden />
              <p className="mt-2 text-xl font-extrabold tabular-nums sm:text-2xl">
                {tile.value}
              </p>
              <p className="text-xs text-muted-foreground">{tile.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 sm:px-6">
        <HomeStats />
      </section>

      {/* Chapters */}
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
            Study by chapter
          </h2>
          <p className="text-sm text-muted-foreground">
            All 5 official handbook chapters
          </p>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {CHAPTERS.map((chapter, index) => (
            <ChapterCard
              key={chapter.id}
              chapter={chapter.id}
              title={chapter.title}
              questionCount={questionsForChapter(chapter.id).length}
              className={index === CHAPTERS.length - 1 ? "sm:col-span-2" : undefined}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
