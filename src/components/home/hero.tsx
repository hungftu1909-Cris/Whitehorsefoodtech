import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { ImageCarousel, type CarouselSlide } from "@/components/ui/image-carousel";
import { Reveal } from "@/components/ui/reveal";
import { hasPublicFile } from "@/lib/media";
import { cn } from "@/lib/utils";

// about.jpg and factory.jpg are deliberately NOT rendered anywhere: the
// artwork itself carries unsupported claims ("> 3,000 cooperatives",
// "hundreds of factories/markets", a Whitehorse-branded factory and
// trucks, a global-delivery slogan). The files stay in public/images until
// replaced; see docs/claim-registry.md row 15.
const CANDIDATE_SLIDES: CarouselSlide[] = [
  { src: "/images/hero.jpg", alt: "Illustrative image: coffee cherries and freeze-dried fruit" },
];

export function Hero() {
  const t = useTranslations("home.hero");
  const slides = CANDIDATE_SLIDES.filter((s) => hasPublicFile(s.src));

  return (
    <section className="border-b border-border bg-muted/40">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-2 lg:items-center lg:px-8">
        {/* Not wrapped in <Reveal>: essential copy must be visible in the
            server HTML without JS (and must not delay LCP). */}
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

        <Reveal delay={150} className="relative">
          <ImageCarousel
            slides={slides}
            aspect="aspect-[16/9]"
            className="w-full"
            priority
          />
        </Reveal>
      </div>
    </section>
  );
}
