import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { SmartImage } from "@/components/ui/smart-image";
import { cn } from "@/lib/utils";

export function Hero() {
  const t = useTranslations("home.hero");

  return (
    <section className="border-b border-border bg-muted/40">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-2 lg:items-center lg:px-8">
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
              href="/rfq"
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

        <SmartImage
          src="/images/hero.jpg"
          alt="Coffee cherries and freeze-dried fruit — Whitehorse Foodtech premium agricultural exports"
          placeholderLabel="Hero photography — coffee cherries / freeze-dried fruit / factory (to replace)"
          aspect="aspect-[16/9]"
          className="w-full"
          sizes="(min-width: 1024px) 50vw, 100vw"
          priority
        />
      </div>
    </section>
  );
}
