import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Globe2 } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { CtaSection } from "@/components/sections/cta-section";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
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

        <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Reveal key={i} delay={i * 60}>
              <ImagePlaceholder label="Partner logo" aspect="aspect-[3/2]" />
            </Reveal>
          ))}
        </div>
      </section>

      <CtaSection title={t("cta.title")} cta={t("cta.cta")} href="/contact" />
    </>
  );
}
