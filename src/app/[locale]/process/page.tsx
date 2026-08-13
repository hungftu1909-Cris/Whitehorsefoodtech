import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Sprout, Filter, FlaskConical, Package, FileText, Ship } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { CtaSection } from "@/components/sections/cta-section";
import { SmartImage } from "@/components/ui/smart-image";
import { Reveal } from "@/components/ui/reveal";
import { pageMetadata } from "@/lib/seo";

// Matches the order of process.steps: Sourcing, Processing & Grading,
// Quality Control, Packing, Export Documentation, Shipping & Delivery.
const STEP_ICONS = [Sprout, Filter, FlaskConical, Package, FileText, Ship];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "process.hero" });
  return pageMetadata({
    locale,
    path: "/process",
    title: t("title"),
    description: t("subtitle"),
    images: ["/images/factory.jpg"],
  });
}

export default async function ProcessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "process" });
  const steps = t.raw("steps") as { title: string; description: string }[];

  return (
    <>
      <PageHero eyebrow={t("hero.eyebrow")} title={t("hero.title")} subtitle={t("hero.subtitle")} />

      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <ol className="relative">
          {steps.map((step, i) => {
            const Icon = STEP_ICONS[i % STEP_ICONS.length];
            return (
              <Reveal key={step.title} as="li" delay={i * 100} className="relative pb-16 pl-24 last:pb-0">
                {i < steps.length - 1 && (
                  <span
                    className="absolute top-16 left-8 h-[calc(100%-4rem)] w-px bg-border"
                    aria-hidden="true"
                  />
                )}
                <span className="absolute top-0 left-0 flex size-16 items-center justify-center rounded-full bg-primary font-serif text-2xl font-semibold text-primary-foreground shadow-sm">
                  {i + 1}
                </span>
                <div className="flex items-center gap-2 pt-4">
                  <Icon className="size-4 shrink-0 text-accent" aria-hidden="true" />
                  <h2 className="font-serif text-xl font-semibold text-foreground sm:text-2xl">
                    {step.title}
                  </h2>
                </div>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {step.description}
                </p>
              </Reveal>
            );
          })}
        </ol>
      </section>

      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <Reveal>
            <SmartImage
              src="/images/factory.jpg"
              alt="Whitehorse Foodtech processing facility — from raw ingredients to export logistics"
              placeholderLabel="Factory / facility photography needed"
              aspect="aspect-[16/9]"
              sizes="(min-width: 1024px) 80rem, 100vw"
            />
          </Reveal>
          <Reveal delay={150} className="mx-auto mt-10 max-w-2xl text-center">
            <h2 className="font-serif text-2xl font-semibold text-foreground">
              {t("factory.title")}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {t("factory.subtitle")}
            </p>
          </Reveal>
        </div>
      </section>

      <CtaSection title={t("cta.title")} cta={t("cta.cta")} href="/contact" />
    </>
  );
}
