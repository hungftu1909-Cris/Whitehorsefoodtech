import Image from "next/image";
import { cn } from "@/lib/utils";
import mark from "../../../public/brand/mark-256.png";

/**
 * Real brand mark (from brand/logo-source.png, cropped to just the emblem —
 * see brand/logo-mark.png for the master crop). Wrapped in a small cream
 * badge so it reads cleanly on both light surfaces (header) and dark ones
 * (footer) — the artwork's horse silhouette is cream-on-brown, so it only
 * renders correctly against a light background.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 font-serif text-lg font-semibold tracking-tight text-primary",
        className
      )}
    >
      <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#fbf7ee] p-1 ring-1 ring-black/5">
        <Image src={mark} alt="" className="h-full w-full object-contain" priority />
      </span>
      <span className="flex flex-col leading-none">
        <span>Whitehorse</span>
        <span className="text-[0.65em] font-sans font-medium tracking-[0.2em] text-muted-foreground uppercase">
          Foodtech
        </span>
      </span>
    </span>
  );
}
