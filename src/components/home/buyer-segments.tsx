import { useTranslations } from "next-intl";
import { Ship, Warehouse, CupSoda } from "lucide-react";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/ui/reveal";

// Matches home.segments.items order: trading houses, ingredient
// distributors, beverage manufacturers.
const ICONS = [Ship, Warehouse, CupSoda];

export function BuyerSegments() {
  const t = useTranslations("home.segments");
  const items = t.raw("items") as { title: string; description: string }[];

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
      <SectionHeading eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
        {items.map((item, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <Reveal key={item.title} delay={i * 100} className="rounded-lg border border-border bg-card p-6">
              <div className="flex size-10 items-center justify-center rounded-md bg-accent/15 text-accent">
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-serif text-lg font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
