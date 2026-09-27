import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { Locale } from "@/i18n/routing";

// Only type imports from "@/…" in this file: it is loaded directly by the
// node:test suite (tests/blog-map.test.ts), where path aliases don't
// resolve. tests/blog-map.test.ts checks this list against routing.ts.
export const BLOG_LOCALES = ["en", "vi"] as const satisfies readonly Locale[];

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type BlogPostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  readingMinutes: number;
  /**
   * Shared by an article and its translations (frontmatter
   * `translationKey`). Slugs differ per locale, so this — not the slug —
   * is what links /en/blog/<a> to /vi/blog/<b> for hreflang, the sitemap
   * and the locale switcher. Omit it for a post with no translation.
   */
  translationKey?: string;
};

export type BlogPost = BlogPostMeta & { content: string };

/** Per-locale slugs of one article, e.g. { en: "coffee-…", vi: "trien-vong-…" }. */
export type TranslatedSlugs = Partial<Record<Locale, string>>;

function localeDir(locale: Locale) {
  return path.join(BLOG_DIR, locale);
}

export function getAllSlugs(locale: Locale): string[] {
  const dir = localeDir(locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getAllPosts(locale: Locale): BlogPostMeta[] {
  return getAllSlugs(locale)
    .map((slug) => getPostMeta(locale, slug))
    .filter((p): p is BlogPostMeta => p !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

function readFile(locale: Locale, slug: string) {
  // Slugs come from the URL — only ever read plain kebab-case filenames.
  if (!SLUG_PATTERN.test(slug)) return null;
  const filePath = path.join(localeDir(locale), `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf-8");
}

function toMeta(slug: string, data: Record<string, unknown>, content: string): BlogPostMeta {
  return {
    slug,
    title: data.title as string,
    description: data.description as string,
    date: data.date as string,
    author: (data.author as string | undefined) ?? "Whitehorse Foodtech",
    readingMinutes: Math.max(1, Math.round(readingTime(content).minutes)),
    ...(typeof data.translationKey === "string" && data.translationKey
      ? { translationKey: data.translationKey }
      : {}),
  };
}

export function getPostMeta(locale: Locale, slug: string): BlogPostMeta | null {
  const raw = readFile(locale, slug);
  if (!raw) return null;
  const { data, content } = matter(raw);
  return toMeta(slug, data, content);
}

export function getPost(locale: Locale, slug: string): BlogPost | null {
  const raw = readFile(locale, slug);
  if (!raw) return null;
  const { data, content } = matter(raw);
  return { ...toMeta(slug, data, content), content };
}

/**
 * Groups posts into translation sets keyed by `translationKey`. A post
 * without one gets its own single-locale group, so it never gains a
 * hreflang/locale-switch target that doesn't exist. Throws on two posts in
 * the same locale sharing a key, so a copy-paste mistake fails the build
 * instead of silently pointing hreflang at the wrong article.
 */
export function buildTranslationMap(
  entries: { locale: Locale; slug: string; translationKey?: string }[]
): Record<string, TranslatedSlugs> {
  const map: Record<string, TranslatedSlugs> = {};
  for (const { locale, slug, translationKey } of entries) {
    const key = translationKey ?? `${locale}:${slug}`;
    const group = (map[key] ??= {});
    if (group[locale]) {
      throw new Error(
        `Duplicate blog translationKey "${key}" in locale "${locale}": ${group[locale]} and ${slug}`
      );
    }
    group[locale] = slug;
  }
  return map;
}

export function getTranslationMap(): Record<string, TranslatedSlugs> {
  return buildTranslationMap(
    BLOG_LOCALES.flatMap((locale) =>
      getAllPosts(locale).map((post) => ({
        locale,
        slug: post.slug,
        translationKey: post.translationKey,
      }))
    )
  );
}

/** All existing language versions of a post (including itself); {} if unknown. */
export function getTranslatedSlugs(locale: Locale, slug: string): TranslatedSlugs {
  return (
    Object.values(getTranslationMap()).find((group) => group[locale] === slug) ?? {}
  );
}

/**
 * slug-in-`locale` → its per-locale slugs, for the client-side locale
 * switcher (which only knows the current URL).
 */
export function getLocaleSwitchMap(locale: Locale): Record<string, TranslatedSlugs> {
  const result: Record<string, TranslatedSlugs> = {};
  for (const group of Object.values(getTranslationMap())) {
    const slug = group[locale];
    if (slug) result[slug] = group;
  }
  return result;
}
