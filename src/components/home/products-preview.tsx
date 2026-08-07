import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/components/sections/section-heading";
import { SmartImage } from "@/components/ui/smart-image";
import { Reveal } from "@/components/ui/reveal";
import { PRODUCT_CATEGORIES } from "@/lib/nav";

export function ProductsPreview() {
  const t = useTranslations("home.productsPreview");
  const items = t.raw("items") as {
    title: string;
    tagline: string;
    description: string;
    cta: string;
  }[];

  return (
    <section className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
        {/* 5 families: 3 + 2 on desktop reads more premium than a cramped
            5-across row, and keeps card width consistent with the /products
            listing grid. */}
        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => {
            const category = PRODUCT_CATEGORIES[i];
            return (
              <Reveal key={item.title} delay={i * 100}>
                <Link
                  href={`/products/${category.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md"
                >
                  <SmartImage
                    src={`/images/products/${category.slug}-card.jpg`}
                    alt={item.title}
                    placeholderLabel={`${item.title} — photo needed`}
                    aspect="aspect-[3/2]"
                    className="rounded-none border-0 border-b border-border"
                  />
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-serif text-xl font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-accent">{item.tagline}</p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                      {item.cta}
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
