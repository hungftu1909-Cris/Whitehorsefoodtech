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
    <section className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <h2 className="max-w-3xl font-serif text-3xl leading-tight font-semibold text-balance md:text-4xl">
          {title}
        </h2>
        {subtitle && <p className="mt-5 max-w-2xl text-primary-foreground/85">{subtitle}</p>}
        <div className="mt-10 grid gap-px overflow-hidden border border-primary-foreground/20 bg-primary-foreground/20 md:grid-cols-2">
          {[buyer, supplier].map((path, i) => (
            <div key={path.label} className="flex flex-col bg-primary p-6 md:p-8">
              <h3 className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">{path.label}</h3>
              <p className="mt-3 flex-1 text-base text-primary-foreground/85">{path.body}</p>
              <Link
                href={path.href}
                className={cn(
                  buttonVariants({ variant: i === 0 ? "default" : "outline", size: "lg" }),
                  "mt-6 h-11 w-full cursor-pointer justify-between px-5 text-sm sm:w-auto sm:self-start",
                  i === 0
                    ? "bg-accent text-accent-foreground hover:bg-accent/90"
                    : "border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
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
