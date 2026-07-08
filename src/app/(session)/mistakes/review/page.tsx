import type { Metadata } from "next";
import { MistakesReviewScreen } from "@/components/quiz/mistakes-review-screen";

export const metadata: Metadata = {
  title: "Review mistakes",
  description:
    "Re-drill every Life in the UK question you have answered incorrectly until you get it right.",
  robots: { index: false },
};

export default function MistakesReviewPage() {
  return <MistakesReviewScreen />;
}
