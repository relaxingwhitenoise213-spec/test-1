import type { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";
import { SettingsView } from "@/components/settings/settings-view";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage appearance, TTS providers and your locally stored data.",
  robots: { index: false, follow: false },
};

export default function SettingsPage() {
  return (
    <PageShell
      title="Settings"
      description="Personalise your experience and manage providers and data."
    >
      <SettingsView />
    </PageShell>
  );
}
