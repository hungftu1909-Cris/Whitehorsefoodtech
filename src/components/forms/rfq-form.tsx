"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { rfqSchema, type RfqInput } from "@/lib/validations";
import { Field } from "./field";
import { Honeypot } from "./honeypot";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function RfqForm() {
  const t = useTranslations("rfq.form");
  const tc = useTranslations("common");

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RfqInput>({ resolver: zodResolver(rfqSchema) });

  async function onSubmit(data: RfqInput) {
    try {
      const res = await fetch("/api/rfq", {
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
          error={
            errors.email &&
            (errors.email.type === "invalid_string" || errors.email.type === "invalid_format"
              ? tc("invalidEmail")
              : tc("required"))
          }
        >
          <Input id="email" type="email" autoComplete="email" {...register("email")} />
        </Field>
        <Field label={t("phone")} htmlFor="phone">
          <Input id="phone" type="tel" {...register("phone")} />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label={t("country")} htmlFor="country" error={errors.country && tc("required")}>
          <Input id="country" autoComplete="country-name" {...register("country")} />
        </Field>

        <Field label={t("product")} htmlFor="product" error={errors.product && tc("required")}>
          <Controller
            control={control}
            name="product"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="product" className="w-full">
                  <SelectValue placeholder={t("productPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="coffee">{t("productCoffee")}</SelectItem>
                  <SelectItem value="coconut">{t("productCoconut")}</SelectItem>
                  <SelectItem value="birdsNest">{t("productBirdsNest")}</SelectItem>
                  <SelectItem value="fruit">{t("productFruit")}</SelectItem>
                  <SelectItem value="nutsSpicesBotanicals">
                    {t("productNutsSpicesBotanicals")}
                  </SelectItem>
                  <SelectItem value="other">{t("productOther")}</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label={t("volume")} htmlFor="volume" error={errors.volume && tc("required")}>
          <Input id="volume" placeholder={t("volumePlaceholder")} {...register("volume")} />
        </Field>
        <Field label={t("incoterm")} htmlFor="incoterm">
          <Input id="incoterm" placeholder={t("incotermPlaceholder")} {...register("incoterm")} />
        </Field>
      </div>

      <Field label={t("message")} htmlFor="message">
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
