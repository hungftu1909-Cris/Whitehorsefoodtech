/**
 * Where the language switcher should send the visitor. Blog slugs differ
 * per locale, so /blog/<slug> maps through the translation map to the
 * translated slug, or back to the /blog index when the article has no
 * translation (never to a 404). Every other page shares its path across
 * locales. Import-free so node:test can load it.
 *
 * @param pathname locale-less pathname, e.g. "/blog/coffee-market-outlook-2026"
 * @param blogSlugMap slug in the current locale → slug per locale
 */
export function localeSwitchPath(
  pathname: string,
  targetLocale: string,
  blogSlugMap: Record<string, Partial<Record<string, string>>>
): string {
  const match = pathname.match(/^\/blog\/([^/]+)\/?$/);
  if (!match) return pathname;
  const slug = decodeURIComponent(match[1]);
  const target = blogSlugMap[slug]?.[targetLocale];
  return target ? `/blog/${target}` : "/blog";
}
