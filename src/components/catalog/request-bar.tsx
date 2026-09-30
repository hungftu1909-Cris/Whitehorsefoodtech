"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type Href = React.ComponentProps<typeof Link>["href"];

/**
 * Thumb-reach, prefilled request action for long family and product-code
 * pages — phones only (the header carries the action from `sm`). It appears
 * once the in-page actions have scrolled away and steps aside whenever it
 * could get in the way: while the footer is on screen and while the visitor
 * is typing (on-screen keyboard). An in-flow spacer of the same height keeps
 * the last content and the footer from ever sitting underneath it.
 */
export function RequestBar({ href, label, context }: { href: Href; label: string; context: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [footerInView, setFooterInView] = useState(false);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const footer = document.querySelector("footer");
    const observer = footer
      ? new IntersectionObserver(([entry]) => setFooterInView(entry.isIntersecting))
      : null;
    if (footer && observer) observer.observe(footer);

    const isField = (el: EventTarget | null) =>
      el instanceof HTMLElement && el.matches("input, textarea, select, [contenteditable=true]");
    const onFocusIn = (e: FocusEvent) => setTyping(isField(e.target));
    const onFocusOut = () => setTyping(false);
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer?.disconnect();
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  const visible = scrolled && !footerInView && !typing;

  return (
    <>
      <div aria-hidden="true" className="h-[4.5rem] sm:hidden" />
      <div
        data-request-bar
        aria-hidden={!visible}
        className={cn(
          "fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur transition-[opacity,transform] duration-300 sm:hidden",
          visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <span className="truncate text-sm text-muted-foreground">{context}</span>
          <Link
            href={href}
            tabIndex={visible ? 0 : -1}
            className="inline-flex h-11 shrink-0 cursor-pointer items-center gap-1.5 rounded-sm bg-primary px-4 text-[0.9375rem] font-medium text-primary-foreground hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
          >
            {label}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </>
  );
}
