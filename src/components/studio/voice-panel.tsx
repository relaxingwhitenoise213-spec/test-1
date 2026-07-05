"use client";

import { useMemo, useState } from "react";
import { Search, Star, Play, Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PROVIDERS, PROVIDER_LIST } from "@/config/providers";
import type { ProviderId, SynthesisSettings, VoiceOption, AudioFormat } from "@/lib/tts/types";

interface VoicePanelProps {
  provider: ProviderId;
  onProviderChange: (id: ProviderId) => void;
  voices: VoiceOption[];
  voicesLoading: boolean;
  selectedVoiceId: string;
  onSelectVoice: (id: string) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  settings: SynthesisSettings;
  onSettingsChange: (patch: Partial<SynthesisSettings>) => void;
  onPreview: (voiceId: string) => void;
  previewingId: string | null;
}

export function VoicePanel(props: VoicePanelProps) {
  const {
    provider,
    onProviderChange,
    voices,
    voicesLoading,
    selectedVoiceId,
    onSelectVoice,
    favorites,
    onToggleFavorite,
    settings,
    onSettingsChange,
    onPreview,
    previewingId,
  } = props;

  const meta = PROVIDERS[provider];
  const [query, setQuery] = useState("");
  const [lang, setLang] = useState("all");
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const languages = useMemo(() => {
    const set = new Set(voices.map((v) => v.lang).filter(Boolean));
    return Array.from(set).sort();
  }, [voices]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return voices
      .filter((v) => (lang === "all" ? true : v.lang === lang))
      .filter((v) => (onlyFavorites ? favorites.includes(v.id) : true))
      .filter((v) =>
        q
          ? v.name.toLowerCase().includes(q) ||
            v.lang.toLowerCase().includes(q) ||
            (v.category ?? "").toLowerCase().includes(q)
          : true
      );
  }, [voices, query, lang, onlyFavorites, favorites]);

  return (
    <div className="flex flex-col gap-5">
      {/* Provider */}
      <div className="space-y-2">
        <Label htmlFor="provider">Provider</Label>
        <Select
          id="provider"
          value={provider}
          onChange={(e) => onProviderChange(e.target.value as ProviderId)}
        >
          {PROVIDER_LIST.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
              {p.kind === "server" ? " (API key)" : ""}
            </option>
          ))}
        </Select>
        <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {meta.description}
        </p>
      </div>

      {/* Voice search & filters */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Voice</Label>
          <button
            type="button"
            onClick={() => setOnlyFavorites((v) => !v)}
            className={cn(
              "inline-flex items-center gap-1 text-xs font-medium transition-colors",
              onlyFavorites ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Star className={cn("h-3.5 w-3.5", onlyFavorites && "fill-current")} />
            Favorites
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="relative col-span-2 sm:col-span-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search voices…"
              className="pl-9"
              aria-label="Search voices"
            />
          </div>
          <Select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            aria-label="Filter by language"
            className="col-span-2 sm:col-span-1"
          >
            <option value="all">All languages</option>
            {languages.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </Select>
        </div>

        {/* Voice list */}
        <div
          className="max-h-64 space-y-1 overflow-y-auto rounded-md border p-1"
          role="listbox"
          aria-label="Available voices"
        >
          {voicesLoading ? (
            <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading voices…
            </div>
          ) : filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No voices match your filters.
            </p>
          ) : (
            filtered.map((voice) => {
              const active = voice.id === selectedVoiceId;
              const fav = favorites.includes(voice.id);
              return (
                <div
                  key={voice.id}
                  role="option"
                  aria-selected={active}
                  onClick={() => onSelectVoice(voice.id)}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-sm transition-colors",
                    active ? "bg-accent text-accent-foreground" : "hover:bg-secondary"
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-medium">{voice.name}</span>
                      {voice.gender && voice.gender !== "neutral" && (
                        <Badge variant="secondary" className="capitalize">
                          {voice.gender}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {voice.lang}
                      {voice.category ? ` · ${voice.category}` : ""}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    aria-label={`Preview ${voice.name}`}
                    title="Preview voice"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPreview(voice.id);
                    }}
                  >
                    {previewingId === voice.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    aria-label={fav ? `Remove ${voice.name} from favorites` : `Add ${voice.name} to favorites`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(voice.id);
                    }}
                  >
                    <Star
                      className={cn(
                        "h-4 w-4",
                        fav ? "fill-primary text-primary" : "text-muted-foreground"
                      )}
                    />
                  </Button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Synthesis controls */}
      <div className="space-y-4">
        {meta.supports.rate && (
          <SliderRow
            label="Speed"
            value={settings.rate}
            min={0.5}
            max={2}
            step={0.05}
            format={(v) => `${v.toFixed(2)}×`}
            onChange={(rate) => onSettingsChange({ rate })}
          />
        )}
        {meta.supports.pitch && (
          <SliderRow
            label="Pitch"
            value={settings.pitch}
            min={0}
            max={2}
            step={0.1}
            format={(v) => v.toFixed(1)}
            onChange={(pitch) => onSettingsChange({ pitch })}
          />
        )}
        {meta.supports.volume && (
          <SliderRow
            label="Volume"
            value={settings.volume}
            min={0}
            max={1}
            step={0.05}
            format={(v) => `${Math.round(v * 100)}%`}
            onChange={(volume) => onSettingsChange({ volume })}
          />
        )}
        {meta.supports.stability && (
          <SliderRow
            label="Stability"
            value={settings.stability ?? 0.5}
            min={0}
            max={1}
            step={0.05}
            format={(v) => `${Math.round(v * 100)}%`}
            onChange={(stability) => onSettingsChange({ stability })}
          />
        )}
        {meta.supports.similarity && (
          <SliderRow
            label="Similarity"
            value={settings.similarity ?? 0.75}
            min={0}
            max={1}
            step={0.05}
            format={(v) => `${Math.round(v * 100)}%`}
            onChange={(similarity) => onSettingsChange({ similarity })}
          />
        )}

        {meta.downloadable && meta.formats.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="format">Export format</Label>
            <Select
              id="format"
              value={settings.format ?? "mp3"}
              onChange={(e) =>
                onSettingsChange({ format: e.target.value as AudioFormat })
              }
            >
              {meta.formats.map((f) => (
                <option key={f} value={f}>
                  {f.toUpperCase()}
                </option>
              ))}
            </Select>
          </div>
        )}
      </div>
    </div>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <span className="text-xs font-medium tabular-nums text-muted-foreground">
          {format(value)}
        </span>
      </div>
      <Slider
        value={value}
        min={min}
        max={max}
        step={step}
        onValueChange={onChange}
        aria-label={label}
      />
    </div>
  );
}
