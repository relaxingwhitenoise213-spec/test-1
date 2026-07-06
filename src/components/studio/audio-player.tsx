"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Play,
  Pause,
  Download,
  Repeat,
  Share2,
  Volume2,
  VolumeX,
  Gauge,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDuration, downloadBlob, cn } from "@/lib/utils";

interface AudioPlayerProps {
  src: string;
  blob: Blob;
  filename: string;
}

const SPEEDS = [0.75, 1, 1.25, 1.5, 2];
/** Static bar heights for a decorative waveform (deterministic, SSR-safe). */
const BARS = Array.from({ length: 56 }, (_, i) =>
  0.35 + Math.abs(Math.sin(i * 0.7) * 0.55 + Math.cos(i * 1.9) * 0.25)
);

export function AudioPlayer({ src, blob, filename }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [loop, setLoop] = useState(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setCurrent(audio.currentTime);
    const onMeta = () => setDuration(audio.duration || 0);
    const onEnd = () => setPlaying(false);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnd);
    };
  }, [src]);

  const progress = duration ? current / duration : 0;

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      void audio.play();
      setPlaying(true);
    }
  };

  const seekTo = (ratio: number) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    audio.currentTime = ratio * duration;
    setCurrent(audio.currentTime);
  };

  const cycleSpeed = () => {
    const next = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length];
    setSpeed(next);
    if (audioRef.current) audioRef.current.playbackRate = next;
  };

  const handleShare = async () => {
    try {
      const file = new File([blob], filename, { type: blob.type });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: filename });
        return;
      }
      await navigator.clipboard.writeText(filename);
      toast.success("Filename copied", {
        description: "Sharing files isn't supported in this browser.",
      });
    } catch {
      /* user cancelled */
    }
  };

  const activeBar = useMemo(
    () => Math.floor(progress * BARS.length),
    [progress]
  );

  return (
    <div className="space-y-4">
      <audio ref={audioRef} src={src} loop={loop} muted={muted} preload="metadata" />

      {/* Waveform / seek */}
      <button
        type="button"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          seekTo((e.clientX - rect.left) / rect.width);
        }}
        className="flex h-20 w-full items-center gap-0.5 rounded-md border bg-secondary/30 px-3"
        aria-label="Seek"
      >
        {BARS.map((h, i) => (
          <span
            key={i}
            className={cn(
              "flex-1 rounded-full transition-colors",
              i <= activeBar ? "bg-primary" : "bg-muted-foreground/25"
            )}
            style={{ height: `${h * 60}%` }}
          />
        ))}
      </button>

      <div className="flex items-center justify-between text-xs tabular-nums text-muted-foreground">
        <span>{formatDuration(current)}</span>
        <span>{formatDuration(duration)}</span>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <Button size="icon" onClick={toggle} aria-label={playing ? "Pause" : "Play"}>
            {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMuted((m) => !m)}
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>
          <Button
            variant={loop ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setLoop((l) => !l)}
            aria-label="Toggle loop"
            aria-pressed={loop}
          >
            <Repeat className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" onClick={cycleSpeed} aria-label="Playback speed">
            <Gauge className="h-4 w-4" /> {speed}×
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4" /> Share
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              downloadBlob(blob, filename);
              toast.success("Download started");
            }}
          >
            <Download className="h-4 w-4" /> Download
          </Button>
        </div>
      </div>
    </div>
  );
}
