import { cn } from "@/lib/utils";

/**
 * Inner-page header in the shared editorial finish (serif medium headline,
 * restrained bronze eyebrow, paper/mist band). `compact` is for tool pages —
 * the catalogue and the enquiry form — where the tools themselves must be in
 * the first viewport, so the header is one short band.
 */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  className,
  align = "left",
  compact = false,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
  compact?: boolean;
  /** Extra content under the subtitle (e.g. a context summary). */
  children?: React.ReactNode;
}) {
  return (
    <section className={cn("border-b border-border bg-muted/40", className)}>
      <div
        className={cn(
          "mx-auto max-w-7xl px-5 sm:px-6 lg:px-8",
          compact ? "py-7 md:py-9" : "py-14 md:py-20",
          align === "center" && "text-center"
        )}
      >
        {eyebrow && (
          <p className="text-xs font-medium tracking-[0.2em] text-accent uppercase">
            {eyebrow}
          </p>
        )}
        <h1
          className={cn(
            "max-w-3xl font-serif leading-[1.08] font-medium tracking-[-0.015em] text-balance text-foreground",
            compact ? "mt-2 text-[1.9rem] md:text-[2.4rem]" : "mt-3 text-4xl md:text-5xl",
            align === "center" && "mx-auto"
          )}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className={cn(
              "max-w-2xl text-pretty text-muted-foreground",
              compact ? "mt-3 text-base leading-relaxed" : "mt-5 text-lg leading-relaxed",
              align === "center" && "mx-auto"
            )}
          >
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
