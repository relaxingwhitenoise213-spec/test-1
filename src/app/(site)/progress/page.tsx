import type { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";
import { ProgressView } from "@/components/quiz/progress-view";

export const metadata: Metadata = {
  title: "Your progress",
  description:
    "Track your Life in the UK Test readiness: mock test history, best and average scores, and accuracy for every handbook chapter.",
  robots: { index: false },
};

export default function ProgressPage() {
  return (
    <PageShell
      title="Your progress"
      description="Everything is stored privately in your browser."
    >
      <ProgressView />
    </PageShell>
  );
}
