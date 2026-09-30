import { useLocale, useTranslations } from "next-intl";
import { Download } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { FamilyVisual } from "@/components/catalog/family-visual";
import type { FamilySlug } from "@/lib/catalog";
import { CUSTOM_SOURCING_HREF, PRODUCT_CATEGORIES } from "@/lib/nav";
import { hasPublicFile } from "@/lib/media";

const DOCUMENTS = [
  { key: "brochure", path: "/documents/whitehorse-foodtech-brochure.pdf" },
  { key: "packaging", path: "/documents/whitehorse-foodtech-packaging-architecture.pdf" },
] as const;

/**
 * The current portfolio as an editorial catalogue: every collection gets
 * the same image size, numeral, name and one descriptor — none is the
 * brand. The sixth plate is the open path for any other Vietnamese
 * ingredient, so the grid reads as today's focus, not the boundary.
 *
 * The approved studio images sit on warm peach sweeps; each is shown on a
 * cool mist mount with slightly quieter saturation (files unaltered). Items
 * are keyed by categoryKey, so the order always follows PRODUCT_CATEGORIES.
 * The image is an overlay link (so its 01/02 control is never inside an
 * <a>); the family name is the keyboard link. Only published documents are
 * offered for download.
 */
export function ProductsPreview() {
  const t = useTranslations("home.productsPreview");
  const tc = useTranslations("catalog");
  const td = useTranslations("documents.library");
  const locale = useLocale();
  const items = t.raw("items") as Record<string, { title: string; tagline: string }>;
  const number = (i: number) => String(i + 1).padStart(2, "0");
  const documents = DOCUMENTS.filter((d) => hasPublicFile(d.path));

  return (
    <section aria-labelledby="portfolio-title" className="bg-card">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="lg:max-w-2xl">
            <p className="text-xs font-medium tracking-[0.2em] text-accent uppercase">{t("eyebrow")}</p>
            <h2 id="portfolio-title" className="mt-4 font-serif text-[2rem] leading-[1.12] font-medium tracking-[-0.01em] text-balance text-foreground md:text-[2.5rem]">
              {t("title")}
            </h2>
          </div>
          <div className="lg:max-w-md">
            <p className="text-base leading-relaxed text-pretty text-muted-foreground">{t("subtitle")}</p>
            <Link
              href="/products"
              className="mt-5 inline-flex min-h-11 items-center text-[0.9375rem] font-medium text-foreground underline decoration-accent/50 underline-offset-8 transition-colors duration-200 hover:decoration-accent focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
            >
              {t("exploreCta")}
            </Link>
          </div>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 md:mt-14 lg:grid-cols-3 lg:gap-y-16">
          {PRODUCT_CATEGORIES.map((category, i) => {
            const item = items[category.categoryKey];
            const href = `/products/${category.slug}`;
            return (
              <li key={category.slug} className="group">
                <div className="border border-foreground/8 bg-muted p-3 sm:p-4">
                  <FamilyVisual
                    family={category.slug as FamilySlug}
                    locale={locale}
                    name={item.title}
                    labels={{ concept: tc("conceptPackBadge") }}
                    href={href}
                    className="brightness-[1.03] saturate-[0.82]"
                  />
                </div>
                <div className="mt-5 grid grid-cols-[2.5rem_1fr] gap-x-3">
                  <span className="pt-1.5 text-xs tracking-[0.12em] text-accent tabular-nums">{number(i)}</span>
                  <div>
                    <h3 className="font-serif text-[1.5rem] leading-tight font-medium text-foreground">
                      <Link
                        href={href}
                        className="rounded-sm decoration-accent/60 underline-offset-[6px] hover:underline focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none group-hover:underline"
                      >
                        {item.title}
                      </Link>
                    </h3>
                    <p className="mt-2 text-base leading-relaxed text-muted-foreground">{item.tagline}</p>
                  </div>
                </div>
              </li>
            );
          })}

          <li id="custom-sourcing" className="scroll-mt-28">
            {/* Same outer mount as the photographs, so the plate aligns with them. */}
            <div className="group relative border border-foreground/8 bg-muted p-3 sm:p-4">
              <div className="flex aspect-[4/3] flex-col justify-between border border-foreground/10 bg-card p-6 text-foreground md:p-7">
                <p className="text-xs font-medium tracking-[0.2em] text-accent uppercase">{t("custom.eyebrow")}</p>
                <div>
                  <h3 className="max-w-[16ch] font-serif text-[1.75rem] leading-[1.15] font-medium text-balance text-primary md:text-[2rem]">
                    {t("custom.title")}
                  </h3>
                  <Link
                    href={CUSTOM_SOURCING_HREF}
                    className="mt-5 inline-flex min-h-11 items-center text-[0.9375rem] font-medium underline decoration-accent/60 underline-offset-8 transition-colors duration-200 after:absolute after:inset-0 group-hover:decoration-accent focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
                  >
                    {t("custom.cta")}
                  </Link>
                </div>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-[2.5rem_1fr] gap-x-3">
              <span className="pt-0.5 text-xs tracking-[0.12em] text-accent tabular-nums">{number(PRODUCT_CATEGORIES.length)}</span>
              <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">{t("custom.body")}</p>
            </div>
          </li>
        </ul>

        {documents.length > 0 && (
          <div className="mt-14 flex flex-col gap-3 border-t border-foreground/12 pt-6 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8">
            <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">{t("documentsLabel")}</p>
            {documents.map((doc) => (
              <a
                key={doc.key}
                href={doc.path}
                download
                className="inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-medium text-foreground underline decoration-accent/40 underline-offset-[6px] transition-colors duration-200 hover:decoration-accent focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
              >
                <Download className="size-4 text-accent" aria-hidden="true" />
                {td(`${doc.key}.title`)}
                <span className="text-sm font-normal text-muted-foreground no-underline">{td(`${doc.key}.meta`)}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
