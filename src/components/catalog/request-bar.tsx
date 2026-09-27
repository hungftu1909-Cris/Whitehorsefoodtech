"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Href = React.ComponentProps<typeof Link>["href"];

/**
 * Persistent, prefilled request action for family and product-code pages.
 * Full-width bar on phones (thumb-reachable), a compact pill on larger
 * screens; appears once the in-page actions have scrolled away. Replaces
 * the generic floating CTA on these pages (see FloatingCtaBar).
 */
export function RequestBar({ href, label, context }: { href: Href; label: string; context: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] backdrop-blur transition-all duration-300 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:rounded-lg sm:border sm:px-3 sm:py-2",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="truncate text-xs font-medium text-muted-foreground sm:hidden">{context}</span>
        <Link
          href={href}
          tabIndex={visible ? 0 : -1}
          className={cn(buttonVariants(), "shrink-0 cursor-pointer gap-1.5 bg-accent text-accent-foreground hover:bg-accent/90")}
        >
          {label}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
