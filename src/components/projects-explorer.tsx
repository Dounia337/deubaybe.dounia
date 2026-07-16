"use client";

import { useMemo, useState } from "react";
import { FolderGit2, Search, X } from "lucide-react";
import { OverlayCard, EmptyState } from "@/components/ui/primitives";
import { RevealGroup, RevealItem } from "@/components/ui/motion";
import { cx } from "@/lib/format";
import type { Project } from "@/db/repo";

export function ProjectsExplorer({ projects }: { projects: Project[] }) {
  const [query, setQuery] = useState("");
  const [activeTech, setActiveTech] = useState<string | null>(null);

  const stacks = useMemo(
    () => new Map(projects.map((p) => [p.id, JSON.parse(p.tech_stack || "[]") as string[]])),
    [projects]
  );

  const allTech = useMemo(() => {
    const set = new Set<string>();
    stacks.forEach((stack) => stack.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [stacks]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      const matchesQuery = !q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      const matchesTech = !activeTech || (stacks.get(p.id) ?? []).includes(activeTech);
      return matchesQuery && matchesTech;
    });
  }, [projects, stacks, query, activeTech]);

  return (
    <>
      <div className="mb-8 space-y-4">
        <div className="glass glass-field flex items-center gap-2.5 rounded-full px-4 py-2.5">
          <Search className="h-4 w-4 shrink-0 text-fg-subtle" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects…"
            aria-label="Search projects"
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

        {allTech.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {allTech.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setActiveTech((cur) => (cur === t ? null : t))}
                aria-pressed={activeTech === t}
                className={cx(
                  "cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  activeTech === t
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
          title="No projects match"
          description="Try a different search term, or clear the technology filter."
        />
      ) : (
        <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <RevealItem key={p.id}>
              <OverlayCard
                href={`/projects/${p.slug}`}
                src={p.image_url}
                alt={p.title}
                icon={<FolderGit2 />}
                title={p.title}
                tags={stacks.get(p.id)}
                githubUrl={p.github_url}
                demoUrl={p.demo_url}
              />
            </RevealItem>
          ))}
        </RevealGroup>
      )}
    </>
  );
}
