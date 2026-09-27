/**
 * Central place for real-world business details. Legal name, address and
 * business registration number are sourced from the Certificate of
 * Business Registration (Giấy chứng nhận đăng ký doanh nghiệp), issued by
 * the Hanoi Department of Finance, first registered 2026-08-10.
 */

// Canonical production host. The live apex domain redirects to www, so
// canonical URLs, hreflang, sitemap, robots and JSON-LD must all use www —
// otherwise every one of them points at a redirect. NEXT_PUBLIC_SITE_URL
// overrides it (e.g. a preview URL); a trailing slash is stripped so paths
// can be appended safely.
const DEFAULT_SITE_URL = "https://www.whitehorsefoodtech.com";

export const siteConfig = {
  name: "Whitehorse Foodtech",
  legalNameVi: "Công ty Cổ phần Công nghệ Thực phẩm Bạch Mã",
  legalNameEn: "White Horse Food Tech Joint Stock Company",
  businessRegistrationNumber: "0111597790",
  foundingDate: "2026-08-10",
  url: (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, ""),
  email: "info@whitehorsefoodtech.com",
  salesEmail: "sales@whitehorsefoodtech.com",
  phone: "+84 962 677 790", // also the WhatsApp/WeChat contact number
  // Registered address (Vietnamese is the legal form) plus an English
  // rendering for /en pages; `postalAddress` is the same split into
  // schema.org PostalAddress parts for JSON-LD.
  address: "Số nhà 27, ngách 23/72/39 Đức Diễn, Phường Phú Diễn, Thành phố Hà Nội, Việt Nam",
  addressEn: "27 Đức Diễn Alley 23/72/39, Phú Diễn Ward, Hanoi, Vietnam",
  postalAddress: {
    vi: {
      streetAddress: "Số nhà 27, ngách 23/72/39 Đức Diễn",
      addressLocality: "Phường Phú Diễn",
      addressRegion: "Thành phố Hà Nội",
    },
    en: {
      streetAddress: "27 Đức Diễn Alley 23/72/39",
      addressLocality: "Phú Diễn Ward",
      addressRegion: "Hanoi",
    },
    addressCountry: "VN",
  },
  // WhatsApp and Zalo both resolve chats directly from a phone number, so
  // these links are derived from `phone` above (kept as a separate literal
  // rather than computed, so the URL format is easy to verify at a glance).
  // WeChat has no equivalent public phone-number deep link — it's listed on
  // the Contact page as plain text, not a link.
  whatsapp: "https://wa.me/84962677790",
  zalo: "https://zalo.me/84962677790",
  social: {
    linkedin: "", // TODO
    facebook: "", // TODO
  },
};

export function localizedAddress(locale: string) {
  return locale === "vi" ? siteConfig.address : siteConfig.addressEn;
}

/**
 * Fills the {email}, {legalName} and {taxCode} slots used by the interim
 * legal copy in messages/*.json from siteConfig, so the legal identity is
 * never retyped by hand in translations.
 */
export function fillLegalPlaceholders(text: string, locale: string) {
  return text
    .replaceAll("{email}", siteConfig.email)
    .replaceAll("{legalName}", locale === "vi" ? siteConfig.legalNameVi : siteConfig.legalNameEn)
    .replaceAll("{taxCode}", siteConfig.businessRegistrationNumber);
}
