"use client";

import { useEffect } from "react";

export interface Shortcut {
  /** Lowercase key, e.g. "enter", "k". */
  key: string;
  ctrlOrMeta?: boolean;
  shift?: boolean;
  handler: (event: KeyboardEvent) => void;
  /** Allow firing even while typing in an input/textarea. */
  allowInInput?: boolean;
}

/** Global keyboard-shortcut registration. */
export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const inField =
        !!target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      for (const s of shortcuts) {
        if (event.key.toLowerCase() !== s.key.toLowerCase()) continue;
        if (!!s.ctrlOrMeta !== (event.ctrlKey || event.metaKey)) continue;
        if (!!s.shift !== event.shiftKey) continue;
        if (inField && !s.allowInInput) continue;
        s.handler(event);
        return;
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [shortcuts]);
}
