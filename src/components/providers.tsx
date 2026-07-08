"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import type { ReactNode } from "react";
import { ProgressProvider } from "@/hooks/use-progress";

/** Client-side provider stack shared across the whole app. */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ProgressProvider>
        {children}
        <Toaster
          richColors
          closeButton
          position="bottom-right"
          toastOptions={{ className: "font-sans" }}
        />
      </ProgressProvider>
    </ThemeProvider>
  );
}
