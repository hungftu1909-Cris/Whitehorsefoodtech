import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { CtaSection } from "@/components/sections/cta-section";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { Badge } from "@/components/ui/badge";
import { PRODUCT_CATEGORIES } from "@/lib/nav";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    PRODUCT_CATEGORIES.map((c) => ({ locale, slug: c.slug }))
  );
}

function findCategory(slug: string) {
  return PRODUCT_CATEGORIES.find((c) => c.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const category = findCategory(slug);
  if (!category) return {};
  const t = await getTranslations({
    locale,
    namespace: `products.categories.${category.categoryKey}`,
  });
  return { title: t("name"), description: t("description") };
}

export default async function ProductCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const category = findCategory(slug);
  if (!category) notFound();

  const t = await getTranslations({
    locale,
    namespace: `products.categories.${category.categoryKey}`,
  });
  const tp = await getTranslations({ locale, namespace: "products" });
  const specs = t.raw("specs") as string[];
  const applications = t.raw("applications") as string[];

  return (
    <>
      <PageHero eyebrow={tp("hero.eyebrow")} title={t("name")} subtitle={t("tagline")} />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start">
          <ImagePlaceholder
            label={`${t("name")} — product photography needed`}
            aspect="aspect-[4/3]"
          />

          <div>
            <p className="text-base leading-relaxed text-muted-foreground">
              {t("description")}
            </p>

            <h2 className="mt-8 font-serif text-xl font-semibold text-foreground">
              {t("specTitle")}
            </h2>
            <ul className="mt-4 space-y-3">
              {specs.map((spec) => (
                <li key={spec} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                  <span>{spec}</span>
                </li>
              ))}
            </ul>

            <h2 className="mt-8 font-serif text-xl font-semibold text-foreground">
              {t("applicationsTitle")}
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {applications.map((app) => (
                <Badge key={app} variant="secondary" className="bg-muted text-foreground">
                  {app}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CtaSection
        title={tp("sampleCta.title")}
        subtitle={tp("sampleCta.subtitle")}
        cta={tp("sampleCta.cta")}
        href="/rfq"
      />
    </>
  );
}
