import type { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";
import { PracticeIndex } from "@/components/quiz/practice-index";

export const metadata: Metadata = {
  title: "Practice by chapter",
  description:
    "Practise Life in the UK Test questions chapter by chapter, with instant answers and explanations after every question.",
  alternates: { canonical: "/practice" },
};

export default function PracticePage() {
  return (
    <PageShell
      title="Practice by chapter"
      description="Work through the five official handbook chapters at your own pace. Every answer comes with an explanation, and wrong answers are saved to your mistakes list."
    >
      <PracticeIndex />
    </PageShell>
  );
}
