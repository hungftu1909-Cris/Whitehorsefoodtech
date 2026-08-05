import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/site";

/**
 * Builds per-page metadata with a correct canonical URL and hreflang
 * alternates for the page's actual path — the root layout's metadata only
 * covers "/", so every page must set its own `alternates` or it silently
 * inherits the homepage's canonical (Next.js does not merge `alternates`
 * across layouts/pages, the nearest one wins).
 *
 * @param path locale-less path, e.g. "" for home, "/about", "/products/coffee"
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  images,
}: {
  locale: string;
  path: string;
  title: string;
  description: string;
  images?: string[];
}): Metadata {
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `/${l}${path}`])
  );

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}${path}`,
      languages,
    },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/${locale}${path}`,
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
