"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SynthesisSettings, VoiceOption } from "@/lib/tts/types";

export type SpeechStatus = "idle" | "speaking" | "paused";

interface SpeakArgs {
  text: string;
  voiceId?: string;
  settings: Pick<SynthesisSettings, "rate" | "pitch" | "volume">;
  onEnd?: () => void;
}

interface UseSpeechSynthesis {
  supported: boolean;
  voices: VoiceOption[];
  status: SpeechStatus;
  /** 0–1 progress through the current utterance. */
  progress: number;
  speak: (args: SpeakArgs) => void;
  pause: () => void;
  resume: () => void;
  cancel: () => void;
}

function toVoiceOption(v: SpeechSynthesisVoice): VoiceOption {
  const name = v.name.toLowerCase();
  const gender: VoiceOption["gender"] = /female|woman|zira|samantha|victoria|karen|moira|tessa|fiona/.test(
    name
  )
    ? "female"
    : /male|man|david|daniel|alex|fred|thomas|rishi/.test(name)
    ? "male"
    : "neutral";
  return {
    id: v.voiceURI,
    name: v.name,
    lang: v.lang,
    gender,
    category: v.localService ? "On-device" : "Network",
    provider: "web-speech",
    local: v.localService,
  };
}

export function useSpeechSynthesis(): UseSpeechSynthesis {
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  const [status, setStatus] = useState<SpeechStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [supported, setSupported] = useState(false);

  const nativeVoices = useRef<SpeechSynthesisVoice[]>([]);
  const keepAlive = useRef<ReturnType<typeof setInterval> | null>(null);

  // Detect support and load voices (async on most browsers).
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    // Feature detection + subscribing to the browser's speech engine (external
    // system): the Web Speech API only exists on the client.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSupported(true);

    const load = () => {
      const list = window.speechSynthesis.getVoices();
      if (list.length) {
        nativeVoices.current = list;
        setVoices(list.map(toVoiceOption));
      }
    };
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", load);
      window.speechSynthesis.cancel();
      if (keepAlive.current) clearInterval(keepAlive.current);
    };
  }, []);

  const stopKeepAlive = useCallback(() => {
    if (keepAlive.current) {
      clearInterval(keepAlive.current);
      keepAlive.current = null;
    }
  }, []);

  const cancel = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    stopKeepAlive();
    setStatus("idle");
    setProgress(0);
  }, [supported, stopKeepAlive]);

  const speak = useCallback(
    ({ text, voiceId, settings, onEnd }: SpeakArgs) => {
      if (!supported || !text.trim()) return;
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      const match = nativeVoices.current.find((v) => v.voiceURI === voiceId);
      if (match) {
        utterance.voice = match;
        utterance.lang = match.lang;
      }
      utterance.rate = settings.rate;
      utterance.pitch = settings.pitch;
      utterance.volume = settings.volume;

      utterance.onstart = () => {
        setStatus("speaking");
        setProgress(0);
      };
      utterance.onboundary = (event) => {
        if (text.length > 0) {
          setProgress(Math.min(1, event.charIndex / text.length));
        }
      };
      utterance.onend = () => {
        stopKeepAlive();
        setStatus("idle");
        setProgress(1);
        onEnd?.();
      };
      utterance.onerror = () => {
        stopKeepAlive();
        setStatus("idle");
      };

      window.speechSynthesis.speak(utterance);

      // Chrome pauses long utterances (~15s) — nudge it to keep going.
      stopKeepAlive();
      keepAlive.current = setInterval(() => {
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }, 10_000);
    },
    [supported, stopKeepAlive]
  );

  const pause = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.pause();
    setStatus("paused");
  }, [supported]);

  const resume = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.resume();
    setStatus("speaking");
  }, [supported]);

  return { supported, voices, status, progress, speak, pause, resume, cancel };
}
