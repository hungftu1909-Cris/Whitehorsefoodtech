"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale } from "next-intl";
import {
  SUPPLIER_CAPABILITIES,
  SUPPLIER_PRODUCT_FAMILIES,
  SUPPLIER_QA_STATES,
  SUPPLIER_TYPES,
  supplierSchema,
  type SupplierInput,
} from "@/lib/validations";
import { Field } from "./field";
import { Honeypot } from "./honeypot";
import { collectLeadContext, submitLead, SubmitStatus, type SubmitState } from "./submit-lead";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const COPY = {
  en: {
    sections: ["1. Profile & contact", "2. Products & capability", "3. Assurance & submit"],
    type: "Supplier type", company: "Legal or trading name", country: "Country",
    region: "Province / origin region", contact: "Contact name", email: "Work email",
    phone: "Phone / Zalo", channel: "Provide a work email or phone / Zalo.",
    families: "Product families", capabilities: "Your capabilities", qa: "QA / certificate status",
    optional: "Add production and commercial details (optional)",
    products: "Products and formats", site: "Production site", processing: "Processing capability",
    moq: "MOQ", capacity: "Capacity", leadTime: "Lead time", certificates: "Certification names",
    website: "Website", evidence: "Photo, video or evidence links", notes: "Notes",
    evidenceNote: "Do not upload documents here. Supporting files can be provided through a secure channel after initial review.",
    consent: "I agree that Whitehorse may contact me about this registration.",
    submit: "Submit supplier registration", submitting: "Submitting…", required: "Required",
    intro: "A concise registration for farmers, cooperatives, factories and companies. Completing it does not mean approval or qualification.",
    successTitle: "Registration received", successText: "Whitehorse will review the information and contact you if further details are needed.",
    reference: "Supplier reference", error: "The registration could not be submitted. Please check the fields and try again.",
    undelivered: "The registration was not delivered. Please email",
    detailed: "Detailed profile for cooperatives and factories", download: "Download detailed profile template",
    types: ["Farmer / grower", "Cooperative", "Processing factory", "Company"],
    familyLabels: ["Coffee", "Coconut", "Bird's Nest", "Fruit", "Nuts, Spices & Botanicals"],
    capabilityLabels: ["Growing", "Processing", "Manufacturing", "Trading / export"],
    qaLabels: ["Documents available", "Available but not uploaded", "None", "Unknown"],
  },
  vi: {
    sections: ["1. Hồ sơ & liên hệ", "2. Sản phẩm & năng lực", "3. Đảm bảo & gửi đăng ký"],
    type: "Loại nhà cung cấp", company: "Tên pháp lý hoặc tên giao dịch", country: "Quốc gia",
    region: "Tỉnh / vùng nguyên liệu", contact: "Người liên hệ", email: "Email công việc",
    phone: "Điện thoại / Zalo", channel: "Cung cấp email công việc hoặc điện thoại / Zalo.",
    families: "Nhóm sản phẩm", capabilities: "Năng lực cung cấp", qa: "Tình trạng hồ sơ QA / chứng nhận",
    optional: "Bổ sung thông tin sản xuất và thương mại (không bắt buộc)",
    products: "Sản phẩm và định dạng", site: "Cơ sở sản xuất", processing: "Năng lực chế biến",
    moq: "MOQ", capacity: "Công suất", leadTime: "Thời gian chuẩn bị", certificates: "Tên chứng nhận",
    website: "Website", evidence: "Liên kết hình ảnh, video hoặc bằng chứng", notes: "Ghi chú",
    evidenceNote: "Không tải tài liệu lên biểu mẫu công khai. Hồ sơ hỗ trợ sẽ được tiếp nhận qua kênh bảo mật sau bước xem xét ban đầu.",
    consent: "Tôi đồng ý để Whitehorse liên hệ về đăng ký này.",
    submit: "Gửi đăng ký nhà cung cấp", submitting: "Đang gửi…", required: "Thông tin bắt buộc",
    intro: "Đăng ký ngắn gọn dành cho nông hộ, hợp tác xã, nhà máy và doanh nghiệp. Việc gửi thông tin không đồng nghĩa đã được phê duyệt hoặc đạt chuẩn.",
    successTitle: "Đã tiếp nhận đăng ký", successText: "Whitehorse sẽ xem xét thông tin và liên hệ khi cần bổ sung hồ sơ.",
    reference: "Mã đăng ký nhà cung cấp", error: "Chưa thể gửi đăng ký. Vui lòng kiểm tra thông tin và thử lại.",
    undelivered: "Đăng ký chưa được chuyển đi. Vui lòng gửi email tới",
    detailed: "Hồ sơ chi tiết cho hợp tác xã và nhà máy", download: "Tải mẫu hồ sơ chi tiết",
    types: ["Nông hộ / vùng trồng", "Hợp tác xã", "Nhà máy chế biến", "Doanh nghiệp"],
    familyLabels: ["Cà phê", "Dừa", "Yến sào", "Trái cây", "Hạt, gia vị & thảo mộc"],
    capabilityLabels: ["Vùng trồng", "Chế biến", "Sản xuất", "Thương mại / xuất khẩu"],
    qaLabels: ["Có sẵn hồ sơ", "Có nhưng chưa tải lên", "Chưa có", "Chưa xác định"],
  },
} as const;

