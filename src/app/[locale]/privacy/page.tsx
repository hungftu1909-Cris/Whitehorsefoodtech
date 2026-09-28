import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { fillLegalPlaceholders } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return {
    ...pageMetadata({ locale, path: "/privacy", title: t("privacyTitle"), description: (t.raw("privacyBody") as string[])[1] }),
    // Legal review pending: the public text is a concise notice that has NOT
    // been reviewed by counsel. Keep noindex (and out of sitemap.xml) until
    // reviewed final text is in — see docs/claim-registry.md row 16.
    robots: { index: false, follow: true },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "legal" });

  return (
    <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-semibold text-foreground">{t("privacyTitle")}</h1>
      <div className="mt-6 space-y-4">
        {(t.raw("privacyBody") as string[]).map((paragraph) => (
          <p key={paragraph} className="text-sm leading-relaxed text-muted-foreground">
            {fillLegalPlaceholders(paragraph, locale)}
          </p>
        ))}
      </div>
    </section>
  );
}
