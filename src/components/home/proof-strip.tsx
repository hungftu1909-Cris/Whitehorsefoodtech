import { useTranslations } from "next-intl";
import { Keywords } from "@/components/ui/keywords";

/**
 * Current facts only (docs/claim-registry.md rows 3, 4 and 9), carrying the
 * "Current" tag. Three-year vision figures live on About, never here. Large
 * forest-ink serif figures on the daylight mist band, each on a hairline rule;
 * no pills or icons.
 */
export function ProofStrip() {
  const t = useTranslations("home.proof");
  const items = t.raw("items") as { value: string; label: string }[];

  return (
    <section aria-labelledby="proof-title" className="bg-daylight text-foreground">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 md:py-16 lg:px-8">
        <h2 id="proof-title" className="flex items-center gap-4 text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
          {t("title")}
          <span aria-hidden="true" className="h-px w-8 bg-accent" />
          <span className="text-accent">{t("tag")}</span>
        </h2>
        <ul className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-10 lg:gap-16">
          {items.map((item) => (
            <li key={item.value} className="border-t border-foreground/15 pt-5">
              <p className="font-serif text-5xl leading-none font-medium tracking-[-0.02em] text-primary md:text-6xl">{item.value}</p>
              <p className="mt-4 max-w-[19rem] text-[0.9375rem] leading-relaxed text-muted-foreground"><Keywords text={item.label} /></p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
