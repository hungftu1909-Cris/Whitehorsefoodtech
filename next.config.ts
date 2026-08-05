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
};

export default withNextIntl(nextConfig);
