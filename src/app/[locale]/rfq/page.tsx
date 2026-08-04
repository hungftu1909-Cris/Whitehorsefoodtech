import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { RfqForm } from "@/components/forms/rfq-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "rfq.hero" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function RfqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "rfq" });

  return (
    <>
      <PageHero eyebrow={t("hero.eyebrow")} title={t("hero.title")} subtitle={t("hero.subtitle")} />

      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <div className="rounded-lg border border-border bg-card p-6 md:p-8">
          <h2 className="font-serif text-xl font-semibold text-foreground">{t("form.title")}</h2>
          <div className="mt-6">
            <RfqForm />
          </div>
        </div>
      </section>
    </>
  );
}
