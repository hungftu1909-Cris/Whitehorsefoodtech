import { useTranslations } from "next-intl";

/**
 * Compact credibility strip: current facts only (docs/claim-registry.md
 * rows 3–4). Three-year vision figures live on About, never here.
 */
export function ProofStrip() {
  const t = useTranslations("home.proof");
  const items = t.raw("items") as { value: string; label: string }[];

  return (
    <section aria-labelledby="proof-title" className="border-b border-border bg-primary text-primary-foreground">
      <h2 id="proof-title" className="sr-only">
        {t("title")}
      </h2>
      <ul className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-10 sm:grid-cols-3 sm:gap-8 sm:px-6 lg:px-8">
        {items.map((item) => (
          <li key={item.value} className="flex items-baseline gap-4 sm:block">
            <p className="shrink-0 font-serif text-3xl font-semibold text-accent md:text-4xl">{item.value}</p>
            <p className="text-sm leading-relaxed text-primary-foreground/85 sm:mt-2">{item.label}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
