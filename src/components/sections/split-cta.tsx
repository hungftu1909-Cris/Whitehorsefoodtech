import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Href = React.ComponentProps<typeof Link>["href"];
type Path = { label: string; body: string; cta: string; href: Href };

/** Closing CTA with two pathways: buyers to RFQ, suppliers to registration. */
export function SplitCta({
  title,
  subtitle,
  buyer,
  supplier,
}: {
  title: string;
  subtitle?: string;
  buyer: Path;
  supplier: Path;
}) {
  return (
    <section className="bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <h2 className="max-w-3xl font-serif text-3xl leading-tight font-semibold text-balance text-foreground md:text-5xl">
          {title}
        </h2>
        {subtitle && <p className="mt-5 max-w-2xl text-muted-foreground">{subtitle}</p>}
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {[buyer, supplier].map((path, i) => (
            <div key={path.label} className={cn("flex min-h-64 flex-col rounded-xl border p-6 md:p-8", i === 0 ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground")}>
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">{path.label}</h3>
                <span className={cn("font-mono text-xs", i === 0 ? "text-primary-foreground/45" : "text-muted-foreground")}>0{i + 1}</span>
              </div>
              <p className={cn("mt-auto max-w-lg pt-12 text-lg leading-relaxed", i === 0 ? "text-primary-foreground/80" : "text-muted-foreground")}>{path.body}</p>
              <Link
                href={path.href}
                className={cn(
                  buttonVariants({ variant: i === 0 ? "default" : "outline", size: "lg" }),
                  "mt-6 h-11 w-full cursor-pointer justify-between px-5 text-sm sm:w-auto sm:self-start",
                  i === 0
                    ? "bg-accent text-accent-foreground hover:bg-accent/90"
                    : "border-border bg-transparent text-foreground hover:border-accent hover:bg-muted"
                )}
              >
                {path.cta}
                <ArrowRight className="ml-2 size-4" aria-hidden="true" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
