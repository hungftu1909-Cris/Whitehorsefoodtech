/**
 * Central place for real-world business details. Legal name, address and
 * business registration number are sourced from the Certificate of
 * Business Registration (Giấy chứng nhận đăng ký doanh nghiệp), issued by
 * the Hanoi Department of Finance, first registered 2026-08-10.
 */
export const siteConfig = {
  name: "Whitehorse Foodtech",
  legalNameVi: "Công ty Cổ phần Công nghệ Thực phẩm Bạch Mã",
  legalNameEn: "White Horse Food Tech Joint Stock Company",
  businessRegistrationNumber: "0111597790",
  // TODO: confirm final domain before deploy — used for canonical URLs, sitemap, OG tags.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://whitehorsefoodtech.com",
  email: "info@whitehorsefoodtech.com",
  salesEmail: "sales@whitehorsefoodtech.com",
  phone: "+84 962 677 790", // also the WhatsApp/WeChat contact number
  address: "Số nhà 27, ngách 23/72/39 Đức Diễn, Phường Phú Diễn, Thành phố Hà Nội, Việt Nam",
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
