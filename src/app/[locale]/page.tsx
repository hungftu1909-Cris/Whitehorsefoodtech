import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/hero";
import { OperatingSystem } from "@/components/home/operating-system";
import { ProofStrip } from "@/components/home/proof-strip";
import { ProductsPreview } from "@/components/home/products-preview";
import { EvidenceLayer } from "@/components/home/evidence-layer";
import { PlatformMap } from "@/components/home/platform-map";
import { SplitCta } from "@/components/sections/split-cta";

// Server-rendered platform story, in a fixed order: promise → operating
// standard → current proof → current portfolio (+ custom sourcing) →
// evidence and technology → buyer / supplier entry. The operating standard
// deliberately precedes the catalogue. Interactive product filtering lives
// on /products, keeping the homepage fast and indexable.
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
      <OperatingSystem />
      <ProofStrip />
      <ProductsPreview />
      <EvidenceLayer />
      <PlatformMap />
      <SplitCta
        title={t("title")}
        subtitle={t("subtitle")}
        buyer={{
          label: t("buyerLabel"),
          body: t("buyerBody"),
          cta: t("buyerCta"),
          href: { pathname: "/rfq", query: { intent: "quote" } },
        }}
        supplier={{ label: t("supplierLabel"), body: t("supplierBody"), cta: t("supplierCta"), href: "/suppliers/apply" }}
      />
    </>
  );
}
