import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { pick, type CatalogRange, type CatalogSku } from "@/lib/catalog";
import { rfqHref } from "@/lib/rfq-links";

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
  const href = `/products/${sku.family}/${sku.slug}`;
  return (
    <article className="group flex w-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md">
      <Link href={href} className="relative block aspect-[4/3] cursor-pointer overflow-hidden border-b border-border" tabIndex={-1} aria-hidden="true">
        <Image
          src={image.src}
          alt=""
          fill
          sizes="(min-width: 1024px) 26rem, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <ImageBadge>{image.kind === "concept-pack" ? labels.conceptBadge : labels.badge}</ImageBadge>
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
 * Text-led tile for a sourcing / custom-development range: name, summary,
 * formats, the general specification fields a buyer specifies, and a
 * prefilled request. No imagery — ranges are not specific products.
 */
export function RangeCard({
  range,
  locale,
  labels,
}: {
  range: CatalogRange;
  locale: string;
  labels: { formats: string; specify: string; request: string; indicative: string; indicativeNote: string };
}) {
  return (
    <article className="flex w-full flex-col rounded-lg border border-border bg-card p-6">
      <h3 className="font-serif text-lg font-semibold text-foreground">{pick(range.name, locale)}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{pick(range.summary, locale)}</p>
      <p className="mt-4 text-[0.65rem] font-semibold tracking-[0.15em] text-muted-foreground uppercase">{labels.formats}</p>
      <ul className="mt-2 flex flex-wrap gap-1.5">
        {range.formats.map((f) => (
          <li key={f.en} className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-foreground">
            {pick(f, locale)}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[0.65rem] font-semibold tracking-[0.15em] text-muted-foreground uppercase">{labels.specify}</p>
      <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
        {range.specFields.map((f) => (
          <li key={f.en} className="flex gap-2">
            <span className="mt-1.5 size-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
            {pick(f, locale)}
          </li>
        ))}
      </ul>
      {range.indicative && (
        <div className="mt-4 border-t border-border pt-4">
          <p className="text-[0.65rem] font-semibold tracking-[0.15em] text-muted-foreground uppercase">{labels.indicative}</p>
          <ul className="mt-2 space-y-1 text-xs text-foreground/85">
            {range.indicative.map((line) => (
              <li key={line.en}>{pick(line, locale)}</li>
            ))}
          </ul>
          <p className="mt-2 text-[0.7rem] leading-relaxed text-muted-foreground italic">{labels.indicativeNote}</p>
        </div>
      )}
      <div className="mt-auto pt-5">
        <Link
          href={rfqHref({ family: range.family, range: range.id, intent: "spec-sheet" })}
          className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-accent hover:underline"
        >
          {labels.request}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
