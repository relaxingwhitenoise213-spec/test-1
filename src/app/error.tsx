"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In production this would report to an error-tracking service.
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center gap-6 px-4 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <AlertTriangle className="h-8 w-8" />
      </span>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">
          Something went wrong
        </h1>
        <p className="text-muted-foreground">
          An unexpected error occurred. You can try again below.
        </p>
      </div>
      <Button onClick={reset} className="gap-2">
        <RotateCcw className="h-4 w-4" />
        Try again
      </Button>
    </div>
  );
}
