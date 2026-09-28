import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, Download, Layers3, PackageCheck, ShieldCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/sections/page-hero";
import { PACKAGING_CHANNELS, PACKAGING_STRUCTURES } from "@/lib/packaging";
import { pick, type FamilySlug } from "@/lib/catalog";
import { PRODUCT_CATEGORIES } from "@/lib/nav";
import { pageMetadata } from "@/lib/seo";

const PACKAGING_PDF = "/documents/whitehorse-foodtech-packaging-architecture.pdf";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "packaging.hero" });
  return pageMetadata({ locale, path: "/packaging", title: t("title"), description: t("subtitle") });
}

export default async function PackagingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "packaging" });
  const tn = await getTranslations({ locale, namespace: "nav" });
  const familyLabels = Object.fromEntries(
    PRODUCT_CATEGORIES.map((category) => [category.slug, tn(category.key)])
  ) as Record<FamilySlug, string>;
  const principles = t.raw("principles.items") as { title: string; body: string }[];

  return (
    <>
      <PageHero eyebrow={t("hero.eyebrow")} title={t("hero.title")} subtitle={t("hero.subtitle")} />

      <section className="border-y border-border bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-7xl gap-px bg-primary-foreground/15 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["27", t("stats.structures")],
            ["29", t("stats.forms")],
            ["103", t("stats.positions")],
            ["4", t("stats.channels")],
          ].map(([value, label]) => (
            <div key={label} className="bg-primary px-6 py-7 lg:px-8">
              <p className="font-serif text-4xl font-semibold text-accent">{value}</p>
              <p className="mt-1 text-sm text-primary-foreground/70">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">{t("channels.eyebrow")}</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-balance text-foreground md:text-4xl">
              {t("channels.title")}
            </h2>
          </div>
          <p className="max-w-2xl leading-relaxed text-muted-foreground lg:justify-self-end">{t("channels.subtitle")}</p>
        </div>
        <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {PACKAGING_CHANNELS.map((channel, index) => (
            <li key={channel.id} className="rounded-xl border border-border bg-card p-5">
              <p className="font-mono text-xs tracking-wider text-accent">0{index + 1}</p>
              <h3 className="mt-5 font-serif text-xl font-semibold text-foreground">{pick(channel.name, locale)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{pick(channel.buyer, locale)}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-accent uppercase">
                <Layers3 className="size-4" aria-hidden="true" />
                {t("structures.eyebrow")}
              </p>
              <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-balance text-foreground md:text-4xl">
                {t("structures.title")}
              </h2>
            </div>
            <p className="max-w-2xl leading-relaxed text-muted-foreground lg:justify-self-end">{t("structures.subtitle")}</p>
          </div>

          <div className="mt-8 rounded-xl border border-accent/30 bg-accent/5 p-5 text-sm leading-relaxed text-foreground md:p-6">
            <strong>{t("reference.label")}</strong> {t("reference.body")}
          </div>

          <ul className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {PACKAGING_STRUCTURES.map((structure) => (
              <li key={structure.code} className="flex min-h-52 flex-col rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <span className="font-mono text-sm font-semibold tracking-wider text-accent">{structure.code}</span>
                  <span className="text-right font-mono text-xs text-muted-foreground">{structure.dimensions}</span>
                </div>
                <h3 className="mt-6 font-serif text-xl font-semibold text-foreground">{pick(structure.name, locale)}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{pick(structure.fill, locale)}</p>
                <ul className="mt-auto flex flex-wrap gap-1.5 pt-6" aria-label={t("structures.usedBy")}>
                  {structure.families.map((family) => (
                    <li key={family} className="rounded-full bg-muted px-2.5 py-1 text-[0.7rem] text-foreground/80">
                      {familyLabels[family]}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-accent uppercase">
              <ShieldCheck className="size-4" aria-hidden="true" />
              {t("principles.eyebrow")}
            </p>
            <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-balance text-foreground md:text-4xl">
              {t("principles.title")}
            </h2>
          </div>
          <ul className="divide-y divide-border border-y border-border">
            {principles.map((principle, index) => (
              <li key={principle.title} className="grid gap-3 py-5 sm:grid-cols-[3rem_0.7fr_1.3fr]">
                <span className="font-mono text-xs text-accent">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="font-serif text-lg font-semibold text-foreground">{principle.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{principle.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-border bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-[1fr_auto] md:items-center lg:px-8">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-accent uppercase">
              <PackageCheck className="size-4" aria-hidden="true" />
              {t("custom.eyebrow")}
            </p>
            <h2 className="mt-3 max-w-3xl font-serif text-3xl font-semibold text-balance">{t("custom.title")}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-primary-foreground/70">{t("custom.body")}</p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <a href={PACKAGING_PDF} download className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground">
              <Download className="size-4" aria-hidden="true" />
              {t("custom.download")}
            </a>
            <Link href={{ pathname: "/rfq", query: { intent: "spec-sheet" } }} className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-primary-foreground/25 px-4 py-2.5 text-sm font-semibold hover:border-accent hover:text-accent">
              {t("custom.cta")}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
