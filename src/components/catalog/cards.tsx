import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { CATALOG_SKUS, pick, type CatalogRange, type CatalogSku } from "@/lib/catalog";
import { rangeMedia, skuMedia } from "@/lib/media-manifest";
import { rfqHref } from "@/lib/rfq-links";
import { DualImageFrame } from "@/components/catalog/dual-image-frame";
import { QuickViewButton } from "@/components/catalog/filter-grid";
import { toFrameImages } from "@/lib/frame-images";
import { SpecPlate } from "@/components/catalog/spec-plate";

// Shared action styles (home, catalogue, family pages and RFQ use the same pair).
export const primaryAction =
  "inline-flex min-h-11 cursor-pointer items-center justify-center gap-1.5 rounded-sm bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors duration-200 hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:outline-none";
export const secondaryAction =
  "inline-flex min-h-11 cursor-pointer items-center justify-center gap-1.5 rounded-sm border border-foreground/20 px-4 text-sm font-medium text-foreground transition-colors duration-200 hover:border-foreground/50 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none";
const textAction =
  "inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-sm text-sm font-medium text-foreground underline decoration-accent/50 underline-offset-4 transition-colors duration-200 hover:decoration-accent focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none";

/**
 * Image-led card for a confirmed product code: image, code, name, one-line
 * format/application, "View details" and a quick sample request. Images come
 * from SKU_MEDIA by code — the code's own pack only; a second view appears
 * only when a second verified image of that code exists. The image is an
 * overlay link, so its 01/02 control is never nested inside an <a>.
 * No price, stock or cart — deliberately.
 */
