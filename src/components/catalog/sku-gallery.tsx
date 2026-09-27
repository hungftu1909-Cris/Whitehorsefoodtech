"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Main image + thumbnail switcher for a product-code page. The first image
 * is server-rendered with priority (LCP); thumbnails only swap the main
 * image. Every image carries a visible badge because these are editorial
 * references, not packshots of the exact product.
 */
export function SkuGallery({
  images,
  badge,
  label,
  showLabel,
}: {
  images: { src: string; alt: string }[];
  badge: string;
  label: string;
  /** "Show image {index}" with {index} to be replaced. */
  showLabel: string;
}) {
  const [active, setActive] = useState(0);
  const current = images[active];

  return (
    <div role="group" aria-label={label}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-muted">
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt}
          fill
          priority={active === 0}
          sizes="(min-width: 1024px) 40rem, 100vw"
          className="object-cover"
        />
        <span className="absolute bottom-2 left-2 rounded-full border border-border/60 bg-background/90 px-2 py-0.5 text-[0.65rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
          {badge}
        </span>
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-3">
          {images.map((image, i) => (
            <button
              key={image.src}
              type="button"
              aria-label={showLabel.replace("{index}", String(i + 1))}
              aria-pressed={i === active}
              onClick={() => setActive(i)}
              className={cn(
                "relative aspect-[4/3] w-24 cursor-pointer overflow-hidden rounded-md border-2 transition-colors",
                i === active ? "border-accent" : "border-transparent opacity-80 hover:opacity-100"
              )}
            >
              <Image src={image.src} alt="" fill sizes="6rem" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
