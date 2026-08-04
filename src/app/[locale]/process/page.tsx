import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { CtaSection } from "@/components/sections/cta-section";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "process.hero" });
  return { title: t("title"), description: t("subtitle") };
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
        <ol className="relative space-y-12 border-l border-border pl-8">
          {steps.map((step) => (
            <li key={step.title} className="relative">
              <span
                className="absolute top-0 -left-[calc(2rem+5px)] flex size-2.5 -translate-x-1/2 items-center justify-center rounded-full bg-accent"
                aria-hidden="true"
              />
              <h2 className="font-serif text-xl font-semibold text-foreground">
                {step.title}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-2 lg:items-center lg:px-8">
          <ImagePlaceholder label="Factory / facility photography needed" aspect="aspect-[4/3]" />
          <div>
            <h2 className="font-serif text-2xl font-semibold text-foreground">
              {t("factory.title")}
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
              {t("factory.subtitle")}
            </p>
          </div>
        </div>
      </section>

      <CtaSection title={t("cta.title")} cta={t("cta.cta")} href="/contact" />
    </>
  );
}
