import { cn } from "@/lib/utils";

/**
 * Image-free, specification-led plate for a range with no verified imagery
 * (src/lib/media-manifest.ts status "missing"). Same 4:3 footprint as a
 * product image so grids stay aligned, but it never imitates a photo or a
 * gallery: no counter, no crossfade, no stand-in picture. Decorative — the
 * range name and formats are repeated in the card body for screen readers.
 */
export function SpecPlate({
  eyebrow,
  formats,
  className,
}: {
  eyebrow: string;
  formats: string[];
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      data-media-frame="none"
      className={cn(
        "relative flex aspect-[4/3] flex-col justify-between overflow-hidden bg-muted/60 p-6 md:p-7",
        className
      )}
    >
      <span className="text-[0.65rem] font-semibold tracking-[0.18em] text-accent uppercase">{eyebrow}</span>
      <ul className="space-y-1.5 border-t border-foreground/12 pt-4">
        {formats.map((format) => (
          <li key={format} className="font-serif text-xl leading-snug text-foreground/85 md:text-[1.35rem]">
            {format}
          </li>
        ))}
      </ul>
    </div>
  );
}
