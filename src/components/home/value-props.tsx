import { useTranslations } from "next-intl";
import { Sprout, ShieldCheck, FileCheck2, Users } from "lucide-react";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/ui/reveal";

const ICONS = [Sprout, ShieldCheck, FileCheck2, Users];

export function ValueProps() {
  const t = useTranslations("home.valueProps");
  const items = t.raw("items") as { title: string; description: string }[];

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />
      <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <Reveal key={item.title} delay={i * 100}>
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
