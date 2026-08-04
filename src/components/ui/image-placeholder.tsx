import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Visibly-a-placeholder block for photography we don't have yet — deliberately
 * NOT a stock photo, so nobody mistakes it for real product/factory imagery.
 * Swap for a real <Image> once photos are available (see README).
 */
export function ImagePlaceholder({
  label,
  className,
  aspect = "aspect-[4/3]",
}: {
  label: string;
  className?: string;
  aspect?: string;
}) {
  return (
    <div
      className={cn(
        aspect,
        "relative flex items-center justify-center overflow-hidden rounded-lg border border-border bg-[repeating-linear-gradient(135deg,var(--color-muted),var(--color-muted)_10px,transparent_10px,transparent_20px)] bg-muted",
        className
      )}
    >
      <div className="flex flex-col items-center gap-2 px-4 text-center">
        <ImageIcon className="size-6 text-muted-foreground/60" aria-hidden="true" />
        <span className="text-xs font-medium text-muted-foreground/80">{label}</span>
      </div>
    </div>
  );
}
