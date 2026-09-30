import { cn } from "@/lib/utils";

/*
 * Small inline flag marks for the language controls and entry chooser.
 * Decorative (aria-hidden): the language name is always given in text or
 * screen-reader text next to them. No emoji (inconsistent across platforms).
 */

const frame = "inline-block shrink-0 overflow-hidden rounded-[2px] ring-1 ring-black/10";

/** United States — English. Simplified canton (a star field at this size). */
export function FlagUS({ className }: { className?: string }) {
  const stripes = Array.from({ length: 13 }, (_, i) => i);
  const stars: [number, number][] = [];
  for (let row = 0; row < 5; row++) for (let col = 0; col < (row % 2 ? 5 : 6); col++) stars.push([6.5 + col * 12.5 + (row % 2 ? 6.25 : 0), 5.5 + row * 10.5]);
  return (
    <svg viewBox="0 0 190 100" aria-hidden="true" focusable="false" className={cn(frame, "h-3.5 w-[1.4rem]", className)}>
      {stripes.map((i) => (
        <rect key={i} x="0" y={(i * 100) / 13} width="190" height={100 / 13 + 0.2} fill={i % 2 ? "#FFFFFF" : "#B22234"} />
      ))}
      <rect x="0" y="0" width="76" height={(7 * 100) / 13} fill="#3C3B6E" />
      {stars.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="2.6" fill="#FFFFFF" />
      ))}
    </svg>
  );
}

/** Viet Nam — Tiếng Việt. */
export function FlagVN({ className }: { className?: string }) {
  // Five-pointed star centred on the field.
  const points = Array.from({ length: 10 }, (_, i) => {
    const r = i % 2 === 0 ? 6 : 2.4;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    return `${(15 + r * Math.cos(a)).toFixed(2)},${(10 + r * Math.sin(a)).toFixed(2)}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 30 20" aria-hidden="true" focusable="false" className={cn(frame, "h-3.5 w-[1.3rem]", className)}>
      <rect width="30" height="20" fill="#DA251D" />
      <polygon points={points} fill="#FFFF00" />
    </svg>
  );
}

export const LOCALE_FLAG = { en: FlagUS, vi: FlagVN } as const;
