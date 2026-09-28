import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CommercialDocuments } from "@/components/sections/commercial-documents";
import { PageHero } from "@/components/sections/page-hero";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "documents.hero" });
  return pageMetadata({ locale, path: "/documents", title: t("title"), description: t("subtitle") });
}

export default async function DocumentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "documents" });

  return (
    <>
      <PageHero eyebrow={t("hero.eyebrow")} title={t("hero.title")} subtitle={t("hero.subtitle")} />
      <CommercialDocuments
        labels={{
          eyebrow: t("library.eyebrow"),
          title: t("library.title"),
          subtitle: t("library.subtitle"),
          brochure: {
            title: t("library.brochure.title"),
            description: t("library.brochure.description"),
            meta: t("library.brochure.meta"),
            cta: t("library.brochure.cta"),
          },
          profile: {
            title: t("library.profile.title"),
            description: t("library.profile.description"),
            meta: t("library.profile.meta"),
            cta: t("library.profile.cta"),
          },
          note: t("library.note"),
        }}
      />
    </>
  );
}
