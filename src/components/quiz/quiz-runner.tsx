"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Flag,
  LayoutGrid,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { ProgressBar } from "@/components/ui/progress-bar";
import { OptionButton, type OptionState } from "@/components/quiz/option-button";
import { ResultsView } from "@/components/quiz/results-view";
import { useProgress } from "@/hooks/use-progress";
import {
  formatClock,
  isPass,
  isSelectionComplete,
  isSelectionCorrect,
  MOCK_DURATION_SECONDS,
  toggleSelection,
} from "@/lib/quiz";
import { cn, createId } from "@/lib/utils";
import type {
  AnsweredQuestion,
  AttemptRecord,
  ChapterId,
  QuizMode,
  Selection,
  SessionQuestion,
} from "@/types";

const LETTERS = ["A", "B", "C", "D"];

interface QuizRunnerProps {
  /** Re-mount with a new `key` to restart with a fresh session. */
  session: SessionQuestion[];
  mode: QuizMode;
  chapter?: ChapterId;
  /** Epoch ms when the session was started (from the start click handler). */
  startedAt: number;
  /** Mock tests run against the official 45-minute clock. */
  timed?: boolean;
  exitHref: string;
  onRestart?: () => void;
}

type View = "question" | "summary" | "results";

interface SessionResult {
  attempt: AttemptRecord;
  answers: AnsweredQuestion[];
}

