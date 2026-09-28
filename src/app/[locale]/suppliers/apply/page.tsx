import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { MessageCircle } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { SupplierForm } from "@/components/forms/supplier-form";
import { pageMetadata } from "@/lib/seo";
import { publicSupplierTemplateUrl } from "@/lib/supplier-intake";
import { siteConfig } from "@/lib/site";

const COPY = {
  en: {
    eyebrow: "Supplier network",
    title: "Register your supply capability",
    subtitle:
      "Share the essentials about your origin, products and processing capability. Whitehorse reviews each registration against product, facility and market requirements.",
    formTitle: "Supplier registration",
    quickTitle: "Prefer a quick first conversation?",
    quickText: "Vietnamese suppliers can introduce their capability on Zalo first, then complete the structured form when ready.",
    quickCta: "Open Zalo",
    metaTitle: "Supplier Registration",
    metaDescription:
      "Register as a potential Whitehorse Foodtech supplier, cooperative, grower or processing partner.",
  },
  vi: {
    eyebrow: "Mạng lưới nhà cung cấp",
    title: "Đăng ký năng lực cung ứng",
    subtitle:
      "Chia sẻ thông tin cốt lõi về vùng nguyên liệu, sản phẩm và năng lực chế biến. Whitehorse xem xét từng hồ sơ theo yêu cầu sản phẩm, cơ sở và thị trường.",
    formTitle: "Đăng ký nhà cung cấp",
    quickTitle: "Muốn trao đổi nhanh trước?",
    quickText: "Nhà cung cấp Việt Nam có thể giới thiệu sơ bộ năng lực qua Zalo, sau đó hoàn thiện biểu mẫu có cấu trúc khi thuận tiện.",
    quickCta: "Mở Zalo",
    metaTitle: "Đăng ký nhà cung cấp",
    metaDescription:
      "Đăng ký trở thành nhà cung cấp, hợp tác xã, vùng trồng hoặc đối tác chế biến tiềm năng của Whitehorse Foodtech.",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const c = locale === "vi" ? COPY.vi : COPY.en;
  return pageMetadata({
    locale,
    path: "/suppliers/apply",
    title: c.metaTitle,
    description: c.metaDescription,
  });
}

export default async function SupplierApplyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = locale === "vi" ? COPY.vi : COPY.en;
  const templateUrl = publicSupplierTemplateUrl(process.env.NEXT_PUBLIC_SUPPLIER_TEMPLATE_URL);

  return (
    <>
      <PageHero eyebrow={c.eyebrow} title={c.title} subtitle={c.subtitle} />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 rounded-lg border border-accent/35 bg-accent/8 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-serif text-lg font-semibold text-foreground">{c.quickTitle}</h2>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">{c.quickText}</p>
          </div>
          <a
            href={siteConfig.zalo}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            {c.quickCta}
          </a>
        </div>
        <div className="rounded-lg border border-border bg-card p-6 md:p-8">
          <h2 className="font-serif text-xl font-semibold text-foreground">{c.formTitle}</h2>
          <div className="mt-6">
            <SupplierForm templateUrl={templateUrl} />
          </div>
        </div>
      </section>
    </>
  );
}
