import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ThemeColor } from "@/components/theme/theme-color";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { JsonLd } from "@/components/seo/json-ld";
import { routing, type Locale } from "@/i18n/routing";
import { getLocaleSwitchMap } from "@/lib/blog";
import { localizedAlternates, OG_LOCALE, samePathEverywhere } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import "../globals.css";

export const viewport: Viewport = {
  // The site opens light regardless of OS preference, so the browser chrome
  // matches the paper background. <ThemeColor /> retints it after an
  // explicit dark choice from the header toggle.
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
  const tn = await getTranslations({ locale, namespace: "nav" });
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
          <ThemeColor />
          <NextIntlClientProvider>
            <a
              href="#main-content"
              className="sr-only z-50 rounded-sm bg-primary px-4 py-3 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
            >
              {tn("skipToContent")}
            </a>
            <SiteHeader blogSlugMap={blogSlugMap} />
            <main id="main-content" tabIndex={-1} className="flex-1 outline-none">{children}</main>
            <SiteFooter />
            <Toaster />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
