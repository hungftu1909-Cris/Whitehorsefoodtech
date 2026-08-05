import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { ShieldCheck, FileText, Leaf, Users, Sprout, BadgeCheck } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { SectionHeading } from "@/components/sections/section-heading";
import { CtaSection } from "@/components/sections/cta-section";
import { Reveal } from "@/components/ui/reveal";
import { pageMetadata } from "@/lib/seo";

const PILLAR_ICONS = [Leaf, Users, Sprout, BadgeCheck];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "certifications.hero" });
  return pageMetadata({ locale, path: "/certifications", title: t("title"), description: t("subtitle") });
}

export default async function CertificationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "certifications" });
  const items = t.raw("items") as { name: string; description: string }[];
  const documents = t.raw("documents") as string[];
  const pillars = t.raw("sustainability.pillars") as { title: string; description: string }[];

  return (
    <>
      <PageHero eyebrow={t("hero.eyebrow")} title={t("hero.title")} subtitle={t("hero.subtitle")} />

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <Reveal key={item.name} delay={i * 100} className="rounded-lg border border-border bg-card p-6">
              <div className="flex size-10 items-center justify-center rounded-md bg-accent/15 text-accent">
                <ShieldCheck className="size-5" aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-serif text-lg font-semibold text-foreground">
                {item.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <SectionHeading
            eyebrow={t("sustainability.eyebrow")}
            title={t("sustainability.title")}
            subtitle={t("sustainability.subtitle")}
          />
          <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((pillar, i) => {
              const Icon = PILLAR_ICONS[i % PILLAR_ICONS.length];
              return (
                <Reveal key={pillar.title} delay={i * 100}>
                  <div className="flex size-10 items-center justify-center rounded-md bg-accent/15 text-accent">
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 font-serif text-lg font-semibold text-foreground">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {pillar.description}
                  </p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-background">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl font-semibold text-foreground">
            {t("documentsTitle")}
          </h2>
          <ul className="mt-6 space-y-3">
            {documents.map((doc) => (
              <li key={doc} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <FileText className="size-4 shrink-0 text-accent" aria-hidden="true" />
                <span>{doc}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaSection title={t("cta.title")} cta={t("cta.cta")} href="/contact" />
    </>
  );
}
