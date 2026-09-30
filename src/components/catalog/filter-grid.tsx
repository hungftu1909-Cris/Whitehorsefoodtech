"use client";

import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export type QuickViewDetail = {
  title: string;
  /** Short line under the title (family, descriptor). */
  kicker?: string;
  content: React.ReactNode;
};

export type FilterItem = {
  id: string;
  group: string;
  /** Lower-cased text the search box matches against (name, code, formats), EN + VI. */
  search: string;
  card: React.ReactNode;
  /** Server-rendered quick-view panel content; mounted only when opened. */
  detail?: QuickViewDetail;
};

// ---------------------------------------------------------------- quick view

type QuickViewApi = { open: (id: string, trigger: HTMLElement | null) => void; has: (id: string) => boolean };
const QuickViewContext = createContext<QuickViewApi | null>(null);
const VIEW_KEY = "view";

/**
 * Reusable quick-view host: a side panel on desktop, a full-width dialog on
 * phones (Base UI dialog: focus trap, Escape to close, focus returns to the
 * card's trigger). The open item lives in the URL (?view=<id>) through
 * history.replaceState, so a view can be shared and Back still leaves the
 * page instead of toggling panels; filters and scroll stay where they were.
 */
export function QuickViewHost({
  items,
  closeLabel,
  children,
}: {
  items: Pick<FilterItem, "id" | "detail">[];
  closeLabel: string;
  children: React.ReactNode;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const details = useMemo(() => new Map(items.filter((i) => i.detail).map((i) => [i.id, i.detail!])), [items]);

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get(VIEW_KEY);
    if (fromUrl && details.has(fromUrl)) queueMicrotask(() => setOpenId(fromUrl));
  }, [details]);

  const syncUrl = (id: string | null) => {
    const url = new URL(window.location.href);
    if (id) url.searchParams.set(VIEW_KEY, id);
    else url.searchParams.delete(VIEW_KEY);
    if (url.href !== window.location.href) window.history.replaceState(window.history.state, "", url);
  };

  const api = useMemo<QuickViewApi>(
    () => ({
      open: (id, el) => {
        trigger.current = el;
        setOpenId(id);
        syncUrl(id);
      },
      has: (id) => details.has(id),
    }),
    [details]
  );

  const detail = openId ? details.get(openId) : undefined;

  return (
    <QuickViewContext.Provider value={api}>
      {children}
      <Sheet
        open={Boolean(detail)}
        onOpenChange={(next) => {
          if (!next) {
            setOpenId(null);
            syncUrl(null);
          }
        }}
      >
        {detail && (
          <SheetContent
            side="right"
            finalFocus={trigger}
            closeLabel={closeLabel}
            className="w-full gap-0 overflow-y-auto data-[side=right]:w-full data-[side=right]:sm:max-w-xl"
          >
            <SheetHeader className="border-b border-border px-6 pt-6 pb-5 pr-14">
              {detail.kicker && <SheetDescription className="text-xs font-medium tracking-[0.16em] text-accent uppercase">{detail.kicker}</SheetDescription>}
              <SheetTitle className="font-serif text-2xl leading-tight font-medium text-foreground">{detail.title}</SheetTitle>
            </SheetHeader>
            <div className="px-6 py-6">{detail.content}</div>
          </SheetContent>
        )}
      </Sheet>
    </QuickViewContext.Provider>
  );
}

/** Opens the item's quick view; renders nothing outside a QuickViewHost. */
export function QuickViewButton({
  id,
  label,
  srLabel,
  className,
}: {
  id: string;
  label: string;
  /** Appended for screen readers, e.g. the range name. */
  srLabel?: string;
  className?: string;
}) {
  const api = useContext(QuickViewContext);
  if (!api?.has(id)) return null;
  return (
    <button
      type="button"
      onClick={(e) => api.open(id, e.currentTarget)}
      aria-haspopup="dialog"
      className={cn(
        "inline-flex min-h-11 cursor-pointer items-center rounded-sm border border-foreground/20 px-4 text-sm font-medium text-foreground transition-colors duration-200 hover:border-foreground/50 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none",
        className
      )}
    >
      {label}
      {srLabel && <span className="sr-only">: {srLabel}</span>}
    </button>
  );
}

// ---------------------------------------------------------------- grid

/**
 * Filterable card grid. Every card is server-rendered (crawlers and no-JS
 * visitors see the full list); filtering only hides cards on the client.
 * State lives in the URL (?family=…&q=…&view=…) via history.replaceState,
 * so a filtered view can be shared — read on mount, never via
 * useSearchParams, so the page stays statically rendered.
 */
