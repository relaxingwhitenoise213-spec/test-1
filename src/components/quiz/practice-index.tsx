"use client";

import { useMemo } from "react";
import { ChapterCard } from "@/components/quiz/chapter-card";
import { useProgress } from "@/hooks/use-progress";
import { chapterAccuracy } from "@/lib/progress";
import { CHAPTER_IDS, CHAPTERS, QUESTIONS, questionsForChapter } from "@/lib/questions";

/** Chapter list with the user's lifetime accuracy per chapter. */
export function PracticeIndex() {
  const { stats } = useProgress();

  const accuracy = useMemo(() => {
    const chapterOf = new Map(QUESTIONS.map((q) => [q.id, q.chapter]));
    return new Map(
      chapterAccuracy(stats, chapterOf, CHAPTER_IDS).map((entry) => [
        entry.chapter,
        entry,
      ])
    );
  }, [stats]);

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {CHAPTERS.map((chapter) => {
        const entry = accuracy.get(chapter.id);
        return (
          <ChapterCard
            key={chapter.id}
            chapter={chapter.id}
            title={chapter.title}
            questionCount={questionsForChapter(chapter.id).length}
            accuracyPercent={entry?.percent}
            answeredCount={entry?.answered}
          />
        );
      })}
    </div>
  );
}
