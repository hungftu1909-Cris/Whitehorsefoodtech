"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Main image + thumbnail switcher for a product-code page. The first image
 * is server-rendered with priority (LCP); thumbnails only swap the main
 * image. Every image carries its own visible badge ("Concept packaging" or
 * "Editorial image"): none of them is a photograph of the exact stock.
 */
export function SkuGallery({
  images,
  label,
  showLabel,
  priority = true,
  sizes = "(min-width: 1024px) 40rem, 100vw",
  embedded,
}: {
  images: { src: string; alt: string; badge: string }[];
  label: string;
  /** "Show image {index}" with {index} to be replaced. */
  showLabel: string;
  /** Page-hero galleries are the LCP; galleries inside cards are not. */
  priority?: boolean;
  sizes?: string;
  /** Flush inside a card: no outer frame, numbered switches instead of thumbnails. */
  embedded?: boolean;
}) {
  const [active, setActive] = useState(0);
  const current = images[active];

  return (
    <div role="group" aria-label={label}>
      <div
        className={cn(
          "relative aspect-[4/3] overflow-hidden bg-muted",
          embedded ? "border-b border-border" : "rounded-lg border border-border"
        )}
      >
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt}
          fill
          priority={priority && active === 0}
          sizes={sizes}
          className="object-cover"
        />
        <span className="absolute bottom-2 left-2 rounded-full border border-border/60 bg-background/90 px-2 py-0.5 text-[0.65rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
          {current.badge}
        </span>
      </div>
      {images.length > 1 &&
        (embedded ? (
          // Inside cards: numbered switches instead of image thumbnails, so a
          // card fetches one image until the visitor asks for another.
          <div className="flex gap-2 px-5 pt-3">
            {images.map((image, i) => (
              <button
                key={image.src}
                type="button"
                aria-label={showLabel.replace("{index}", String(i + 1))}
                aria-pressed={i === active}
                onClick={() => setActive(i)}
                className={cn(
                  "flex size-8 cursor-pointer items-center justify-center rounded-full border text-xs font-medium tabular-nums transition-colors",
                  i === active
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border text-muted-foreground hover:border-accent hover:text-accent"
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>
        ) : (
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
        ))}
    </div>
  );
}
