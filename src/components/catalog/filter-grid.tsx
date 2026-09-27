"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type FilterItem = {
  id: string;
  group: string;
  /** Lower-cased text the search box matches against (name, code, formats). */
  search: string;
  card: React.ReactNode;
};

/**
 * Filterable card grid. Every card is server-rendered (crawlers and no-JS
 * visitors see the full list); filtering only hides cards on the client.
 * State lives in the URL (?range=…&q=…) via history.replaceState, so a
 * filtered view can be shared — read on mount, never via useSearchParams,
 * so the page stays statically rendered.
 */
export function FilterGrid({
  items,
  groups,
  labels,
  className,
}: {
  items: FilterItem[];
  groups: { id: string; label: string }[];
  labels: {
    filter: string;
    all: string;
    search: string;
    searchPlaceholder: string;
    clear: string;
    noResults: string;
    /** Pre-rendered "N results" label per count (index = count); functions can't cross the server/client boundary. */
    results: string[];
  };
  className?: string;
}) {
  const [group, setGroup] = useState("");
  const [query, setQuery] = useState("");
  const searchId = useId();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("range") ?? "";
    // Deferred so hydration matches the server HTML (unfiltered) first.
    queueMicrotask(() => {
      if (groups.some((g) => g.id === fromUrl)) setGroup(fromUrl);
      setQuery((params.get("q") ?? "").slice(0, 60));
    });
  }, [groups]);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (group) url.searchParams.set("range", group);
    else url.searchParams.delete("range");
    if (query.trim()) url.searchParams.set("q", query.trim());
    else url.searchParams.delete("q");
    if (url.href !== window.location.href) window.history.replaceState(window.history.state, "", url);
  }, [group, query]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return new Set(
      items
        .filter((item) => (!group || item.group === group) && (!q || item.search.includes(q)))
        .map((item) => item.id)
    );
  }, [items, group, query]);

  const filtered = Boolean(group || query.trim());
  const chip = (active: boolean) =>
    cn(
      "cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
      active
        ? "border-accent bg-accent text-accent-foreground"
        : "border-border bg-card text-muted-foreground hover:border-accent/60 hover:text-foreground"
    );

  return (
    <div className={className}>
      <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label={labels.filter} className="flex flex-wrap gap-2">
          <button type="button" aria-pressed={!group} onClick={() => setGroup("")} className={chip(!group)}>
            {labels.all}
          </button>
          {groups.map((g) => (
            <button
              key={g.id}
              type="button"
              aria-pressed={group === g.id}
              onClick={() => setGroup(group === g.id ? "" : g.id)}
              className={chip(group === g.id)}
            >
              {g.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <label htmlFor={searchId} className="sr-only">
            {labels.search}
          </label>
          <div className="relative w-full lg:w-64">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              id={searchId}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value.slice(0, 60))}
              placeholder={labels.searchPlaceholder}
              className="h-9 w-full rounded-lg border border-input bg-transparent pr-3 pl-8 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
          {filtered && (
            <button
              type="button"
              onClick={() => {
                setGroup("");
                setQuery("");
              }}
              className="inline-flex shrink-0 cursor-pointer items-center gap-1 text-xs font-medium text-accent hover:underline"
            >
              <X className="size-3.5" aria-hidden="true" />
              {labels.clear}
            </button>
          )}
        </div>
      </div>

      <p aria-live="polite" className="mt-3 text-xs text-muted-foreground">
        {labels.results[visible.size] ?? visible.size}
      </p>

      <ul className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.id} hidden={!visible.has(item.id)} className="flex">
            {item.card}
          </li>
        ))}
      </ul>

      {visible.size === 0 && (
        <p className="mt-6 rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          {labels.noResults}
        </p>
      )}
    </div>
  );
}
