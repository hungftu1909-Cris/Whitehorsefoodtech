import { ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { serializeJsonLd } from "@/lib/json-ld";
import { siteConfig } from "@/lib/site";

export type Crumb = { label: string; href?: string };

/**
 * Visible breadcrumb trail plus matching BreadcrumbList structured data.
 * `href` values are locale-less paths ("/products/coffee"); the last crumb
 * is the current page and has no link.
 */
export function Breadcrumbs({
  crumbs,
  locale,
  label,
}: {
  crumbs: Crumb[];
  locale: string;
  label: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.label,
      ...(crumb.href ? { item: `${siteConfig.url}/${locale}${crumb.href === "/" ? "" : crumb.href}` } : {}),
    })),
  };

  return (
    <nav aria-label={label} className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        {crumbs.map((crumb, i) => (
          <li key={`${crumb.label}-${i}`} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="size-3 shrink-0" aria-hidden="true" />}
            {crumb.href ? (
              <Link href={crumb.href} className="cursor-pointer hover:text-foreground">
                {crumb.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-medium text-foreground">
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
    </nav>
  );
}
