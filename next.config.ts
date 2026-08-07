import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Drop the X-Powered-By response header — no functional value, saves bytes.
  poweredByHeader: false,
  // Per-icon imports from lucide-react instead of pulling in the whole
  // package's module graph (keeps client bundles smaller).
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  // Product taxonomy rework (2026-08): three family slugs changed. Redirect
  // the old URLs (308, permanent) so bookmarks/backlinks/search results
  // keep working instead of 404ing. "coffee" is unchanged so needs none.
  async redirects() {
    return [
      {
        source: "/:locale(en|vi)/products/freeze-dried-fruit-powder",
        destination: "/:locale/products/fruit",
        permanent: true,
      },
      {
        source: "/:locale(en|vi)/products/processed-birds-nest",
        destination: "/:locale/products/birds-nest",
        permanent: true,
      },
      {
        source: "/:locale(en|vi)/products/premium-agri-raw-materials",
        destination: "/:locale/products/nuts-spices-botanicals",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
