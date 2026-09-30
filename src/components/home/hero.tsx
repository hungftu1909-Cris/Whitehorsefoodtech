import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { CUSTOM_SOURCING_HREF, PRODUCT_CATEGORIES } from "@/lib/nav";
import { hasPublicFile } from "@/lib/media";
import { cn } from "@/lib/utils";

// Platform-level composition from owner-supplied supply-network images
// (docs/asset-provenance.md, "Platform and supply-network imagery"):
// processing, origin and market connection — no single product family
// leads the first viewport. They always carry the representative-stage
// caption. about.jpg and factory.jpg stay unrendered: that artwork
// carries unsupported claims (claim registry row 15).
const HERO_IMAGES = [
  "/images/platform/quality-processing.webp",
  "/images/platform/network-coffee-harvest.webp",
  "/images/platform/network-air-freight.webp",
] as const;

/**
 * Server-rendered hero: the platform promise, the current operating
 * standard and the current portfolio as an open-ended line. The first
 * image is the page's LCP and the only priority image — no carousel or
 * client JS.
 */
export function Hero() {
  const t = useTranslations("home.hero");
  const tn = useTranslations("nav");
  const images = t.raw("images") as { label: string; alt: string }[];
  const showImages = HERO_IMAGES.every(hasPublicFile);

  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      <div aria-hidden="true" className="absolute inset-y-0 right-0 hidden w-[46%] bg-muted/50 lg:block" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:px-8 lg:py-24">
        <div>
          <p className="text-xs font-semibold tracking-[0.22em] text-accent uppercase">{t("eyebrow")}</p>
          <h1 className="mt-5 max-w-2xl font-serif text-4xl leading-[1.06] font-semibold tracking-[-0.025em] text-balance text-foreground md:text-[3.4rem]">
            {t("title")}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-muted-foreground">
            {t("subtitle")}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={{ pathname: "/rfq", query: { intent: "quote" } }}
              className={cn(buttonVariants({ size: "lg" }), "group cursor-pointer px-6")}
            >
              {t("ctaPrimary")}
              <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
            <Link
              href="/products"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "cursor-pointer px-6")}
            >
              {t("ctaSecondary")}
            </Link>
          </div>

          {/* The current portfolio is read from PRODUCT_CATEGORIES, so a new
              collection appears here without a copy change; custom sourcing
              is always the open end of the list. */}
          <div className="mt-10 max-w-xl border-t border-border pt-5">
            <p className="text-[0.65rem] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              {t("portfolioLabel")}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-foreground">
              {PRODUCT_CATEGORIES.map((c) => tn(c.key)).join(" · ")}
              <span className="text-muted-foreground"> · </span>
              <Link href={CUSTOM_SOURCING_HREF} className="font-medium text-accent underline-offset-4 hover:underline">
                {t("portfolioBeyond")}
              </Link>
            </p>
          </div>
        </div>

        <div className="relative">
          {showImages && (
            <figure>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-6">
                {HERO_IMAGES.map((src, i) => (
                  <div
                    key={src}
                    className={cn(
                      "relative overflow-hidden rounded-lg border border-border bg-muted",
                      i === 0 ? "col-span-2 aspect-[4/3] sm:col-span-4 sm:row-span-2 sm:aspect-auto" : "aspect-[4/3] sm:col-span-2"
                    )}
                  >
                    <Image
                      src={src}
                      alt={images[i].alt}
                      fill
                      priority={i === 0}
                      sizes={i === 0 ? "(min-width: 1280px) 25rem, (min-width: 1024px) 33vw, (min-width: 640px) 66vw, 100vw" : "(min-width: 1024px) 12rem, (min-width: 640px) 33vw, 50vw"}
                      className="object-cover"
                    />
                    <span className="absolute bottom-2 left-2 rounded-sm bg-primary/85 px-2 py-1 text-[0.6rem] font-semibold tracking-[0.14em] text-primary-foreground uppercase">
                      {images[i].label}
                    </span>
                  </div>
                ))}
              </div>
              <figcaption className="mt-3 text-[0.7rem] leading-relaxed text-muted-foreground">
                {t("imageCaption")}
              </figcaption>
            </figure>
          )}

          {/* The prime card states a capability that operates today; future
              digital layers are shown further down with their own status. */}
          <div className={cn("relative rounded-lg border border-border bg-card p-5 shadow-[0_24px_60px_-40px_rgba(20,30,24,0.55)]", showImages && "mt-5")}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[0.65rem] font-semibold tracking-[0.16em] text-accent uppercase">{t("standard.label")}</p>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2.5 py-1 text-[0.65rem] font-semibold tracking-[0.12em] text-success uppercase">
                <Check className="size-3" aria-hidden="true" />
                {t("standard.status")}
              </span>
            </div>
            <p className="mt-2 font-serif text-xl font-semibold text-foreground">{t("standard.title")}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t("standard.body")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
