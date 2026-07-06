"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import type { ReactNode } from "react";
import { HistoryProvider } from "@/hooks/use-history";

/** Client-side provider stack shared across the whole app. */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <HistoryProvider>
        {children}
        <Toaster
          richColors
          closeButton
          position="bottom-right"
          toastOptions={{ className: "font-sans" }}
        />
      </HistoryProvider>
    </ThemeProvider>
  );
}
