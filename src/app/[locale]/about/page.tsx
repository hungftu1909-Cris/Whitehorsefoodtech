import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { SectionHeading } from "@/components/sections/section-heading";
import { CtaSection } from "@/components/sections/cta-section";
import { SmartImage } from "@/components/ui/smart-image";
import { Reveal } from "@/components/ui/reveal";
import { StatusMarkers } from "@/components/home/status-markers";
import { pageMetadata } from "@/lib/seo";
import {
  Sprout,
  FlaskConical,
  ClipboardCheck,
  Ship,
  ShieldCheck,
  Target,
  MessageCircle,
  Handshake,
} from "lucide-react";

const VALUE_CREATION_ICONS = [Sprout, FlaskConical, ClipboardCheck, Ship];
const VALUE_ICONS = [ShieldCheck, Target, MessageCircle, Handshake];

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
  const paragraphs = t.raw("origin.paragraphs") as string[];
  const valueCreationItems = t.raw("valueCreation.items") as {
    title: string;
    description: string;
  }[];
  const steps = t.raw("operatingModel.steps") as { title: string; description: string }[];
  const values = t.raw("values.items") as { title: string; description: string }[];

  return (
    <>
      <PageHero eyebrow={t("hero.eyebrow")} title={t("hero.title")} subtitle={t("hero.subtitle")} />

      {/* Our story */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal>
          <SmartImage
            src="/images/about.jpg"
            alt="Illustrative image: Vietnamese agricultural ingredients"
            placeholderLabel="Company / capability photography needed"
            aspect="aspect-[16/9]"
            sizes="(min-width: 1024px) 64rem, 100vw"
          />
        </Reveal>
        <Reveal delay={150} className="mx-auto mt-10 max-w-3xl space-y-4">
          <h2 className="font-serif text-2xl font-semibold text-foreground">
            {t("origin.title")}
          </h2>
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-base leading-relaxed text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </Reveal>
      </section>

      {/* How we create value */}
      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <SectionHeading
            eyebrow={t("valueCreation.eyebrow")}
            title={t("valueCreation.title")}
            subtitle={t("valueCreation.subtitle")}
          />
          <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {valueCreationItems.map((item, i) => {
              const Icon = VALUE_CREATION_ICONS[i % VALUE_CREATION_ICONS.length];
              return (
                <Reveal key={item.title} delay={i * 100}>
                  <div className="flex size-10 items-center justify-center rounded-md bg-accent/15 text-accent">
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 font-serif text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Operating model */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <SectionHeading
          eyebrow={t("operatingModel.eyebrow")}
          title={t("operatingModel.title")}
          subtitle={t("operatingModel.subtitle")}
        />

        {/* Desktop: horizontal flow with a connecting line */}
        <div className="relative mt-16 hidden lg:grid lg:grid-cols-5 lg:gap-6">
          <div className="absolute top-5 right-0 left-0 h-px bg-border" aria-hidden="true" />
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 100} className="relative px-2 text-center">
              <div className="relative z-10 mx-auto flex size-10 items-center justify-center rounded-full bg-accent font-serif text-sm font-semibold text-accent-foreground">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-4 font-serif text-base font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </Reveal>
          ))}
        </div>

        {/* Mobile/tablet: vertical timeline */}
        <ol className="relative mt-14 space-y-10 border-l border-border pl-8 lg:hidden">
          {steps.map((step, i) => (
            <Reveal key={step.title} as="li" delay={i * 80} className="relative">
              <span
                className="absolute top-1 -left-[calc(2rem+5px)] flex size-2.5 -translate-x-1/2 items-center justify-center rounded-full bg-accent"
                aria-hidden="true"
              />
              <h3 className="font-serif text-base font-semibold text-foreground">
                {String(i + 1).padStart(2, "0")}. {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* Mission */}
      <section className="bg-primary text-primary-foreground">
        <Reveal className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
            {t("mission.title")}
          </p>
          <p className="mt-4 font-serif text-2xl leading-snug text-balance italic md:text-3xl">
            &ldquo;{t("mission.body")}&rdquo;
          </p>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-primary-foreground/85">
            {t("mission.extra")}
          </p>
        </Reveal>
      </section>

      {/* Where we stand: current facts vs. clearly labelled targets */}
      <StatusMarkers variant="muted" />

      {/* Values */}
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

      {/* Ecosystem development (program signal) + long-term direction
          (vision). Deliberately text-only and restrained: no partner logos,
          and only participants who have formally agreed are named — see
          docs/claim-registry.md before adding anything here. */}
      <section className="border-t border-border bg-background">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-5 lg:px-8">
          <Reveal className="lg:col-span-3">
            <SectionHeading eyebrow={t("ecosystem.eyebrow")} title={t("ecosystem.title")} />
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
              {t("ecosystem.body")}
            </p>
          </Reveal>
          <Reveal delay={150} className="rounded-lg border border-dashed border-border bg-muted/30 p-6 lg:col-span-2">
            <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
              {t("vision.label")}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{t("vision.note")}</p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{t("vision.body")}</p>
          </Reveal>
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

      <CtaSection
        title={t("cta.title")}
        subtitle={t("cta.subtitle")}
        cta={t("cta.cta")}
        href="/rfq"
        secondaryCta={t("cta.secondaryCta")}
        secondaryHref="/products"
      />
    </>
  );
}
