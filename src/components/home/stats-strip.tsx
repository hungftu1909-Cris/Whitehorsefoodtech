import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";

/**
 * Scale/credibility numbers surfaced right on the homepage — reuses the
 * same figures as the About page (single source of truth: about.stats.*)
 * rather than duplicating copy in a separate translation key.
 */
export function StatsStrip() {
  const t = useTranslations("about.stats");
  const stats = t.raw("items") as { value: string; label: string }[];

  return (
    <section className="border-b border-border bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <dl className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 80} className="text-center md:text-left">
              <dt className="sr-only">{stat.label}</dt>
              <dd className="font-serif text-3xl font-semibold text-accent md:text-4xl">
                {stat.value}
              </dd>
              <p className="mt-1 text-xs text-primary-foreground/70 md:text-sm">{stat.label}</p>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
