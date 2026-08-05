import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { SectionHeading } from "@/components/sections/section-heading";
import { CtaSection } from "@/components/sections/cta-section";
import { SmartImage } from "@/components/ui/smart-image";
import { Reveal } from "@/components/ui/reveal";
import { pageMetadata } from "@/lib/seo";
import { Compass, ShieldCheck, MessageCircle, Handshake } from "lucide-react";

const VALUE_ICONS = [Compass, ShieldCheck, MessageCircle, Handshake];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about.hero" });
  return pageMetadata({
    locale,
    path: "/about",
    title: t("title"),
    description: t("subtitle"),
    images: ["/images/about.jpg"],
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about" });
  const stats = t.raw("stats.items") as { value: string; label: string }[];
  const values = t.raw("values.items") as { title: string; description: string }[];

  return (
    <>
      <PageHero eyebrow={t("hero.eyebrow")} title={t("hero.title")} subtitle={t("hero.subtitle")} />

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal>
          <SmartImage
            src="/images/about.jpg"
            alt="Whitehorse Foodtech — from freeze-drying technology to Vietnam's agricultural value chain"
            placeholderLabel="Company / capability photography needed"
            aspect="aspect-[16/9]"
            sizes="(min-width: 1024px) 64rem, 100vw"
          />
        </Reveal>
        <Reveal delay={150} className="mx-auto mt-10 max-w-3xl">
          <h2 className="font-serif text-2xl font-semibold text-foreground">
            {t("origin.title")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {t("origin.body")}
          </p>
        </Reveal>
      </section>

      <section className="bg-primary text-primary-foreground">
        <Reveal className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
            {t("mission.title")}
          </p>
          <p className="mt-4 font-serif text-2xl leading-snug text-balance italic md:text-3xl">
            &ldquo;{t("mission.body")}&rdquo;
          </p>
        </Reveal>
      </section>

      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-center font-serif text-2xl font-semibold text-foreground">
            {t("stats.title")}
          </h2>
          <dl className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, i) => (
              <Reveal key={stat.label} as="div" delay={i * 100} className="text-center">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-serif text-4xl font-semibold text-accent">{stat.value}</dd>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <SectionHeading title={t("values.title")} align="center" className="mx-auto" />
        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, i) => {
            const Icon = VALUE_ICONS[i % VALUE_ICONS.length];
            return (
              <Reveal key={value.title} delay={i * 100} className="text-center">
                <div className="mx-auto flex size-10 items-center justify-center rounded-md bg-accent/15 text-accent">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-serif text-lg font-semibold text-foreground">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {value.description}
                </p>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="border-t border-border bg-muted/30">
        <Reveal className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl font-semibold text-foreground">
            {t("team.title")}
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">{t("team.subtitle")}</p>
        </Reveal>
      </section>

      <CtaSection title={t("cta.title")} cta={t("cta.cta")} href="/contact" />
    </>
  );
}
