"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Persistent "Request a Quote" button that appears once the visitor has
 * scrolled past the hero — a constant, low-friction conversion touchpoint
 * for a site whose whole business goal is RFQ submissions. Hidden on the
 * RFQ page itself (redundant there).
 */
export function FloatingRfqCta() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 600);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname === "/rfq") return null;

  return (
    <Link
      href="/rfq"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={cn(
        buttonVariants({ size: "lg" }),
        "fixed right-4 bottom-4 z-30 cursor-pointer gap-1.5 shadow-lg transition-all duration-300 sm:right-6 sm:bottom-6",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      )}
    >
      {t("requestQuote")}
      <ArrowRight className="size-4" aria-hidden="true" />
    </Link>
  );
}
