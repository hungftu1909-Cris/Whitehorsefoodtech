import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { SplitCta } from "@/components/sections/split-cta";
import { FamilyVisual } from "@/components/catalog/family-visual";
import { ABOUT_MOSAIC_FAMILIES } from "@/lib/family-images";
import { PRODUCT_CATEGORIES } from "@/lib/nav";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

// Truth boundary for this page (docs/claim-registry.md):
// - Mission, vision and the four long-term roles are VISION: labelled as
//   direction being built toward, never as current services.
// - Current figures (50+ suppliers, 10+ markets) sit next to the three-year
//   VISION figures (3,000+ / 10,000+), each with its visible tag. This is
//   the only page that shows the vision figures; the homepage shows
//   current facts only.
// - Balance Life is a program signal; no partner logos or other names.
// - The legacy About/factory artwork is never rendered (unsupported claims
//   in the images). The hero mosaic comes from src/lib/family-images.ts.

type Item = { title: string; description: string };

const num = (i: number) => String(i + 1).padStart(2, "0");

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about.hero" });
  return pageMetadata({
    locale,
    path: "/about",
    title: t("title"),
    description: t("subtitle"),
  });
}

function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("text-xs font-semibold tracking-[0.2em] text-accent uppercase", className)}>{children}</p>
  );
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about" });
  const tp = await getTranslations({ locale, namespace: "products" });
  const tc = await getTranslations({ locale, namespace: "catalog" });

  const bottlenecks = t.raw("bottlenecks.items") as Item[];
  const capabilities = t.raw("role.capabilities") as Item[];
  const steps = t.raw("control.steps") as Item[];
  const roles = t.raw("vision.roles") as Item[];
  const status = t.raw("status.items") as { tag: string; value: string; label: string }[];
  const visualLabels = { editorial: tc("editorialBadge"), studio: tp("studioBadge") };
  const familyName = (slug: string) => {
    const category = PRODUCT_CATEGORIES.find((c) => c.slug === slug)!;
    return tp(`categories.${category.categoryKey}.name`);
  };

  return (
    <>
      {/* 1 · Hero — copy left, 2×2 ingredient mosaic right */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 pt-16 pb-20 sm:px-6 md:pt-24 md:pb-28 lg:grid-cols-12 lg:items-center lg:gap-16 lg:px-8">
          <div className="lg:col-span-7">
            <Eyebrow>{t("hero.eyebrow")}</Eyebrow>
            <h1 className="mt-6 font-serif text-4xl leading-[1.08] font-semibold tracking-tight text-balance text-foreground sm:text-5xl lg:text-[3.5rem]">
              {t("hero.title")}
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground">
              {t("hero.subtitle")}
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/products"
                className={cn(buttonVariants({ size: "lg" }), "h-11 cursor-pointer px-5 text-sm")}
              >
                {t("hero.ctaProducts")}
              </Link>
              <Link
                href="/rfq"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 cursor-pointer px-5 text-sm")}
              >
                {t("hero.ctaRfq")}
              </Link>
            </div>
          </div>
          {/* Five families: two larger tiles over three. One shared caption
              discloses the imagery instead of a badge on every tile. */}
          <figure className="lg:col-span-5">
            <ul aria-label={t("hero.mosaicLabel")} className="grid grid-cols-6 gap-2 sm:gap-3">
              {ABOUT_MOSAIC_FAMILIES.map((family, i) => (
                <li key={family} className={i < 2 ? "col-span-3" : "col-span-2"}>
                  <FamilyVisual
                    family={family}
                    locale={locale}
                    name={familyName(family)}
                    labels={visualLabels}
                    sizes={i < 2 ? "(min-width: 1024px) 14rem, 50vw" : "(min-width: 1024px) 9rem, 33vw"}
                    priority={i < 2}
                    compact
                    showBadge={false}
                    className="rounded-md border border-border"
                  />
                </li>
              ))}
            </ul>
            <figcaption className="mt-4 border-t border-border pt-3 text-xs leading-relaxed text-muted-foreground">
              {t("hero.imageCaption")}
            </figcaption>
          </figure>
        </div>
      </section>

      {/* 2 · Brand thesis */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-32 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12">
          <Eyebrow className="lg:col-span-3 lg:pt-3">{t("thesis.eyebrow")}</Eyebrow>
          <div className="lg:col-span-9">
            <p className="font-serif text-2xl leading-snug text-balance text-foreground md:text-4xl md:leading-[1.25]">
              {t("thesis.body")}
            </p>
            <p className="mt-8 border-t border-border pt-6 font-serif text-xl text-accent italic md:text-2xl">
              {t("thesis.close")}
            </p>
          </div>
        </div>
      </section>

      {/* 3 · Bottlenecks — numbered editorial list, not icon cards */}
      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <Eyebrow>{t("bottlenecks.eyebrow")}</Eyebrow>
              <h2 className="mt-4 font-serif text-3xl leading-tight font-semibold text-balance text-foreground md:text-4xl">
                {t("bottlenecks.title")}
              </h2>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground">{t("bottlenecks.intro")}</p>
            </div>
          </div>
          <ol className="grid gap-x-10 sm:grid-cols-2 lg:col-span-8">
            {bottlenecks.map((item, i) => (
              <li key={item.title} className="border-t border-border py-8">
                <span className="font-serif text-sm text-accent tabular-nums" aria-hidden="true">
                  {num(i)}
                </span>
                <h3 className="mt-3 font-serif text-xl font-semibold text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 4 · Whitehorse role — orchestration layer + four capabilities */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Eyebrow>{t("role.eyebrow")}</Eyebrow>
            <h2 className="mt-4 font-serif text-3xl leading-tight font-semibold text-balance text-foreground md:text-4xl">
              {t("role.title")}
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pt-10">
            <p className="text-base leading-relaxed text-muted-foreground">{t("role.body")}</p>
          </div>
        </div>
        <dl className="mt-16 border-b border-border">
          {capabilities.map((item, i) => (
            <div
              key={item.title}
              className="grid gap-2 border-t border-border py-7 md:grid-cols-12 md:gap-8"
            >
              <dt className="flex items-baseline gap-4 md:col-span-5">
                <span className="font-serif text-sm text-accent tabular-nums" aria-hidden="true">
                  {num(i)}
                </span>
                <span className="font-serif text-xl font-semibold text-foreground md:text-2xl">{item.title}</span>
              </dt>
              <dd className="pl-9 text-sm leading-relaxed text-muted-foreground md:col-span-7 md:pt-1.5 md:pl-0 md:text-base">
                {item.description}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* 5 · QA/QC control point — horizontal flow on desktop, vertical on mobile */}
      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <div className="max-w-3xl">
            <Eyebrow>{t("control.eyebrow")}</Eyebrow>
            <h2 className="mt-4 font-serif text-3xl leading-tight font-semibold text-balance text-foreground md:text-4xl">
              {t("control.title")}
            </h2>
          </div>
          <ol
            aria-label={t("control.flowLabel")}
            className="relative mt-16 space-y-8 border-l border-foreground/20 pl-8 lg:grid lg:grid-cols-6 lg:gap-6 lg:space-y-0 lg:border-t lg:border-l-0 lg:pt-10 lg:pl-0"
          >
            {steps.map((step, i) => (
              <li key={step.title} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute top-1.5 -left-8 size-2 -translate-x-1/2 rounded-full bg-accent lg:-top-10 lg:left-0 lg:-translate-x-0 lg:-translate-y-1/2"
                />
                <span className="font-serif text-sm text-accent tabular-nums" aria-hidden="true">
                  {num(i)}
                </span>
                <h3 className="mt-2 font-serif text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </li>
            ))}
          </ol>
          <div className="mt-16 grid gap-8 border-t border-border pt-10 lg:grid-cols-12">
            <p className="text-lg leading-relaxed text-foreground lg:col-span-7">{t("control.body")}</p>
            <p className="text-sm leading-relaxed text-muted-foreground lg:col-span-4 lg:col-start-9">
              {t("control.note")}
            </p>
          </div>
        </div>
      </section>

      {/* 6 · Mission */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-12 lg:px-8">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-accent uppercase lg:col-span-3 lg:pt-3">
            {t("mission.label")}
          </h2>
          <p className="font-serif text-2xl leading-snug text-balance md:text-[2rem] md:leading-[1.3] lg:col-span-9">
            {t("mission.body")}
          </p>
        </div>
      </section>

      {/* 7 · Vision + four long-term roles (labelled: not current services) */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-accent uppercase lg:col-span-3 lg:pt-3">
            {t("vision.label")}
          </h2>
          <p className="font-serif text-2xl leading-snug text-balance text-foreground md:text-[2rem] md:leading-[1.3] lg:col-span-9">
            {t("vision.body")}
          </p>
        </div>
        <div className="mt-20 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <h3 className="font-serif text-xl font-semibold text-foreground">{t("vision.rolesTitle")}</h3>
            <p className="mt-3 inline-block border border-dashed border-foreground/30 px-2.5 py-1 text-xs text-muted-foreground">
              {t("vision.rolesNote")}
            </p>
          </div>
          <ol className="grid gap-x-10 sm:grid-cols-2 lg:col-span-9">
            {roles.map((role, i) => (
              <li key={role.title} className="border-t border-border py-7">
                <span className="font-serif text-sm text-accent tabular-nums" aria-hidden="true">
                  {num(i)}
                </span>
                <h4 className="mt-2 font-serif text-lg font-semibold text-foreground">{role.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{role.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Where Whitehorse stands (current) and where it is heading (vision),
          each figure with its visible tag. */}
      <section aria-labelledby="status-title" className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-24 lg:px-8">
          <h2 id="status-title" className="font-serif text-2xl font-semibold text-balance text-foreground md:text-3xl">
            {t("status.title")}
          </h2>
          <ul className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {status.map((item) => (
              <li key={item.value} className="border-t border-border pt-5">
                <span className="inline-block rounded-full border border-border px-2 py-0.5 text-[0.65rem] font-semibold tracking-[0.15em] text-muted-foreground uppercase">
                  {item.tag}
                </span>
                <p className="mt-3 font-serif text-3xl font-semibold text-accent md:text-4xl">{item.value}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.label}</p>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-xs text-muted-foreground">{t("status.note")}</p>
        </div>
      </section>

      {/* 8 · Long-term platform direction (vision) + 9 · ecosystem (program
          signal). Text-only: no partner logos, no network figures. */}
      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto grid max-w-7xl gap-16 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-7">
            <Eyebrow>{t("direction.label")}</Eyebrow>
            <p className="mt-2 text-xs text-muted-foreground">{t("direction.note")}</p>
            <h2 className="mt-6 font-serif text-3xl leading-tight font-semibold text-balance text-foreground md:text-4xl">
              {t("direction.title")}
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">{t("direction.body")}</p>
          </div>
          <div className="border-t border-border pt-8 lg:col-span-4 lg:col-start-9 lg:border-t-0 lg:border-l lg:pt-2 lg:pl-10">
            <Eyebrow>{t("ecosystem.eyebrow")}</Eyebrow>
            <h2 className="mt-4 font-serif text-xl font-semibold text-foreground">{t("ecosystem.title")}</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{t("ecosystem.body")}</p>
          </div>
        </div>
      </section>

      {/* Closing CTA — buyers to RFQ, suppliers to Contact */}
      <SplitCta
        title={t("cta.title")}
        subtitle={t("cta.subtitle")}
        buyer={{ label: t("cta.buyerLabel"), body: t("cta.buyerBody"), cta: t("cta.buyerCta"), href: "/rfq" }}
        supplier={{ label: t("cta.supplierLabel"), body: t("cta.supplierBody"), cta: t("cta.supplierCta"), href: "/suppliers/apply" }}
      />
    </>
  );
}
