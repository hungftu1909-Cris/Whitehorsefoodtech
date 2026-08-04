import { cn } from "@/lib/utils";

/**
 * Text-based lockup used until the real brand logo file is supplied.
 * Once available, drop the source file at `brand/logo-source.png` and swap
 * this for an <Image> pointing at the processed /public/logo.svg (or .png).
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-serif text-lg font-semibold tracking-tight text-primary",
        className
      )}
    >
      <svg
        viewBox="0 0 40 40"
        aria-hidden="true"
        className="size-8 shrink-0 text-accent"
      >
        <circle cx="20" cy="20" r="19" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M12 27c2-6 3-10 8-14 2.5-2 5.5-2.5 8-1-3 .5-5 2-6.5 4 2-1 4-1 5.5.5-3 0-5 1-6.5 3-2.5 3-3.5 5-4.5 7.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
      <span className="flex flex-col leading-none">
        <span>Whitehorse</span>
        <span className="text-[0.65em] font-sans font-medium tracking-[0.2em] text-muted-foreground uppercase">
          Foodtech
        </span>
      </span>
    </span>
  );
}
