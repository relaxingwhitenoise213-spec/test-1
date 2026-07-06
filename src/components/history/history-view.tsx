"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Search,
  Star,
  Trash2,
  Pencil,
  Check,
  X,
  ExternalLink,
  Inbox,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useHistory } from "@/hooks/use-history";
import { useDebounce } from "@/hooks/use-debounce";
import { PROVIDERS } from "@/config/providers";
import { formatDuration, formatRelativeTime, cn } from "@/lib/utils";
import type { HistoryFilter, SortKey } from "@/types";

const PAGE_SIZE = 8;

export function HistoryView() {
  const { records, remove, toggleFavorite, rename, clear } = useHistory();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<HistoryFilter>("all");
  const [sort, setSort] = useState<SortKey>("newest");
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState("");

  const debouncedQuery = useDebounce(query, 200);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    const list = records
      .filter((r) => (filter === "favorites" ? r.favorite : true))
      .filter((r) =>
        q ? r.title.toLowerCase().includes(q) || r.text.toLowerCase().includes(q) : true
      );

    const sorted = [...list];
    switch (sort) {
      case "oldest":
        sorted.sort((a, b) => a.createdAt - b.createdAt);
        break;
      case "longest":
        sorted.sort((a, b) => b.characters - a.characters);
        break;
      case "shortest":
        sorted.sort((a, b) => a.characters - b.characters);
        break;
      case "title":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        sorted.sort((a, b) => b.createdAt - a.createdAt);
    }
    return sorted;
  }, [records, debouncedQuery, filter, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const startRename = (id: string, title: string) => {
    setEditingId(id);
    setDraftTitle(title);
  };
  const commitRename = () => {
    if (editingId) {
      rename(editingId, draftTitle);
      toast.success("Renamed");
    }
    setEditingId(null);
  };

  const loadInStudio = (text: string) => {
    try {
      window.localStorage.setItem("vocalis.draft.v1", JSON.stringify(text));
    } catch {
      /* ignore */
    }
    toast.success("Loaded into Studio");
    router.push("/");
  };

  if (records.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
          <Inbox className="h-10 w-10 text-muted-foreground/40" />
          <h2 className="text-lg font-semibold">No history yet</h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            Every generation you create is saved here automatically, so you can
            search, favorite, rename and re-use it later.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search history…"
            className="pl-9"
            aria-label="Search history"
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value as HistoryFilter);
              setPage(1);
            }}
            aria-label="Filter"
            className="w-36"
          >
            <option value="all">All</option>
            <option value="favorites">Favorites</option>
          </Select>
          <Select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            aria-label="Sort by"
            className="w-40"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="longest">Longest</option>
            <option value="shortest">Shortest</option>
            <option value="title">Title A–Z</option>
          </Select>
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            No results match your filters.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {pageItems.map((r) => (
            <Card key={r.id} className="transition-colors hover:border-primary/40">
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start">
                <div className="min-w-0 flex-1">
                  {editingId === r.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={draftTitle}
                        onChange={(e) => setDraftTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") commitRename();
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        autoFocus
                        className="h-9"
                        aria-label="Edit title"
                      />
                      <Button size="icon" className="h-9 w-9" onClick={commitRename} aria-label="Save">
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => setEditingId(null)}
                        aria-label="Cancel"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {r.favorite && (
                        <Star className="h-4 w-4 shrink-0 fill-primary text-primary" />
                      )}
                      <h3 className="truncate font-medium">{r.title}</h3>
                    </div>
                  )}
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{r.text}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary">{PROVIDERS[r.provider].label}</Badge>
                    <span>{r.voiceName}</span>
                    <span aria-hidden>·</span>
                    <span>{r.lang}</span>
                    <span aria-hidden>·</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {formatDuration(r.durationSeconds)}
                    </span>
                    <span aria-hidden>·</span>
                    <span>{r.characters.toLocaleString()} chars</span>
                    <span aria-hidden>·</span>
                    <span>{formatRelativeTime(r.createdAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 self-start">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => loadInStudio(r.text)}
                    aria-label="Load in Studio"
                    title="Load in Studio"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => toggleFavorite(r.id)}
                    aria-label={r.favorite ? "Unfavorite" : "Favorite"}
                  >
                    <Star className={cn("h-4 w-4", r.favorite && "fill-primary text-primary")} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => startRename(r.id, r.title)}
                    aria-label="Rename"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-destructive hover:text-destructive"
                    onClick={() => {
                      remove(r.id);
                      toast.success("Deleted");
                    }}
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Footer: pagination + clear */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={() => {
            if (confirm("Delete all history? This cannot be undone.")) {
              clear();
              toast.success("History cleared");
            }
          }}
        >
          <Trash2 className="h-4 w-4" /> Clear all
        </Button>

        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
