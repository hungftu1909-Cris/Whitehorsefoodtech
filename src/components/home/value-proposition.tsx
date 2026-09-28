import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

/**
 * One compact section for how Whitehorse creates value: sourcing + QA/QC
 * coordination, and bulk + OEM/ODM/OBM through suitable partners. Detail
 * stays on Quality and How We Work (docs/claim-registry.md rows 4, 7, 26).
 */
export function ValueProposition() {
  const t = useTranslations("home.value");
  const models = t.raw("models") as { term: string; description: string }[];

  const pillars = [
    { title: t("sourcingTitle"), body: t("sourcingBody"), cta: t("qualityCta"), href: "/certifications" as const },
    { title: t("modelsTitle"), body: t("modelsBody"), cta: t("processCta"), href: "/process" as const },
  ];

  return (
    <section className="border-t border-border bg-muted/30">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-7">
          <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">{t("eyebrow")}</p>
          <h2 className="mt-3 max-w-2xl font-serif text-3xl leading-tight font-semibold tracking-tight text-balance text-foreground md:text-4xl">
            {t("title")}
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {pillars.map((pillar) => (
              <div key={pillar.href} className="border-t border-border pt-5">
                <h3 className="font-serif text-lg font-semibold text-foreground">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{pillar.body}</p>
                <Link
                  href={pillar.href}
                  className="mt-4 inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-accent hover:underline"
                >
                  {pillar.cta}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5">
          <dl className="divide-y divide-border rounded-lg border border-border bg-card">
            {models.map((model) => (
              <div key={model.term} className="grid grid-cols-[4rem_1fr] gap-4 p-4">
                <dt className="font-serif text-base font-semibold text-accent">{model.term}</dt>
                <dd className="text-sm leading-relaxed text-muted-foreground">{model.description}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{t("note")}</p>
        </div>
      </div>
    </section>
  );
}
