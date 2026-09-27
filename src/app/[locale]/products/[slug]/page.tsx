import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CtaSection } from "@/components/sections/cta-section";
import { SectionHeading } from "@/components/sections/section-heading";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/catalog/breadcrumbs";
import { RequestActions } from "@/components/catalog/request-actions";
import { FilterGrid } from "@/components/catalog/filter-grid";
import { FamilyVisual } from "@/components/catalog/family-visual";
import { RangeCard, SkuCard } from "@/components/catalog/cards";
import { RequestBar } from "@/components/catalog/request-bar";
import { PRODUCT_CATEGORIES } from "@/lib/nav";
import { familyImage } from "@/lib/family-images";
import {
  findRange,
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
  const hero = familyImage(slug as FamilySlug);
  return pageMetadata({
    locale,
    path: `/products/${slug}`,
    title: t("name"),
    description: t("description"),
    ...(hasPublicFile(hero.src) ? { images: [hero.src] } : {}),
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
  const hero = familyImage(family);
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
  const rangeLabels = { formats: tc("formatsLabel"), specify: tc("specifyLabel"), request: tc("requestRange") };
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
          <Badge
            variant={family === "coffee" ? "default" : "outline"}
            className={family === "coffee" ? "bg-accent text-accent-foreground" : "text-muted-foreground"}
          >
            {t("status")}
          </Badge>
          <h1 className="mt-4 font-serif text-4xl leading-[1.1] font-semibold tracking-tight text-balance text-foreground md:text-5xl">
            {name}
          </h1>
          <p className="mt-2 text-sm font-medium text-accent">{t("tagline")}</p>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">{t("description")}</p>
          <p className="mt-4 text-xs text-muted-foreground">
            {skus.length > 0 && <>{tc("codesCount", { count: skus.length })} · </>}
            {tc("rangesCount", { count: ranges.length })}
          </p>
          <RequestActions family={family} labels={actionLabels} className="mt-7" />
        </div>
        <div>
          <FamilyVisual
            family={family}
            locale={locale}
            name={name}
            labels={{ editorial: tc("editorialBadge"), studio: tp("studioBadge") }}
            sizes="(min-width: 1280px) 38rem, (min-width: 1024px) 50vw, 100vw"
            priority
            className="rounded-lg border border-border"
          />
          {/* A studio representation is never inventory, a supplier batch or
              evidence — say so under the image. */}
          {hero.kind === "studio" && hasPublicFile(hero.src) && (
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{tp("studioNote")}</p>
          )}
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
                      badge: tc("editorialBadge"),
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
            <p className="rounded-lg border border-dashed border-border bg-muted/30 p-4 text-xs leading-relaxed text-muted-foreground">
              {tc("perRequestNote")}
            </p>
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
