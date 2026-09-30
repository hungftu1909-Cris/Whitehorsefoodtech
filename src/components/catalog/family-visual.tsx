import { DualImageFrame } from "@/components/catalog/dual-image-frame";
import { FAMILY_SECONDARY_IMAGES, familyImage } from "@/lib/family-images";
import { pick, rangesFor, type FamilySlug } from "@/lib/catalog";
import { PRODUCT_CATEGORIES } from "@/lib/nav";
import { hasPublicFile } from "@/lib/media";
import { cn } from "@/lib/utils";

export type FamilyVisualLabels = {
  /** "Concept packaging" / "Bao bì ý tưởng" */
  concept: string;
};

/**
 * The visual for one product family, from src/lib/family-images.ts.
 * Always 4:3 and object-cover. Editorial and studio images carry their
 * visible badge; a studio image that is not on disk yet renders as a quiet
 * typographic panel (family number, name and ranges) instead of an empty
 * box or the retired packaging mock-ups.
 */
export function FamilyVisual({
  family,
  locale,
  name,
  labels,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  priority,
  compact,
  showBadge = true,
  showCounter = true,
  className,
}: {
  family: FamilySlug;
  locale: string;
  name: string;
  labels: FamilyVisualLabels;
  sizes?: string;
  priority?: boolean;
  /** Smaller type for mosaic tiles. */
  compact?: boolean;
  /**
   * Hide the per-image badge only where one shared, visible caption labels
   * the whole group (the About mosaic).
   */
  showBadge?: boolean;
  /** Passed to DualImageFrame. */
  showCounter?: boolean;
  className?: string;
}) {
  const image = familyImage(family);
  const secondary = FAMILY_SECONDARY_IMAGES[family];
  const frame = cn("relative aspect-[4/3] overflow-hidden", className);
  const badge = (kind: typeof image.kind) =>
    kind === "concept-pack" ? labels.concept : undefined;

  if (hasPublicFile(image.src)) {
    return (
      <DualImageFrame
        images={[
          { src: image.src, alt: pick(image.alt, locale), badge: badge(image.kind) },
          ...(hasPublicFile(secondary.src)
            ? [{ src: secondary.src, alt: pick(secondary.alt, locale), badge: badge(secondary.kind) }]
            : []),
        ]}
        sizes={sizes}
        priority={priority}
        showBadge={showBadge}
        showCounter={showCounter}
        className={frame}
      />
    );
  }

  const index = PRODUCT_CATEGORIES.findIndex((c) => c.slug === family) + 1;
  const ranges = rangesFor(family).map((range) => pick(range.name, locale));
  return (
    // Decorative: the family name and ranges are repeated in the card or
    // page copy next to it, so screen readers skip the panel.
    <div
      aria-hidden="true"
      className={cn(frame, "flex flex-col justify-between bg-muted/60", compact ? "p-4" : "p-6 md:p-8")}
    >
      <span className="font-serif text-sm text-accent tabular-nums">{String(index).padStart(2, "0")}</span>
      <div>
        <p
          className={cn(
            "font-serif leading-tight text-balance text-foreground",
            compact ? "text-lg" : "text-2xl md:text-3xl"
          )}
        >
          {name}
        </p>
        {!compact && (
          <p className="mt-3 border-t border-foreground/15 pt-3 text-xs leading-relaxed text-muted-foreground">
            {ranges.join(" · ")}
          </p>
        )}
      </div>
    </div>
  );
}
