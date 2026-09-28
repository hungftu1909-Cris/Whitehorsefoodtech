"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { contactSchema, type ContactInput } from "@/lib/validations";
import { siteConfig } from "@/lib/site";
import { Field } from "./field";
import { Honeypot } from "./honeypot";
import { collectLeadContext, submitLead, SubmitStatus, type SubmitState } from "./submit-lead";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function ContactForm({ defaultMessage = "" }: { defaultMessage?: string }) {
  const t = useTranslations("contact.form");
  const tc = useTranslations("common");
  const locale = useLocale();
  const [state, setState] = useState<SubmitState>({ kind: "idle" });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { message: defaultMessage },
  });

  async function onSubmit(data: ContactInput) {
    setState({ kind: "idle" });
    const result = await submitLead("/api/contact", { ...data, ...collectLeadContext(locale) });
    setState(result);
    if (result.kind === "success") reset({ message: defaultMessage });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <Honeypot register={register} />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label={t("name")} htmlFor="name" error={errors.name && tc("required")}>
          <Input id="name" autoComplete="name" {...register("name")} />
        </Field>
        <Field label={t("company")} htmlFor="company" error={errors.company && tc("required")}>
          <Input id="company" autoComplete="organization" {...register("company")} />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field
          label={t("email")}
          htmlFor="email"
          error={errors.email && (errors.email.type === "invalid_string" || errors.email.type === "invalid_format" ? tc("invalidEmail") : tc("required"))}
        >
          <Input id="email" type="email" autoComplete="email" {...register("email")} />
        </Field>
        <Field label={t("phone")} htmlFor="phone">
          <Input id="phone" type="tel" autoComplete="tel" {...register("phone")} />
        </Field>
      </div>

      <Field label={t("message")} htmlFor="message" error={errors.message && tc("required")}>
        <Textarea
          id="message"
          rows={5}
          placeholder={t("messagePlaceholder")}
          {...register("message")}
        />
      </Field>

      <p className="text-xs text-muted-foreground">
        {t.rich("privacyNote", {
          privacy: (chunks) => (
            <Link href="/privacy" target="_blank" rel="noopener" className="text-accent underline-offset-2 hover:underline">
              {chunks}
            </Link>
          ),
        })}
      </p>

      <SubmitStatus
        state={state}
        successTitle={t("successTitle")}
        successText={t("success")}
        referenceText={(leadId) => t("reference", { leadId })}
        errorText={t("error")}
        undeliveredText={(email) => t("errorDelivery", { email })}
        fallbackEmail={siteConfig.email}
      />

      <Button type="submit" size="lg" disabled={isSubmitting} className="cursor-pointer">
        {isSubmitting ? tc("sending") : t("submit")}
      </Button>
    </form>
  );
}
