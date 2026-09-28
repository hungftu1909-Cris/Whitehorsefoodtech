import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import Image from "next/image";
import { ClipboardList, UserCheck, FlaskConical, ShieldCheck, FileText, Ship } from "lucide-react";
import { PlatformPageHero } from "@/components/sections/platform-page-hero";
import { CtaSection } from "@/components/sections/cta-section";
import { pageMetadata } from "@/lib/seo";

// Matches the order of process.steps: Requirement & specification,
// Supplier matching & qualification, Sampling & approval, Quality control,
// Packing & documentation, Shipping & delivery.
const STEP_ICONS = [ClipboardList, UserCheck, FlaskConical, ShieldCheck, FileText, Ship];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "process.hero" });
  return pageMetadata({
    locale,
    path: "/process",
    title: t("title"),
    description: t("subtitle"),
  });
}

export default async function ProcessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "process" });
  const steps = t.raw("steps") as { title: string; description: string }[];
  const isVi = locale === "vi";

  return (
    <>
      <PlatformPageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        images={[{
          src: "/images/platform/process-container-loading.webp",
          alt: isVi ? "Đóng hàng xuất khẩu tại một công đoạn logistics trong mạng lưới" : "Export loading at a logistics stage in the network",
        }]}
        imageNote={t("hero.imageNote")}
        facts={[
          { value: "01–06", label: isVi ? "Một luồng công việc" : "One workflow" },
          { value: isVi ? "Bằng văn bản" : "Written", label: isVi ? "Thông số làm chuẩn" : "Specification first" },
          { value: isVi ? "Theo đơn" : "Per order", label: isVi ? "Hồ sơ được xác nhận" : "Evidence confirmed" },
        ]}
        action={{ label: t("hero.action"), href: "/rfq" }}
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <ol className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, i) => {
            const Icon = STEP_ICONS[i % STEP_ICONS.length];
            return (
              <li key={step.title} className="bg-background p-6 md:min-h-56">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-xs tracking-[0.18em] text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <Icon className="size-5 shrink-0 text-accent" aria-hidden="true" />
                </div>
                <div className="mt-8">
                  <h2 className="font-serif text-xl font-semibold text-foreground">
                    {step.title}
                  </h2>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-16 sm:px-6 md:py-20 lg:grid-cols-2 lg:items-center lg:px-8">
          <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-border bg-muted">
            <Image
              src="/images/platform/process-partner-facility.webp"
              alt={isVi ? "Dây chuyền chế biến tại một cơ sở đối tác đại diện" : "Processing line at a representative partner facility"}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="max-w-xl">
            <h2 className="font-serif text-2xl font-semibold text-foreground">
              {t("factory.title")}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {t("factory.subtitle")}
            </p>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground italic">{t("hero.imageNote")}</p>
          </div>
        </div>
      </section>

      <CtaSection title={t("cta.title")} cta={t("cta.cta")} href="/contact" />
    </>
  );
}
