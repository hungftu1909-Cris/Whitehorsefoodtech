import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/hero";
import { StatusMarkers } from "@/components/home/status-markers";
import { BuyerSegments } from "@/components/home/buyer-segments";
import { TrustStrip } from "@/components/home/trust-strip";
import { ValueProps } from "@/components/home/value-props";
import { ProductsPreview } from "@/components/home/products-preview";
import { ProcessPreview } from "@/components/home/process-preview";
import { CertificationsTeaser } from "@/components/home/certifications-teaser";
import { CtaSection } from "@/components/sections/cta-section";
import { getTranslations } from "next-intl/server";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "home.ctaBanner" });

  return (
    <>
      <Hero />
      <BuyerSegments />
      <ProductsPreview />
      <StatusMarkers />
      <TrustStrip />
      <ValueProps />
      <ProcessPreview />
      <CertificationsTeaser />
      <CtaSection title={t("title")} subtitle={t("subtitle")} cta={t("cta")} />
    </>
  );
}
