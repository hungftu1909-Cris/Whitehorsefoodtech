import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Globe2, Users } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { CtaSection } from "@/components/sections/cta-section";
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
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <div className="mx-auto flex size-10 items-center justify-center rounded-md bg-accent/15 text-accent">
            <Globe2 className="size-5" aria-hidden="true" />
          </div>
          <h2 className="mt-4 font-serif text-xl font-semibold text-foreground">
            {t("regionsTitle")}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{t("regions")}</p>
        </div>

        {/* Aggregate figures, not named suppliers/buyers on purpose —
            showing specific factory or trading-partner names here would let
            either side identify and approach the other directly. Only
            current, tagged facts appear here (docs/claim-registry.md rows
            3–4); the three-year vision figures are shown on About only. */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {(["current", "suppliers"] as const).map((group) => {
            const Icon = { current: Globe2, suppliers: Users }[group];
            return (
              <div key={group} className="rounded-lg border border-border bg-card p-8">
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
              </div>
            );
          })}
        </div>
      </section>

      <CtaSection title={t("cta.title")} cta={t("cta.cta")} href="/contact" />
    </>
  );
}
