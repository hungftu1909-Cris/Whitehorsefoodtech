import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Check, CircleDashed } from "lucide-react";
import { ImageBadge } from "@/components/catalog/cards";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { hasPublicFile } from "@/lib/media";
import { cn } from "@/lib/utils";

// about.jpg and factory.jpg are deliberately NOT rendered anywhere: the
// artwork itself carries unsupported claims ("> 3,000 cooperatives",
// "hundreds of factories/markets", a Whitehorse-branded factory and
// trucks, a global-delivery slogan). The files stay in public/images until
// replaced; see docs/claim-registry.md row 15.
const HERO_IMAGE = "/images/catalog/coffee/coffee-ground-whole-instant.jpg";

/**
 * Server-rendered hero: one positioning sentence, one support line, RFQ +
 * Products CTAs. The single image is the page's LCP, so it is the only
 * priority image on the homepage — no carousel or client JS.
 */
export function Hero() {
  const t = useTranslations("home.hero");
  const tc = useTranslations("catalog");
  const locale = useLocale();
  const signals = t.raw("signals") as { label: string; value: string }[];

  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      <div aria-hidden="true" className="absolute inset-y-0 right-0 hidden w-1/2 bg-muted/45 lg:block" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:px-8 lg:py-28">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs font-semibold tracking-[0.22em] text-accent uppercase">{t("eyebrow")}</p>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2.5 py-1 text-[0.65rem] font-semibold tracking-[0.12em] text-success uppercase">
              <Check className="size-3" aria-hidden="true" />
              {t("status")}
            </span>
          </div>
          <h1 className="mt-5 max-w-2xl font-serif text-4xl leading-[1.04] font-semibold tracking-[-0.025em] text-balance text-foreground md:text-6xl">
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
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "cursor-pointer px-6"
              )}
            >
              {t("ctaSecondary")}
            </Link>
          </div>

          <dl className="mt-10 grid max-w-xl grid-cols-3 border-y border-border">
            {signals.map((signal) => (
              <div key={signal.label} className="border-r border-border py-4 pr-3 last:border-r-0 last:pl-4 sm:px-4 sm:first:pl-0">
                <dt className="text-[0.65rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">{signal.label}</dt>
                <dd className="mt-1 font-serif text-lg font-semibold text-foreground">{signal.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {hasPublicFile(HERO_IMAGE) && (
          <div className="relative">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-muted shadow-[0_28px_80px_-45px_rgba(36,21,5,0.65)]">
              <Image
                src={HERO_IMAGE}
                alt={locale === "vi" ? "Cà phê xay, cà phê hạt rang và cà phê hòa tan dạng hạt trong ba chiếc cốc" : "Ground coffee, roasted beans and instant coffee granules in three cups"}
                fill
                priority
                sizes="(min-width: 1280px) 38rem, (min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <ImageBadge>{tc("editorialBadge")}</ImageBadge>
            </div>
            <div className="relative -mt-10 ml-6 rounded-lg border border-border bg-card p-5 shadow-xl sm:ml-auto sm:w-[80%] lg:-mr-8">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[0.65rem] font-semibold tracking-[0.16em] text-accent uppercase">{t("moduleLabel")}</p>
                <span className="inline-flex items-center gap-1.5 text-[0.65rem] text-muted-foreground">
                  <CircleDashed className="size-3" aria-hidden="true" />
                  {t("building")}
                </span>
              </div>
              <p className="mt-2 font-serif text-lg font-semibold text-foreground">{t("moduleTitle")}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t("moduleBody")}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
