"use client";

import { useCallback, useRef, useState } from "react";

interface UndoState<T> {
  past: T[];
  present: T;
  future: T[];
}

/**
 * Undo/redo state container. New values are coalesced if they arrive within
 * `coalesceMs` of the previous change (so typing produces sensible undo steps).
 */
export function useUndo<T>(initial: T, coalesceMs = 600) {
  const [state, setState] = useState<UndoState<T>>({
    past: [],
    present: initial,
    future: [],
  });
  const lastChange = useRef<number>(0);

  const set = useCallback(
    (value: T) => {
      setState((s) => {
        if (Object.is(value, s.present)) return s;
        const now = Date.now();
        const coalesce = now - lastChange.current < coalesceMs && s.past.length > 0;
        lastChange.current = now;
        return {
          past: coalesce ? s.past : [...s.past, s.present].slice(-100),
          present: value,
          future: [],
        };
      });
    },
    [coalesceMs]
  );

  const undo = useCallback(() => {
    setState((s) => {
      if (!s.past.length) return s;
      const previous = s.past[s.past.length - 1];
      return {
        past: s.past.slice(0, -1),
        present: previous,
        future: [s.present, ...s.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState((s) => {
      if (!s.future.length) return s;
      const next = s.future[0];
      return {
        past: [...s.past, s.present],
        present: next,
        future: s.future.slice(1),
      };
    });
  }, []);

  /** Replace the value without recording history (e.g. hydration). */
  const reset = useCallback((value: T) => {
    setState({ past: [], present: value, future: [] });
  }, []);

  return {
    value: state.present,
    set,
    undo,
    redo,
    reset,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
  };
}
