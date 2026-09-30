import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/hero";
import { ProofStrip } from "@/components/home/proof-strip";
import { ProductsPreview } from "@/components/home/products-preview";
import { QualityMethod } from "@/components/home/quality-method";
import { SplitCta } from "@/components/sections/split-cta";

// Server-rendered, shortest path to a buyer decision: promise → compact
// current proof → current collections (+ custom sourcing, documents) → one
// short quality / working-method band (technology roadmap in a disclosure)
// → buyer / supplier paths. Detailed mechanics live on Process and Quality.
// Interactive product filtering lives on /products.
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
      <QualityMethod />
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
