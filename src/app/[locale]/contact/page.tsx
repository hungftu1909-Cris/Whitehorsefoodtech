import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { ContactForm } from "@/components/forms/contact-form";
import { siteConfig } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact.hero" });
  return pageMetadata({ locale, path: "/contact", title: t("title"), description: t("subtitle") });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "contact" });

  return (
    <>
      <PageHero eyebrow={t("hero.eyebrow")} title={t("hero.title")} subtitle={t("hero.subtitle")} />

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <h2 className="font-serif text-xl font-semibold text-foreground">
              {t("info.title")}
            </h2>
            <dl className="mt-6 space-y-5 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                <div>
                  <dt className="text-muted-foreground">{t("info.addressLabel")}</dt>
                  <dd className="text-foreground">{siteConfig.address}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                <div>
                  <dt className="text-muted-foreground">{t("info.phoneLabel")}</dt>
                  <dd>
                    <a href={`tel:${siteConfig.phone}`} className="cursor-pointer text-foreground hover:text-accent">
                      {siteConfig.phone}
                    </a>
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                <div>
                  <dt className="text-muted-foreground">{t("info.emailLabel")}</dt>
                  <dd>
                    <a href={`mailto:${siteConfig.email}`} className="cursor-pointer text-foreground hover:text-accent">
                      {siteConfig.email}
                    </a>
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                <div>
                  <dt className="text-muted-foreground">{t("info.hoursLabel")}</dt>
                  <dd className="text-foreground">{t("info.hours")}</dd>
                </div>
              </div>
            </dl>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 md:p-8 lg:col-span-3">
            <h2 className="font-serif text-xl font-semibold text-foreground">
              {t("form.title")}
            </h2>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
