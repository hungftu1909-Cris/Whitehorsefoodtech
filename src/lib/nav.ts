export const PRODUCT_CATEGORIES = [
  { slug: "coffee", key: "productsCoffee" as const, categoryKey: "coffee" as const },
  {
    slug: "freeze-dried-fruit-powder",
    key: "productsFruitPowder" as const,
    categoryKey: "fruitPowder" as const,
  },
  {
    slug: "premium-agri-raw-materials",
    key: "productsAgri" as const,
    categoryKey: "agriRaw" as const,
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
