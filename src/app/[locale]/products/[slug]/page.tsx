import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, FileText } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { CtaSection } from "@/components/sections/cta-section";
import { SectionHeading } from "@/components/sections/section-heading";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/catalog/breadcrumbs";
import { RequestActions } from "@/components/catalog/request-actions";
import { FilterGrid } from "@/components/catalog/filter-grid";
import { RangeCard, SkuCard } from "@/components/catalog/cards";
import { RequestBar } from "@/components/catalog/request-bar";
import { PRODUCT_CATEGORIES } from "@/lib/nav";
import { familyMedia } from "@/lib/media-manifest";
import { DualImageFrame, toFrameImages } from "@/components/catalog/dual-image-frame";
import {
  DEFINED_SKU_COUNTS,
  definedCodesFor,
  findRange,
  PACKAGING_OPTIONS,
  pick,
  rangesFor,
  skusFor,
  type FamilySlug,
} from "@/lib/catalog";
import { rfqHref } from "@/lib/rfq-links";
import { pageMetadata } from "@/lib/seo";
import { serializeJsonLd } from "@/lib/json-ld";
import { siteConfig } from "@/lib/site";
import { routing } from "@/i18n/routing";
import { hasPublicFile } from "@/lib/media";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    PRODUCT_CATEGORIES.map((c) => ({ locale, slug: c.slug }))
  );
}