export function QuizRunner({
  session,
  mode,
  chapter,
  startedAt,
  timed = false,
  exitHref,
  onRestart,
}: QuizRunnerProps) {
  const router = useRouter();
  const { recordAttempt } = useProgress();
  const instantFeedback = mode !== "mock";

  const [view, setView] = useState<View>("question");
  const [index, setIndex] = useState(0);
  const [selections, setSelections] = useState<Selection[]>(() =>
    session.map(() => [])
  );
  const [checked, setChecked] = useState<boolean[]>(() =>
    session.map(() => false)
  );
  const [flagged, setFlagged] = useState<boolean[]>(() =>
    session.map(() => false)
  );
  const [confirmQuit, setConfirmQuit] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [remaining, setRemaining] = useState(MOCK_DURATION_SECONDS);
  const [result, setResult] = useState<SessionResult | null>(null);

  const endsAt = timed ? startedAt + MOCK_DURATION_SECONDS * 1000 : null;
  const headingRef = useRef<HTMLHeadingElement>(null);

  const current = session[index];
  const selection = selections[index] ?? [];
  const isChecked = checked[index] ?? false;
  const total = session.length;
  const answeredCount = useMemo(
    () =>
      session.filter((_, i) =>
        instantFeedback ? checked[i] : (selections[i] ?? []).length > 0
      ).length,
    [session, selections, checked, instantFeedback]
  );

  const finish = useCallback(
    (scope: "all" | "checked") => {
      const inScope = session
        .map((sq, i) => ({ sq, i }))
        .filter(({ i }) => scope === "all" || checked[i]);
      if (inScope.length === 0) {
        router.push(exitHref);
        return;
      }
      const answers: AnsweredQuestion[] = inScope.map(({ sq, i }) => ({
        questionId: sq.question.id,
        chapter: sq.question.chapter,
        selected: selections[i] ?? [],
        correct: isSelectionCorrect(sq.question, selections[i] ?? []),
      }));
      const correct = answers.filter((a) => a.correct).length;
      const attempt: AttemptRecord = {
        id: createId(),
        mode,
        chapter,
        total: answers.length,
        correct,
        passed: isPass(correct, answers.length),
        startedAt,
        finishedAt: Date.now(),
        wrongIds: answers.filter((a) => !a.correct).map((a) => a.questionId),
      };
      recordAttempt(attempt, answers);
      setResult({ attempt, answers });
      setView("results");
      window.scrollTo({ top: 0 });
    },
    [
      session,
      checked,
      selections,
      mode,
      chapter,
      startedAt,
      recordAttempt,
      router,
      exitHref,
    ]
  );

  // Countdown clock for timed sessions; auto-submits at zero.
  useEffect(() => {
    if (!timed || endsAt === null || view === "results") return;
    const tick = () => {
      const left = Math.ceil((endsAt - Date.now()) / 1000);
      setRemaining(Math.max(0, left));
      if (left <= 0) finish("all");
    };
    tick();
    const id = window.setInterval(tick, 500);
    return () => window.clearInterval(id);
  }, [timed, endsAt, view, finish]);

  // Leaving mid-test would lose the attempt — warn like the real thing.
  useEffect(() => {
    if (mode !== "mock" || view === "results") return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [mode, view]);

  // Move focus to the new question for keyboard and screen-reader users.
  useEffect(() => {
    if (view !== "question") return;
    const frame = requestAnimationFrame(() => headingRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [index, view]);

  const select = (originalIndex: number) => {
    if (isChecked && instantFeedback) return;
    setSelections((prev) => {
      const next = [...prev];
      next[index] = toggleSelection(current.question, prev[index] ?? [], originalIndex);
      return next;
    });
  };

  const check = () => {
    setChecked((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
  };

  const goTo = (i: number) => {
    setIndex(Math.max(0, Math.min(total - 1, i)));
    setView("question");
  };

  const optionState = (originalIndex: number): OptionState => {
    const isSelected = selection.includes(originalIndex);
    const revealed = instantFeedback && isChecked;
    if (!revealed) return isSelected ? "selected" : "idle";
    const isCorrect = current.question.answers.includes(originalIndex);
    if (isSelected && isCorrect) return "correct";
    if (isSelected && !isCorrect) return "wrong";
    if (isCorrect) return "missed";
    return "idle";
  };

  if (view === "results" && result) {
    return (
      <ResultsView
        mode={mode}
        session={session}
        attempt={result.attempt}
        answers={result.answers}
        exitHref={exitHref}
        onRestart={onRestart}
      />
    );
  }

  const lowTime = timed && remaining <= 300;
  const answeredCurrent = isSelectionComplete(current.question, selection);
  const isLast = index === total - 1;

  return (
    <div className="mx-auto flex min-h-dvh max-w-2xl flex-col px-4 pt-4 sm:px-6 sm:pt-6 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
      {/* Top bar */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Quit session"
          onClick={() => setConfirmQuit(true)}
          data-testid="quit-button"
        >
          <X className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <p className="text-center text-sm font-semibold tabular-nums text-muted-foreground">
            Question {index + 1} <span className="font-normal">of</span> {total}
          </p>
          <ProgressBar
            value={((index + 1) / total) * 100}
            label="Session progress"
            className="mt-1.5"
          />
        </div>
        {timed && (
          <div
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold tabular-nums",
              lowTime
                ? "border-destructive/40 bg-destructive/10 text-destructive"
                : "bg-card text-foreground"
            )}
            role="timer"
            aria-label="Time remaining"
            data-testid="timer"
          >
            <Clock className="h-4 w-4" aria-hidden />
            {formatClock(remaining)}
          </div>
        )}
        {mode === "mock" && (
          <Button
            variant={flagged[index] ? "secondary" : "ghost"}
            size="icon"
            aria-label={flagged[index] ? "Remove flag" : "Flag question for review"}
            aria-pressed={flagged[index]}
            onClick={() =>
              setFlagged((prev) => {
                const next = [...prev];
                next[index] = !next[index];
                return next;
              })
            }
          >
            <Flag
              className={cn("h-5 w-5", flagged[index] && "fill-warning text-warning")}
            />
          </Button>
        )}
      </div>
      {lowTime && (
        <p className="sr-only" role="status">
          Less than five minutes remaining
        </p>
      )}

      {view === "summary" ? (
        /* Review grid (mock): jump anywhere, then submit */
        <div className="flex flex-1 flex-col pt-8">
          <h1 className="text-xl font-bold tracking-tight">Review your answers</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {answeredCount} of {total} answered
            {flagged.some(Boolean) &&
              ` · ${flagged.filter(Boolean).length} flagged`}
            . Tap a question to revisit it.
          </p>
          <div className="mt-6 grid grid-cols-6 gap-2 sm:grid-cols-8">
            {session.map((sq, i) => {
              const answered = (selections[i] ?? []).length > 0;
              return (
                <button
                  key={sq.question.id}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Question ${i + 1}: ${
                    answered ? "answered" : "unanswered"
                  }${flagged[i] ? ", flagged" : ""}`}
                  className={cn(
                    "relative flex h-11 items-center justify-center rounded-lg border-2 text-sm font-bold transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    answered
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-primary/50"
                  )}
                >
                  {i + 1}
                  {flagged[i] && (
                    <span
                      aria-hidden
                      className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-warning ring-2 ring-background"
                    />
                  )}
                </button>
              );
            })}
          </div>
          <div className="mt-auto flex gap-3 pt-8">
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={() => setView("question")}
            >
              Keep answering
            </Button>
            <Button
              size="lg"
              className="flex-1"
              data-testid="submit-test"
              onClick={() => {
                if (answeredCount < total) setConfirmSubmit(true);
                else finish("all");
              }}
            >
              Submit test
            </Button>
          </div>
        </div>
      ) : (
        /* Question view */
        <div className="flex flex-1 flex-col">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.question.id}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="flex flex-1 flex-col"
            >
              <div className="pt-6 sm:pt-8">
                {current.question.type === "multi" && (
                  <span className="mb-2 inline-flex items-center rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground">
                    Select TWO answers
                  </span>
                )}
                {current.question.type === "truefalse" && (
                  <span className="mb-2 inline-flex items-center rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">
                    Is this statement true or false?
                  </span>
                )}
                <h1
                  ref={headingRef}
                  tabIndex={-1}
                  data-testid="question-text"
                  className="text-balance text-xl font-bold leading-snug tracking-tight outline-none sm:text-2xl"
                >
                  {current.question.question}
                </h1>
              </div>

              <div
                role={current.question.type === "multi" ? "group" : "radiogroup"}
                aria-label="Answer options"
                className="mt-6 flex flex-col gap-2.5"
              >
                {current.order.map((originalIndex, position) => (
                  <OptionButton
                    key={originalIndex}
                    letter={LETTERS[position] ?? String(position + 1)}
                    label={current.question.options[originalIndex]}
                    state={optionState(originalIndex)}
                    multi={current.question.type === "multi"}
                    disabled={instantFeedback && isChecked}
                    onClick={() => select(originalIndex)}
                  />
                ))}
              </div>

              {/* Instant feedback (practice modes) */}
              {instantFeedback && isChecked && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="status"
                  data-testid="feedback"
                  className={cn(
                    "mt-5 rounded-xl border-l-4 bg-card p-4 shadow-sm",
                    isSelectionCorrect(current.question, selection)
                      ? "border-success"
                      : "border-destructive"
                  )}
                >
                  <p
                    className={cn(
                      "text-sm font-bold uppercase tracking-wide",
                      isSelectionCorrect(current.question, selection)
                        ? "text-success"
                        : "text-destructive"
                    )}
                  >
                    {isSelectionCorrect(current.question, selection)
                      ? "Correct"
                      : "Incorrect"}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {current.question.explanation}
                  </p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Bottom controls */}
          <div className="sticky bottom-0 -mx-4 mt-8 border-t bg-background/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
            {instantFeedback ? (
              <div className="flex gap-3">
                {!isChecked ? (
                  <Button
                    size="lg"
                    className="flex-1"
                    disabled={!answeredCurrent}
                    onClick={check}
                    data-testid="check-answer"
                  >
                    Check answer
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    className="flex-1"
                    data-testid="next-question"
                    onClick={() => (isLast ? finish("checked") : goTo(index + 1))}
                  >
                    {isLast ? "See results" : "Next question"}
                    {!isLast && <ChevronRight className="h-4 w-4" />}
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="lg"
                  disabled={index === 0}
                  onClick={() => goTo(index - 1)}
                  aria-label="Previous question"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Previous</span>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-3"
                  onClick={() => setView("summary")}
                  aria-label="Review all answers"
                  data-testid="open-summary"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  className="flex-1"
                  data-testid="mock-next"
                  onClick={() => (isLast ? setView("summary") : goTo(index + 1))}
                >
                  {isLast ? "Review & submit" : "Next"}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quit confirmation */}
      <Dialog
        open={confirmQuit}
        onClose={() => setConfirmQuit(false)}
        title={mode === "mock" ? "Abandon this test?" : "End this session?"}
      >
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "mock"
            ? "Your answers will not be saved and this attempt will not count."
            : answeredCount > 0
              ? "Your answers so far will be saved to your progress."
              : "You have not answered any questions yet."}
        </p>
        <div className="mt-5 flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setConfirmQuit(false)}
          >
            Keep going
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            data-testid="confirm-quit"
            onClick={() => {
              setConfirmQuit(false);
              if (mode === "mock" || answeredCount === 0) router.push(exitHref);
              else finish("checked");
            }}
          >
            {mode === "mock" ? "Abandon test" : "End session"}
          </Button>
        </div>
      </Dialog>

      {/* Submit-with-unanswered confirmation */}
      <Dialog
        open={confirmSubmit}
        onClose={() => setConfirmSubmit(false)}
        title="Submit with unanswered questions?"
      >
        <p className="mt-2 text-sm text-muted-foreground">
          {total - answeredCount} unanswered{" "}
          {total - answeredCount === 1 ? "question" : "questions"} will be
          marked as incorrect.
        </p>
        <div className="mt-5 flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setConfirmSubmit(false)}
          >
            Go back
          </Button>
          <Button
            className="flex-1"
            data-testid="confirm-submit"
            onClick={() => {
              setConfirmSubmit(false);
              finish("all");
            }}
          >
            Submit anyway
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
