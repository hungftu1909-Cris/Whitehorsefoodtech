import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Globe2, Users, Target, Telescope } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { CtaSection } from "@/components/sections/cta-section";
import { Reveal } from "@/components/ui/reveal";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "clients.hero" });
  return pageMetadata({ locale, path: "/clients", title: t("title"), description: t("subtitle") });
}

export default async function ClientsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "clients" });

  return (
    <>
      <PageHero eyebrow={t("hero.eyebrow")} title={t("hero.title")} subtitle={t("hero.subtitle")} />

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal className="rounded-lg border border-border bg-card p-8 text-center">
          <div className="mx-auto flex size-10 items-center justify-center rounded-md bg-accent/15 text-accent">
            <Globe2 className="size-5" aria-hidden="true" />
          </div>
          <h2 className="mt-4 font-serif text-xl font-semibold text-foreground">
            {t("regionsTitle")}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{t("regions")}</p>
        </Reveal>

        {/* Aggregate figures, not named suppliers/buyers on purpose —
            showing specific factory or trading-partner names here would let
            either side identify and approach the other directly. The current
            fact, the dated objective and the three-year vision are always
            shown side by side with their tags so an objective or vision is
            never read as a track record; all three are
            recorded in docs/claim-registry.md. */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {(["current", "objective", "vision"] as const).map((group, i) => {
            const Icon = { current: Users, objective: Target, vision: Telescope }[group];
            return (
              <Reveal key={group} delay={i * 100} className="rounded-lg border border-border bg-card p-8">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex size-10 items-center justify-center rounded-md bg-accent/15 text-accent">
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <span className="rounded-full border border-border px-2 py-0.5 text-[0.65rem] font-semibold tracking-[0.15em] text-muted-foreground uppercase">
                    {t(`network.${group}.tag`)}
                  </span>
                </div>
                <div className="mt-4 font-serif text-3xl font-semibold text-foreground">
                  {t(`network.${group}.stat`)}
                </div>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {t(`network.${group}.statLabel`)}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {t(`network.${group}.description`)}
                </p>
              </Reveal>
            );
          })}
        </div>
      </section>

      <CtaSection title={t("cta.title")} cta={t("cta.cta")} href="/contact" />
    </>
  );
}
