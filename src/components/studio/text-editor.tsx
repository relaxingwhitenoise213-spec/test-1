"use client";

import { useRef } from "react";
import { toast } from "sonner";
import {
  Clipboard,
  Copy,
  Eraser,
  Redo2,
  Undo2,
  Type,
  Hash,
  AlignLeft,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StatPill } from "@/components/studio/stat-pill";
import { analyzeText } from "@/lib/text-stats";
import { formatDuration, cn } from "@/lib/utils";

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  maxChars: number;
  disabled?: boolean;
}

export function TextEditor({
  value,
  onChange,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  maxChars,
  disabled,
}: TextEditorProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const stats = analyzeText(value);
  const overLimit = stats.characters > maxChars;

  const handleCopy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Clipboard access was blocked");
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onChange(value ? `${value} ${text}` : text);
        toast.success("Pasted from clipboard");
      }
    } catch {
      toast.error("Clipboard access was blocked");
    }
  };

  const handleClear = () => {
    if (!value) return;
    onChange("");
    ref.current?.focus();
    toast("Text cleared", { description: "Press Ctrl/⌘ + Z to undo." });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Undo"
            title="Undo (Ctrl/⌘+Z)"
            onClick={onUndo}
            disabled={!canUndo}
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Redo"
            title="Redo (Ctrl/⌘+Shift+Z)"
            onClick={onRedo}
            disabled={!canRedo}
          >
            <Redo2 className="h-4 w-4" />
          </Button>
          <span className="mx-1 h-5 w-px bg-border" aria-hidden />
          <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!value}>
            <Copy className="h-4 w-4" /> Copy
          </Button>
          <Button variant="ghost" size="sm" onClick={handlePaste}>
            <Clipboard className="h-4 w-4" /> Paste
          </Button>
          <Button variant="ghost" size="sm" onClick={handleClear} disabled={!value}>
            <Eraser className="h-4 w-4" /> Clear
          </Button>
        </div>
        <span
          className={cn(
            "text-xs tabular-nums",
            overLimit ? "font-semibold text-destructive" : "text-muted-foreground"
          )}
          aria-live="polite"
        >
          {stats.characters.toLocaleString()} / {maxChars.toLocaleString()}
        </span>
      </div>

      <Textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-label="Text to convert to speech"
        aria-invalid={overLimit}
        placeholder="Type or paste the text you want to turn into speech…"
        className={cn(
          "min-h-[240px] text-base",
          overLimit && "border-destructive focus-visible:ring-destructive"
        )}
      />

      <div className="flex flex-wrap gap-2">
        <StatPill icon={Type} label="words" value={stats.words.toLocaleString()} />
        <StatPill icon={Hash} label="characters" value={stats.charactersNoSpaces.toLocaleString()} />
        <StatPill icon={AlignLeft} label="sentences" value={stats.sentences.toLocaleString()} />
        <StatPill
          icon={Clock}
          label="est. duration"
          value={formatDuration(stats.estimatedSeconds)}
        />
      </div>
    </div>
  );
}
