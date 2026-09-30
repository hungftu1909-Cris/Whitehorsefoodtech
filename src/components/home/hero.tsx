import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CUSTOM_SOURCING_HREF, PRODUCT_CATEGORIES } from "@/lib/nav";
import { hasPublicFile } from "@/lib/media";

// One dominant owner-supplied supply-network image and one restrained inset
// (docs/asset-provenance.md, "Homepage hero composition"): processing leads,
// Vietnamese origin supports. Neither is a product family. The
// representative-stage disclosure is a proper caption beneath the image,
// outside the focal area. about.jpg and factory.jpg stay unrendered: that
// artwork carries unsupported claims (claim registry row 15).
const HERO_IMAGES = [
  "/images/platform/quality-processing.webp",
  "/images/platform/network-coffee-harvest.webp",
] as const;

/**
 * Server-rendered editorial hero on the black-olive surface: the platform
 * promise, two quiet actions and a ruled footer carrying the current
 * operating standard and the open-ended current portfolio. The main image
 * is the page's LCP and the only priority image — no carousel or client JS.
 */
export function Hero() {
  const t = useTranslations("home.hero");
  const tn = useTranslations("nav");
  const images = t.raw("images") as { alt: string }[];
  const showImages = HERO_IMAGES.every(hasPublicFile);

  return (
    <section className="relative isolate overflow-hidden bg-deep text-deep-foreground">
      {showImages && (
        <figure className="relative lg:absolute lg:inset-y-0 lg:right-0 lg:w-[37%] xl:w-[38%]">
          <div className="relative aspect-[16/9] lg:absolute lg:inset-x-0 lg:top-16 lg:bottom-28 lg:aspect-auto">
            <Image
              src={HERO_IMAGES[0]}
              alt={images[0].alt}
              fill
              priority
              sizes="(min-width: 1024px) 38vw, 100vw"
              className="object-cover object-[60%_50%] saturate-[0.85]"
            />
            {/* Blends the photograph into the surface instead of framing it. */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-deep/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-deep/35 lg:via-transparent"
            />
          </div>

          <div className="absolute bottom-16 -left-10 hidden aspect-[4/5] w-36 border-[6px] border-deep lg:block xl:w-44">
            <Image
              src={HERO_IMAGES[1]}
              alt={images[1].alt}
              fill
              sizes="11rem"
              className="object-cover object-[58%_50%] saturate-[0.82]"
            />
          </div>

          <figcaption className="hidden text-xs leading-relaxed text-deep-foreground/55 lg:absolute lg:right-0 lg:bottom-8 lg:left-40 lg:block lg:pr-8 xl:left-48 xl:pr-12">
            {t("imageCaption")}
          </figcaption>
        </figure>
      )}

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col pt-9 pb-12 sm:pt-12 lg:min-h-[clamp(38rem,calc(100svh-5rem),50rem)] lg:w-[60%] lg:pt-24 lg:pr-12 lg:pb-0">
          <p className="text-xs font-medium tracking-[0.28em] text-accent uppercase">{t("eyebrow")}</p>
          <h1 className="mt-5 font-serif text-[2.3rem] leading-[1.06] font-medium tracking-[-0.02em] text-balance sm:text-5xl lg:mt-7 lg:text-[3.2rem] xl:text-[3.5rem]">
            {t("title")}
          </h1>
          <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-pretty text-deep-foreground/72 lg:mt-8 lg:text-lg">
            {t("subtitle")}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-5 lg:mt-10">
            <Link
              href={{ pathname: "/rfq", query: { intent: "quote" } }}
              className="inline-flex h-12 cursor-pointer items-center bg-deep-foreground px-7 text-[0.9375rem] font-medium tracking-[0.01em] text-deep transition-colors hover:bg-white focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
            >
              {t("ctaPrimary")}
            </Link>
            <Link
              href="/products"
              className="cursor-pointer text-[0.9375rem] font-medium underline decoration-deep-foreground/35 underline-offset-[10px] transition-colors hover:decoration-accent focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
            >
              {t("ctaSecondary")}
            </Link>
          </div>

          {/* The current portfolio is read from PRODUCT_CATEGORIES, so a new
              collection appears here without a copy change; custom sourcing
              is always the open end of the list. The standard states a
              capability that operates today. */}
          <dl className="mt-14 grid gap-8 border-t border-deep-foreground/15 pt-7 sm:grid-cols-2 sm:gap-10 lg:mt-auto lg:mb-16 lg:pt-8">
            <div>
              <dt className="text-xs tracking-[0.2em] text-deep-foreground/55 uppercase">{t("standard.label")}</dt>
              <dd className="mt-3 font-serif text-xl">{t("standard.title")}</dd>
              <dd className="mt-1.5 text-sm text-accent">{t("standard.status")}</dd>
            </div>
            <div>
              <dt className="text-xs tracking-[0.2em] text-deep-foreground/55 uppercase">{t("portfolioLabel")}</dt>
              <dd className="mt-3 text-[0.9375rem] leading-relaxed text-deep-foreground/80">
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

          {showImages && (
            <p className="mt-8 text-xs leading-relaxed text-deep-foreground/50 lg:hidden">{t("imageCaption")}</p>
          )}
        </div>
      </div>
    </section>
  );
}
