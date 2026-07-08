import type { Metadata } from "next";
import { MockTestScreen } from "@/components/quiz/mock-test-screen";

export const metadata: Metadata = {
  title: "Mock test",
  description:
    "Take a timed Life in the UK mock test in the official format: 24 questions, 45 minutes, 75% to pass.",
  alternates: { canonical: "/mock-test" },
};

export default function MockTestPage() {
  return <MockTestScreen />;
}
