import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import {
  Award,
  BadgeCheck,
  BrainCircuit,
  CircleDashed,
  ClipboardCheck,
  FileText,
  Leaf,
  Network,
  RadioTower,
  Route,
  ShieldCheck,
  Truck,
  Users,
  Warehouse,
  Workflow,
} from "lucide-react";
import { PlatformPageHero } from "@/components/sections/platform-page-hero";
import { SectionHeading } from "@/components/sections/section-heading";
import { CtaSection } from "@/components/sections/cta-section";
import { pageMetadata } from "@/lib/seo";

// Matches the order of certifications.items: ISO 22000 / FSSC 22000, HACCP,
// Organic, FDA. These are schemes checked during supplier assessment, per
// product/site/market — not certificates Whitehorse claims to hold.
const CERT_ICONS = [Award, ClipboardCheck, Leaf, ShieldCheck];
// Matches certifications.sustainability.pillars: traceability per order,
// supplier relationships, environmental responsibility, quality vs. spec.
const PILLAR_ICONS = [Route, Users, Leaf, BadgeCheck];
const TECHNOLOGY_ICONS = [RadioTower, ShieldCheck, Warehouse, Workflow, Truck, Network];
type TechnologyStatus = "current" | "building" | "roadmap";
type TechnologyLayer = {
  number: string;
  title: string;
  description: string;
  status: TechnologyStatus;
};
const TECHNOLOGY_STATUS_CLASSES: Record<TechnologyStatus, string> = {
  current: "border-success/50 bg-success/20 text-primary-foreground",
  building: "border-accent/50 bg-accent/15 text-primary-foreground",
  roadmap: "border-primary-foreground/25 bg-primary-foreground/5 text-primary-foreground/65",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "certifications.hero" });
  return pageMetadata({ locale, path: "/certifications", title: t("title"), description: t("subtitle") });
}

