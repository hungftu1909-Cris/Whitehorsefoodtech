// Product taxonomy — Level 1 (Ingredient Family). Order here drives every
// product listing on the site (homepage cards, /products grid, header
// dropdown, mobile nav, footer, sitemap) since all of them map over this
// array rather than hardcoding the list separately.
//
// `slug` → route segment under /products/[slug] and image filename prefix
// (/images/products/{slug}-card.jpg, {slug}-detail.jpg).
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
export const PRODUCT_CATEGORIES = [
  { slug: "coffee", key: "productsCoffee" as const, categoryKey: "coffee" as const },
  { slug: "coconut", key: "productsCoconut" as const, categoryKey: "coconut" as const },
  { slug: "birds-nest", key: "productsBirdsNest" as const, categoryKey: "birdsNest" as const },
  { slug: "fruit", key: "productsFruit" as const, categoryKey: "fruit" as const },
  {
    slug: "nuts-spices-botanicals",
    key: "productsNutsSpicesBotanicals" as const,
    categoryKey: "nutsSpicesBotanicals" as const,
  },
];

export const MAIN_NAV = [
  { href: "/about", key: "about" as const },
  { href: "/products", key: "products" as const, hasChildren: true },
  { href: "/certifications", key: "certifications" as const },
  { href: "/process", key: "process" as const },
  { href: "/clients", key: "clients" as const },
  { href: "/blog", key: "blog" as const },
  { href: "/contact", key: "contact" as const },
];