function findCategory(slug: string) {
  return PRODUCT_CATEGORIES.find((c) => c.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const category = findCategory(slug);
  if (!category) return {};
  const t = await getTranslations({ locale, namespace: `products.categories.${category.categoryKey}` });
  const hero = familyMedia(slug as FamilySlug)[0];
  return pageMetadata({
    locale,
    path: `/products/${slug}`,
    title: t("name"),
    description: t("description"),
    ...(hero && hasPublicFile(hero.src) ? { images: [hero.src] } : {}),
  });
}

export default async function ProductFamilyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const category = findCategory(slug);
  if (!category) notFound();
  const family = category.slug as FamilySlug;

  const t = await getTranslations({ locale, namespace: `products.categories.${category.categoryKey}` });
  const tp = await getTranslations({ locale, namespace: "products" });
  const tc = await getTranslations({ locale, namespace: "catalog" });
  const applications = t.raw("applications") as string[];

  const ranges = rangesFor(family);
  const skus = skusFor(family);
  const definedCount = DEFINED_SKU_COUNTS[family];
  const definedCodes = definedCodesFor(family);
  const heroMedia = familyMedia(family);
  const name = t("name");

  const actionLabels = { sample: tc("requestSample"), spec: tc("requestSpec"), quote: tc("requestQuote") };
  const filterLabels = (count: number) => ({
    filter: tc("filterLabel"),
    all: tc("filterAll"),
    search: tc("searchLabel"),
    searchPlaceholder: tc("searchPlaceholder"),
    clear: tc("clearAll"),
    noResults: tc("noResults"),
    results: Array.from({ length: count + 1 }, (_, n) => tc("results", { count: n })),
  });
  const rangeLabels = {
    formats: tc("formatsLabel"),
    generalSpecLabel: tc("generalSpecLabel"),
    specify: tc("specifyLabel"),
    request: tc("requestRange"),
    indicative: tc("indicativeLabel"),
    indicativeNote: tc("indicativeNote"),
    moreDetail: tc("moreDetail"),
    conceptBadge: tc("conceptPackBadge"),
    familyName: name,
  };
  const packaging = PACKAGING_OPTIONS[family];
  const rangeCards = ranges.map((range) => ({
    id: range.id,
    group: range.id,
    search: [range.name.en, range.name.vi, ...range.formats.flatMap((f) => [f.en, f.vi])].join(" ").toLowerCase(),
    card: <RangeCard range={range} locale={locale} labels={rangeLabels} />,
  }));

  // ItemList only where each item has its own page (confirmed codes).
  const itemList =
    skus.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `${name} — ${tc("confirmedTitle")}`,
          itemListElement: skus.map((sku, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: `${sku.code} ${pick(sku.name, locale)}`,
            url: `${siteConfig.url}/${locale}/products/${family}/${sku.slug}`,
          })),
        }
      : null;

  return (
    <>
      <Breadcrumbs
        locale={locale}
        label={tc("breadcrumbLabel")}
        crumbs={[
          { label: tc("breadcrumbHome"), href: "/" },
          { label: tc("breadcrumbProducts"), href: "/products" },
          { label: name },
        ]}
      />

      {/* Compact hero: copy + actions left, imagery right */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 pt-8 pb-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
        <div>
          <Badge variant="outline" className="text-muted-foreground">
            {t("status")}
          </Badge>
          <h1 className="mt-4 font-serif text-4xl leading-[1.1] font-semibold tracking-tight text-balance text-foreground md:text-5xl">
            {name}
          </h1>
          <p className="mt-2 text-sm font-medium text-accent">{t("tagline")}</p>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">{t("description")}</p>
          <p className="mt-4 text-xs text-muted-foreground">
            {tc("codesCount", { count: definedCount })} · {" "}
            {tc("rangesCount", { count: ranges.length })}
          </p>
          <RequestActions family={family} labels={actionLabels} className="mt-7" />
        </div>
        <div>
          {heroMedia.length > 0 && (
            <DualImageFrame
              images={toFrameImages(heroMedia, locale, tc("conceptPackBadge"))}
              sizes="(min-width: 1024px) 40rem, 100vw"
              priority
              className="rounded-lg border border-border"
            />
          )}
          {/* Family highlight images from FAMILY_MEDIA: an owner-supplied or
              editorial ingredient image, plus a concept line-up only where one
              exists. Neither is a statement of stock or final artwork. */}
          {heroMedia.some((image) => image.kind === "concept-pack") && (
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{tc("conceptPackNote")}</p>
          )}
        </div>
      </section>

      <section id="sku-portfolio" className="border-y border-primary-foreground/10 bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-accent uppercase">
              <FileText className="size-4" aria-hidden="true" />
              {tc("portfolioEyebrow")}
            </p>
            <h2 className="mt-3 font-serif text-2xl font-semibold text-balance md:text-3xl">
              {tc("portfolioTitle", { count: definedCount })}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-primary-foreground/75">
              {tc("portfolioSubtitle")}
            </p>
          </div>
          <div>
            <ul className="flex flex-wrap gap-2" aria-label={tc("portfolioCodesLabel")}>
              {definedCodes.map((code) => (
                <li key={code} className="rounded-full border border-primary-foreground/20 bg-primary-foreground/5 px-3 py-1.5 font-mono text-xs tracking-wide">
                  {code}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-primary-foreground/75">{tc("generalSpecLead")}</p>
            <Link
              href={rfqHref({ family, intent: "spec-sheet" })}
              className="mt-4 inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-accent hover:underline"
            >
              {tc("generalSpecCta")}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {skus.length > 0 && (
        <section id="codes" className="border-t border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <SectionHeading title={tc("confirmedTitle")} subtitle={tc("confirmedSubtitle")} />
            <FilterGrid
              className="mt-8"
              groups={ranges.filter((range) => skus.some((s) => s.range === range.id)).map((range) => ({ id: range.id, label: pick(range.name, locale) }))}
              labels={filterLabels(skus.length)}
              items={skus.map((sku) => ({
                id: sku.code,
                group: sku.range,
                search: [sku.code, sku.name.en, sku.name.vi, sku.line.en, sku.line.vi].join(" ").toLowerCase(),
                card: (
                  <SkuCard
                    sku={sku}
                    locale={locale}
                    labels={{
                      view: tc("viewDetails"),
                      sample: tc("requestSample"),
                      conceptBadge: tc("conceptPackBadge"),
                      rangeLabel: tc("rangeLabel"),
                      rangeName: pick(findRange(sku.range)!.name, locale),
                    }}
                  />
                ),
              }))}
            />
          </div>
        </section>
      )}

      <section id="ranges" className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading title={tc("rangesTitle")} subtitle={tc("rangesSubtitle")} />
          {skus.length > 0 ? (
            <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rangeCards.map((item) => (
                <li key={item.id} className="flex">
                  {item.card}
                </li>
              ))}
            </ul>
          ) : (
            <FilterGrid
              className="mt-8"
              groups={ranges.map((range) => ({ id: range.id, label: pick(range.name, locale) }))}
              labels={filterLabels(rangeCards.length)}
              items={rangeCards}
            />
          )}

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="font-serif text-xl font-semibold text-foreground">{t("applicationsTitle")}</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {applications.map((app) => (
                  <li key={app}>
                    <Badge variant="secondary" className="bg-muted text-foreground">
                      {app}
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              {packaging && (
                <div>
                  <h2 className="font-serif text-xl font-semibold text-foreground">{tc("packagingTitle")}</h2>
                  <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-muted-foreground">
                    {packaging.map((option) => (
                      <li key={option.en} className="flex gap-2">
                        <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                        {pick(option, locale)}
                      </li>
                    ))}
                  </ul>
                  <Link href="/packaging" className="mt-4 inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-accent hover:underline">
                    {tc("packagingExplore")}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </div>
              )}
              <p className="rounded-lg border border-dashed border-border bg-muted/30 p-4 text-xs leading-relaxed text-muted-foreground">
                {tc("perRequestNote")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <CtaSection
        title={tp("sampleCta.title")}
        subtitle={tp("sampleCta.subtitle")}
        cta={tp("sampleCta.cta")}
        href={rfqHref({ family, intent: "sample" })}
        secondaryCta={tp("sampleCta.secondaryCta")}
        secondaryHref={rfqHref({ family, intent: "quote" })}
      />

      <RequestBar href={rfqHref({ family, intent: "sample" })} label={tc("stickyLabel")} context={name} />

      {itemList && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(itemList) }} />
      )}
    </>
  );
}
