"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ImagePlaceholder } from "./image-placeholder";

export type CarouselSlide = { src: string; alt: string };

/**
 * Auto-advancing, cross-fading image carousel. Falls back to a single
 * static image (no controls) when only one slide is available, and to
 * <ImagePlaceholder> when none are. Pauses on hover/focus and respects
 * prefers-reduced-motion (no auto-advance, but dots still work).
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
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (slides.length < 2 || paused || reducedMotion.current) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [slides.length, paused, intervalMs]);

  if (slides.length === 0) {
    return <ImagePlaceholder label={placeholderLabel} aspect={aspect} className={className} />;
  }

  return (
    <div
      className={cn(aspect, "relative overflow-hidden rounded-lg border border-border", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {slides.map((slide, i) => (
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
      ))}

      {slides.length > 1 && (
        <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              aria-label={`Show slide ${i + 1}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
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
