import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { pick, type CatalogImage, type CatalogRange, type CatalogSku } from "@/lib/catalog";
import { rfqHref } from "@/lib/rfq-links";
import { SkuGallery } from "@/components/catalog/sku-gallery";

/** Small visible label for editorial (non-packshot) imagery. */
export function ImageBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute bottom-2 left-2 rounded-full border border-border/60 bg-background/90 px-2 py-0.5 text-[0.65rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
      {children}
    </span>
  );
}

/**
 * Large image-led card for a confirmed product code: image, code, name,
 * one-line format/application, "View details" and a quick sample request.
 * No price, stock or cart — deliberately.
 */
export function SkuCard({
  sku,
  locale,
  labels,
}: {
  sku: CatalogSku;
  locale: string;
  labels: { view: string; sample: string; badge: string; conceptBadge: string; rangeLabel: string; rangeName: string };
}) {
  const image = sku.images[0];
  const secondary = sku.images[1];
  const href = `/products/${sku.family}/${sku.slug}`;
  return (
    <article className="group flex w-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md">
      <Link href={href} className="relative block aspect-[4/3] cursor-pointer overflow-hidden border-b border-border" tabIndex={-1} aria-hidden="true">
        <Image
          src={image.src}
          alt=""
          fill
          sizes="(min-width: 1024px) 26rem, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-all duration-700 ease-out group-hover:scale-[1.03] group-hover:opacity-0 group-focus-within:opacity-0"
        />
        {secondary && (
          <Image
            src={secondary.src}
            alt=""
            fill
            sizes="(min-width: 1024px) 26rem, (min-width: 640px) 50vw, 100vw"
            className="object-cover opacity-0 transition-all duration-700 ease-out group-hover:scale-[1.03] group-hover:opacity-100 group-focus-within:opacity-100"
          />
        )}
        <span className="transition-opacity duration-300 group-hover:opacity-0 group-focus-within:opacity-0">
          <ImageBadge>{image.kind === "concept-pack" ? labels.conceptBadge : labels.badge}</ImageBadge>
        </span>
        {secondary && (
          <span className="opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
            <ImageBadge>{secondary.kind === "concept-pack" ? labels.conceptBadge : labels.badge}</ImageBadge>
          </span>
        )}
        {secondary && (
          <span className="absolute top-3 right-3 rounded-full border border-background/50 bg-background/85 px-2 py-1 font-mono text-[0.65rem] tracking-wider text-foreground">
            01 / 02
          </span>
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
 * short on mobile: a distinct image, name + one-line value, formats, the
 * first key specification dimensions and one CTA. Remaining dimensions and
 * the indicative values (with their disclaimer) sit in a native <details>
 * — no client JS. A single image renders server-side; only ranges with
 * several images use the client gallery. A range is not a confirmed code,
 * so no code or stock status is shown.
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
    studioBadge: string;
    editorialBadge: string;
    galleryLabel: string;
    familyLabel?: string;
    /** "Show image {index}" */
    showImage: string;
  };
}) {
  const badge = (kind: CatalogImage["kind"]) =>
    kind === "concept-pack" ? labels.conceptBadge : kind === "studio" ? labels.studioBadge : labels.editorialBadge;
  const images = range.images ?? [];
  const sizes = "(min-width: 1024px) 26rem, (min-width: 640px) 50vw, 100vw";
  const keySpecs = range.specFields.slice(0, KEY_SPEC_COUNT);
  const moreSpecs = range.specFields.slice(KEY_SPEC_COUNT);
  const hasMore = moreSpecs.length > 0 || !!range.indicative;

  return (
    <article className="flex w-full flex-col overflow-hidden rounded-lg border border-border bg-card">
      {images.length > 1 ? (
        <SkuGallery
          images={images.map((image) => ({ src: image.src, alt: pick(image.alt, locale), badge: badge(image.kind) }))}
          label={`${pick(range.name, locale)} — ${labels.galleryLabel}`}
          showLabel={labels.showImage}
          priority={false}
          sizes={sizes}
          embedded
        />
      ) : images.length === 1 ? (
        <div className="relative aspect-[4/3] overflow-hidden border-b border-border bg-muted">
          <Image src={images[0].src} alt={pick(images[0].alt, locale)} fill sizes={sizes} className="object-cover" />
          <ImageBadge>{badge(images[0].kind)}</ImageBadge>
        </div>
      ) : null}
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
