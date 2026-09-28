import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/hero";
import { ProofStrip } from "@/components/home/proof-strip";
import { ProductsPreview } from "@/components/home/products-preview";
import { ValueProposition } from "@/components/home/value-proposition";
import { SplitCta } from "@/components/sections/split-cta";

// Five sections, all Server Components. Company story, process, quality
// detail and the three-year vision live on their own pages (About, How We
// Work, Quality) and are reached through links, not repeated here.
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
      <ValueProposition />
      <SplitCta
        title={t("title")}
        subtitle={t("subtitle")}
        buyer={{
          label: t("buyerLabel"),
          body: t("buyerBody"),
          cta: t("buyerCta"),
          href: { pathname: "/rfq", query: { intent: "quote" } },
        }}
        supplier={{ label: t("supplierLabel"), body: t("supplierBody"), cta: t("supplierCta"), href: "/contact" }}
      />
    </>
  );
}
