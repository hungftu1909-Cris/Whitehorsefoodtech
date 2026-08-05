import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/sections/page-hero";
import { CtaSection } from "@/components/sections/cta-section";
import { SmartImage } from "@/components/ui/smart-image";
import { Reveal } from "@/components/ui/reveal";
import { PRODUCT_CATEGORIES } from "@/lib/nav";
import { ArrowRight } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "products.hero" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "products" });
  const tc = await getTranslations({ locale, namespace: "common" });

  return (
    <>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
      />

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCT_CATEGORIES.map((c, i) => (
            <Reveal key={c.slug} delay={i * 100}>
              <Link
                href={`/products/${c.slug}`}
                className="group block cursor-pointer overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md"
              >
                <SmartImage
                  src={`/images/products/${c.slug}-card.jpg`}
                  alt={t(`categories.${c.categoryKey}.name`)}
                  placeholderLabel={`${t(`categories.${c.categoryKey}.name`)} — photo needed`}
                  aspect="aspect-[3/2]"
                  className="rounded-none border-0 border-b border-border"
                />
                <div className="p-6">
                  <h2 className="font-serif text-xl font-semibold text-foreground">
                    {t(`categories.${c.categoryKey}.name`)}
                  </h2>
                  <p className="mt-1 text-sm font-medium text-accent">
                    {t(`categories.${c.categoryKey}.tagline`)}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {t(`categories.${c.categoryKey}.description`)}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                    {tc("learnMore")}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaSection
        title={t("sampleCta.title")}
        subtitle={t("sampleCta.subtitle")}
        cta={t("sampleCta.cta")}
        href="/rfq"
      />
    </>
  );
}
