"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Sparkles,
  Square,
  Pause,
  Play,
  Loader2,
  AudioLines,
  Keyboard,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TextEditor } from "@/components/studio/text-editor";
import { VoicePanel } from "@/components/studio/voice-panel";
import { AudioPlayer } from "@/components/studio/audio-player";
import { useUndo } from "@/hooks/use-undo";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useHistory } from "@/hooks/use-history";
import { PROVIDERS, DEFAULT_PROVIDER } from "@/config/providers";
import { DEFAULT_SETTINGS, type ProviderId, type SynthesisSettings, type VoiceOption } from "@/lib/tts/types";
import { analyzeText } from "@/lib/text-stats";
import { createId, slugify } from "@/lib/utils";

const PREVIEW_TEXT = "Hello! This is a preview of how this voice sounds.";
const AUTOSAVE_KEY = "vocalis.draft.v1";

export function Studio() {
  const history = useHistory();
  const speech = useSpeechSynthesis();

  // --- Persisted preferences ---
  const [provider, setProvider] = useLocalStorage<ProviderId>(
    "vocalis.provider",
    DEFAULT_PROVIDER
  );
  const [settings, setSettings] = useLocalStorage<SynthesisSettings>(
    "vocalis.settings",
    DEFAULT_SETTINGS
  );
  const [favorites, setFavorites] = useLocalStorage<string[]>("vocalis.favorites", []);
  const [voiceByProvider, setVoiceByProvider] = useLocalStorage<Record<string, string>>(
    "vocalis.voices",
    {}
  );
  const [savedDraft, setSavedDraft] = useLocalStorage<string>(AUTOSAVE_KEY, "");

  // --- Editor (undo/redo) ---
  const editor = useUndo<string>("");
  const hydrated = useRef(false);
  useEffect(() => {
    if (!hydrated.current && savedDraft) {
      editor.reset(savedDraft);
    }
    hydrated.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedDraft]);

  // Autosave draft (debounced through the effect dependency).
  useEffect(() => {
    const t = setTimeout(() => setSavedDraft(editor.value), 500);
    return () => clearTimeout(t);
  }, [editor.value, setSavedDraft]);

  // --- Server provider voices ---
  const [serverVoices, setServerVoices] = useState<Record<string, VoiceOption[]>>({});
  const [voicesLoading, setVoicesLoading] = useState(false);

  useEffect(() => {
    const meta = PROVIDERS[provider];
    if (meta.kind !== "server" || serverVoices[provider]) return;
    // Fetch voices from the server provider (external system) on demand.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVoicesLoading(true);
    fetch(`/api/voices?provider=${provider}`)
      .then((r) => r.json())
      .then((data: { voices?: VoiceOption[] }) => {
        setServerVoices((prev) => ({ ...prev, [provider]: data.voices ?? [] }));
      })
      .catch(() => toast.error("Could not load voices for this provider."))
      .finally(() => setVoicesLoading(false));
  }, [provider, serverVoices]);

  const voices: VoiceOption[] =
    PROVIDERS[provider].kind === "client"
      ? speech.voices
      : serverVoices[provider] ?? [];

  const selectedVoiceId =
    voiceByProvider[provider] && voices.some((v) => v.id === voiceByProvider[provider])
      ? voiceByProvider[provider]
      : voices[0]?.id ?? "";

  // Persist a default selection once voices load.
  useEffect(() => {
    if (selectedVoiceId && voiceByProvider[provider] !== selectedVoiceId && !voiceByProvider[provider]) {
      setVoiceByProvider((prev) => ({ ...prev, [provider]: selectedVoiceId }));
    }
  }, [selectedVoiceId, provider, voiceByProvider, setVoiceByProvider]);

  // --- Server generation output ---
  const [generating, setGenerating] = useState(false);
  const [output, setOutput] = useState<{ url: string; blob: Blob; filename: string } | null>(null);
  const [previewingId, setPreviewingId] = useState<string | null>(null);

  const meta = PROVIDERS[provider];
  const stats = analyzeText(editor.value);
  const isClient = meta.kind === "client";
  const selectedVoice = voices.find((v) => v.id === selectedVoiceId);

  const updateSettings = useCallback(
    (patch: Partial<SynthesisSettings>) => setSettings((prev) => ({ ...prev, ...patch })),
    [setSettings]
  );

  const toggleFavorite = useCallback(
    (id: string) =>
      setFavorites((prev) =>
        prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
      ),
    [setFavorites]
  );

  const selectVoice = useCallback(
    (id: string) => setVoiceByProvider((prev) => ({ ...prev, [provider]: id })),
    [provider, setVoiceByProvider]
  );

  const recordGeneration = useCallback(
    (durationSeconds: number, sizeBytes: number) => {
      history.add({
        id: createId(),
        title: editor.value.slice(0, 60).trim() || "Untitled generation",
        text: editor.value,
        provider,
        voiceId: selectedVoiceId,
        voiceName: selectedVoice?.name ?? "Default",
        lang: selectedVoice?.lang ?? "en-US",
        settings,
        characters: stats.characters,
        durationSeconds,
        sizeBytes,
        createdAt: Date.now(),
        favorite: false,
      });
    },
    [history, editor.value, provider, selectedVoiceId, selectedVoice, settings, stats.characters]
  );

  // --- Cloud synthesis via API ---
  const synthesizeServer = useCallback(
    async (text: string, voiceId: string, forPreview: boolean) => {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, text, voiceId, settings }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Request failed (${res.status})`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      if (!forPreview) {
        setOutput((prev) => {
          if (prev) URL.revokeObjectURL(prev.url);
          return { url, blob, filename: `${slugify(text)}.${settings.format ?? "mp3"}` };
        });
      }
      return { url, blob };
    },
    [provider, settings]
  );

  const handleGenerate = useCallback(async () => {
    const text = editor.value.trim();
    if (!text) {
      toast.error("Please enter some text first.");
      return;
    }
    if (stats.characters > meta.maxChars) {
      toast.error(`Text exceeds the ${meta.maxChars.toLocaleString()} character limit for ${meta.label}.`);
      return;
    }

    if (isClient) {
      if (!speech.supported) {
        toast.error("Your browser doesn't support the Web Speech API. Try a cloud provider.");
        return;
      }
      speech.speak({
        text,
        voiceId: selectedVoiceId,
        settings,
        onEnd: () => undefined,
      });
      recordGeneration(stats.estimatedSeconds, 0);
      toast.success("Speaking…", { description: `${selectedVoice?.name ?? "Voice"} · ${selectedVoice?.lang ?? ""}` });
      return;
    }

    setGenerating(true);
    const id = toast.loading("Generating audio…");
    try {
      const { blob } = await synthesizeServer(text, selectedVoiceId, false);
      recordGeneration(stats.estimatedSeconds, blob.size);
      toast.success("Audio ready", { id });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Generation failed", { id });
    } finally {
      setGenerating(false);
    }
  }, [editor.value, stats, meta, isClient, speech, selectedVoiceId, settings, selectedVoice, recordGeneration, synthesizeServer]);

  const handlePreview = useCallback(
    async (voiceId: string) => {
      if (isClient) {
        speech.speak({ text: PREVIEW_TEXT, voiceId, settings });
        return;
      }
      setPreviewingId(voiceId);
      try {
        const { url } = await synthesizeServer(PREVIEW_TEXT, voiceId, true);
        const audio = new Audio(url);
        await audio.play();
        audio.onended = () => URL.revokeObjectURL(url);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Preview failed");
      } finally {
        setPreviewingId(null);
      }
    },
    [isClient, speech, settings, synthesizeServer]
  );

  const handleUndo = useCallback(() => editor.undo(), [editor]);
  const handleRedo = useCallback(() => editor.redo(), [editor]);

  // --- Keyboard shortcuts ---
  const shortcuts = useMemo(
    () => [
      {
        key: "enter",
        ctrlOrMeta: true,
        allowInInput: true,
        handler: (e: KeyboardEvent) => {
          e.preventDefault();
          void handleGenerate();
        },
      },
      {
        key: "z",
        ctrlOrMeta: true,
        allowInInput: true,
        handler: (e: KeyboardEvent) => {
          e.preventDefault();
          editor.undo();
        },
      },
      {
        key: "z",
        ctrlOrMeta: true,
        shift: true,
        allowInInput: true,
        handler: (e: KeyboardEvent) => {
          e.preventDefault();
          editor.redo();
        },
      },
      {
        key: " ",
        handler: (e: KeyboardEvent) => {
          if (!isClient) return;
          e.preventDefault();
          if (speech.status === "speaking") speech.pause();
          else if (speech.status === "paused") speech.resume();
        },
      },
      {
        key: "escape",
        handler: () => speech.cancel(),
      },
    ],
    [handleGenerate, editor, isClient, speech]
  );
  useKeyboardShortcuts(shortcuts);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      {/* Left: editor + output */}
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AudioLines className="h-5 w-5 text-primary" /> Text
            </CardTitle>
            <Badge variant="secondary" className="gap-1">
              <Keyboard className="h-3 w-3" /> Ctrl/⌘ + Enter to generate
            </Badge>
          </CardHeader>
          <CardContent>
            <TextEditor
              value={editor.value}
              onChange={editor.set}
              onUndo={handleUndo}
              onRedo={handleRedo}
              canUndo={editor.canUndo}
              canRedo={editor.canRedo}
              maxChars={meta.maxChars}
              disabled={generating}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" /> Output
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="lg"
                onClick={handleGenerate}
                disabled={generating || !editor.value.trim() || (isClient && !speech.supported)}
                className="min-w-40"
              >
                {generating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Generating…
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" /> Generate speech
                  </>
                )}
              </Button>

              {isClient && speech.status !== "idle" && (
                <>
                  {speech.status === "speaking" ? (
                    <Button variant="secondary" size="lg" onClick={speech.pause}>
                      <Pause className="h-5 w-5" /> Pause
                    </Button>
                  ) : (
                    <Button variant="secondary" size="lg" onClick={speech.resume}>
                      <Play className="h-5 w-5" /> Resume
                    </Button>
                  )}
                  <Button variant="outline" size="lg" onClick={speech.cancel}>
                    <Square className="h-4 w-4" /> Stop
                  </Button>
                </>
              )}
            </div>

            {/* Client playback progress */}
            {isClient && speech.status !== "idle" && (
              <div className="space-y-2" aria-live="polite">
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary transition-[width] duration-200"
                    style={{ width: `${Math.round(speech.progress * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {speech.status === "paused" ? "Paused" : "Speaking"} · {selectedVoice?.name}
                </p>
              </div>
            )}

            {/* Server audio result */}
            {!isClient && output && (
              <AudioPlayer src={output.url} blob={output.blob} filename={output.filename} />
            )}

            {/* Empty state */}
            {!isClient && !output && !generating && (
              <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-10 text-center">
                <AudioLines className="h-8 w-8 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  Generated audio will appear here, ready to play and download.
                </p>
              </div>
            )}

            {isClient && (
              <p className="text-xs text-muted-foreground">
                Browser voices play instantly and privately. To export downloadable
                audio files, switch to a cloud provider in the panel.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right: voice panel */}
      <aside className="lg:sticky lg:top-20 lg:h-fit">
        <Card>
          <CardHeader>
            <CardTitle>Voice &amp; settings</CardTitle>
          </CardHeader>
          <CardContent>
            <VoicePanel
              provider={provider}
              onProviderChange={setProvider}
              voices={voices}
              voicesLoading={isClient ? !speech.supported && voices.length === 0 : voicesLoading}
              selectedVoiceId={selectedVoiceId}
              onSelectVoice={selectVoice}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              settings={settings}
              onSettingsChange={updateSettings}
              onPreview={handlePreview}
              previewingId={previewingId}
            />
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
