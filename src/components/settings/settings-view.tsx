"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Monitor, Moon, Sun, Download, Trash2, KeyRound, Palette } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useHistory } from "@/hooks/use-history";
import { PROVIDER_LIST } from "@/config/providers";
import { downloadBlob, cn } from "@/lib/utils";

const THEMES = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export function SettingsView() {
  const { theme, setTheme } = useTheme();
  const { records, clear } = useHistory();
  const [mounted, setMounted] = useState(false);

  // Mount guard: theme is only known on the client, avoids hydration mismatch.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const exportData = () => {
    const blob = new Blob([JSON.stringify(records, null, 2)], {
      type: "application/json",
    });
    downloadBlob(blob, `vocalis-history-${new Date().toISOString().slice(0, 10)}.json`);
    toast.success("Data exported");
  };

  return (
    <div className="space-y-6">
      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" /> Appearance
          </CardTitle>
          <CardDescription>Choose how Vocalis looks on this device.</CardDescription>
        </CardHeader>
        <CardContent>
          <Label className="mb-2 block">Theme</Label>
          <div className="grid grid-cols-3 gap-2 sm:max-w-md">
            {THEMES.map(({ value, label, icon: Icon }) => {
              const active = mounted && theme === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTheme(value)}
                  aria-pressed={active}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-lg border p-4 text-sm font-medium transition-all",
                    active
                      ? "border-primary bg-accent text-accent-foreground ring-1 ring-primary"
                      : "hover:bg-secondary"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Providers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-primary" /> TTS providers
          </CardTitle>
          <CardDescription>
            Cloud providers are enabled by setting their API key as an environment
            variable on the server. Keys are never exposed to the browser.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {PROVIDER_LIST.map((p) => (
            <div
              key={p.id}
              className="flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{p.label}</span>
                  {p.kind === "client" ? (
                    <Badge variant="success">Always on</Badge>
                  ) : (
                    <Badge variant="secondary">Requires key</Badge>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
              </div>
              {p.envKey && (
                <code className="shrink-0 rounded bg-secondary px-2 py-1 text-xs font-mono text-muted-foreground">
                  {p.envKey}
                </code>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Data & privacy */}
      <Card>
        <CardHeader>
          <CardTitle>Data &amp; privacy</CardTitle>
          <CardDescription>
            Your history is stored locally in this browser — nothing is uploaded.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={exportData} disabled={records.length === 0}>
            <Download className="h-4 w-4" /> Export data ({records.length})
          </Button>
          <Button
            variant="outline"
            className="text-destructive hover:text-destructive"
            disabled={records.length === 0}
            onClick={() => {
              if (confirm("Delete all locally stored history?")) {
                clear();
                toast.success("All data deleted");
              }
            }}
          >
            <Trash2 className="h-4 w-4" /> Delete all data
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
