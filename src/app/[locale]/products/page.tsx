import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { CtaSection } from "@/components/sections/cta-section";
import { CommercialDocuments } from "@/components/sections/commercial-documents";
import { FilterGrid } from "@/components/catalog/filter-grid";
import { RangeCard, RangeDetail } from "@/components/catalog/cards";
import { Link } from "@/i18n/navigation";
import { PRODUCT_CATEGORIES } from "@/lib/nav";
import { pageMetadata } from "@/lib/seo";
import { CATALOG_RANGES, pick, rangesFor, type FamilySlug } from "@/lib/catalog";
import { CUSTOM_SOURCING_HREF } from "@/lib/nav";
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
      <PageHero compact eyebrow={t("hero.eyebrow")} title={t("hero.title")} subtitle={t("hero.lead")} />

      {/* Tools first: filters, search, result count and the first row sit in
          the first desktop viewport. Family counts ride on the filter chips;
          full specification fields open in the quick view. */}
      <section className="mx-auto max-w-7xl px-5 pt-6 pb-16 sm:px-6 md:pb-24 lg:px-8">
        <FilterGrid
          queryKey="family"
          groups={categories.map((category) => ({
            id: category.slug,
            label: category.name,
            count: rangesFor(category.family).length,
          }))}
          labels={{
            filter: t("explorer.filterLabel"),
            all: tcat("filterAll"),
            search: tcat("searchLabel"),
            searchPlaceholder: t("explorer.searchPlaceholder"),
            clear: tcat("clearAll"),
            noResults: tcat("noResults"),
            emptyHint: tcat("emptyHint"),
            close: tcat("closePanel"),
            results,
          }}
          empty={
            <Link
              href={CUSTOM_SOURCING_HREF}
              className="inline-flex min-h-11 items-center text-sm font-medium text-foreground underline decoration-accent/50 underline-offset-4 hover:decoration-accent"
            >
              {tcat("briefOther")}
            </Link>
          }
          items={orderedRanges.map((range) => {
            const category = categories.find((item) => item.slug === range.family)!;
            return {
              id: range.id,
              group: range.family,
              search: [range.name.en, range.name.vi, range.summary.en, range.summary.vi, ...range.formats.flatMap((format) => [format.en, format.vi]), ...range.specFields.flatMap((f) => [f.en, f.vi]), category.name].join(" ").toLowerCase(),
              card: (
                <RangeCard
                  range={range}
                  locale={locale}
                  labels={{
                    showFamily: true,
                    familyName: category.name,
                    formats: tcat("formatsLabel"),
                    specify: tcat("specifyLabel"),
                    request: tcat("requestRange"),
                    conceptBadge: tcat("conceptPackBadge"),
                    quickView: tcat("quickView"),
                  }}
                />
              ),
              detail: {
                title: pick(range.name, locale),
                kicker: category.name,
                content: (
                  <RangeDetail
                    range={range}
                    locale={locale}
                    labels={{
                      formats: tcat("formatsLabel"),
                      specFieldsTitle: tcat("specFieldsTitle"),
                      indicative: tcat("indicativeLabel"),
                      indicativeNote: tcat("indicativeNote"),
                      conceptBadge: tcat("conceptPackBadge"),
                      familyPage: tcat("familyPage"),
                      codePages: tcat("codePagesInRange"),
                      requestSpec: tcat("requestSpec"),
                      requestSample: tcat("requestSample"),
                      perRequestNote: tcat("perRequestNote"),
                    }}
                  />
                ),
              },
            };
          })}
        />

        <p className="mt-10 max-w-4xl text-sm leading-relaxed text-muted-foreground">{tcat("perRequestNote")}</p>
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
