"use client";

import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type OptionState =
  | "idle"
  | "selected"
  | "correct"
  | "wrong"
  | "missed";

interface OptionButtonProps {
  letter: string;
  label: string;
  state: OptionState;
  disabled?: boolean;
  multi?: boolean;
  onClick: () => void;
}

/**
 * One answer row. States:
 * - idle/selected while answering
 * - correct/wrong/missed once feedback is revealed (missed = correct answer
 *   the user failed to pick)
 */
export function OptionButton({
  letter,
  label,
  state,
  disabled,
  multi,
  onClick,
}: OptionButtonProps) {
  return (
    <button
      type="button"
      role={multi ? "checkbox" : "radio"}
      aria-checked={state === "selected" || state === "correct" || state === "wrong"}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border-2 bg-card p-3.5 text-left text-sm font-medium transition-all sm:p-4 sm:text-base",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:pointer-events-none",
        state === "idle" &&
          "border-border hover:border-primary/50 hover:bg-accent/50 active:scale-[0.99]",
        state === "selected" && "border-primary bg-accent/70 text-accent-foreground",
        state === "correct" && "border-success bg-success/10",
        state === "wrong" && "border-destructive bg-destructive/10",
        state === "missed" && "border-success border-dashed bg-success/5"
      )}
    >
      <span
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-xs font-bold",
          state === "idle" && "border-border bg-muted text-muted-foreground",
          state === "selected" &&
            "border-primary bg-primary text-primary-foreground",
          state === "correct" && "border-success bg-success text-white",
          state === "wrong" && "border-destructive bg-destructive text-white",
          state === "missed" && "border-success bg-success/15 text-success"
        )}
        aria-hidden
      >
        {state === "correct" || state === "missed" ? (
          <Check className="h-4 w-4" />
        ) : state === "wrong" ? (
          <X className="h-4 w-4" />
        ) : (
          letter
        )}
      </span>
      <span className="flex-1">{label}</span>
    </button>
  );
}
