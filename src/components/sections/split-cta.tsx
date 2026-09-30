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
 * Two light plates (white on a hairline, and pale mist) with quiet,
 * arrow-free actions; the buyer path leads with the solid forest action.
 * Both bodies start on the same line under the label row and the actions
 * sit on a shared baseline, whatever the copy length.
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
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 md:py-24 lg:px-8">
        <h2 className="max-w-3xl font-serif text-[2.1rem] leading-[1.1] font-medium tracking-[-0.01em] text-balance text-foreground md:text-5xl">
          {title}
        </h2>
        {subtitle && <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-[1.0625rem]">{subtitle}</p>}
        <div className="mt-10 grid gap-4 md:mt-12 md:grid-cols-2 md:gap-6">
          {[buyer, supplier].map((path, i) => (
            <div key={path.label} className={cn("flex min-h-64 min-w-0 flex-col p-6 text-foreground sm:p-7 md:p-10", i === 0 ? "border border-foreground/12 bg-card" : "bg-muted")}>
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-xs font-medium tracking-[0.24em] text-accent uppercase">{path.label}</h3>
                <span className="font-serif text-lg text-muted-foreground tabular-nums">0{i + 1}</span>
              </div>
              <p className="mt-10 max-w-lg font-serif text-xl leading-relaxed text-foreground md:text-[1.4rem]">{path.body}</p>
              <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row sm:flex-wrap">
                <Link
                  href={path.href}
                  className={cn(
                    buttonVariants({ variant: i === 0 ? "default" : "outline", size: "lg" }),
                    "h-auto min-h-12 w-full cursor-pointer rounded-sm px-6 py-3 text-center text-[0.9375rem] whitespace-normal sm:w-auto sm:px-7",
                    i === 0
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
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
                      "h-auto min-h-12 w-full cursor-pointer rounded-sm border-foreground/30 bg-transparent px-6 py-3 text-center text-[0.9375rem] whitespace-normal text-foreground hover:border-foreground hover:bg-transparent sm:w-auto sm:px-7"
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
