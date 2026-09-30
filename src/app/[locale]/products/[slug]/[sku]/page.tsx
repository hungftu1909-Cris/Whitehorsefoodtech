import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronDown, FileText, Layers, MapPin, Package } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/catalog/breadcrumbs";
import { RequestActions } from "@/components/catalog/request-actions";
import { SkuCard } from "@/components/catalog/cards";
import { DualImageFrame } from "@/components/catalog/dual-image-frame";
import { toFrameImages } from "@/lib/frame-images";
import { SpecPlate } from "@/components/catalog/spec-plate";
import { RequestBar } from "@/components/catalog/request-bar";
import { PRODUCT_CATEGORIES } from "@/lib/nav";
import {
  AGREED_PER_ORDER,
  CATALOG_SKUS,
  PACKAGING_OPTIONS,
  findRange,
  findSku,
  pick,
  relatedSkus,
} from "@/lib/catalog";
import { skuMedia } from "@/lib/media-manifest";
import { rfqHref } from "@/lib/rfq-links";
import { pageMetadata } from "@/lib/seo";
import { routing } from "@/i18n/routing";

// Only confirmed product codes have pages; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    CATALOG_SKUS.map((sku) => ({ locale, slug: sku.family, sku: sku.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string; sku: string }>;
}): Promise<Metadata> {
  const { locale, slug, sku: skuSlug } = await params;
  const sku = findSku(slug, skuSlug);
  if (!sku) return {};
  return pageMetadata({
    locale,
    path: `/products/${sku.family}/${sku.slug}`,
    title: `${pick(sku.name, locale)} (${sku.code})`,
    description: pick(sku.summary, locale),
    images: skuMedia(sku.code).map((image) => image.src).slice(0, 1),
  });
}

