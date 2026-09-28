import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/sections/page-hero";
import { SupplierForm } from "@/components/forms/supplier-form";
import { pageMetadata } from "@/lib/seo";
import { publicSupplierTemplateUrl } from "@/lib/supplier-intake";

const COPY = {
  en: {
    eyebrow: "Supplier network",
    title: "Register your supply capability",
    subtitle:
      "Share the essentials about your origin, products and processing capability. Whitehorse reviews each registration against product, facility and market requirements.",
    formTitle: "Supplier registration",
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
