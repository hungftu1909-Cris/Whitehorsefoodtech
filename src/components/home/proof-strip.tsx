import { useTranslations } from "next-intl";

/**
 * Current facts only (docs/claim-registry.md rows 3, 4 and 9), carrying the
 * "Current" tag. Three-year vision figures live on About, never here. Large
 * forest-ink serif figures on the pale mist band, each on a hairline rule;
 * no pills or icons.
 */
export function ProofStrip() {
  const t = useTranslations("home.proof");
  const items = t.raw("items") as { value: string; label: string }[];

  return (
    <section aria-labelledby="proof-title" className="bg-muted text-foreground">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 md:py-24 lg:px-8">
        <h2 id="proof-title" className="flex items-center gap-4 text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
          {t("title")}
          <span aria-hidden="true" className="h-px w-8 bg-accent" />
          <span className="text-accent">{t("tag")}</span>
        </h2>
        <ul className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-10 md:mt-14 lg:gap-16">
          {items.map((item) => (
            <li key={item.value} className="border-t border-foreground/15 pt-7">
              <p className="font-serif text-6xl leading-none font-medium tracking-[-0.02em] text-primary md:text-7xl">{item.value}</p>
              <p className="mt-5 max-w-[19rem] text-[0.9375rem] leading-relaxed text-muted-foreground">{item.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
