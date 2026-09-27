import { siteConfig } from "@/lib/site";
import { serializeJsonLd } from "@/lib/json-ld";

/**
 * Sitewide Organization + WebSite structured data (JSON-LD). Helps search
 * engines recognize the brand entity and contact details. Zero client JS —
 * this is a plain server-rendered <script> tag. Organization facts only;
 * no Product/Offer schema until SKUs have confirmed status and pricing.
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
  const isVi = locale === "vi";
  const address = isVi ? siteConfig.postalAddress.vi : siteConfig.postalAddress.en;

  const data = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: siteName,
      legalName: isVi ? siteConfig.legalNameVi : siteConfig.legalNameEn,
      alternateName: isVi ? siteConfig.legalNameEn : siteConfig.legalNameVi,
      url: siteConfig.url,
      logo: `${siteConfig.url}/icon.png`,
      description,
      email: siteConfig.email,
      telephone: siteConfig.phone,
      foundingDate: siteConfig.foundingDate,
      taxID: siteConfig.businessRegistrationNumber,
      address: {
        "@type": "PostalAddress",
        ...address,
        addressCountry: siteConfig.postalAddress.addressCountry,
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
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
