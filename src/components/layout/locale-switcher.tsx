"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { localeSwitchPath } from "@/lib/locale-switch";
import { cn } from "@/lib/utils";

export type BlogSlugMap = Record<string, Partial<Record<string, string>>>;

const LOCALE_LABEL: Record<string, string> = {
  en: "EN",
  vi: "VI",
};

export function LocaleSwitcher({
  className,
  blogSlugMap = {},
}: {
  className?: string;
  blogSlugMap?: BlogSlugMap;
}) {
  const locale = useLocale();
  const t = useTranslations("nav");
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div role="group" aria-label={t("language")} className={cn("flex items-center gap-0.5 text-sm", className)}>
      {routing.locales.map((cur, i) => (
        <span key={cur} className="flex items-center">
          {i > 0 && <span className="mx-1 text-border" aria-hidden="true">/</span>}
          <button
            type="button"
            aria-current={cur === locale ? "true" : undefined}
            aria-label={t(`localeNames.${cur}` as "localeNames.en")}
            lang={cur}
            onClick={() =>
              // Query string read at click time (not useSearchParams) so the
              // header stays statically renderable; keeps e.g. RFQ prefill.
              router.replace(
                localeSwitchPath(pathname, cur, blogSlugMap) + window.location.search,
                { locale: cur }
              )
            }
            className={cn(
              // The invisible ::after widens the tap area to ~44px tall
              // without changing the compact EN / VI layout.
              "relative cursor-pointer rounded-sm px-2 py-0.5 transition-colors duration-200 after:absolute after:-inset-x-2 after:-inset-y-3 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none",
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
