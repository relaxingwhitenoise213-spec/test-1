import { cn } from "@/lib/utils";

interface ProgressBarProps {
  /** 0–100 */
  value: number;
  className?: string;
  label?: string;
  tone?: "primary" | "success" | "destructive";
}

const tones = {
  primary: "bg-primary",
  success: "bg-success",
  destructive: "bg-destructive",
} as const;

export function ProgressBar({
  value,
  className,
  label,
  tone = "primary",
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
      aria-label={label}
      className={cn("h-2 w-full overflow-hidden rounded-full bg-muted", className)}
    >
      <div
        className={cn("h-full rounded-full transition-all duration-300", tones[tone])}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
