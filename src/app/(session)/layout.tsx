import type { ReactNode } from "react";

/** Distraction-free layout for quiz sessions: no site chrome. */
export default function SessionLayout({ children }: { children: ReactNode }) {
  return (
    <main id="main" className="min-h-dvh">
      {children}
    </main>
  );
}
