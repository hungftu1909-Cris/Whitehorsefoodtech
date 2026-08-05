"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ImagePlaceholder } from "./image-placeholder";

export type CarouselSlide = { src: string; alt: string };

function withMounted(mounted: Set<number>, i: number) {
  return mounted.has(i) ? mounted : new Set(mounted).add(i);
}

/**
 * Auto-advancing, cross-fading image carousel. Falls back to a single
 * static image (no controls) when only one slide is available, and to
 * <ImagePlaceholder> when none are. Pauses on hover/focus and respects
 * prefers-reduced-motion (no auto-advance, but dots still work).
 *
 * `index` and `mounted` are updated together (in the same setState call)
 * wherever the slide changes, rather than deriving `mounted` from `index`
 * in an effect — keeps this to one render per change instead of two.
 */
export function ImageCarousel({
  slides,
  placeholderLabel,
  aspect = "aspect-[16/9]",
  className,
  intervalMs = 5000,
  priority,
}: {
  slides: CarouselSlide[];
  placeholderLabel: string;
  aspect?: string;
  className?: string;
  intervalMs?: number;
  priority?: boolean;
}) {
  // Only the first slide is fetched up front; later slides are only
  // requested once the carousel actually reaches them, so a visitor who
  // never lingers on the hero never pays for slide 2/3's image bytes.
  const [{ index, mounted }, setState] = useState(() => ({
    index: 0,
    mounted: new Set([0]),
  }));
  const [paused, setPaused] = useState(false);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (slides.length < 2 || paused || reducedMotion.current) return;
    const id = setInterval(() => {
      setState((s) => {
        const next = (s.index + 1) % slides.length;
        return { index: next, mounted: withMounted(s.mounted, next) };
      });
    }, intervalMs);
    return () => clearInterval(id);
  }, [slides.length, paused, intervalMs]);

  if (slides.length === 0) {
    return <ImagePlaceholder label={placeholderLabel} aspect={aspect} className={className} />;
  }

  function goTo(i: number) {
    setState((s) => ({ index: i, mounted: withMounted(s.mounted, i) }));
  }

  return (
    <div
      className={cn(aspect, "relative overflow-hidden rounded-lg border border-border", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {slides.map((slide, i) =>
        mounted.has(i) ? (
          <Image
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority={priority && i === 0}
            className={cn(
              "object-cover transition-opacity duration-700 ease-in-out",
              i === index ? "opacity-100" : "opacity-0"
            )}
          />
        ) : null
      )}

      {slides.length > 1 && (
        <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              aria-label={`Show slide ${i + 1}`}
              aria-current={i === index}
              onClick={() => goTo(i)}
              className={cn(
                "size-1.5 cursor-pointer rounded-full transition-all",
                i === index ? "w-4 bg-white" : "bg-white/50 hover:bg-white/75"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
