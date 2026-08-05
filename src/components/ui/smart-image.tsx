import Image from "next/image";
import { hasPublicFile } from "@/lib/media";
import { ImagePlaceholder } from "./image-placeholder";
import { cn } from "@/lib/utils";

/**
 * Renders a real <Image> if the file exists under /public, otherwise falls
 * back to a visible placeholder. Drop a licensed photo at `src` (relative to
 * /public, e.g. "/images/products/coffee-card.jpg") and it appears
 * automatically — no code changes needed. See README "Adding real photos".
 */
export function SmartImage({
  src,
  alt,
  placeholderLabel,
  aspect = "aspect-[4/3]",
  className,
  sizes = "(min-width: 1024px) 33vw, 100vw",
  priority,
}: {
  src: string;
  alt: string;
  placeholderLabel: string;
  aspect?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (!hasPublicFile(src)) {
    return <ImagePlaceholder label={placeholderLabel} aspect={aspect} className={className} />;
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
    </div>
  );
}