export default async function SkuPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string; sku: string }>;
}) {
  const { locale, slug, sku: skuSlug } = await params;
  setRequestLocale(locale);
  const sku = findSku(slug, skuSlug);
  const category = PRODUCT_CATEGORIES.find((c) => c.slug === slug);
  if (!sku || !category) notFound();

  const tc = await getTranslations({ locale, namespace: "catalog" });
  const tf = await getTranslations({ locale, namespace: `products.categories.${category.categoryKey}` });
  const range = findRange(sku.range)!;
  const familyName = tf("name");
  const name = pick(sku.name, locale);
  const related = relatedSkus(sku);
  const media = skuMedia(sku.code);
  const packaging = PACKAGING_OPTIONS[sku.family];
  const steps = tc.raw("orderingSteps") as string[];
  const formatRow = sku.specs.find((row) => row.reference && /Format|Drying|Species/.test(row.label.en));

  const tiles = [
    { icon: Layers, label: tc("tileRange"), value: pick(range.name, locale) },
    { icon: MapPin, label: tc("tileOrigin"), value: tc("tileOriginValue") },
    { icon: Package, label: tc("tilePackaging"), value: tc("tilePackagingValue") },
    { icon: FileText, label: tc("tileDocuments"), value: tc("tileDocumentsValue") },
  ];

  return (
    <>
      <Breadcrumbs
        locale={locale}
        label={tc("breadcrumbLabel")}
        crumbs={[
          { label: tc("breadcrumbHome"), href: "/" },
          { label: tc("breadcrumbProducts"), href: "/products" },
          { label: familyName, href: `/products/${sku.family}` },
          { label: `${sku.code} ${name}` },
        ]}
      />

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 pt-8 pb-14 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          {/* SKU_MEDIA by code: the code's own pack; a second view only when a
              second verified image of this code exists (hover / auto-advance,
              no manual chooser). */}
          {media.length > 0 ? (
            <DualImageFrame
              images={toFrameImages(media, locale, tc("conceptPackBadge"))}
              sizes="(min-width: 1024px) 40rem, 100vw"
              priority
              className="rounded-lg border border-border"
            />
          ) : (
            <SpecPlate eyebrow={sku.code} formats={[name]} className="rounded-lg border border-border" />
          )}
          {media.some((image) => image.kind === "concept-pack") && (
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{tc("conceptPackNote")}</p>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
            {tc("codeLabel")} · <span className="font-mono tracking-wider">{sku.code}</span>
          </p>
          <h1 className="mt-3 font-serif text-4xl leading-[1.1] font-semibold tracking-tight text-balance text-foreground md:text-5xl">
            {name}
          </h1>
          <p className="mt-2 text-sm font-medium text-accent">
            {pick(range.name, locale)}
            {formatRow?.reference && ` · ${pick(formatRow.reference, locale)}`}
          </p>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">{pick(sku.summary, locale)}</p>

          <p className="mt-6 text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase">
            {tc("applicationsLabel")}
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {sku.applications.map((app) => (
              <li key={app.en}>
                <Badge variant="secondary" className="bg-muted text-foreground">
                  {pick(app, locale)}
                </Badge>
              </li>
            ))}
          </ul>

          <RequestActions
            family={sku.family}
            range={sku.range}
            sku={sku.code}
            labels={{ sample: tc("requestSample"), spec: tc("requestSpec"), quote: tc("requestQuote") }}
            className="mt-8"
          />
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{tc("perRequestNote")}</p>
        </div>
      </section>

      {/* Technical tiles */}
      <section className="border-y border-border bg-muted/30">
        <dl className="mx-auto grid max-w-7xl grid-cols-1 gap-px px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {tiles.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3 py-6 sm:px-4">
              <Icon className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
              <div>
                <dt className="text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase">{label}</dt>
                <dd className="mt-1 text-sm text-foreground">{value}</dd>
              </div>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 py-16 sm:px-6 lg:grid-cols-5 lg:px-8">
        {/* Typical reference parameters */}
        <div className="min-w-0 lg:col-span-3">
          <h2 className="font-serif text-2xl font-semibold text-foreground">{tc("referenceTitle")}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tc("referenceDisclaimer")}</p>
          <div className="mt-6 overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[32rem] text-left text-sm">
              <thead className="bg-muted/50 text-xs text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">{tc("paramHeader")}</th>
                  <th scope="col" className="px-4 py-3 font-semibold">{tc("referenceHeader")}</th>
                  <th scope="col" className="px-4 py-3 font-semibold">{tc("methodHeader")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sku.specs.map((row) => (
                  <tr key={row.label.en}>
                    <th scope="row" className="px-4 py-3 font-medium text-foreground">{pick(row.label, locale)}</th>
                    <td className={row.reference ? "px-4 py-3 text-foreground" : "px-4 py-3 text-muted-foreground italic"}>
                      {pick(row.reference ?? AGREED_PER_ORDER, locale)}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {[row.method, row.source].filter(Boolean).join(" · ") || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Progressive disclosure */}
        <div className="min-w-0 space-y-3 lg:col-span-2">
          {[
            {
              title: tc("docsTitle"),
              body: <p>{tc("docsBody")}</p>,
            },
            {
              title: tc("packagingTitle"),
              body: packaging ? (
                <ul className="space-y-1.5">
                  {packaging.map((option) => (
                    <li key={option.en}>{pick(option, locale)}</li>
                  ))}
                  <li className="italic">{tc("packagingDefault")}</li>
                </ul>
              ) : (
                <p>{tc("packagingDefault")}</p>
              ),
            },
            {
              title: tc("orderingTitle"),
              body: (
                <ol className="list-decimal space-y-1.5 pl-4">
                  {steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              ),
            },
          ].map((item, i) => (
            <details key={item.title} open={i === 0} className="group rounded-lg border border-border bg-card">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 font-serif text-base font-semibold text-foreground">
                {item.title}
                <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true" />
              </summary>
              <div className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{item.body}</div>
            </details>
          ))}
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="font-serif text-2xl font-semibold text-foreground">{tc("relatedTitle")}</h2>
            <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <li key={item.code} className="flex">
                  <SkuCard
                    sku={item}
                    locale={locale}
                    labels={{
                      view: tc("viewDetails"),
                      sample: tc("requestSample"),
                      conceptBadge: tc("conceptPackBadge"),
                      rangeLabel: tc("rangeLabel"),
                      rangeName: pick(findRange(item.range)!.name, locale),
                    }}
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-14 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <h2 className="font-serif text-xl font-semibold text-foreground">{tc("broaderTitle")}</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{tc("broaderBody")}</p>
          </div>
          <Link
            href={`/products/${sku.family}#ranges`}
            className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 text-sm font-medium text-accent hover:underline"
          >
            {tc("broaderCta", { family: familyName })}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <RequestBar
        href={rfqHref({ family: sku.family, range: sku.range, sku: sku.code, intent: "sample" })}
        label={tc("stickyLabel")}
        context={`${sku.code} ${name}`}
      />
    </>
  );
}
