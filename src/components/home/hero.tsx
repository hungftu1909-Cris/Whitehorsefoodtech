import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CUSTOM_SOURCING_HREF, PRODUCT_CATEGORIES } from "@/lib/nav";
import { hasPublicFile } from "@/lib/media";

// One dominant owner-supplied supply-network image and one restrained inset
// (docs/asset-provenance.md, "Homepage hero composition"): processing leads,
// export air freight supports. Neither is a product family, and no
// coffee-family visual is used here. The representative-stage disclosure is a
// proper caption directly beneath the visible image, outside the focal area.
// about.jpg and factory.jpg stay unrendered: that artwork carries unsupported
// claims (claim registry row 15).
const HERO_IMAGES = [
  "/images/platform/quality-processing.webp",
  "/images/platform/network-air-freight.webp",
] as const;

/**
 * Server-rendered editorial hero on the luminous paper surface: the platform
 * promise in forest ink, two quiet actions and a ruled footer carrying the
 * current operating standard and the open-ended current portfolio. The
 * photograph sits in daylight — no dark surround or overlay. The main image
 * is the page's LCP and the only priority image — no carousel or client JS.
 */
export function Hero() {
  const t = useTranslations("home.hero");
  const tn = useTranslations("nav");
  const images = t.raw("images") as { alt: string }[];
  const showImages = HERO_IMAGES.every(hasPublicFile);

  return (
    <section className="bg-luminous relative isolate overflow-hidden text-foreground">
      {showImages && (
        <figure className="relative px-5 pt-2 sm:px-6 lg:absolute lg:inset-y-0 lg:right-0 lg:w-[37%] lg:p-0 xl:w-[38%]">
          <div className="relative aspect-[16/9] bg-muted lg:absolute lg:inset-x-0 lg:top-16 lg:bottom-28 lg:aspect-auto">
            <Image
              src={HERO_IMAGES[0]}
              alt={images[0].alt}
              fill
              priority
              sizes="(min-width: 1024px) 38vw, 100vw"
              className="object-cover object-[60%_50%] saturate-[0.9]"
            />
          </div>

          {/* The inset sits proud of the paper on a hairline, in daylight. */}
          <div className="absolute bottom-16 -left-10 hidden aspect-[4/3] w-52 border border-foreground/15 bg-background lg:block xl:w-60">
            <Image
              src={HERO_IMAGES[1]}
              alt={images[1].alt}
              fill
              sizes="15rem"
              className="object-cover object-[62%_50%] saturate-[0.9]"
            />
          </div>

          {/* Mobile shows only the main image, so its caption names only that
              stage; desktop adds the inset and names both. */}
          <figcaption className="pt-3 text-xs leading-relaxed text-muted-foreground lg:absolute lg:right-0 lg:bottom-8 lg:left-48 lg:px-0 lg:pt-0 lg:pr-8 xl:left-56 xl:pr-12">
            <span className="lg:hidden">{t("imageCaptionMobile")}</span>
            <span className="hidden lg:inline">{t("imageCaption")}</span>
          </figcaption>
        </figure>
      )}

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col pt-9 pb-12 sm:pt-12 lg:min-h-[clamp(36rem,calc(100svh-5rem),46rem)] lg:w-[60%] lg:pt-24 lg:pr-12 lg:pb-0">
          <p className="text-xs font-medium tracking-[0.28em] text-accent uppercase">{t("eyebrow")}</p>
          <h1 className="mt-5 font-serif text-[2.3rem] leading-[1.06] font-medium tracking-[-0.02em] text-balance text-primary sm:text-5xl lg:mt-7 lg:text-[3.2rem] xl:text-[3.5rem]">
            {t("title")}
          </h1>
          <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-pretty text-muted-foreground lg:mt-8 lg:text-lg">
            {t("subtitle")}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-5 lg:mt-10 lg:mb-14">
            <Link
              href={{ pathname: "/rfq", query: { intent: "quote" } }}
              className="inline-flex h-12 cursor-pointer items-center bg-primary px-7 text-[0.9375rem] font-medium tracking-[0.01em] text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
            >
              {t("ctaPrimary")}
            </Link>
            <Link
              href="/products"
              className="inline-flex min-h-11 cursor-pointer items-center text-[0.9375rem] font-medium text-foreground underline decoration-accent/50 underline-offset-[10px] transition-colors hover:decoration-accent focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
            >
              {t("ctaSecondary")}
            </Link>
          </div>

          {/* The current portfolio is read from PRODUCT_CATEGORIES, so a new
              collection appears here without a copy change; custom sourcing
              is always the open end of the list. The standard states a
              capability that operates today. */}
          <dl className="mt-14 grid gap-8 border-t border-foreground/15 pt-7 sm:grid-cols-2 sm:gap-10 lg:mt-auto lg:mb-16 lg:pt-8">
            <div>
              <dt className="text-xs tracking-[0.2em] text-muted-foreground uppercase">{t("standard.label")}</dt>
              <dd className="mt-3 font-serif text-xl text-primary">{t("standard.title")}</dd>
              <dd className="mt-1.5 text-sm text-accent">{t("standard.status")}</dd>
            </div>
            <div>
              <dt className="text-xs tracking-[0.2em] text-muted-foreground uppercase">{t("portfolioLabel")}</dt>
              <dd className="mt-3 text-[0.9375rem] leading-relaxed text-foreground/80">
                {PRODUCT_CATEGORIES.map((c) => tn(c.key)).join(" · ")}
                {" · "}
                <Link
                  href={CUSTOM_SOURCING_HREF}
                  className="text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
                >
                  {t("portfolioBeyond")}
                </Link>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
