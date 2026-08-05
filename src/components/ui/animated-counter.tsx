"use client";

import { useEffect, useRef, useState } from "react";

const NUMERIC_PREFIX = /^([\d,]+)(.*)$/;

/**
 * Counts up from 0 to the numeric part of `value` once scrolled into view
 * (e.g. "3,000+" → animates 0→3,000 then renders "3,000+"). Values with no
 * leading number (or prefers-reduced-motion) just render as static text.
 */
export function AnimatedCounter({
  value,
  durationMs = 1400,
}: {
  value: string;
  durationMs?: number;
}) {
  const match = value.match(NUMERIC_PREFIX);
  const target = match ? parseInt(match[1].replace(/,/g, ""), 10) : null;
  const suffix = match ? match[2] : "";

  const [display, setDisplay] = useState("0");
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (target === null) return;
    const el = ref.current;
    if (!el) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        observer.unobserve(el);

        if (reducedMotion) {
          setDisplay(target.toLocaleString());
          return;
        }

        const start = performance.now();
        function tick(now: number) {
          const progress = Math.min((now - start) / durationMs, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(Math.round(target! * eased).toLocaleString());
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, durationMs]);

  if (target === null) {
    return <span>{value}</span>;
  }

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}
