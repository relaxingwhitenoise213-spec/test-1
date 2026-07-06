import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatPillProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  className?: string;
  warning?: boolean;
}

export function StatPill({ icon: Icon, label, value, className, warning }: StatPillProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md border bg-secondary/40 px-2.5 py-1.5 text-xs",
        warning && "border-warning/40 bg-warning/10",
        className
      )}
    >
      <Icon className={cn("h-3.5 w-3.5", warning ? "text-warning" : "text-muted-foreground")} aria-hidden />
      <span className="font-semibold tabular-nums text-foreground">{value}</span>
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}
