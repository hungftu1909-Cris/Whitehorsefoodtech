import { DualImageFrame } from "@/components/catalog/dual-image-frame";
import { toFrameImages } from "@/lib/frame-images";
import { familyMedia } from "@/lib/media-manifest";
import { pick, rangesFor, type FamilySlug } from "@/lib/catalog";
import { hasPublicFile } from "@/lib/media";
import { cn } from "@/lib/utils";

export type FamilyVisualLabels = {
  /** "Concept packaging" / "Bao bì ý tưởng" */
  concept: string;
};

/**
 * The visual for one product family, resolved by family slug from
 * src/lib/media-manifest.ts (FAMILY_MEDIA). Always 4:3 and object-cover.
 * Two verified highlight images give the hover / auto-advance pair; one
 * gives a still frame. If no verified file is on disk the family renders a
 * quiet typographic panel (name and ranges) — never another family's image.
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
  href,
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
  /** Makes the image a link (overlay; controls stay outside the <a>). */
  href?: React.ComponentProps<typeof DualImageFrame>["href"];
  className?: string;
}) {
  const media = familyMedia(family).filter((asset) => hasPublicFile(asset.src));
  const frame = cn("relative aspect-[4/3] overflow-hidden", className);

  if (media.length > 0) {
    return (
      <DualImageFrame
        images={toFrameImages(media, locale, labels.concept)}
        sizes={sizes}
        priority={priority}
        showBadge={showBadge}
        href={href}
        className={frame}
      />
    );
  }

  const ranges = rangesFor(family).map((range) => pick(range.name, locale));
  return (
    // Decorative: the family name and ranges are repeated in the card or
    // page copy next to it, so screen readers skip the panel.
    <div
      aria-hidden="true"
      className={cn(frame, "flex flex-col justify-end bg-muted/60", compact ? "p-4" : "p-6 md:p-8")}
    >
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