export function FilterGrid({
  items,
  groups,
  labels,
  queryKey = "range",
  className,
  empty,
}: {
  items: FilterItem[];
  groups: { id: string; label: string; count?: number }[];
  labels: {
    filter: string;
    all: string;
    search: string;
    searchPlaceholder: string;
    clear: string;
    noResults: string;
    /** Pre-rendered "N results" label per count (index = count); functions can't cross the server/client boundary. */
    results: string[];
    emptyHint?: string;
    close?: string;
  };
  /** URL key for the selected group; family explorers use `family`. */
  queryKey?: string;
  className?: string;
  /** Extra action in the empty state (e.g. brief another ingredient). */
  empty?: React.ReactNode;
}) {
  const [group, setGroup] = useState("");
  const [query, setQuery] = useState("");
  const searchId = useId();
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get(queryKey) ?? "";
    // Deferred so hydration matches the server HTML (unfiltered) first.
    queueMicrotask(() => {
      if (groups.some((g) => g.id === fromUrl)) setGroup(fromUrl);
      setQuery((params.get("q") ?? "").slice(0, 60));
    });
  }, [groups, queryKey]);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (group) url.searchParams.set(queryKey, group);
    else url.searchParams.delete(queryKey);
    if (query.trim()) url.searchParams.set("q", query.trim());
    else url.searchParams.delete("q");
    if (url.href !== window.location.href) window.history.replaceState(window.history.state, "", url);
  }, [group, query, queryKey]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return new Set(
      items
        .filter((item) => (!group || item.group === group) && (!q || item.search.includes(q)))
        .map((item) => item.id)
    );
  }, [items, group, query]);

  const filtered = Boolean(group || query.trim());
  const reset = useCallback(() => {
    setGroup("");
    setQuery("");
    searchRef.current?.focus();
  }, []);
  const chip = (active: boolean) =>
    cn(
      "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors duration-200 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none",
      active
        ? "border-primary bg-primary text-primary-foreground"
        : "border-border bg-card text-foreground/80 hover:border-foreground/40 hover:text-foreground"
    );

  return (
    <QuickViewHost items={items} closeLabel={labels.close ?? ""}>
      <div className={className}>
        {/* Row 1: families (one line on desktop, a scroll row on phones).
            Row 2: search, live result count and reset. */}
        <div role="group" aria-label={labels.filter} className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:flex-wrap lg:overflow-visible lg:pb-0">
          <button type="button" aria-pressed={!group} onClick={() => setGroup("")} className={cn(chip(!group), "shrink-0")}>
            {labels.all}
          </button>
          {groups.map((g) => (
            <button
              key={g.id}
              type="button"
              aria-pressed={group === g.id}
              onClick={() => setGroup(group === g.id ? "" : g.id)}
              className={cn(chip(group === g.id), "shrink-0")}
            >
              {g.label}
              {g.count !== undefined && (
                <span className={cn("tabular-nums", group === g.id ? "text-primary-foreground/75" : "text-muted-foreground")}>{g.count}</span>
              )}
            </button>
          ))}
        </div>

        <div className="mt-3 flex flex-col gap-2 border-b border-border pb-3 sm:flex-row sm:items-center sm:gap-5">
          <div className="relative w-full sm:w-80">
            <label htmlFor={searchId} className="sr-only">
              {labels.search}
            </label>
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              ref={searchRef}
              id={searchId}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value.slice(0, 60))}
              placeholder={labels.searchPlaceholder}
              className="h-11 w-full rounded-sm border border-input bg-card pr-3 pl-9 text-[0.9375rem] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
          <div className="flex min-h-11 flex-1 items-center justify-between gap-4">
            <p aria-live="polite" className="text-sm text-muted-foreground">
              {labels.results[visible.size] ?? visible.size}
            </p>
            {filtered && (
              <button
                type="button"
                onClick={reset}
                className="inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-1.5 rounded-sm px-2 text-sm font-medium text-foreground underline decoration-accent/50 underline-offset-4 hover:decoration-accent focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
              >
                <X className="size-4" aria-hidden="true" />
                {labels.clear}
              </button>
            )}
          </div>
        </div>

        <ul className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.id} hidden={!visible.has(item.id)} className="flex [content-visibility:auto] [contain-intrinsic-size:520px]">
              {item.card}
            </li>
          ))}
        </ul>

        {visible.size === 0 && (
          <div className="mt-6 rounded-sm border border-dashed border-border p-8 text-center">
            <p className="text-[0.9375rem] text-foreground">{labels.noResults}</p>
            {labels.emptyHint && <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">{labels.emptyHint}</p>}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <button
                type="button"
                onClick={reset}
                className="inline-flex min-h-11 cursor-pointer items-center rounded-sm border border-foreground/25 px-4 text-sm font-medium text-foreground hover:border-foreground/60 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
              >
                {labels.clear}
              </button>
              {empty}
            </div>
          </div>
        )}
      </div>
    </QuickViewHost>
  );
}
