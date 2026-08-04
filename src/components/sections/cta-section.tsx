import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CtaSection({
  title,
  subtitle,
  cta,
  href = "/rfq",
  className,
}: {
  title: string;
  subtitle?: string;
  cta: string;
  href?: string;
  className?: string;
}) {
  return (
    <section className={cn("bg-primary text-primary-foreground", className)}>
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 px-4 py-16 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-balance md:text-3xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 max-w-xl text-primary-foreground/75">{subtitle}</p>
          )}
        </div>
        <Link
          href={href}
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "shrink-0 cursor-pointer bg-accent text-accent-foreground hover:bg-accent/90"
          )}
        >
          {cta}
        </Link>
      </div>
    </section>
  );
}
