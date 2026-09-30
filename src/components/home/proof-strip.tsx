import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * Compact credibility strip: current facts only (docs/claim-registry.md
 * rows 3, 4 and 9), carrying the "Current" tag. Three-year vision figures
 * live on About, never here.
 */
export function ProofStrip() {
  const t = useTranslations("home.proof");
  const items = t.raw("items") as { value: string; label: string }[];

  return (
    <section aria-labelledby="proof-title" className="border-b border-border bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <h2 id="proof-title" className="text-xs font-semibold tracking-[0.2em] text-primary-foreground/80 uppercase">
            {t("title")}
          </h2>
          <span className="inline-flex items-center gap-1 rounded-full border border-accent/50 px-2 py-0.5 text-[0.65rem] font-semibold tracking-[0.12em] text-accent uppercase">
            <Check className="size-3" aria-hidden="true" />
            {t("tag")}
          </span>
        </div>
        <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-0">
          {items.map((item) => (
            <li key={item.value} className="flex items-baseline gap-4 sm:block sm:border-r sm:border-primary-foreground/15 sm:px-8 sm:first:pl-0 sm:last:border-r-0 sm:last:pr-0">
              <p className="w-14 shrink-0 font-serif text-3xl font-semibold text-accent sm:w-auto md:text-4xl">{item.value}</p>
              <p className="text-sm leading-relaxed text-primary-foreground/75 sm:mt-2">{item.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
