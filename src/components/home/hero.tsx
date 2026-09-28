import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { hasPublicFile } from "@/lib/media";
import { cn } from "@/lib/utils";

// about.jpg and factory.jpg are deliberately NOT rendered anywhere: the
// artwork itself carries unsupported claims ("> 3,000 cooperatives",
// "hundreds of factories/markets", a Whitehorse-branded factory and
// trucks, a global-delivery slogan). The files stay in public/images until
// replaced; see docs/claim-registry.md row 15.
const HERO_IMAGE = {
  src: "/images/hero.jpg",
  alt: "Illustrative image: coffee cherries and freeze-dried fruit",
};

/**
 * Server-rendered hero: one positioning sentence, one support line, RFQ +
 * Products CTAs. The single image is the page's LCP, so it is the only
 * priority image on the homepage — no carousel or client JS.
 */
export function Hero() {
  const t = useTranslations("home.hero");

  return (
    <section className="border-b border-border bg-muted/40">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2 lg:items-center lg:px-8">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
            {t("eyebrow")}
          </p>
          <h1 className="mt-4 max-w-xl font-serif text-4xl leading-[1.08] font-semibold tracking-tight text-balance text-foreground md:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-6 max-w-lg text-lg text-pretty text-muted-foreground">
            {t("subtitle")}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={{ pathname: "/rfq", query: { intent: "quote" } }}
              className={cn(buttonVariants({ size: "lg" }), "cursor-pointer px-6")}
            >
              {t("ctaPrimary")}
            </Link>
            <Link
              href="/products"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "cursor-pointer px-6"
              )}
            >
              {t("ctaSecondary")}
            </Link>
          </div>
        </div>

        {hasPublicFile(HERO_IMAGE.src) && (
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-border">
            <Image
              src={HERO_IMAGE.src}
              alt={HERO_IMAGE.alt}
              fill
              priority
              sizes="(min-width: 1280px) 38rem, (min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        )}
      </div>
    </section>
  );
}
