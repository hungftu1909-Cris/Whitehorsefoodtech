import Image from "next/image";
import { cn } from "@/lib/utils";

type FrameImage = {
  src: string;
  alt: string;
  badge?: string;
};

/**
 * Shared two-view product treatment. The first view is always visible and
 * the second view crossfades on hover or keyboard focus — the same quiet
 * interaction used by the original coffee cards, without manual selectors.
 */
export function DualImageFrame({
  images,
  sizes,
  priority,
  className,
  showBadge = true,
  showCounter = true,
}: {
  images: FrameImage[];
  sizes: string;
  priority?: boolean;
  className?: string;
  showBadge?: boolean;
  /** The "01 / 02" marker; editorial grids that explain the pair elsewhere hide it. */
  showCounter?: boolean;
}) {
  const primary = images[0];
  const secondary = images[1];

  return (
    <div
      className={cn(
        "group/media relative aspect-[4/3] overflow-hidden bg-muted outline-none",
        className
      )}
    >
      <Image
        src={primary.src}
        alt={primary.alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn(
          "object-cover transition-all duration-700 ease-out",
          secondary &&
            "dual-frame-primary group-hover/media:scale-[1.03] group-hover/media:opacity-0"
        )}
      />
      {secondary && (
        <Image
          src={secondary.src}
          alt={secondary.alt}
          fill
          sizes={sizes}
          className="dual-frame-secondary object-cover opacity-0 transition-all duration-700 ease-out group-hover/media:scale-[1.03] group-hover/media:opacity-100"
        />
      )}
      {showBadge && primary.badge && (
        <span
          className={cn(
            "absolute bottom-3 left-3 rounded-sm bg-background/92 px-2.5 py-1 text-xs font-medium tracking-[0.08em] text-foreground/80 uppercase transition-opacity duration-300",
            secondary && "dual-frame-primary-badge group-hover/media:opacity-0"
          )}
        >
          {primary.badge}
        </span>
      )}
      {showBadge && secondary?.badge && (
        <span className="dual-frame-secondary-badge absolute bottom-3 left-3 rounded-sm bg-background/92 px-2.5 py-1 text-xs font-medium tracking-[0.08em] text-foreground/80 uppercase opacity-0 transition-opacity duration-300 group-hover/media:opacity-100">
          {secondary.badge}
        </span>
      )}
      {secondary && showCounter && (
        <span className="absolute top-3 right-3 rounded-sm bg-background/88 px-2 py-1 font-mono text-xs tracking-wider text-foreground">
          01 / 02
        </span>
      )}
    </div>
  );
}
