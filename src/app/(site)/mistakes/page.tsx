import type { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";
import { MistakesView } from "@/components/quiz/mistakes-view";

export const metadata: Metadata = {
  title: "Your mistakes",
  description:
    "Review every Life in the UK practice question you have answered incorrectly and drill them until they stick.",
  robots: { index: false },
};

export default function MistakesPage() {
  return (
    <PageShell
      title="Your mistakes"
      description="The fastest way to improve is to attack what you got wrong. This list updates itself as you practise."
    >
      <MistakesView />
    </PageShell>
  );
}
