"use client";

import { useEffect, useRef, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { FlagUS, FlagVN } from "./flags";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/** Any control can reopen the chooser by dispatching this event. */
export const OPEN_ENTRY_EVENT = "whitehorse:open-entry";

// Last locale-less pathname seen in this page load (module scope: survives
// client navigation and locale switches, resets on a full page load).
let lastPath: string | null = null;

/**
 * Platform entry on the domain: the visitor chooses a side, and the side
 * sets the language — global buyers continue in English, Vietnamese
 * suppliers in Vietnamese (with Zalo on the supplier page). It opens every
 * time the visitor arrives at the homepage — a fresh visit to the domain, a
 * reload, or the brand logo / Home from another page — and stays closed
 * after a choice or dismissal while they remain on that page (a language
 * switch on the homepage does not re-open it). Deep product or RFQ links
 * never trigger it; the hero can reopen it at any time.
 * Bilingual by design, since it may appear before a language is chosen.
 * Keyboard: focus is trapped inside, Escape or the close button dismiss it,
 * and focus returns to the control that reopened it.
 */
export function AudienceGateway() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const arrivedHome = pathname === "/" && lastPath !== "/";
    lastPath = pathname;
    // Not cancelled on cleanup: a StrictMode double-run must not swallow it.
    if (arrivedHome) window.requestAnimationFrame(() => setOpen(true));
  }, [pathname]);

  useEffect(() => {
    const onOpen = () => {
      opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setOpen(true);
    };
    window.addEventListener(OPEN_ENTRY_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_ENTRY_EVENT, onOpen);
  }, []);

  const choose = () => setOpen(false);

  const path =
    "group flex min-h-44 cursor-pointer flex-col bg-card p-6 transition-colors duration-200 hover:bg-muted/60 focus-visible:relative focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none sm:p-8";

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogContent
        finalFocus={opener}
        data-entry-chooser
        className="max-h-[calc(100dvh-2rem)] gap-0 overflow-y-auto p-0 sm:max-w-2xl"
        aria-label="Enter the Whitehorse platform · Chọn lối vào"
      >
        <DialogHeader className="border-b border-border px-6 py-6 pr-16 sm:px-8 sm:py-7">
          <p className="text-xs font-medium tracking-[0.22em] text-accent uppercase">Enter the Whitehorse platform</p>
          <DialogTitle className="font-serif text-2xl leading-tight font-medium text-balance sm:text-[2rem]">
            Premium ingredients from Vietnam. One qualified supply workflow.
          </DialogTitle>
          <DialogDescription lang="vi" className="leading-relaxed">
            Nguyên liệu cao cấp từ Việt Nam · Một quy trình cung ứng được thẩm định.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2">
          <Link href="/products" locale="en" lang="en" hrefLang="en" onClick={choose} data-entry="buyer" className={path}>
            <span className="flex items-center gap-2.5 text-sm font-semibold text-foreground">
              <FlagUS className="h-4 w-6" />
              English
            </span>
            <span className="mt-6 text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase sm:mt-8">Global buyers</span>
            <span className="mt-2 font-serif text-xl font-medium text-foreground decoration-accent/60 underline-offset-[6px] group-hover:underline">
              Source qualified Vietnamese ingredients.
            </span>
            <span className="mt-2 text-sm leading-relaxed text-muted-foreground">Continue in English · Current portfolio, custom sourcing and quote requests.</span>
          </Link>
          <Link href="/suppliers/apply" locale="vi" lang="vi" hrefLang="vi" onClick={choose} data-entry="supplier" className={path}>
            <span className="flex items-center gap-2.5 text-sm font-semibold text-foreground">
              <FlagVN className="h-4 w-6" />
              Tiếng Việt
            </span>
            <span className="mt-6 text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase sm:mt-8">Nhà cung cấp Việt Nam</span>
            <span className="mt-2 font-serif text-xl font-medium text-foreground decoration-accent/60 underline-offset-[6px] group-hover:underline">
              Tham gia mạng lưới nguồn cung được thẩm định.
            </span>
            <span className="mt-2 text-sm leading-relaxed text-muted-foreground">Tiếp tục bằng tiếng Việt · Đăng ký năng lực hoặc trao đổi nhanh qua Zalo.</span>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** Reopens the entry chooser (hero, menus). */
export function EntryChooserButton({ label, className }: { label: string; className?: string }) {
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      onClick={() => window.dispatchEvent(new Event(OPEN_ENTRY_EVENT))}
      className={cn(
        "inline-flex min-h-11 cursor-pointer items-center gap-2 text-left text-foreground/80 underline decoration-foreground/20 underline-offset-[6px] transition-colors duration-200 hover:text-foreground hover:decoration-accent focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none",
        className
      )}
    >
      <span className="flex shrink-0 items-center gap-1" aria-hidden="true">
        <FlagUS />
        <FlagVN />
      </span>
      <span>{label}</span>
    </button>
  );
}
