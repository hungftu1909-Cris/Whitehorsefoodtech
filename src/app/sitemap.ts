import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getAllSlugs } from "@/lib/blog";
import { PRODUCT_CATEGORIES } from "@/lib/nav";
import { siteConfig } from "@/lib/site";

const STATIC_PATHS = [
  "",
  "/about",
  "/products",
  "/certifications",
  "/process",
  "/clients",
  "/blog",
  "/contact",
  "/rfq",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of STATIC_PATHS) {
      entries.push({
        url: `${siteConfig.url}/${locale}${path}`,
        lastModified: new Date(),
      });
    }
    for (const category of PRODUCT_CATEGORIES) {
      entries.push({
        url: `${siteConfig.url}/${locale}/products/${category.slug}`,
        lastModified: new Date(),
      });
    }
    for (const slug of getAllSlugs(locale)) {
      entries.push({
        url: `${siteConfig.url}/${locale}/blog/${slug}`,
        lastModified: new Date(),
      });
    }
  }

  return entries;
}
