// Server-safe helper (no "use client"): manifest assets → DualImageFrame images.
import type { FrameImage } from "@/components/catalog/dual-image-frame";

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
