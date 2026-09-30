import { ArrowRight, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type Stage = { number: string; title: string; body: string };

/**
 * The fixed asset: Buyer specification + Qualified network +
 * Request-specific evidence + Commercial execution. It operates today and
 * applies to any collection, so it comes before the catalogue.
 */
export function OperatingSystem() {
  const t = useTranslations("home.operating");
  const stages = t.raw("stages") as Stage[];

  return (
    <section aria-labelledby="operating-title" className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-24 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.22em] text-accent uppercase">{t("eyebrow")}</p>
            <h2 id="operating-title" className="mt-3 font-serif text-3xl leading-tight font-semibold tracking-tight text-balance text-foreground md:text-4xl">
              {t("title")}
            </h2>
            <p className="mt-4 text-base text-pretty text-muted-foreground md:text-lg">{t("subtitle")}</p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border border-success/30 bg-success/10 px-3 py-1.5 text-xs font-semibold text-success lg:self-auto">
            <Check className="size-3.5" aria-hidden="true" />
            {t("status")}
          </span>
        </div>

        <ol className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {stages.map((stage, i) => (
            <li key={stage.number} className="relative flex flex-col bg-card p-6 md:p-7">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs tracking-[0.18em] text-accent">{stage.number}</span>
                <span aria-hidden="true" className="h-px flex-1 bg-border" />
                {i < stages.length - 1 && (
                  <span aria-hidden="true" className="font-serif text-lg leading-none text-accent">+</span>
                )}
              </div>
              <h3 className="mt-8 font-serif text-xl font-semibold text-foreground">{stage.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{stage.body}</p>
            </li>
          ))}
        </ol>

        <Link href="/process" className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline">
          {t("cta")}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
