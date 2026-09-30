import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { FloatingCtaBar } from "@/components/layout/floating-cta-bar";
import { AudienceGateway } from "@/components/layout/audience-gateway";
import { JsonLd } from "@/components/seo/json-ld";
import { routing, type Locale } from "@/i18n/routing";
import { getLocaleSwitchMap } from "@/lib/blog";
import { localizedAlternates, OG_LOCALE, samePathEverywhere } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import "../globals.css";

export const viewport: Viewport = {
  // The site opens light regardless of OS preference, so the browser chrome
  // matches the paper background.
  themeColor: "#fbfaf7",
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    // Single source for the canonical host (www) — see src/lib/site.ts.
    metadataBase: new URL(siteConfig.url),
    title: {
      default: t("title"),
      template: `%s | ${t("siteName")}`,
    },
    description: t("description"),
    alternates: {
      canonical: `/${locale}`,
      languages: localizedAlternates(samePathEverywhere("")),
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      siteName: t("siteName"),
      locale: OG_LOCALE[locale as Locale] ?? OG_LOCALE[routing.defaultLocale],
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "meta" });
  // Blog slugs differ per locale; the header's language switcher needs this
  // map to land on the translated article (or /blog) instead of a 404.
  const blogSlugMap = getLocaleSwitchMap(locale);

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <JsonLd locale={locale} siteName={t("siteName")} description={t("description")} />
        {/* Light is the default for every first visit (Luminous direction): an
            OS dark preference no longer turns the whole site dark. Dark stays
            available from the header toggle and is remembered once chosen. */}
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <NextIntlClientProvider>
            <SiteHeader blogSlugMap={blogSlugMap} />
            <AudienceGateway />
            <main className="flex-1">{children}</main>
            <SiteFooter />
            <FloatingCtaBar />
            <Toaster />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
