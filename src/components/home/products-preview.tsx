import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Compass } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/components/sections/section-heading";
import { FamilyVisual } from "@/components/catalog/family-visual";
import type { FamilySlug } from "@/lib/catalog";
import { Badge } from "@/components/ui/badge";
import { CUSTOM_SOURCING_HREF, PRODUCT_CATEGORIES } from "@/lib/nav";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * The current portfolio: every collection gets the same card, badge and
 * weight — none is the brand. The last cell is the open path for any other
 * Vietnamese ingredient, so the grid reads as today's focus, not the
 * boundary (2 + 2 + 2 on tablet, 3 + 3 on desktop).
 */
export function ProductsPreview() {
  const t = useTranslations("home.productsPreview");
  const tc = useTranslations("catalog");
  const locale = useLocale();
  const items = t.raw("items") as { title: string; tagline: string; status: string }[];

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
        <Link href="/products" className="group inline-flex shrink-0 items-center gap-2 text-sm font-medium text-accent hover:underline">
          {t("exploreCta")}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      </div>

      <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PRODUCT_CATEGORIES.map((category, i) => {
          const item = items[i];
          return (
            <li key={category.slug} className="flex">
              <Link
                href={`/products/${category.slug}`}
                className="group flex w-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                <FamilyVisual
                  family={category.slug as FamilySlug}
                  locale={locale}
                  name={item.title}
                  labels={{ concept: tc("conceptPackBadge") }}
                  className="border-b border-border"
                />
                <div className="flex flex-1 flex-col p-5">
                  <Badge variant="outline" className="mb-3 text-muted-foreground">
                    {item.status}
                  </Badge>
                  <h3 className="flex items-center justify-between gap-3 font-serif text-xl font-semibold text-foreground">
                    {item.title}
                    <ArrowRight
                      className="size-4 shrink-0 text-accent transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.tagline}</p>
                </div>
              </Link>
            </li>
          );
        })}

        <li id="custom-sourcing" className="flex scroll-mt-24">
          <div className="flex w-full flex-col rounded-xl border border-dashed border-accent/60 bg-muted/40 p-6 md:p-7">
            <span className="flex size-11 items-center justify-center rounded-full border border-accent/40 text-accent">
              <Compass className="size-5" aria-hidden="true" />
            </span>
            <p className="mt-6 text-[0.65rem] font-semibold tracking-[0.18em] text-accent uppercase">{t("custom.eyebrow")}</p>
            <h3 className="mt-2 font-serif text-2xl leading-snug font-semibold text-foreground">{t("custom.title")}</h3>
            <p className="mt-3 mb-8 text-sm leading-relaxed text-muted-foreground">{t("custom.body")}</p>
            <Link
              href={CUSTOM_SOURCING_HREF}
              className={cn(buttonVariants({ size: "lg" }), "group mt-auto h-auto min-h-11 w-full cursor-pointer justify-between px-5 py-2.5 text-left whitespace-normal")}
            >
              {t("custom.cta")}
              <ArrowRight className="ml-2 size-4 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </div>
        </li>
      </ul>
    </section>
  );
}