export function SkuCard({
  sku,
  locale,
  labels,
}: {
  sku: CatalogSku;
  locale: string;
  labels: { view: string; sample: string; conceptBadge: string; rangeLabel: string; rangeName: string };
}) {
  const media = skuMedia(sku.code);
  const href = `/products/${sku.family}/${sku.slug}`;
  return (
    <article className="group flex w-full flex-col overflow-hidden rounded-sm border border-border bg-card transition-shadow duration-200 hover:shadow-[0_12px_32px_-22px_rgba(15,20,17,0.4)]">
      <div className="border-b border-border">
        {media.length > 0 ? (
          <DualImageFrame
            images={toFrameImages(media, locale, labels.conceptBadge, { decorative: true })}
            sizes="(min-width: 1024px) 26rem, (min-width: 640px) 50vw, 100vw"
            href={href}
          />
        ) : (
          <SpecPlate eyebrow={sku.code} formats={[pick(sku.name, locale)]} />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="font-mono text-xs font-semibold tracking-wider text-accent">{sku.code}</p>
        <h3 className="mt-1 font-serif text-xl leading-snug font-medium text-foreground">
          <Link href={href} className="cursor-pointer rounded-sm hover:underline focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none">
            {pick(sku.name, locale)}
          </Link>
        </h3>
        <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-muted-foreground">{pick(sku.line, locale)}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          <span className="text-foreground/80">{labels.rangeLabel}:</span> {labels.rangeName}
        </p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
          <Link href={href} className={textAction}>
            {labels.view}
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
          <Link href={rfqHref({ family: sku.family, range: sku.range, sku: sku.code, intent: "sample" })} className={secondaryAction}>
            {labels.sample}
          </Link>
        </div>
      </div>
    </article>
  );
}

export type RangeCardLabels = {
  formats: string;
  specify: string;
  request: string;
  conceptBadge: string;
  quickView: string;
  /** Family name — card eyebrow on mixed-family grids, plate eyebrow everywhere. */
  familyName: string;
  showFamily?: boolean;
};

const KEY_SPEC_COUNT = 3;

/**
 * Compact decision tile for a sourcing / custom-development range: the
 * range's own verified image(s) from RANGE_MEDIA (or an image-free
 * specification plate), family, name, one descriptor, formats and the first
 * specification fields to agree. Everything else — all fields, indicative
 * values with their disclaimer, code pages and prefilled requests — is one
 * tap away in the quick view (RangeDetail). A range is not a confirmed code,
 * so no code or stock status is shown.
 */
export function RangeCard({ range, locale, labels }: { range: CatalogRange; locale: string; labels: RangeCardLabels }) {
  const media = rangeMedia(range.id);
  const sizes = "(min-width: 1024px) 26rem, (min-width: 640px) 50vw, 100vw";
  const name = pick(range.name, locale);

  return (
    <article className="flex w-full flex-col overflow-hidden rounded-sm border border-border bg-card">
      {media.length > 0 ? (
        <DualImageFrame images={toFrameImages(media, locale, labels.conceptBadge)} sizes={sizes} className="border-b border-border" />
      ) : (
        <SpecPlate eyebrow={labels.familyName} formats={range.formats.map((format) => pick(format, locale))} className="border-b border-border" />
      )}
      <div className="flex flex-1 flex-col p-5">
        {labels.showFamily && <p className="mb-2 text-xs font-medium tracking-[0.14em] text-accent uppercase">{labels.familyName}</p>}
        <h3 className="font-serif text-xl leading-snug font-medium text-foreground">{name}</h3>
        <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-muted-foreground">{pick(range.summary, locale)}</p>
        <ul aria-label={labels.formats} className="mt-3 flex flex-wrap gap-1.5">
          {range.formats.map((f) => (
            <li key={f.en} className="rounded-full bg-muted px-2.5 py-1 text-xs text-foreground">
              {pick(f, locale)}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          <span className="text-foreground/80">{labels.specify}:</span>{" "}
          {range.specFields.slice(0, KEY_SPEC_COUNT).map((f) => pick(f, locale)).join(" · ")}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-3 pt-5">
          <QuickViewButton id={range.id} label={labels.quickView} srLabel={name} />
          <Link href={rfqHref({ family: range.family, range: range.id, intent: "spec-sheet" })} className={textAction}>
            {labels.request}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export type RangeDetailLabels = {
  formats: string;
  specFieldsTitle: string;
  indicative: string;
  indicativeNote: string;
  conceptBadge: string;
  familyPage: string;
  codePages: string;
  requestSpec: string;
  requestSample: string;
  perRequestNote: string;
};

/**
 * Quick-view body for a range: existing catalogue data only — no invented
 * SKU routes (code pages are linked only where they exist, i.e. coffee).
 */
export function RangeDetail({ range, locale, labels }: { range: CatalogRange; locale: string; labels: RangeDetailLabels }) {
  const media = rangeMedia(range.id);
  const codes = CATALOG_SKUS.filter((sku) => sku.range === range.id);

  return (
    <div className="space-y-6">
      {media.length > 0 && (
        <DualImageFrame images={toFrameImages(media, locale, labels.conceptBadge)} sizes="(min-width: 640px) 34rem, 100vw" className="rounded-sm border border-border" />
      )}
      <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">{pick(range.summary, locale)}</p>

      <div>
        <h3 className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">{labels.formats}</h3>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {range.formats.map((f) => (
            <li key={f.en} className="rounded-full bg-muted px-2.5 py-1 text-sm text-foreground">
              {pick(f, locale)}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">{labels.specFieldsTitle}</h3>
        <ul className="mt-2 divide-y divide-border border-y border-border">
          {range.specFields.map((f) => (
            <li key={f.en} className="py-2.5 text-[0.9375rem] text-foreground">
              {pick(f, locale)}
            </li>
          ))}
        </ul>
      </div>

      {range.indicative && (
        <div className="rounded-sm bg-muted/60 p-4">
          <h3 className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">{labels.indicative}</h3>
          <ul className="mt-2 space-y-1.5 text-[0.9375rem] text-foreground">
            {range.indicative.map((line) => (
              <li key={line.en}>{pick(line, locale)}</li>
            ))}
          </ul>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground italic">{labels.indicativeNote}</p>
        </div>
      )}

      {codes.length > 0 && (
        <div>
          <h3 className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">{labels.codePages}</h3>
          <ul className="mt-2 divide-y divide-border border-y border-border">
            {codes.map((sku) => (
              <li key={sku.code}>
                <Link
                  href={`/products/${sku.family}/${sku.slug}`}
                  className="flex min-h-11 items-center justify-between gap-4 py-2 text-[0.9375rem] text-foreground hover:text-accent focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
                >
                  <span>
                    <span className="mr-2 font-mono text-xs text-accent">{sku.code}</span>
                    {pick(sku.name, locale)}
                  </span>
                  <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Link href={rfqHref({ family: range.family, range: range.id, intent: "spec-sheet" })} className={primaryAction}>
          {labels.requestSpec}
        </Link>
        <Link href={rfqHref({ family: range.family, range: range.id, intent: "sample" })} className={secondaryAction}>
          {labels.requestSample}
        </Link>
      </div>
      <Link href={`/products/${range.family}`} className={textAction}>
        {labels.familyPage}
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
      <p className="border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground">{labels.perRequestNote}</p>
    </div>
  );
}
