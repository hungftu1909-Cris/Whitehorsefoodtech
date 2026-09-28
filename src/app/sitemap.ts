import type { MetadataRoute } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { getPostMeta, getTranslationMap } from "@/lib/blog";
import { PRODUCT_CATEGORIES } from "@/lib/nav";
import { CATALOG_SKUS } from "@/lib/catalog";
import { localizedAlternates, samePathEverywhere } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

// /privacy and /terms are deliberately absent: their interim copy is
// noindex, and listing a noindex URL in the sitemap sends search engines
// contradictory signals.
const INDEXABLE_STATIC_PATHS = [
  "",
  "/about",
  "/products",
  "/documents",
  "/certifications",
  "/process",
  "/clients",
  "/blog",
  "/contact",
  "/rfq",
  "/suppliers/apply",
];

/**
 * One entry per URL, each carrying its hreflang alternates (+ x-default).
 * Static pages omit lastModified rather than stamping every build's time;
 * blog posts use their frontmatter date.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  const addEverywhere = (path: string) => {
    const alternates = {
      languages: localizedAlternates(samePathEverywhere(path), { absolute: true }),
    };
    for (const locale of routing.locales) {
      entries.push({ url: `${siteConfig.url}/${locale}${path}`, alternates });
    }
  };

  INDEXABLE_STATIC_PATHS.forEach(addEverywhere);
  PRODUCT_CATEGORIES.forEach((c) => addEverywhere(`/products/${c.slug}`));
  CATALOG_SKUS.forEach((sku) => addEverywhere(`/products/${sku.family}/${sku.slug}`));

  for (const group of Object.values(getTranslationMap())) {
    const versions = Object.entries(group) as [Locale, string][];
    const pathByLocale = Object.fromEntries(
      versions.map(([locale, slug]) => [locale, `/blog/${slug}`])
    ) as Partial<Record<Locale, string>>;
    const alternates = { languages: localizedAlternates(pathByLocale, { absolute: true }) };
    for (const [locale, slug] of versions) {
      const date = getPostMeta(locale, slug)?.date;
      entries.push({
        url: `${siteConfig.url}/${locale}/blog/${slug}`,
        ...(date ? { lastModified: new Date(date) } : {}),
        alternates,
      });
    }
  }

  return entries;
}
