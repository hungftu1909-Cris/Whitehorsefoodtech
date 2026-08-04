"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";

const LOCALE_LABEL: Record<string, string> = {
  en: "EN",
  vi: "VI",
};

export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  return (
    <div className={cn("flex items-center gap-0.5 text-sm", className)}>
      {routing.locales.map((cur, i) => (
        <span key={cur} className="flex items-center">
          {i > 0 && <span className="mx-1 text-border" aria-hidden="true">/</span>}
          <button
            type="button"
            aria-current={cur === locale}
            onClick={() =>
              router.replace(
                // @ts-expect-error -- pathname is dynamic but valid for this locale set
                { pathname, params },
                { locale: cur }
              )
            }
            className={cn(
              "cursor-pointer rounded px-1 py-0.5 transition-colors",
              cur === locale
                ? "font-semibold text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {LOCALE_LABEL[cur] ?? cur.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}
