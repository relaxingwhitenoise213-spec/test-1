import Link from "next/link";
import { ArrowRight, Gavel, Map, Scale, ScrollText, Users } from "lucide-react";
import { ProgressBar } from "@/components/ui/progress-bar";
import { cn } from "@/lib/utils";
import type { ChapterId } from "@/types";

const chapterIcons = {
  values: Scale,
  uk: Map,
  history: ScrollText,
  society: Users,
  government: Gavel,
} as const;

interface ChapterCardProps {
  chapter: ChapterId;
  title: string;
  questionCount: number;
  /** Lifetime accuracy 0–100; omit to hide the bar (e.g. on first visit). */
  accuracyPercent?: number;
  answeredCount?: number;
  className?: string;
}

export function ChapterCard({
  chapter,
  title,
  questionCount,
  accuracyPercent,
  answeredCount,
  className,
}: ChapterCardProps) {
  const Icon = chapterIcons[chapter];
  const hasProgress = accuracyPercent !== undefined && (answeredCount ?? 0) > 0;
  return (
    <Link
      href={`/practice/${chapter}`}
      data-testid={`chapter-${chapter}`}
      className={cn(
        "group flex flex-col rounded-xl border bg-card p-4 shadow-sm transition-all",
        "hover:border-primary/50 hover:shadow-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <ArrowRight
          className="h-4 w-4 translate-x-0 text-muted-foreground transition-transform group-hover:translate-x-1"
          aria-hidden
        />
      </div>
      <h3 className="mt-3 font-semibold leading-snug">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {questionCount} questions
      </p>
      {hasProgress && (
        <div className="mt-3">
          <div className="mb-1 flex justify-between text-xs text-muted-foreground">
            <span>Accuracy</span>
            <span className="font-semibold tabular-nums">{accuracyPercent}%</span>
          </div>
          <ProgressBar
            value={accuracyPercent}
            tone={accuracyPercent >= 75 ? "success" : "primary"}
            label={`${title} accuracy`}
          />
        </div>
      )}
    </Link>
  );
}
