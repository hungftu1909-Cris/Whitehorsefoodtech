import { useLocale, useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/components/sections/section-heading";
import { FamilyVisual } from "@/components/catalog/family-visual";
import type { FamilySlug } from "@/lib/catalog";
import { Badge } from "@/components/ui/badge";
import { PRODUCT_CATEGORIES } from "@/lib/nav";
import { cn } from "@/lib/utils";

/** Image-led routing to the five family pages; detail lives there. */
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
      {/* 5 families: 3 + 2 on desktop reads more premium than a cramped
          5-across row, and keeps card width consistent with /products. */}
      <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6">
        {items.map((item, i) => {
          const category = PRODUCT_CATEGORIES[i];
          return (
            <li key={item.title} className={cn("flex", i < 2 ? "lg:col-span-3" : "lg:col-span-2")}>
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
                  {/* Coffee is the focus category; every other family is
                      labelled as sourced/developed on request so the grid
                      never implies five equally ready product lines. */}
                  <Badge
                    variant={category.slug === "coffee" ? "default" : "outline"}
                    className={category.slug === "coffee" ? "mb-3 bg-accent text-accent-foreground" : "mb-3 text-muted-foreground"}
                  >
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
      </ul>
    </section>
  );
}