function freshMeta() {
  return {
    idempotencyKey: globalThis.crypto?.randomUUID?.() ?? "00000000-0000-4000-8000-000000000000",
    submittedAt: new Date().toISOString(),
  };
}

const controlClass =
  "h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function SupplierForm({ templateUrl }: { templateUrl?: string }) {
  const locale = useLocale();
  const c = locale === "vi" ? COPY.vi : COPY.en;
  const [state, setState] = useState<SubmitState>({ kind: "idle" });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SupplierInput>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      contract: "supplier_public_intake@1",
      ...freshMeta(),
      email: "",
      phoneZalo: "",
      productFamilies: [],
      capabilities: [],
      consent: false,
    },
  });

  async function onSubmit(data: SupplierInput) {
    setState({ kind: "idle" });
    const payload = { ...data, submittedAt: new Date().toISOString(), ...collectLeadContext(locale) };
    const result = await submitLead("/api/suppliers/apply", payload);
    setState(result);
    if (result.kind === "success") {
      reset({
        contract: "supplier_public_intake@1",
        ...freshMeta(),
        email: "",
        phoneZalo: "",
        productFamilies: [],
        capabilities: [],
        consent: false,
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-10">
      <Honeypot register={register} />
      <input type="hidden" {...register("contract")} />
      <input type="hidden" {...register("idempotencyKey")} />
      <input type="hidden" {...register("submittedAt")} />
      <p className="text-sm leading-relaxed text-muted-foreground">{c.intro}</p>

      <fieldset className="space-y-5">
        <legend className="font-serif text-lg font-semibold text-foreground">{c.sections[0]}</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={c.type} htmlFor="supplierType" error={errors.supplierType && c.required}>
            <select id="supplierType" className={controlClass} defaultValue="" {...register("supplierType")}>
              <option value="" disabled>{c.required}</option>
              {SUPPLIER_TYPES.map((value, i) => <option key={value} value={value}>{c.types[i]}</option>)}
            </select>
          </Field>
          <Field label={c.company} htmlFor="companyName" error={errors.companyName && c.required}>
            <Input id="companyName" autoComplete="organization" {...register("companyName")} />
          </Field>
          <Field label={c.country} htmlFor="country" error={errors.country && c.required}>
            <Input id="country" autoComplete="country-name" {...register("country")} />
          </Field>
          <Field label={c.region} htmlFor="originRegion" error={errors.originRegion && c.required}>
            <Input id="originRegion" {...register("originRegion")} />
          </Field>
          <Field label={c.contact} htmlFor="contactName" error={errors.contactName && c.required}>
            <Input id="contactName" autoComplete="name" {...register("contactName")} />
          </Field>
          <Field label={c.email} htmlFor="email" error={errors.email && c.channel}>
            <Input id="email" type="email" autoComplete="email" {...register("email")} />
          </Field>
          <Field label={c.phone} htmlFor="phoneZalo" error={errors.phoneZalo && c.channel} className="sm:col-span-2">
            <Input id="phoneZalo" type="tel" autoComplete="tel" {...register("phoneZalo")} />
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="font-serif text-lg font-semibold text-foreground">{c.sections[1]}</legend>
        <div>
          <p className="mb-2 text-sm font-medium text-foreground">{c.families}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {SUPPLIER_PRODUCT_FAMILIES.map((value, i) => (
              <label key={value} className="flex cursor-pointer gap-2 rounded-md border border-border p-3 text-sm">
                <input type="checkbox" value={value} className="mt-0.5 size-4" {...register("productFamilies")} />
                {c.familyLabels[i]}
              </label>
            ))}
          </div>
          {errors.productFamilies && <p className="mt-2 text-xs text-destructive">{c.required}</p>}
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-foreground">{c.capabilities}</p>
          <div className="grid grid-cols-2 gap-2">
            {SUPPLIER_CAPABILITIES.map((value, i) => (
              <label key={value} className="flex cursor-pointer gap-2 rounded-md border border-border p-3 text-sm">
                <input type="checkbox" value={value} className="mt-0.5 size-4" {...register("capabilities")} />
                {c.capabilityLabels[i]}
              </label>
            ))}
          </div>
          {errors.capabilities && <p className="mt-2 text-xs text-destructive">{c.required}</p>}
        </div>
        <details className="rounded-lg border border-border p-4">
          <summary className="cursor-pointer font-medium text-foreground">{c.optional}</summary>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field label={c.products} htmlFor="productsFormats" className="sm:col-span-2">
              <Textarea id="productsFormats" rows={3} {...register("productsFormats")} />
            </Field>
            <Field label={c.site} htmlFor="productionSite"><Input id="productionSite" {...register("productionSite")} /></Field>
            <Field label={c.processing} htmlFor="processingCapability"><Input id="processingCapability" {...register("processingCapability")} /></Field>
            <Field label={c.moq} htmlFor="moq"><Input id="moq" {...register("moq")} /></Field>
            <Field label={c.capacity} htmlFor="capacity"><Input id="capacity" {...register("capacity")} /></Field>
            <Field label={c.leadTime} htmlFor="leadTime"><Input id="leadTime" {...register("leadTime")} /></Field>
            <Field label={c.certificates} htmlFor="certificationNames"><Input id="certificationNames" {...register("certificationNames")} /></Field>
            <Field label={c.website} htmlFor="website"><Input id="website" type="url" {...register("website")} /></Field>
            <Field label={c.evidence} htmlFor="evidenceLinks" className="sm:col-span-2">
              <Textarea id="evidenceLinks" rows={3} {...register("evidenceLinks")} />
            </Field>
            <Field label={c.notes} htmlFor="notes" className="sm:col-span-2">
              <Textarea id="notes" rows={3} {...register("notes")} />
            </Field>
          </div>
        </details>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="font-serif text-lg font-semibold text-foreground">{c.sections[2]}</legend>
        <Field label={c.qa} htmlFor="qaState" error={errors.qaState && c.required}>
          <select id="qaState" className={controlClass} defaultValue="" {...register("qaState")}>
            <option value="" disabled>{c.required}</option>
            {SUPPLIER_QA_STATES.map((value, i) => <option key={value} value={value}>{c.qaLabels[i]}</option>)}
          </select>
        </Field>
        <p className="rounded-md bg-muted/50 p-3 text-xs leading-relaxed text-muted-foreground">{c.evidenceNote}</p>
        <label className="flex cursor-pointer gap-3 text-sm leading-relaxed text-foreground">
          <input type="checkbox" className="mt-1 size-4 shrink-0" {...register("consent")} />
          {c.consent}
        </label>
        {errors.consent && <p className="text-xs text-destructive">{c.required}</p>}

        {templateUrl && (
          <div className="rounded-md border border-border p-4">
            <p className="text-sm font-medium text-foreground">{c.detailed}</p>
            <a className="mt-2 inline-block text-sm font-semibold text-accent underline-offset-4 hover:underline" href={templateUrl} rel="noopener noreferrer">
              {c.download}
            </a>
          </div>
        )}

        <SubmitStatus
          state={state}
          successTitle={c.successTitle}
          successText={c.successText}
          referenceText={(id) => `${c.reference}: ${id}`}
          errorText={c.error}
          undeliveredText={(email) => `${c.undelivered} ${email}.`}
        />
        <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? c.submitting : c.submit}
        </Button>
      </fieldset>
    </form>
  );
}
