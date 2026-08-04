"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { contactSchema, type ContactInput } from "@/lib/validations";
import { Field } from "./field";
import { Honeypot } from "./honeypot";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const t = useTranslations("contact.form");
  const tc = useTranslations("common");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  async function onSubmit(data: ContactInput) {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      toast.success(t("success"));
      reset();
    } catch {
      toast.error(t("error"));
    }
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

      <Button type="submit" size="lg" disabled={isSubmitting} className="cursor-pointer">
        {isSubmitting ? tc("sending") : t("submit")}
      </Button>
    </form>
  );
}
