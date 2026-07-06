import type { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";
import { HistoryView } from "@/components/history/history-view";

export const metadata: Metadata = {
  title: "History",
  description: "Search, filter and manage every speech generation you've created.",
};

export default function HistoryPage() {
  return (
    <PageShell
      title="History"
      description="Every generation is saved locally. Search, favorite, rename or re-use them."
    >
      <HistoryView />
    </PageShell>
  );
}
