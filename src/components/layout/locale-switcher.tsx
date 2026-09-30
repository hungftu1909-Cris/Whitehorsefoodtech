"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { localeSwitchPath } from "@/lib/locale-switch";
import { LOCALE_FLAG } from "./flags";
import { cn } from "@/lib/utils";

export type BlogSlugMap = Record<string, Partial<Record<string, string>>>;

const LOCALE_CODE: Record<string, string> = { en: "EN", vi: "VI" };

/**
 * Prominent language control: US flag + EN (English) and Vietnam flag + VI
 * (Tiếng Việt) as a bordered two-button group with a clear active state and
 * 44px targets; the full language name is the accessible name. `compact`
 * (narrow phones) shows one 44px button that switches to the other language.
 * The query string is read at click time and carried over, so product,
 * intent and range context (e.g. RFQ prefill) survive the switch.
 */
export function LocaleSwitcher({
  className,
  blogSlugMap = {},
  compact = false,
}: {
  className?: string;
  blogSlugMap?: BlogSlugMap;
  compact?: boolean;
}) {
  const locale = useLocale();
  const t = useTranslations("nav");
  const router = useRouter();
  const pathname = usePathname();

  const go = (target: string) =>
    router.replace(localeSwitchPath(pathname, target, blogSlugMap) + window.location.search, { locale: target });

  if (compact) {
    const other = routing.locales.find((l) => l !== locale) ?? "en";
    const Flag = LOCALE_FLAG[other as keyof typeof LOCALE_FLAG];
    return (
      <button
        type="button"
        onClick={() => go(other)}
        lang={other}
        aria-label={t(`localeNames.${other}` as "localeNames.en")}
        className={cn(
          "inline-flex size-11 cursor-pointer items-center justify-center gap-1 rounded-sm border border-foreground/15 text-xs font-semibold text-foreground focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none",
          className
        )}
      >
        <Flag />
        <span aria-hidden="true">{LOCALE_CODE[other]}</span>
      </button>
    );
  }

  return (
    <div role="group" aria-label={t("language")} className={cn("flex items-center gap-0.5 rounded-sm border border-foreground/15", className)}>
      {routing.locales.map((cur) => {
        const Flag = LOCALE_FLAG[cur as keyof typeof LOCALE_FLAG];
        const active = cur === locale;
        return (
          <button
            key={cur}
            type="button"
            aria-current={active ? "true" : undefined}
            aria-pressed={active}
            aria-label={t(`localeNames.${cur}` as "localeNames.en")}
            lang={cur}
            onClick={() => !active && go(cur)}
            className={cn(
              "inline-flex h-11 min-w-11 cursor-pointer items-center justify-center gap-1.5 rounded-[3px] px-2.5 text-sm font-semibold tracking-[0.02em] transition-colors duration-200 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none",
              active ? "bg-primary text-primary-foreground" : "text-foreground/75 hover:bg-muted hover:text-foreground"
            )}
          >
            <Flag />
            <span aria-hidden="true">{LOCALE_CODE[cur] ?? cur.toUpperCase()}</span>
          </button>
        );
      })}
    </div>
  );
}
