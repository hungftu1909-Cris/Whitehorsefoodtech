import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/sections/page-hero";
import { CtaSection } from "@/components/sections/cta-section";
import { FamilyVisual } from "@/components/catalog/family-visual";
import { Reveal } from "@/components/ui/reveal";
import { Badge } from "@/components/ui/badge";
import { PRODUCT_CATEGORIES } from "@/lib/nav";
import { pageMetadata } from "@/lib/seo";
import { pick, rangesFor, skusFor, type FamilySlug } from "@/lib/catalog";
import { serializeJsonLd } from "@/lib/json-ld";
import { siteConfig } from "@/lib/site";
import { ArrowRight } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "products.hero" });
  return pageMetadata({ locale, path: "/products", title: t("title"), description: t("subtitle") });
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "products" });
  const tc = await getTranslations({ locale, namespace: "common" });
  const tcat = await getTranslations({ locale, namespace: "catalog" });
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t("hero.title"),
    itemListElement: PRODUCT_CATEGORIES.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t(`categories.${c.categoryKey}.name`),
      url: `${siteConfig.url}/${locale}/products/${c.slug}`,
    })),
  };

  return (
    <>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
      />

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        {/* 5 families: 3 + 2 on desktop — same grid rhythm as the homepage
            preview, avoids a cramped 5-across row or an orphaned lone card
            in a 4-column layout. */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCT_CATEGORIES.map((c, i) => (
            <Reveal key={c.slug} delay={i * 100}>
              <Link
                href={`/products/${c.slug}`}
                className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md"
              >
                <FamilyVisual
                  family={c.slug as FamilySlug}
                  locale={locale}
                  name={t(`categories.${c.categoryKey}.name`)}
                  labels={{ editorial: tcat("editorialBadge"), studio: t("studioBadge") }}
                  priority={i < 3}
                  className="border-b border-border"
                />
                <div className="flex flex-1 flex-col p-6">
                  <Badge
                    variant={c.slug === "coffee" ? "default" : "outline"}
                    className={c.slug === "coffee" ? "mb-3 bg-accent text-accent-foreground" : "mb-3 text-muted-foreground"}
                  >
                    {t(`categories.${c.categoryKey}.status`)}
                  </Badge>
                  <h2 className="font-serif text-xl font-semibold text-foreground">
                    {t(`categories.${c.categoryKey}.name`)}
                  </h2>
                  <p className="mt-1 text-sm font-medium text-accent">
                    {t(`categories.${c.categoryKey}.tagline`)}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {t(`categories.${c.categoryKey}.description`)}
                  </p>
                  {/* Layer-1 preview of layer 2: what's inside this family. */}
                  <p className="mt-4 text-xs font-medium text-foreground/80">
                    {skusFor(c.slug as FamilySlug).length > 0 && (
                      <>{tcat("codesCount", { count: skusFor(c.slug as FamilySlug).length })} · </>
                    )}
                    {tcat("rangesCount", { count: rangesFor(c.slug as FamilySlug).length })}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {rangesFor(c.slug as FamilySlug).map((range) => pick(range.name, locale)).join(" · ")}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                    {tc("learnMore")}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaSection
        title={t("sampleCta.title")}
        subtitle={t("sampleCta.subtitle")}
        cta={t("sampleCta.cta")}
        href={{ pathname: "/rfq", query: { intent: "sample" } }}
        secondaryCta={t("sampleCta.secondaryCta")}
        secondaryHref={{ pathname: "/rfq", query: { intent: "quote" } }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(itemList) }} />
    </>
  );
}
