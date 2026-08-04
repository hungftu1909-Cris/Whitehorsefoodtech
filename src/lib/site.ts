/**
 * Central place for real-world business details that are still placeholders.
 * Replace every [PLACEHOLDER] before launch — see README "Before you launch".
 */
export const siteConfig = {
  name: "Whitehorse Foodtech",
  // TODO: confirm final domain before deploy — used for canonical URLs, sitemap, OG tags.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://whitehorsefoodtech.com",
  email: "info@whitehorsefoodtech.com", // TODO: confirm real inbox
  phone: "+84 000 000 000", // TODO: confirm real phone/WhatsApp number
  address: "[Company address — to be confirmed], Vietnam", // TODO
  social: {
    linkedin: "", // TODO
    facebook: "", // TODO
  },
};
