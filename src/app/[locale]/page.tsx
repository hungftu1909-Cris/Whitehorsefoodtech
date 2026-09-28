import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/hero";
import { ProofStrip } from "@/components/home/proof-strip";
import { ProductsPreview } from "@/components/home/products-preview";
import { PlatformMap } from "@/components/home/platform-map";
import { EvidenceLayer } from "@/components/home/evidence-layer";
import { SplitCta } from "@/components/sections/split-cta";

// Six server-rendered sections tell one platform story. Interactive product
// filtering lives on /products, keeping the homepage fast and indexable.
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
      <ProofStrip />
      <ProductsPreview />
      <PlatformMap />
      <EvidenceLayer />
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
