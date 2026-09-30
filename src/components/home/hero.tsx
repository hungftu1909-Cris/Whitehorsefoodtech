import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SUPPLIER_HREF } from "@/lib/nav";
import { hasPublicFile } from "@/lib/media";

// One dominant owner-supplied supply-network image and one restrained inset
// (docs/asset-provenance.md, "Homepage hero composition"): processing leads,
// export air freight supports. Neither is a product family, and no
// coffee-family visual is used here. about.jpg and factory.jpg stay
// unrendered: that artwork carries unsupported claims (claim registry row 15).
const HERO_IMAGES = [
  "/images/platform/quality-processing.webp",
  "/images/platform/network-air-freight.webp",
] as const;

/**
 * Server-rendered editorial hero on the luminous paper surface: promise,
 * one commercial paragraph, two actions and the two platform paths inline
 * (buyers continue in English, Vietnamese suppliers in Vietnamese) — no
 * first-visit modal. The figure is in normal flow: on phones it follows the
 * headline and actions; from lg it sits beside them. The inset lies inside
 * the image box and the representative-stage caption sits beneath both,
 * so it can never collide with either image. Main image = LCP, no carousel.
 */
export function Hero() {
  const t = useTranslations("home.hero");
  const images = t.raw("images") as { alt: string }[];
  const showImages = HERO_IMAGES.every(hasPublicFile);

  return (
    <section className="bg-luminous text-foreground" aria-labelledby="hero-title">
      <div className="mx-auto grid max-w-7xl gap-x-14 gap-y-12 px-5 pt-10 pb-16 sm:px-6 sm:pt-14 lg:grid-cols-12 lg:items-center lg:px-8 lg:pt-16 lg:pb-20">
        <div className="lg:col-span-6">
          <p className="text-xs font-medium tracking-[0.24em] text-accent uppercase">{t("eyebrow")}</p>
          <h1
            id="hero-title"
            className="mt-5 font-serif text-[2.25rem] leading-[1.07] font-medium tracking-[-0.02em] text-balance text-primary sm:text-5xl lg:mt-6 lg:text-[3.1rem] xl:text-[3.35rem]"
          >
            {t("title")}
          </h1>
          <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-pretty text-muted-foreground lg:text-lg">
            {t("subtitle")}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link
              href={{ pathname: "/rfq", query: { intent: "quote" } }}
              className="inline-flex h-12 cursor-pointer items-center rounded-sm bg-primary px-7 text-[0.9375rem] font-medium tracking-[0.01em] text-primary-foreground transition-colors duration-200 hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              {t("ctaPrimary")}
            </Link>
            <Link
              href="/products"
              className="inline-flex min-h-11 cursor-pointer items-center text-[0.9375rem] font-medium text-foreground underline decoration-accent/50 underline-offset-[10px] transition-colors duration-200 hover:decoration-accent focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
            >
              {t("ctaSecondary")}
            </Link>
          </div>

          {/* The two sides of the platform, chosen explicitly: buyers continue
              in English, Vietnamese suppliers in Vietnamese. */}
          <nav aria-label={t("paths.label")} className="mt-10 border-t border-foreground/12 pt-5">
            <ul className="flex flex-col gap-1 text-[0.9375rem] sm:flex-row sm:flex-wrap sm:gap-x-8">
              <li>
                <Link
                  href="/products"
                  locale="en"
                  lang="en"
                  hrefLang="en"
                  className="inline-flex min-h-11 items-center text-foreground/80 underline decoration-foreground/20 underline-offset-[6px] transition-colors duration-200 hover:text-foreground hover:decoration-accent focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
                >
                  {t("paths.buyer")}
                </Link>
              </li>
              <li>
                <Link
                  href={SUPPLIER_HREF}
                  locale="vi"
                  lang="vi"
                  hrefLang="vi"
                  className="inline-flex min-h-11 items-center text-foreground/80 underline decoration-foreground/20 underline-offset-[6px] transition-colors duration-200 hover:text-foreground hover:decoration-accent focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
                >
                  {t("paths.supplier")}
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {showImages && (
          <figure className="lg:col-span-6 lg:pl-6">
            <div className="relative aspect-[4/3] bg-muted lg:aspect-[5/4]">
              <Image
                src={HERO_IMAGES[0]}
                alt={images[0].alt}
                fill
                priority
                sizes="(min-width: 1024px) 44vw, 100vw"
                className="object-cover object-[60%_50%] saturate-[0.9]"
              />
              {/* The inset lies inside the image box (it only steps past its
                  left edge into the gutter), so the caption below is clear. */}
              <div className="absolute bottom-6 -left-6 hidden aspect-[4/3] w-44 border border-foreground/15 bg-background lg:block xl:w-52">
                <Image
                  src={HERO_IMAGES[1]}
                  alt={images[1].alt}
                  fill
                  sizes="13rem"
                  className="object-cover object-[62%_50%] saturate-[0.9]"
                />
              </div>
            </div>
            {/* Beneath the visible images; names only what each breakpoint shows. */}
            <figcaption className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              <span className="lg:hidden">{t("imageCaptionMobile")}</span>
              <span className="hidden lg:inline">{t("imageCaption")}</span>
            </figcaption>
          </figure>
        )}
      </div>
    </section>
  );
}