export default async function CertificationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "certifications" });
  const items = t.raw("items") as { name: string; description: string }[];
  const technologyLayers = t.raw("technology.layers") as TechnologyLayer[];
  const technologyBackbone = t.raw("technology.backboneNodes") as string[];
  const documents = t.raw("documents") as string[];
  const pillars = t.raw("sustainability.pillars") as { title: string; description: string }[];
  const isVi = locale === "vi";

  return (
    <>
      <PlatformPageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        images={[{
          src: "/images/platform/quality-processing.webp",
          alt: isVi ? "Công đoạn chế biến tại một cơ sở trong mạng lưới cung ứng" : "Processing stage at a facility in the supply network",
        }]}
        imageNote={t("hero.imageNote")}
        facts={[
          { value: isVi ? "Sản phẩm" : "Product", label: isVi ? "Đúng phạm vi" : "Scope matched" },
          { value: isVi ? "Cơ sở" : "Site", label: isVi ? "Đúng địa điểm" : "Facility checked" },
          { value: isVi ? "Thị trường" : "Market", label: isVi ? "Đúng yêu cầu" : "Requirement fit" },
        ]}
        action={{ label: t("hero.action"), href: "/contact" }}
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <SectionHeading
          eyebrow={t("standards.eyebrow")}
          title={t("standards.title")}
          subtitle={t("standards.subtitle")}
        />
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => {
            const Icon = CERT_ICONS[i % CERT_ICONS.length];
            return (
              <div key={item.name} className="rounded-lg border border-border bg-card p-6">
                <div className="flex size-10 items-center justify-center rounded-md bg-accent/15 text-accent">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-serif text-lg font-semibold text-foreground">
                  {item.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-primary-foreground/10 bg-primary text-primary-foreground">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:48px_48px]"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.65fr] lg:items-end">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
                {t("technology.eyebrow")}
              </p>
              <h2 className="mt-4 max-w-3xl font-serif text-3xl leading-tight font-semibold tracking-tight text-balance md:text-5xl">
                {t("technology.title")}
              </h2>
            </div>
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/45 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-primary-foreground">
                <CircleDashed className="size-3.5 text-accent" aria-hidden="true" />
                {t("technology.status")}
              </span>
              <p className="mt-4 text-sm leading-relaxed text-primary-foreground/75 sm:text-base">
                {t("technology.subtitle")}
              </p>
            </div>
          </div>

          <div className="mt-10 rounded-xl border border-primary-foreground/15 bg-primary-foreground/[0.04] p-5 sm:p-6 md:p-8">
            <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">
              {t("technology.backboneEyebrow")}
            </p>
            <div className="mt-3 grid gap-4 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
              <h3 className="font-serif text-2xl leading-tight font-semibold md:text-3xl">
                {t("technology.backboneTitle")}
              </h3>
              <p className="text-sm leading-relaxed text-primary-foreground/70">
                {t("technology.backboneBody")}
              </p>
            </div>
            <ol
              aria-label={t("technology.backboneTitle")}
              className="-mx-5 mt-7 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 sm:-mx-6 sm:px-6 md:mx-0 md:grid md:grid-cols-4 md:gap-2 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-8"
            >
              {technologyBackbone.map((node, i) => (
                <li
                  key={node}
                  className="flex min-h-28 w-[68vw] shrink-0 snap-start flex-col justify-between rounded-md border border-primary-foreground/15 bg-primary/70 p-4 md:w-auto"
                >
                  <span className="font-mono text-xs tracking-[0.16em] text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-6 text-sm leading-snug text-primary-foreground/85">{node}</span>
                </li>
              ))}
            </ol>
          </div>

          <ol className="-mx-4 mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-px sm:overflow-hidden sm:rounded-xl sm:border sm:border-primary-foreground/15 sm:bg-primary-foreground/15 sm:px-0 sm:pb-0 lg:grid-cols-3">
            {technologyLayers.map((layer, i) => {
              const Icon = TECHNOLOGY_ICONS[i % TECHNOLOGY_ICONS.length];
              return (
                <li key={layer.number} className="flex min-h-56 w-[82vw] shrink-0 snap-start flex-col rounded-xl border border-primary-foreground/15 bg-primary/95 p-6 sm:w-auto sm:rounded-none sm:border-0 md:p-7">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-mono text-xs tracking-[0.18em] text-accent">{layer.number}</span>
                    <span className="flex size-10 items-center justify-center rounded-md border border-primary-foreground/15 bg-primary-foreground/5 text-accent">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                  </div>
                  <h3 className="mt-auto pt-10 font-serif text-xl font-semibold">{layer.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-primary-foreground/70">{layer.description}</p>
                  <span className={`mt-5 inline-flex w-fit rounded-full border px-2.5 py-1 text-xs font-semibold tracking-[0.1em] uppercase ${TECHNOLOGY_STATUS_CLASSES[layer.status]}`}>
                    {t(`technology.statusLabels.${layer.status}`)}
                  </span>
                </li>
              );
            })}
          </ol>

          <div className="mt-5 grid gap-5 rounded-xl border border-accent/35 bg-accent/[0.08] p-6 md:grid-cols-[auto_1fr] md:items-start md:p-8">
            <div className="flex size-12 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <BrainCircuit className="size-6" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-semibold md:text-2xl">{t("technology.aiTitle")}</h3>
              <p className="mt-2 max-w-4xl text-sm leading-relaxed text-primary-foreground/75 sm:text-base">
                {t("technology.aiBody")}
              </p>
            </div>
          </div>
          <p className="mt-5 max-w-4xl text-xs leading-relaxed text-primary-foreground/55">
            {t("technology.note")}
          </p>
        </div>
      </section>

      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
          <SectionHeading
            eyebrow={t("sustainability.eyebrow")}
            title={t("sustainability.title")}
            subtitle={t("sustainability.subtitle")}
          />
          <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((pillar, i) => {
              const Icon = PILLAR_ICONS[i % PILLAR_ICONS.length];
              return (
                <div key={pillar.title}>
                  <div className="flex size-10 items-center justify-center rounded-md bg-accent/15 text-accent">
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 font-serif text-lg font-semibold text-foreground">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-background">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl font-semibold text-foreground">
            {t("documentsTitle")}
          </h2>
          <ul className="mt-6 space-y-3">
            {documents.map((doc) => (
              <li key={doc} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <FileText className="size-4 shrink-0 text-accent" aria-hidden="true" />
                <span>{doc}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaSection title={t("cta.title")} cta={t("cta.cta")} href="/contact" />
    </>
  );
}
