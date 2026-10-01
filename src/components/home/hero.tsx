import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SUPPLIER_HREF } from "@/lib/nav";
import { hasPublicFile } from "@/lib/media";
import { EntryChooserButton } from "@/components/layout/audience-gateway";

// Owner-supplied supply-network photographs (docs/asset-provenance.md,
// "Homepage hero composition"): processing leads; a growing-area harvest and
// export air freight support. All three are captioned as representative
// stages, never as Whitehorse-owned farms, facilities or a shipment. about.jpg and factory.jpg stay
// unrendered: that artwork carries unsupported claims (claim registry row 15).
// Three representative supply-network stages, keyed (never positional):
// harvest at a growing area, freeze-drying, and export air cargo.
const HERO_IMAGES = {
  origin: "/images/platform/origin-harvest.webp",
  processing: "/images/platform/quality-processing.webp",
  freight: "/images/platform/network-air-freight.webp",
} as const;

/**
 * Server-rendered editorial hero on the luminous paper surface: promise,
 * one commercial paragraph, two actions and the platform paths inline
 * (buyers continue in English, Vietnamese suppliers in Vietnamese) plus a
 * control that reopens the bilingual entry chooser (AudienceGateway, which
 * also opens by itself on every arrival at the homepage). The figure is a
 * three-photo collage in normal flow: on phones it follows the headline and
 * actions; from lg it sits beside them. One caption sits beneath the collage,
 * outside every photo. The processing photo is the LCP; no carousel.
 */
export function Hero() {
  const t = useTranslations("home.hero");
  const images = t.raw("images") as Record<keyof typeof HERO_IMAGES, { alt: string }>;
  const showImages = Object.values(HERO_IMAGES).every(hasPublicFile);

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
          {/* Scannable keywords: what Whitehorse delivers, in four labels. */}
          <ul className="mt-6 flex flex-wrap gap-x-2 gap-y-2" aria-label={t("eyebrow")}>
            {(t.raw("facts") as string[]).map((fact) => (
              <li key={fact} className="rounded-sm border border-primary/20 bg-card/70 px-2.5 py-1 text-xs font-semibold tracking-[0.12em] text-primary uppercase">
                {fact}
              </li>
            ))}
          </ul>
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
              <li>
                <EntryChooserButton label={t("paths.chooser")} />
              </li>
            </ul>
          </nav>
        </div>

        {showImages && (
          <figure className="lg:col-span-6 lg:pl-4">
            {/* One fixed-ratio stage; every tile is placed in percentages of
                it, so the collage keeps its proportions from 320px up. The
                caption sits below the stage and can never touch a photo. */}
            <div className="relative aspect-[6/5] w-full">
              <div className="absolute top-0 right-0 h-[80%] w-[74%] border border-foreground/15 bg-muted">
                <Image
                  src={HERO_IMAGES.processing}
                  alt={images.processing.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 34vw, 74vw"
                  className="object-cover object-[60%_50%] saturate-[0.9]"
                />
              </div>
              <div className="absolute top-[13%] left-0 aspect-[4/5] w-[35%] border border-foreground/15 bg-muted">
                <Image
                  src={HERO_IMAGES.origin}
                  alt={images.origin.alt}
                  fill
                  sizes="(min-width: 1024px) 16vw, 35vw"
                  className="object-cover saturate-[0.9]"
                />
              </div>
              <div className="absolute right-[7%] bottom-0 aspect-[4/3] w-[47%] border border-foreground/15 bg-muted">
                <Image
                  src={HERO_IMAGES.freight}
                  alt={images.freight.alt}
                  fill
                  sizes="(min-width: 1024px) 22vw, 47vw"
                  className="object-cover object-[62%_50%] saturate-[0.9]"
                />
              </div>
            </div>
            <figcaption className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">{t("imageCaption")}</figcaption>
          </figure>
        )}
      </div>
    </section>
  );
}
