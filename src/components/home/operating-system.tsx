import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type Stage = { number: string; title: string; body: string };

/**
 * The fixed asset: Buyer specification + Qualified network +
 * Request-specific evidence + Commercial execution. It operates today and
 * applies to any collection, so it comes before the catalogue. Rendered as
 * a ruled, numbered editorial sequence rather than a row of cards.
 */
export function OperatingSystem() {
  const t = useTranslations("home.operating");
  const stages = t.raw("stages") as Stage[];

  return (
    <section aria-labelledby="operating-title" className="bg-card">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 py-20 sm:px-6 md:py-32 lg:grid-cols-12 lg:gap-8 lg:px-8 lg:py-40">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <p className="text-xs font-medium tracking-[0.24em] text-accent uppercase">{t("eyebrow")}</p>
            <h2 id="operating-title" className="mt-5 font-serif text-[2rem] leading-[1.12] font-medium tracking-[-0.01em] text-balance text-foreground md:text-[2.6rem]">
              {t("title")}
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-pretty text-muted-foreground md:text-[1.0625rem]">{t("subtitle")}</p>
            <p className="mt-8 flex items-center gap-3 text-sm text-foreground">
              <span aria-hidden="true" className="h-px w-8 bg-accent" />
              {t("status")}
            </p>
            <Link
              href="/process"
              className="mt-8 inline-block text-[0.9375rem] font-medium text-foreground underline decoration-accent/50 underline-offset-8 transition-colors hover:decoration-accent"
            >
              {t("cta")}
            </Link>
          </div>
        </div>

        <ol className="lg:col-span-7 lg:col-start-6">
          {stages.map((stage) => (
            <li
              key={stage.number}
              className="grid grid-cols-[3.25rem_1fr] gap-x-4 border-t border-foreground/15 py-9 first:border-t-0 first:pt-0 sm:grid-cols-[5.5rem_1fr] sm:gap-x-6 md:py-11 lg:first:pt-1"
            >
              <span className="font-serif text-[2.1rem] leading-none text-accent tabular-nums sm:text-5xl">{stage.number}</span>
              <div>
                <h3 className="font-serif text-2xl leading-snug font-medium text-foreground md:text-[1.75rem]">{stage.title}</h3>
                <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">{stage.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
