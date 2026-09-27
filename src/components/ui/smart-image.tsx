import Image from "next/image";
import { hasPublicFile } from "@/lib/media";
import { cn } from "@/lib/utils";

/**
 * Renders a real <Image> if the file exists under /public, otherwise
 * renders nothing — a visible "missing photo" panel reads as an unfinished
 * site, so layouts are built to work text-only. Drop a licensed photo at
 * `src` (relative to /public, e.g. "/images/products/coffee-card.jpg") and
 * it appears automatically — no code changes needed. See
 * public/images/README.md.
 *
 * `badge` puts a small visible label on the image (e.g. "Concept artwork")
 * — use it whenever the artwork is not a literal product photo, since alt
 * text alone is not a disclosure a sighted buyer ever sees.
 */
export function SmartImage({
  src,
  alt,
  aspect = "aspect-[4/3]",
  className,
  sizes = "(min-width: 1024px) 33vw, 100vw",
  priority,
  badge,
}: {
  src: string;
  alt: string;
  aspect?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  badge?: string;
}) {
  if (!hasPublicFile(src)) {
    return null;
  }

  return (
    <div className={cn(aspect, "relative overflow-hidden rounded-lg border border-border", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        // group-hover only fires inside a `.group` ancestor (e.g. a product
        // card <Link>) — harmless no-op everywhere else.
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />
      {badge && (
        <span className="absolute bottom-2 left-2 rounded-full border border-border/60 bg-background/90 px-2 py-0.5 text-[0.65rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
          {badge}
        </span>
      )}
    </div>
  );
}
