import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { CtaSection } from "@/components/sections/cta-section";
import { CommercialDocuments } from "@/components/sections/commercial-documents";
import { FilterGrid } from "@/components/catalog/filter-grid";
import { RangeCard } from "@/components/catalog/cards";
import { PRODUCT_CATEGORIES } from "@/lib/nav";
import { pageMetadata } from "@/lib/seo";
import { CATALOG_RANGES, DEFINED_SKU_COUNTS, rangesFor, type FamilySlug } from "@/lib/catalog";
import { serializeJsonLd } from "@/lib/json-ld";
import { siteConfig } from "@/lib/site";

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
  const tcat = await getTranslations({ locale, namespace: "catalog" });
  const td = await getTranslations({ locale, namespace: "documents.library" });
  const categories = PRODUCT_CATEGORIES.map((category) => ({
    ...category,
    family: category.slug as FamilySlug,
    name: t(`categories.${category.categoryKey}.name`),
  }));
  // Ranges follow the family order of PRODUCT_CATEGORIES; images are keyed by
  // range id (media-manifest), so reordering never changes what a card shows.
  const familyOrder = PRODUCT_CATEGORIES.map((category) => category.slug as FamilySlug);
  const orderedRanges = familyOrder.flatMap((family) => rangesFor(family));
  const results = Array.from({ length: CATALOG_RANGES.length + 1 }, (_, count) => tcat("results", { count }));
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
        <div className="grid gap-8 border-b border-border pb-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">{t("explorer.eyebrow")}</p>
            <h2 className="mt-3 font-serif text-3xl leading-tight font-semibold tracking-tight text-balance text-foreground md:text-4xl">
              {t("explorer.title")}
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground lg:justify-self-end">{t("explorer.subtitle")}</p>
        </div>

        <dl className="grid border-b border-border sm:grid-cols-5">
          {categories.map((category) => (
            <div key={category.slug} className="border-b border-border py-4 last:border-b-0 sm:border-r sm:border-b-0 sm:px-4 sm:first:pl-0 sm:last:border-r-0 sm:last:pr-0">
              <dt className="text-[0.65rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">{category.name}</dt>
              <dd className="mt-1 font-serif text-lg font-semibold text-foreground">
                {tcat("rangesCount", { count: rangesFor(category.family).length })}
                <span className="ml-2 text-xs font-normal text-accent">+ {tcat("codesCount", { count: DEFINED_SKU_COUNTS[category.family] })}</span>
              </dd>
            </div>
          ))}
        </dl>

        <FilterGrid
          className="mt-10"
          queryKey="family"
          groups={categories.map((category) => ({ id: category.slug, label: category.name }))}
          labels={{
            filter: t("explorer.filterLabel"),
            all: tcat("filterAll"),
            search: tcat("searchLabel"),
            searchPlaceholder: t("explorer.searchPlaceholder"),
            clear: tcat("clearAll"),
            noResults: tcat("noResults"),
            results,
          }}
          items={orderedRanges.map((range) => {
            const category = categories.find((item) => item.slug === range.family)!;
            return {
              id: range.id,
              group: range.family,
              search: [range.name.en, range.name.vi, range.summary.en, range.summary.vi, ...range.formats.flatMap((format) => [format.en, format.vi])].join(" ").toLowerCase(),
              card: (
                <RangeCard
                  range={range}
                  locale={locale}
                  labels={{
                    familyLabel: category.name,
                    formats: tcat("formatsLabel"),
                    generalSpecLabel: tcat("generalSpecLabel"),
                    specify: tcat("specifyLabel"),
                    request: tcat("requestRange"),
                    indicative: tcat("indicativeLabel"),
                    indicativeNote: tcat("indicativeNote"),
                    moreDetail: tcat("moreDetail"),
                    conceptBadge: tcat("conceptPackBadge"),
                    familyName: category.name,
                  }}
                />
              ),
            };
          })}
        />

        <p className="mt-10 rounded-lg border border-dashed border-border bg-muted/30 p-4 text-xs leading-relaxed text-muted-foreground">
          {tcat("perRequestNote")}
        </p>
      </section>

      <CommercialDocuments
        labels={{
          eyebrow: td("eyebrow"),
          title: td("title"),
          subtitle: td("subtitle"),
          brochure: {
            title: td("brochure.title"),
            description: td("brochure.description"),
            meta: td("brochure.meta"),
            cta: td("brochure.cta"),
          },
          packaging: {
            title: td("packaging.title"),
            description: td("packaging.description"),
            meta: td("packaging.meta"),
            cta: td("packaging.cta"),
          },
          profile: {
            title: td("profile.title"),
            description: td("profile.description"),
            meta: td("profile.meta"),
            cta: td("profile.cta"),
          },
          note: td("note"),
        }}
      />

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
