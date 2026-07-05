"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { GenerationRecord } from "@/types";

const STORAGE_KEY = "vocalis.history.v1";
const MAX_RECORDS = 500;

interface HistoryContextValue {
  records: GenerationRecord[];
  add: (record: GenerationRecord) => void;
  remove: (id: string) => void;
  clear: () => void;
  toggleFavorite: (id: string) => void;
  rename: (id: string, title: string) => void;
}

const HistoryContext = createContext<HistoryContextValue | null>(null);

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useLocalStorage<GenerationRecord[]>(
    STORAGE_KEY,
    []
  );

  const add = useCallback(
    (record: GenerationRecord) => {
      setRecords((prev) => [record, ...prev].slice(0, MAX_RECORDS));
    },
    [setRecords]
  );

  const remove = useCallback(
    (id: string) => setRecords((prev) => prev.filter((r) => r.id !== id)),
    [setRecords]
  );

  const clear = useCallback(() => setRecords([]), [setRecords]);

  const toggleFavorite = useCallback(
    (id: string) =>
      setRecords((prev) =>
        prev.map((r) => (r.id === id ? { ...r, favorite: !r.favorite } : r))
      ),
    [setRecords]
  );

  const rename = useCallback(
    (id: string, title: string) =>
      setRecords((prev) =>
        prev.map((r) => (r.id === id ? { ...r, title: title.trim() || r.title } : r))
      ),
    [setRecords]
  );

  const value = useMemo(
    () => ({ records, add, remove, clear, toggleFavorite, rename }),
    [records, add, remove, clear, toggleFavorite, rename]
  );

  return (
    <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>
  );
}

export function useHistory(): HistoryContextValue {
  const ctx = useContext(HistoryContext);
  if (!ctx) throw new Error("useHistory must be used within a HistoryProvider");
  return ctx;
}
