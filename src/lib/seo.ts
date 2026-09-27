import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { siteConfig } from "@/lib/site";

/** OpenGraph wants territory-qualified locales, not bare language codes. */
export const OG_LOCALE: Record<Locale, string> = {
  en: "en_US",
  vi: "vi_VN",
};

/**
 * hreflang map for one page: `{ en: "/en/about", vi: "/vi/about",
 * "x-default": "/en/about" }`. `pathByLocale` holds the locale-less path of
 * each language version that actually exists — pages that exist in every
 * locale use the same path; blog posts pass their per-locale slugs, so no
 * alternate ever points at a 404. x-default goes to the default-locale
 * version when there is one. Pass `absolute` for contexts without
 * metadataBase (sitemap.xml).
 */
export function localizedAlternates(
  pathByLocale: Partial<Record<Locale, string>>,
  { absolute = false }: { absolute?: boolean } = {}
): Record<string, string> {
  const base = absolute ? siteConfig.url : "";
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    const path = pathByLocale[locale];
    if (path !== undefined) languages[locale] = `${base}/${locale}${path}`;
  }
  const defaultPath = pathByLocale[routing.defaultLocale];
  if (defaultPath !== undefined) {
    languages["x-default"] = `${base}/${routing.defaultLocale}${defaultPath}`;
  }
  return languages;
}

/** Same path in every locale — true for every non-blog page. */
export function samePathEverywhere(path: string): Partial<Record<Locale, string>> {
  return Object.fromEntries(routing.locales.map((l) => [l, path]));
}

/**
 * Builds per-page metadata with a correct canonical URL and hreflang
 * alternates for the page's actual path — the root layout's metadata only
 * covers "/", so every page must set its own `alternates` or it silently
 * inherits the homepage's canonical (Next.js does not merge `alternates`
 * across layouts/pages, the nearest one wins). The same applies to
 * `openGraph`, so siteName/locale are repeated here.
 *
 * @param path locale-less path, e.g. "" for home, "/about", "/products/coffee"
 * @param languages locale-less path per locale when it differs by locale
 *   (blog posts) — only locales listed get an hreflang link.
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  images,
  languages,
  type = "website",
}: {
  locale: string;
  path: string;
  title: string;
  description: string;
  images?: string[];
  languages?: Partial<Record<Locale, string>>;
  type?: "website" | "article";
}): Metadata {
  const pathByLocale = languages ?? samePathEverywhere(path);
  const ogLocale = OG_LOCALE[locale as Locale] ?? OG_LOCALE[routing.defaultLocale];

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: localizedAlternates(pathByLocale),
    },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/${locale}${path}`,
      siteName: siteConfig.name,
      type,
      locale: ogLocale,
      alternateLocale: routing.locales
        .filter((l) => l !== locale && pathByLocale[l] !== undefined)
        .map((l) => OG_LOCALE[l]),
      // Omit entirely (rather than `images: undefined`) when there's no
      // page-specific photo, so Next.js falls back to the auto-generated
      // opengraph-image.tsx route instead of treating this as "no image".
      ...(images ? { images } : {}),
    },
    twitter: {
      title,
      description,
      ...(images ? { images } : {}),
    },
  };
}
