import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { pick, type CatalogRange, type CatalogSku } from "@/lib/catalog";
import { rangeMedia, skuMedia } from "@/lib/media-manifest";
import { rfqHref } from "@/lib/rfq-links";
import { DualImageFrame, toFrameImages } from "@/components/catalog/dual-image-frame";
import { SpecPlate } from "@/components/catalog/spec-plate";

/**
 * Large image-led card for a confirmed product code: image, code, name,
 * one-line format/application, "View details" and a quick sample request.
 * Images come from SKU_MEDIA by code — the code's own pack only; a second
 * view appears only when a second verified image of that code exists.
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
    <article className="group flex w-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md">
      <Link href={href} className="block cursor-pointer border-b border-border" tabIndex={-1} aria-hidden="true">
        {media.length > 0 ? (
          <DualImageFrame
            images={toFrameImages(media, locale, labels.conceptBadge, { decorative: true })}
            sizes="(min-width: 1024px) 26rem, (min-width: 640px) 50vw, 100vw"
          />
        ) : (
          <SpecPlate eyebrow={sku.code} formats={[pick(sku.name, locale)]} />
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="font-mono text-xs font-semibold tracking-wider text-accent">{sku.code}</p>
        <h3 className="mt-1 font-serif text-lg font-semibold text-foreground">
          <Link href={href} className="cursor-pointer hover:text-accent">
            {pick(sku.name, locale)}
          </Link>
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{pick(sku.line, locale)}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground/80">{labels.rangeLabel}:</span> {labels.rangeName}
        </p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
          <Link href={href} className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-accent">
            {labels.view}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
          <Link
            href={rfqHref({ family: sku.family, range: sku.range, sku: sku.code, intent: "sample" })}
            className="cursor-pointer rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:border-accent hover:text-accent"
          >
            {labels.sample}
          </Link>
        </div>
      </div>
    </article>
  );
}

/**
 * Tile for a sourcing / custom-development range. The default view stays
 * short on mobile: the range's own verified image(s) from RANGE_MEDIA — or,
 * when none exist, an image-free specification plate — name + one-line
 * value, formats, the first key specification dimensions and one CTA.
 * Remaining dimensions and the indicative values (with their disclaimer) sit
 * in a native <details> — no client JS. A range is not a confirmed code, so
 * no code or stock status is shown.
 */
const KEY_SPEC_COUNT = 3;

export function RangeCard({
  range,
  locale,
  labels,
}: {
  range: CatalogRange;
  locale: string;
  labels: {
    formats: string;
    generalSpecLabel: string;
    specify: string;
    request: string;
    indicative: string;
    indicativeNote: string;
    moreDetail: string;
    conceptBadge: string;
    /** Family name — card eyebrow on mixed-family grids, plate eyebrow everywhere. */
    familyLabel?: string;
    familyName: string;
  };
}) {
  const media = rangeMedia(range.id);
  const sizes = "(min-width: 1024px) 26rem, (min-width: 640px) 50vw, 100vw";
  const keySpecs = range.specFields.slice(0, KEY_SPEC_COUNT);
  const moreSpecs = range.specFields.slice(KEY_SPEC_COUNT);
  const hasMore = moreSpecs.length > 0 || !!range.indicative;

  return (
    <article className="flex w-full flex-col overflow-hidden rounded-lg border border-border bg-card">
      {media.length > 0 ? (
        <DualImageFrame
          images={toFrameImages(media, locale, labels.conceptBadge)}
          sizes={sizes}
          className="border-b border-border"
        />
      ) : (
        <SpecPlate
          eyebrow={labels.familyName}
          formats={range.formats.map((format) => pick(format, locale))}
          className="border-b border-border"
        />
      )}
      <div className="flex flex-1 flex-col p-5">
        {labels.familyLabel && (
          <p className="mb-2 text-[0.65rem] font-semibold tracking-[0.14em] text-accent uppercase">{labels.familyLabel}</p>
        )}
        <h3 className="font-serif text-lg font-semibold text-foreground">{pick(range.name, locale)}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{pick(range.summary, locale)}</p>
        <ul aria-label={labels.formats} className="mt-3 flex flex-wrap gap-1.5">
          {range.formats.map((f) => (
            <li key={f.en} className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-foreground">
              {pick(f, locale)}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[0.65rem] font-semibold tracking-[0.14em] text-accent uppercase">
          {labels.generalSpecLabel}
        </p>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
          <span className="font-medium text-foreground/80">{labels.specify}:</span>{" "}
          {keySpecs.map((f) => pick(f, locale)).join(" · ")}
        </p>
        {hasMore && (
          <details className="group/details mt-3 border-t border-border pt-3 text-xs">
            <summary className="cursor-pointer font-medium text-foreground/80 hover:text-accent">{labels.moreDetail}</summary>
            {moreSpecs.length > 0 && (
              <ul className="mt-2 space-y-1 text-muted-foreground">
                {moreSpecs.map((f) => (
                  <li key={f.en} className="flex gap-2">
                    <span className="mt-1.5 size-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                    {pick(f, locale)}
                  </li>
                ))}
              </ul>
            )}
            {range.indicative && (
              <div className="mt-3">
                <p className="text-[0.65rem] font-semibold tracking-[0.15em] text-muted-foreground uppercase">{labels.indicative}</p>
                <ul className="mt-1.5 space-y-1 text-foreground/85">
                  {range.indicative.map((line) => (
                    <li key={line.en}>{pick(line, locale)}</li>
                  ))}
                </ul>
                <p className="mt-2 leading-relaxed text-muted-foreground italic">{labels.indicativeNote}</p>
              </div>
            )}
          </details>
        )}
        <div className="mt-auto pt-4">
          <Link
            href={rfqHref({ family: range.family, range: range.id, intent: "spec-sheet" })}
            className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-accent hover:underline"
          >
            {labels.request}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
