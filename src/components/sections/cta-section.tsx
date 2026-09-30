import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type Href = React.ComponentProps<typeof Link>["href"];

/**
 * Closing enquiry band in the shared light finish: mist surface on a
 * hairline, forest primary action, quiet outline secondary.
 */
export function CtaSection({
  title,
  subtitle,
  cta,
  href = "/rfq",
  secondaryCta,
  secondaryHref,
  className,
}: {
  title: string;
  subtitle?: string;
  cta: string;
  href?: Href;
  secondaryCta?: string;
  secondaryHref?: Href;
  className?: string;
}) {
  return (
    <section className={cn("border-t border-border bg-muted/50 text-foreground", className)}>
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-5 py-14 sm:px-6 md:flex-row md:items-center md:justify-between md:py-16 lg:px-8">
        <div>
          <h2 className="font-serif text-2xl font-medium tracking-[-0.01em] text-balance md:text-[2rem]">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <Link
            href={href}
            className="inline-flex h-12 cursor-pointer items-center rounded-sm bg-primary px-6 text-[0.9375rem] font-medium text-primary-foreground transition-colors duration-200 hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            {cta}
          </Link>
          {secondaryCta && secondaryHref && (
            <Link
              href={secondaryHref}
              className="inline-flex h-12 cursor-pointer items-center rounded-sm border border-foreground/25 px-6 text-[0.9375rem] font-medium text-foreground transition-colors duration-200 hover:border-foreground/60 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
            >
              {secondaryCta}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
