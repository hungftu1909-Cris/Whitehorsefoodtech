import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/**
 * Evidence is scoped to a request; this section never implies universal
 * certificates or live lot data. Image-free by design: a typographic
 * statement followed by ruled evidence rows, not a grid of cards. (The
 * air-freight image lives in the hero; it is not repeated here.)
 */
export function EvidenceLayer() {
  const t = useTranslations("home.evidence");
  const items = t.raw("items") as { label: string; title: string; body: string }[];

  return (
    <section aria-labelledby="evidence-title" className="bg-luminous">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 md:py-32 lg:px-8 lg:py-40">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-6">
            <p className="text-xs font-medium tracking-[0.24em] text-accent uppercase">{t("eyebrow")}</p>
            <h2 id="evidence-title" className="mt-5 font-serif text-[2.1rem] leading-[1.1] font-medium tracking-[-0.01em] text-balance text-foreground md:text-5xl">
              {t("title")}
            </h2>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <p className="max-w-md text-base leading-relaxed text-pretty text-muted-foreground md:text-[1.0625rem]">{t("subtitle")}</p>
            <Link
              href="/certifications"
              className="mt-8 inline-block text-[0.9375rem] font-medium text-foreground underline decoration-accent/50 underline-offset-8 transition-colors hover:decoration-accent"
            >
              {t("cta")}
            </Link>
          </div>
        </div>

        <ol className="mt-20 border-b border-foreground/15 md:mt-28">
          {items.map((item) => (
            <li
              key={item.title}
              className="grid gap-2 border-t border-foreground/15 py-7 md:grid-cols-12 md:gap-8 md:py-8"
            >
              <span className="text-xs tracking-[0.2em] text-accent uppercase md:col-span-2 md:pt-2">{item.label}</span>
              <h3 className="font-serif text-2xl leading-snug font-medium text-foreground md:col-span-4">{item.title}</h3>
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:col-span-6 md:pt-1">{item.body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted-foreground">{t("note")}</p>
      </div>
    </section>
  );
}
