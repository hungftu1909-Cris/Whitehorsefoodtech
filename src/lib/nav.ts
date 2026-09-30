// Product taxonomy — Level 1 (Ingredient Family). Order here drives every
// product listing on the site (homepage cards, /products grid, header
// dropdown, mobile nav, footer, sitemap) since all of them map over this
// array rather than hardcoding the list separately.
//
// `slug` → route segment under /products/[slug] and the stable key into
// FAMILY_MEDIA (src/lib/media-manifest.ts). Order is presentation only:
// nothing — copy or imagery — may be looked up by position in this array.
// `key` → nav.* translation key (short label used in menus/footer).
// `categoryKey` → products.categories.* translation key (full card/detail
// content: name, tagline, description, specs, applications).
//
// Deeper Level 2/3 taxonomy (product group / SKU — e.g. Coconut Ingredients
// → "Milk & Cream" group → "Coconut Milk Powder" SKU) isn't surfaced as its
// own routes yet. Level 2 group names are translated per family under
// `products.categories.<categoryKey>.groups` in messages/*.json and shown on
// each /products/[slug] page; Level 3 SKUs stay internal for now (buyers
// reach that detail via RFQ) but are enumerated per family in this file's
// git history / project brief so a future per-SKU page can key off the same
// `categoryKey` without restructuring this list.
//
// Platform order (2026-09-30): broad, multi-application plant-ingredient
// families lead (coconut, fruit, nuts/spices/botanicals), then the two
// specialty collections (coffee, bird's nest). No single family — coffee in
// particular — reads as the brand. Copy keyed per family (e.g.
// home.productsPreview.items.<categoryKey>) follows this order automatically.
export const PRODUCT_CATEGORIES = [
  { slug: "coconut", key: "productsCoconut" as const, categoryKey: "coconut" as const },
  { slug: "fruit", key: "productsFruit" as const, categoryKey: "fruit" as const },
  {
    slug: "nuts-spices-botanicals",
    key: "productsNutsSpicesBotanicals" as const,
    categoryKey: "nutsSpicesBotanicals" as const,
  },
  { slug: "coffee", key: "productsCoffee" as const, categoryKey: "coffee" as const },
  { slug: "birds-nest", key: "productsBirdsNest" as const, categoryKey: "birdsNest" as const },
];

// PRODUCT_CATEGORIES is the *current* portfolio, not the platform boundary.
// Briefs for any other Vietnamese ingredient use the same RFQ with the
// family preset to "Other / not listed" (whitelisted by parseRfqPrefill).
export const CUSTOM_SOURCING_HREF = {
  pathname: "/rfq" as const,
  query: { product: "other", intent: "quote" },
};

export const MAIN_NAV = [
  { href: "/about", key: "about" as const },
  { href: "/products", key: "products" as const, hasChildren: true },
  { href: "/certifications", key: "certifications" as const },
  { href: "/process", key: "process" as const },
  { href: "/clients", key: "clients" as const },
  { href: "/blog", key: "blog" as const },
  { href: "/contact", key: "contact" as const },
];

// Header information architecture (2026-09-30 UX refinement): a few buyer
// priorities plus one company menu. Every MAIN_NAV page stays reachable —
// tests/navigation.test.ts checks the header, mobile menu and footer cover it.
export const BUYER_NAV = [
  { href: "/certifications", key: "qualityShort" as const },
  { href: "/process", key: "process" as const },
];

export const COMPANY_NAV = [
  { href: "/about", key: "about" as const },
  { href: "/clients", key: "clients" as const },
  { href: "/blog", key: "blog" as const },
  { href: "/documents", key: "documents" as const },
  { href: "/contact", key: "contact" as const },
];

/** The supplier path always opens in Vietnamese (the supplier audience). */
export const SUPPLIER_HREF = "/suppliers/apply" as const;
