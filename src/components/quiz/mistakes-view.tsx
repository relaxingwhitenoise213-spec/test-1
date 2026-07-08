"use client";

import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/link-button";
import { useProgress } from "@/hooks/use-progress";
import { chapterTitle, getQuestions } from "@/lib/questions";

/** Lists every question currently answered wrong, with a drill CTA. */
export function MistakesView() {
  const { mistakeIds, stats } = useProgress();
  const questions = getQuestions(mistakeIds);

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center gap-5 rounded-xl border border-dashed px-6 py-16 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-success/10 text-success">
          <CheckCircle2 className="h-8 w-8" aria-hidden />
        </span>
        <div>
          <h2 className="text-xl font-bold tracking-tight">
            Your mistakes list is empty
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            Any question you answer incorrectly — in a mock test or while
            practising — appears here until you answer it correctly.
          </p>
        </div>
        <LinkButton href="/mock-test" size="lg">
          Take a mock test
        </LinkButton>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-bold text-foreground">{questions.length}</span>{" "}
          {questions.length === 1 ? "question needs" : "questions need"} another
          look. Answer one correctly and it leaves the list.
        </p>
        <LinkButton href="/mistakes/review" data-testid="drill-mistakes">
          Practise these questions
        </LinkButton>
      </div>

      <ul className="mt-4 space-y-2.5">
        {questions.map((question) => {
          const stat = stats[question.id];
          return (
            <li
              key={question.id}
              className="rounded-xl border bg-card p-4 shadow-sm"
            >
              <p className="text-sm font-medium leading-snug">
                {question.question}
              </p>
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{chapterTitle(question.chapter)}</Badge>
                {stat && stat.wrong > 1 && (
                  <Badge variant="warning">Missed {stat.wrong} times</Badge>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
