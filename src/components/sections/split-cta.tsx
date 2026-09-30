import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Href = React.ComponentProps<typeof Link>["href"];
type Path = {
  label: string;
  body: string;
  cta: string;
  href: Href;
  secondaryCta?: string;
  secondaryHref?: Href;
};

/**
 * Closing CTA with two pathways: buyers to RFQ, suppliers to registration.
 * Two flat plates (forest and sand) with quiet, arrow-free actions.
 */
export function SplitCta({
  title,
  subtitle,
  buyer,
  supplier,
  id,
}: {
  title: string;
  subtitle?: string;
  buyer: Path;
  supplier: Path;
  id?: string;
}) {
  return (
    <section id={id} className="scroll-mt-24 bg-background">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 md:py-32 lg:px-8">
        <h2 className="max-w-3xl font-serif text-[2.1rem] leading-[1.1] font-medium tracking-[-0.01em] text-balance text-foreground md:text-5xl">
          {title}
        </h2>
        {subtitle && <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-[1.0625rem]">{subtitle}</p>}
        <div className="mt-14 grid gap-4 md:mt-16 md:grid-cols-2 md:gap-6">
          {[buyer, supplier].map((path, i) => (
            <div key={path.label} className={cn("flex min-h-72 flex-col p-7 md:p-10", i === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-foreground")}>
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-xs font-medium tracking-[0.24em] text-accent uppercase">{path.label}</h3>
                <span className={cn("font-serif text-lg tabular-nums", i === 0 ? "text-primary-foreground/50" : "text-muted-foreground")}>0{i + 1}</span>
              </div>
              <p className={cn("mt-auto max-w-lg pt-14 font-serif text-xl leading-relaxed md:text-[1.4rem]", i === 0 ? "text-primary-foreground/90" : "text-foreground")}>{path.body}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href={path.href}
                  className={cn(
                    buttonVariants({ variant: i === 0 ? "default" : "outline", size: "lg" }),
                    "h-12 w-full cursor-pointer rounded-sm px-7 text-[0.9375rem] sm:w-auto",
                    i === 0
                      ? "bg-primary-foreground text-primary hover:bg-white"
                      : "border-foreground/30 bg-transparent text-foreground hover:border-foreground hover:bg-transparent"
                  )}
                >
                  {path.cta}
                </Link>
                {path.secondaryCta && path.secondaryHref && (
                  <Link
                    href={path.secondaryHref}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "lg" }),
                      "h-12 w-full cursor-pointer rounded-sm border-primary-foreground/35 bg-transparent px-7 text-[0.9375rem] text-primary-foreground hover:border-primary-foreground hover:bg-transparent sm:w-auto"
                    )}
                  >
                    {path.secondaryCta}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
