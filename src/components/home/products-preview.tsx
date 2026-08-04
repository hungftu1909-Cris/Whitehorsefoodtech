import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/components/sections/section-heading";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { PRODUCT_CATEGORIES } from "@/lib/nav";

export function ProductsPreview() {
  const t = useTranslations("home.productsPreview");
  const items = t.raw("items") as { title: string; description: string; cta: string }[];

  return (
    <section className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
          {items.map((item, i) => {
            const category = PRODUCT_CATEGORIES[i];
            return (
              <Link
                key={item.title}
                href={`/products/${category.slug}`}
                className="group cursor-pointer overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md"
              >
                <ImagePlaceholder label={`${item.title} — photo needed`} aspect="aspect-[4/3]" className="rounded-none border-0 border-b border-border" />
                <div className="p-6">
                  <h3 className="font-serif text-xl font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                    {item.cta}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
