"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export type FrameImage = {
  /** Stable media-manifest id; rendered as data-media-id for audits. */
  id: string;
  src: string;
  alt: string;
  badge?: string;
};

type Href = React.ComponentProps<typeof Link>["href"];

/** Each view holds about 8 seconds on touch screens. */
export const AUTO_ADVANCE_MS = 8000;

/**
 * Shared product image treatment, fed only by src/lib/media-manifest.ts.
 *
 * One image: a still frame — no control, no motion.
 * Two verified images: mouse hover peeks at the second view until the
 * visitor makes a choice; a discreet "01 / 02" button switches views
 * anywhere (touch, keyboard, screen reader) and that choice is then
 * authoritative. Images, counter and badge always show the same view. On touch screens the pair also advances
 * about every 8 s, but only while on screen, while the tab is visible, when
 * the visitor has not asked for reduced motion, and until they pause it or
 * choose a view themselves. The images show the same product, so no
 * decision information changes underneath the visitor.
 *
 * `href` makes the image a link without nesting the controls inside an
 * <a>: a decorative overlay link sits under the controls.
 */
export function DualImageFrame({
  images,
  sizes,
  priority,
  className,
  showBadge = true,
  href,
}: {
  images: FrameImage[];
  sizes: string;
  priority?: boolean;
  className?: string;
  showBadge?: boolean;
  href?: Href;
}) {
  const t = useTranslations("catalog");
  const primary = images[0];
  const secondary = images[1] && images[1].src !== primary.src ? images[1] : undefined;
  const [active, setActive] = useState<0 | 1>(0);
  // Mouse hover peeks at the second view until the visitor chooses a view
  // explicitly; from then on the manual choice is authoritative.
  const [hovering, setHovering] = useState(false);
  const [manual, setManual] = useState(false);
  const [autoplay, setAutoplay] = useState(false);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  // Autoplay only on touch-first devices without a reduced-motion request.
  useEffect(() => {
    if (!secondary) return;
    const query = window.matchMedia("(hover: none) and (prefers-reduced-motion: no-preference)");
    const update = () => setAutoplay(query.matches);
    update();
    query.addEventListener("change", update);
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.5 });
    if (frameRef.current) observer.observe(frameRef.current);
    return () => {
      query.removeEventListener("change", update);
      observer.disconnect();
    };
  }, [secondary]);

  useEffect(() => {
    if (!secondary || !autoplay || paused || !inView) return;
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") setActive((a) => (a === 0 ? 1 : 0));
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(timer);
  }, [secondary, autoplay, paused, inView]);

  // One displayed value drives both images, the counter and the badge.
  const displayed: 0 | 1 = secondary ? (!manual && hovering ? 1 : active) : 0;
  const showSecond = displayed === 1;
  const fade = "transition-opacity duration-[400ms] ease-out motion-reduce:transition-none";

  return (
    <div
      ref={frameRef}
      data-media-frame={secondary ? "pair" : "single"}
      data-active={displayed + 1}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovering(true)}
      onPointerLeave={() => setHovering(false)}
      className={cn("group/media relative aspect-[4/3] overflow-hidden bg-muted", className)}
    >
      <Image
        src={primary.src}
        alt={primary.alt}
        data-media-id={primary.id}
        data-media-slot="01"
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", secondary && fade, showSecond ? "opacity-0" : "opacity-100")}
      />
      {secondary && (
        <Image
          src={secondary.src}
          alt={secondary.alt}
          data-media-id={secondary.id}
          data-media-slot="02"
          fill
          sizes={sizes}
          className={cn("object-cover", fade, showSecond ? "opacity-100" : "opacity-0")}
        />
      )}

      {href && (
        <Link href={href} tabIndex={-1} aria-hidden="true" className="absolute inset-0 z-[1] cursor-pointer">
          <span className="sr-only">{primary.alt}</span>
        </Link>
      )}

      {showBadge && (showSecond ? secondary?.badge : primary.badge) && (
        <span className="pointer-events-none absolute bottom-3 left-3 z-[2] rounded-sm bg-background/92 px-2.5 py-1 text-xs font-medium tracking-[0.06em] text-foreground/80 uppercase">
          {showSecond ? secondary?.badge : primary.badge}
        </span>
      )}

      {secondary && (
        <div className="absolute top-2 right-2 z-[3] flex items-center gap-1">
          {autoplay && (
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? t("playImages") : t("pauseImages")}
              className="flex size-11 cursor-pointer items-center justify-center rounded-sm text-foreground focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
            >
              <span className="flex size-7 items-center justify-center rounded-sm bg-background/88">
                {paused ? <Play className="size-3.5" aria-hidden="true" /> : <Pause className="size-3.5" aria-hidden="true" />}
              </span>
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setActive(displayed === 0 ? 1 : 0);
              setManual(true);
              setPaused(true);
            }}
            aria-label={t("showImageOf", { index: displayed === 0 ? 2 : 1 })}
            className="flex h-11 cursor-pointer items-center justify-center rounded-sm px-1 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
          >
            <span className="rounded-sm bg-background/88 px-2 py-1 font-mono text-xs tracking-wider text-foreground tabular-nums">
              {String(displayed + 1).padStart(2, "0")} / 02
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
