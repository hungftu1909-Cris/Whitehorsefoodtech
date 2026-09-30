import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { FamilyVisual } from "@/components/catalog/family-visual";
import type { FamilySlug } from "@/lib/catalog";
import { CUSTOM_SOURCING_HREF, PRODUCT_CATEGORIES } from "@/lib/nav";

/**
 * The current portfolio as an editorial catalogue: every collection gets
 * the same image size, numeral, name and one descriptor — none is the
 * brand. The sixth plate is the open path for any other Vietnamese
 * ingredient, so the grid reads as today's focus, not the boundary
 * (2 + 2 + 2 on tablet, 3 + 3 on desktop). That plate is pale mist on a
 * hairline, not a dark block among the photographs.
 */
export function ProductsPreview() {
  const t = useTranslations("home.productsPreview");
  const tc = useTranslations("catalog");
  const locale = useLocale();
  const items = t.raw("items") as { title: string; tagline: string }[];
  const number = (i: number) => String(i + 1).padStart(2, "0");

  return (
    <section aria-labelledby="portfolio-title" className="bg-background">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 md:py-32 lg:px-8 lg:py-40">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="lg:max-w-2xl">
            <p className="text-xs font-medium tracking-[0.24em] text-accent uppercase">{t("eyebrow")}</p>
            <h2 id="portfolio-title" className="mt-5 font-serif text-[2rem] leading-[1.12] font-medium tracking-[-0.01em] text-balance text-foreground md:text-[2.6rem]">
              {t("title")}
            </h2>
          </div>
          <div className="lg:max-w-md">
            <p className="text-base leading-relaxed text-pretty text-muted-foreground">{t("subtitle")}</p>
            <Link
              href="/products"
              className="mt-6 inline-block text-[0.9375rem] font-medium text-foreground underline decoration-accent/50 underline-offset-8 transition-colors hover:decoration-accent"
            >
              {t("exploreCta")}
            </Link>
          </div>
        </div>

        <ul className="mt-16 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 md:mt-20 lg:grid-cols-3 lg:gap-y-20">
          {PRODUCT_CATEGORIES.map((category, i) => {
            const item = items[i];
            return (
              <li key={category.slug}>
                <Link href={`/products/${category.slug}`} className="group block cursor-pointer">
                  <FamilyVisual
                    family={category.slug as FamilySlug}
                    locale={locale}
                    name={item.title}
                    labels={{ concept: tc("conceptPackBadge") }}
                    showCounter={false}
                  />
                  <div className="mt-6 grid grid-cols-[2.5rem_1fr] gap-x-3">
                    <span className="pt-1.5 text-xs tracking-[0.12em] text-accent tabular-nums">{number(i)}</span>
                    <div>
                      <h3 className="font-serif text-[1.6rem] leading-tight font-medium text-foreground decoration-accent/60 underline-offset-[6px] group-hover:underline">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-base leading-relaxed text-muted-foreground">{item.tagline}</p>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}

          <li id="custom-sourcing" className="scroll-mt-28">
            <div className="group relative flex aspect-[4/3] flex-col justify-between border border-foreground/10 bg-muted p-7 text-foreground md:p-8">
              <p className="text-xs font-medium tracking-[0.24em] text-accent uppercase">{t("custom.eyebrow")}</p>
              <div>
                <h3 className="max-w-[16ch] font-serif text-[1.75rem] leading-[1.15] font-medium text-balance text-primary md:text-[2rem]">
                  {t("custom.title")}
                </h3>
                <Link
                  href={CUSTOM_SOURCING_HREF}
                  className="mt-6 inline-block text-[0.9375rem] font-medium underline decoration-accent/60 underline-offset-8 transition-colors after:absolute after:inset-0 group-hover:decoration-accent"
                >
                  {t("custom.cta")}
                </Link>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-[2.5rem_1fr] gap-x-3">
              <span className="pt-0.5 text-xs tracking-[0.12em] text-accent tabular-nums">{number(PRODUCT_CATEGORIES.length)}</span>
              <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">{t("custom.body")}</p>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}
