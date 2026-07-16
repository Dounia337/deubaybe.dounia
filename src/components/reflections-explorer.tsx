"use client";

import { useMemo, useState } from "react";
import { BookOpen, Search, X } from "lucide-react";
import { OverlayCard, EmptyState } from "@/components/ui/primitives";
import { RevealGroup, RevealItem } from "@/components/ui/motion";
import { cx, formatDate } from "@/lib/format";
import type { Reflection } from "@/db/repo";

export function ReflectionsExplorer({ reflections }: { reflections: Reflection[] }) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const tagsById = useMemo(
    () => new Map(reflections.map((r) => [r.id, JSON.parse(r.tags || "[]") as string[]])),
    [reflections]
  );

  const allTags = useMemo(() => {
    const set = new Set<string>();
    tagsById.forEach((tags) => tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [tagsById]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return reflections.filter((r) => {
      const matchesQuery = !q || r.title.toLowerCase().includes(q) || r.content.toLowerCase().includes(q);
      const matchesTag = !activeTag || (tagsById.get(r.id) ?? []).includes(activeTag);
      return matchesQuery && matchesTag;
    });
  }, [reflections, tagsById, query, activeTag]);

  return (
    <>
      <div className="mb-8 space-y-4">
        <div className="glass glass-field flex items-center gap-2.5 rounded-full px-4 py-2.5">
          <Search className="h-4 w-4 shrink-0 text-fg-subtle" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search reflections…"
            aria-label="Search reflections"
            className="w-full bg-transparent text-sm text-fg outline-none placeholder:text-fg-subtle"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="shrink-0 cursor-pointer text-fg-subtle transition-colors hover:text-fg"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {allTags.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setActiveTag((cur) => (cur === t ? null : t))}
                aria-pressed={activeTag === t}
                className={cx(
                  "cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  activeTag === t
                    ? "border-accent bg-accent text-bg-sunken"
                    : "border-border text-fg-muted hover:border-accent/40 hover:text-accent"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No reflections match"
          description="Try a different search term, or clear the tag filter."
        />
      ) : (
        <RevealGroup className="grid gap-5 sm:grid-cols-2">
          {filtered.map((r) => (
            <RevealItem key={r.id}>
              <OverlayCard
                href={`/reflections/${r.slug}`}
                src={r.image_url}
                alt={r.title}
                icon={<BookOpen />}
                title={r.title}
                tags={tagsById.get(r.id)}
                date={formatDate(r.post_date)}
              />
            </RevealItem>
          ))}
        </RevealGroup>
      )}
    </>
  );
}
