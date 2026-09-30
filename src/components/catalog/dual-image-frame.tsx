import Image from "next/image";
import { cn } from "@/lib/utils";

export type FrameImage = {
  /** Stable media-manifest id; rendered as data-media-id for audits. */
  id: string;
  src: string;
  alt: string;
  badge?: string;
};

/**
 * Shared product image treatment, fed only by src/lib/media-manifest.ts.
 * With two verified images the second view crossfades on hover or keyboard
 * focus (desktop) and auto-advances about every 8 seconds on touch screens —
 * no manual selectors. With one image it is a still frame: no counter, no
 * animation. A second image that repeats the first is never shown.
 */
export function DualImageFrame({
  images,
  sizes,
  priority,
  className,
  showBadge = true,
  showCounter = true,
}: {
  images: FrameImage[];
  sizes: string;
  priority?: boolean;
  className?: string;
  showBadge?: boolean;
  /** The "01 / 02" marker; editorial grids that explain the pair elsewhere hide it. */
  showCounter?: boolean;
}) {
  const primary = images[0];
  const secondary = images[1] && images[1].src !== primary.src ? images[1] : undefined;

  return (
    <div
      data-media-frame={secondary ? "pair" : "single"}
      className={cn(
        "group/media relative aspect-[4/3] overflow-hidden bg-muted outline-none",
        className
      )}
    >
      <Image
        src={primary.src}
        alt={primary.alt}
        data-media-id={primary.id}
        data-media-slot="01"
        fill
        sizes={sizes}
        priority={priority}
        className={cn(
          "object-cover transition-all duration-700 ease-out",
          secondary &&
            "dual-frame-primary group-hover/media:scale-[1.03] group-hover/media:opacity-0"
        )}
      />
      {secondary && (
        <Image
          src={secondary.src}
          alt={secondary.alt}
          data-media-id={secondary.id}
          data-media-slot="02"
          fill
          sizes={sizes}
          className="dual-frame-secondary object-cover opacity-0 transition-all duration-700 ease-out group-hover/media:scale-[1.03] group-hover/media:opacity-100"
        />
      )}
      {showBadge && primary.badge && (
        <span
          className={cn(
            "absolute bottom-3 left-3 rounded-sm bg-background/92 px-2.5 py-1 text-xs font-medium tracking-[0.08em] text-foreground/80 uppercase transition-opacity duration-300",
            secondary && "dual-frame-primary-badge group-hover/media:opacity-0"
          )}
        >
          {primary.badge}
        </span>
      )}
      {showBadge && secondary?.badge && (
        <span className="dual-frame-secondary-badge absolute bottom-3 left-3 rounded-sm bg-background/92 px-2.5 py-1 text-xs font-medium tracking-[0.08em] text-foreground/80 uppercase opacity-0 transition-opacity duration-300 group-hover/media:opacity-100">
          {secondary.badge}
        </span>
      )}
      {secondary && showCounter && (
        <span className="absolute top-3 right-3 rounded-sm bg-background/88 px-2 py-1 font-mono text-xs tracking-wider text-foreground">
          01 / 02
        </span>
      )}
    </div>
  );
}

/** Manifest assets → frame images, with the concept-packaging badge where due. */
export function toFrameImages(
  assets: { id: string; src: string; alt: { en: string; vi: string }; kind: string }[],
  locale: string,
  conceptBadge: string,
  { decorative = false }: { decorative?: boolean } = {}
): FrameImage[] {
  return assets.map((asset) => ({
    id: asset.id,
    src: asset.src,
    alt: decorative ? "" : locale === "vi" ? asset.alt.vi : asset.alt.en,
    badge: asset.kind === "concept-pack" ? conceptBadge : undefined,
  }));
}
