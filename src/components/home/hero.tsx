import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { ImageCarousel, type CarouselSlide } from "@/components/ui/image-carousel";
import { Reveal } from "@/components/ui/reveal";
import { hasPublicFile } from "@/lib/media";
import { cn } from "@/lib/utils";

// Illustrative photography only. factory.jpg is deliberately not a hero
// slide: its provenance is unconfirmed and, placed next to the company
// name, it reads as the company's own plant, while the business model is
// coordinating supplier and partner facilities.
const CANDIDATE_SLIDES: CarouselSlide[] = [
  { src: "/images/hero.jpg", alt: "Illustrative image: coffee cherries and freeze-dried fruit" },
  { src: "/images/about.jpg", alt: "Illustrative image: Vietnamese agricultural ingredients" },
];

export function Hero() {
  const t = useTranslations("home.hero");
  const slides = CANDIDATE_SLIDES.filter((s) => hasPublicFile(s.src));

  return (
    <section className="border-b border-border bg-muted/40">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-2 lg:items-center lg:px-8">
        <Reveal>
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
              href="/rfq"
              className={cn(buttonVariants({ size: "lg" }), "cursor-pointer px-6")}
            >
              {t("ctaPrimary")}
            </Link>
            <Link
              href="/products/coffee"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "cursor-pointer px-6"
              )}
            >
              {t("ctaSecondary")}
            </Link>
          </div>
        </Reveal>

        <Reveal delay={150} className="relative">
          <ImageCarousel
            slides={slides}
            placeholderLabel="Hero photography — coffee cherries / freeze-dried fruit (to replace)"
            aspect="aspect-[16/9]"
            className="w-full"
            priority
          />
        </Reveal>
      </div>
    </section>
  );
}
