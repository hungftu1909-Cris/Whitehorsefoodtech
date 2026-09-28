import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Globe2 } from "lucide-react";
import { PlatformPageHero } from "@/components/sections/platform-page-hero";
import { SplitCta } from "@/components/sections/split-cta";
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
  const isVi = locale === "vi";

  return (
    <>
      <PlatformPageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        images={[
          {
            src: "/images/platform/network-coffee-harvest.webp",
            alt: isVi ? "Thu gom cà phê tại vùng nguyên liệu Việt Nam" : "Coffee collection in a Vietnamese growing region",
          },
          {
            src: "/images/platform/network-air-freight.webp",
            alt: isVi ? "Hàng hóa được chuẩn bị cho vận tải hàng không" : "Cargo prepared for air freight",
          },
        ]}
        imageNote={t("hero.imageNote")}
        facts={[
          { value: "50+", label: t("network.suppliers.statLabel") },
          { value: "10+", label: t("network.current.statLabel") },
        ]}
        action={{ label: t("hero.buyerAction"), href: "#join-network" }}
        secondaryAction={{ label: t("hero.supplierAction"), href: "/suppliers/apply" }}
      />

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div className="rounded-lg border border-border bg-card p-8 md:p-10">
          <div className="flex size-10 items-center justify-center rounded-md bg-accent/15 text-accent">
            <Globe2 className="size-5" aria-hidden="true" />
          </div>
          <h2 className="mt-5 max-w-2xl font-serif text-2xl font-semibold text-foreground">
            {t("regionsTitle")}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">{t("regions")}</p>
          <p className="mt-5 border-t border-border pt-5 text-xs leading-relaxed text-muted-foreground">
            {t("network.suppliers.description")}
          </p>
        </div>
      </section>

      <SplitCta
        id="join-network"
        title={t("cta.title")}
        subtitle={t("cta.subtitle")}
        buyer={{
          label: t("cta.buyer.label"),
          body: t("cta.buyer.body"),
          cta: t("cta.buyer.cta"),
          href: "/rfq",
          secondaryCta: t("cta.buyer.distributionCta"),
          secondaryHref: { pathname: "/contact", query: { topic: "distribution" } },
        }}
        supplier={{
          label: t("cta.supplier.label"),
          body: t("cta.supplier.body"),
          cta: t("cta.supplier.cta"),
          href: "/suppliers/apply",
        }}
      />
    </>
  );
}
