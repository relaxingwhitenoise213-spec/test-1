import type { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";
import { DashboardView } from "@/components/dashboard/dashboard-view";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your text-to-speech usage, quota and recent activity at a glance.",
};

export default function DashboardPage() {
  return (
    <PageShell
      title="Dashboard"
      description="Track your generations, characters and audio output over time."
    >
      <DashboardView />
    </PageShell>
  );
}
