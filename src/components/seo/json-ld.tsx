import { siteConfig } from "@/lib/site";

/**
 * Sitewide Organization + WebSite structured data (JSON-LD). Helps search
 * engines recognize the brand entity and contact details. Zero client JS —
 * this is a plain server-rendered <script> tag.
 */
export function JsonLd({
  locale,
  siteName,
  description,
}: {
  locale: string;
  siteName: string;
  description: string;
}) {
  const sameAs = [siteConfig.social.linkedin, siteConfig.social.facebook].filter(Boolean);

  const data = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: siteName,
      url: siteConfig.url,
      logo: `${siteConfig.url}/icon.png`,
      description,
      email: siteConfig.email,
      telephone: siteConfig.phone,
      address: {
        "@type": "PostalAddress",
        addressCountry: "VN",
      },
      ...(sameAs.length ? { sameAs } : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteName,
      url: `${siteConfig.url}/${locale}`,
      inLanguage: locale,
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
