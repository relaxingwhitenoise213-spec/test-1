"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Persisted state backed by localStorage, SSR-safe and synced across tabs.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [stored, setStored] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  // Read once on mount (avoids hydration mismatch).
  // Hydrate from the external localStorage system after mount. Reading during
  // render would cause an SSR/client hydration mismatch.
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (item !== null) setStored(JSON.parse(item) as T);
    } catch {
      /* ignore malformed storage */
    }
    setHydrated(true);
  }, [key]);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStored((prev) => {
        const next =
          typeof value === "function" ? (value as (p: T) => T)(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch {
          /* quota or unavailable */
        }
        return next;
      });
    },
    [key]
  );

  // Cross-tab synchronisation.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStored(JSON.parse(e.newValue) as T);
        } catch {
          /* ignore */
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key]);

  // Expose hydration through a stable tuple shape while keeping the API simple.
  void hydrated;
  return [stored, setValue];
}
