"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Two persistent, symmetric CTAs — "Explore our products" bottom-left,
 * "Request a Quote" bottom-right — that appear once the visitor starts
 * scrolling. Each is a constant, low-friction touchpoint for this site's
 * two core conversion goals (browse the catalog / submit an RFQ), and each
 * hides itself on its own destination page (redundant there).
 *
 * The scroll threshold is intentionally low (200px — roughly one hero
 * subtitle's worth of scrolling) so both stay on screen for as much of the
 * visit as possible, maximizing exposure rather than only appearing deep
 * into the page. On narrow phones the two pills would collide, so each
 * collapses to a round icon-only button below the `sm` breakpoint.
 */
export function FloatingCtaBar() {
  const tNav = useTranslations("nav");
  const tHero = useTranslations("home.hero");
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 200);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const showProducts = pathname !== "/products";
  const showRfq = pathname !== "/rfq";

  const shared =
    "fixed bottom-4 z-30 flex size-12 items-center justify-center gap-1.5 rounded-full p-0 shadow-lg transition-all duration-300 sm:bottom-6 sm:h-11 sm:w-auto sm:rounded-lg sm:px-5 sm:py-2.5";
  const state = (v: boolean) =>
    v ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0";

  return (
    <>
      {showProducts && (
        <Link
          href="/products"
          aria-label={tHero("ctaSecondary")}
          aria-hidden={!visible}
          tabIndex={visible ? 0 : -1}
          className={cn(
            buttonVariants({ variant: "outline" }),
            shared,
            "left-4 border-border bg-card/95 backdrop-blur sm:left-6",
            state(visible)
          )}
        >
          <span className="hidden sm:inline">{tHero("ctaSecondary")}</span>
          <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
        </Link>
      )}

      {showRfq && (
        <Link
          href="/rfq"
          aria-label={tNav("requestQuote")}
          aria-hidden={!visible}
          tabIndex={visible ? 0 : -1}
          className={cn(buttonVariants(), shared, "right-4 sm:right-6", state(visible))}
        >
          <span className="hidden sm:inline">{tNav("requestQuote")}</span>
          <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
        </Link>
      )}
    </>
  );
}
