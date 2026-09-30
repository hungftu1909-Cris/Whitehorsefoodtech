import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { RfqForm } from "@/components/forms/rfq-form";
import { pageMetadata } from "@/lib/seo";
import { parseRfqPrefill } from "@/lib/validations";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "rfq.hero" });
  return pageMetadata({ locale, path: "/rfq", title: t("title"), description: t("subtitle") });
}

export default async function RfqPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "rfq" });
  // Product CTAs link here with ?product=&intent=(&sku=); unknown values
  // are dropped. Reading searchParams renders this page per request.
  const prefill = parseRfqPrefill(await searchParams);

  return (
    <>
      {/* One compact header, then the form itself — the page title is not
          repeated on the form card, so the first fields sit in the first
          viewport. The prefilled selection is summarised inside the form. */}
      <PageHero compact eyebrow={t("hero.eyebrow")} title={t("hero.title")} subtitle={t("hero.lead")} />

      <section aria-label={t("form.title")} className="mx-auto max-w-3xl px-5 pt-6 pb-20 sm:px-6 md:pt-8 md:pb-28 lg:px-8">
        <div className="rounded-sm border border-border bg-card p-5 sm:p-7">
          <RfqForm defaults={prefill} />
        </div>
      </section>
    </>
  );
}
