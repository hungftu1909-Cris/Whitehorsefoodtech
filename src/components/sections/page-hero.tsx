import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  className,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <section className={cn("border-b border-border bg-muted/40", className)}>
      <div
        className={cn(
          "mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8",
          align === "center" && "text-center"
        )}
      >
        {eyebrow && (
          <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
            {eyebrow}
          </p>
        )}
        <h1
          className={cn(
            "mt-3 max-w-3xl font-serif text-4xl leading-[1.08] font-semibold tracking-tight text-balance text-foreground md:text-5xl",
            align === "center" && "mx-auto"
          )}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className={cn(
              "mt-5 max-w-2xl text-lg text-pretty text-muted-foreground",
              align === "center" && "mx-auto"
            )}
          >
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
