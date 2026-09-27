"use client";

import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CATALOG_SKUS, pick } from "@/lib/catalog";
import {
  COFFEE_FORMAT_CODES,
  INCOTERMS,
  ORDER_FREQUENCIES,
  ORDER_TIMINGS,
  PACKAGING_TIERS,
  PRIVATE_LABEL_OPTIONS,
  RFQ_INTENTS,
  rangesForProduct,
  rfqSchema,
  type RfqInput,
  type RfqPrefill,
} from "@/lib/validations";
import { Field } from "./field";
import { Honeypot } from "./honeypot";
import { collectLeadContext, submitLead, SubmitStatus, type SubmitState } from "./submit-lead";
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

type Option = { value: string; label: string };

// Sentinel for "no format" — Base UI items need a non-empty value.
const NO_FORMAT = "none";

/**
 * Select bound to a string form field ("" = nothing chosen). Passing
 * `items` lets <SelectValue> show the label rather than the raw value.
 */
function ChoiceSelect({
  id,
  value,
  onChange,
  placeholder,
  options,
  invalid,
}: {
  id: string;
  value: string | undefined;
  onChange: (value: string) => void;
  placeholder: string;
  options: Option[];
  invalid?: boolean;
}) {
  const items = Object.fromEntries(options.map((o) => [o.value, o.label]));
  return (
    <Select
      items={items}
      value={value || null}
      onValueChange={(v) => onChange((v as string | null) ?? "")}
    >
      <SelectTrigger id={id} className="w-full" aria-invalid={invalid || undefined}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function FieldGroup({ legend, children }: { legend: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-5">
      <legend className="mb-4 font-serif text-base font-semibold text-foreground">{legend}</legend>
      {children}
    </fieldset>
  );
}

export function RfqForm({ defaults = {} }: { defaults?: RfqPrefill }) {
  const t = useTranslations("rfq.form");
  const tc = useTranslations("common");
  const locale = useLocale();
  const [state, setState] = useState<SubmitState>({ kind: "idle" });

  // Prefill from ?product=&range=&sku=&intent= (parsed and whitelisted on
  // the server by parseRfqPrefill) — kept as the reset target after submit.
  const defaultValues: Partial<RfqInput> = {
    intent: defaults.intent ?? "quote",
    product: defaults.product,
    range: defaults.range ?? "",
    sku: defaults.sku ?? "",
    consent: false,
  };

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    getValues,
    formState: { errors, isSubmitting, submitCount },
  } = useForm<RfqInput>({ resolver: zodResolver(rfqSchema), defaultValues });
  const product = useWatch({ control, name: "product" });

  async function onSubmit(data: RfqInput) {
    setState({ kind: "idle" });
    const result = await submitLead("/api/rfq", { ...data, ...collectLeadContext(locale) });
    setState(result);
    if (result.kind === "success") reset(defaultValues);
  }

  const productOptions: Option[] = [
    { value: "coffee", label: t("productCoffee") },
    { value: "coconut", label: t("productCoconut") },
    { value: "birdsNest", label: t("productBirdsNest") },
    { value: "fruit", label: t("productFruit") },
    { value: "nutsSpicesBotanicals", label: t("productNutsSpicesBotanicals") },
    { value: "other", label: t("productOther") },
  ];
  const options = (values: readonly string[], group: string): Option[] =>
    values.map((v) => ({ value: v, label: t(`${group}.${v}`) }));
  const formatOptions: Option[] = [
    { value: NO_FORMAT, label: t("skuNone") },
    ...COFFEE_FORMAT_CODES.map((code) => ({ value: code, label: `${code} · ${t(`formats.${code}`)}` })),
  ];
  const incotermOptions: Option[] = INCOTERMS.map((v) => ({
    value: v,
    label: v === "not-sure" ? t("incotermNotSure") : v,
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-10">
      <Honeypot register={register} />

      <FieldGroup legend={t("sectionRequest")}>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label={t("intent")} htmlFor="intent" error={errors.intent && tc("required")}>
            <Controller
              control={control}
              name="intent"
              render={({ field }) => (
                <ChoiceSelect
                  id="intent"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t("selectPlaceholder")}
                  options={options(RFQ_INTENTS, "intents")}
                  invalid={!!errors.intent}
                />
              )}
            />
          </Field>
          <Field label={t("product")} htmlFor="product" error={errors.product && tc("required")}>
            <Controller
              control={control}
              name="product"
              render={({ field }) => (
                <ChoiceSelect
                  id="product"
                  value={field.value}
                  onChange={(v) => {
                    field.onChange(v);
                    // Ranges and coffee format codes belong to one family.
                    setValue("range", "");
                    if (v !== "coffee") setValue("sku", "");
                  }}
                  placeholder={t("productPlaceholder")}
                  options={productOptions}
                  invalid={!!errors.product}
                />
              )}
            />
          </Field>
        </div>

        {rangesForProduct(product).length > 0 && (
          <Field label={t("range")} htmlFor="range">
            <Controller
              control={control}
              name="range"
              render={({ field }) => (
                <ChoiceSelect
                  id="range"
                  value={field.value || NO_FORMAT}
                  onChange={(v) => {
                    field.onChange(v === NO_FORMAT ? "" : v);
                    // A format code from another range no longer fits.
                    const code = getValues("sku");
                    if (code && CATALOG_SKUS.find((s) => s.code === code)?.range !== v) setValue("sku", "");
                  }}
                  placeholder={t("rangeNone")}
                  options={[
                    { value: NO_FORMAT, label: t("rangeNone") },
                    ...rangesForProduct(product).map((r) => ({ value: r.id, label: pick(r.name, locale) })),
                  ]}
                />
              )}
            />
          </Field>
        )}

        {product === "coffee" && (
          <Field label={t("sku")} htmlFor="sku">
            <Controller
              control={control}
              name="sku"
              render={({ field }) => (
                <ChoiceSelect
                  id="sku"
                  value={field.value || NO_FORMAT}
                  onChange={(v) => {
                    field.onChange(v === NO_FORMAT ? "" : v);
                    // Keep the range consistent with the chosen code.
                    const skuRange = CATALOG_SKUS.find((s) => s.code === v)?.range;
                    if (skuRange) setValue("range", skuRange);
                  }}
                  placeholder={t("skuNone")}
                  options={formatOptions}
                />
              )}
            />
            <p className="text-xs text-muted-foreground">{t("skuHint")}</p>
          </Field>
        )}

        <Field label={t("application")} htmlFor="application">
          <Input id="application" placeholder={t("applicationPlaceholder")} {...register("application")} />
        </Field>
      </FieldGroup>

      <FieldGroup legend={t("sectionDelivery")}>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label={t("volume")} htmlFor="volume" error={errors.volume && tc("required")}>
            <Input id="volume" placeholder={t("volumePlaceholder")} {...register("volume")} />
          </Field>
          <Field label={t("frequency")} htmlFor="frequency">
            <Controller
              control={control}
              name="frequency"
              render={({ field }) => (
                <ChoiceSelect
                  id="frequency"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t("selectPlaceholder")}
                  options={options(ORDER_FREQUENCIES, "frequencies")}
                />
              )}
            />
          </Field>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label={t("country")} htmlFor="country" error={errors.country && tc("required")}>
            <Input id="country" autoComplete="country-name" {...register("country")} />
          </Field>
          <Field label={t("destinationPort")} htmlFor="destinationPort">
            <Input
              id="destinationPort"
              placeholder={t("destinationPortPlaceholder")}
              {...register("destinationPort")}
            />
          </Field>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label={t("timing")} htmlFor="timing">
            <Controller
              control={control}
              name="timing"
              render={({ field }) => (
                <ChoiceSelect
                  id="timing"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t("selectPlaceholder")}
                  options={options(ORDER_TIMINGS, "timings")}
                />
              )}
            />
          </Field>
          <Field label={t("incoterm")} htmlFor="incoterm">
            <Controller
              control={control}
              name="incoterm"
              render={({ field }) => (
                <ChoiceSelect
                  id="incoterm"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t("selectPlaceholder")}
                  options={incotermOptions}
                />
              )}
            />
          </Field>
        </div>
      </FieldGroup>

      <FieldGroup legend={t("sectionSpec")}>
        <Field label={t("specRequirements")} htmlFor="specRequirements">
          <Textarea
            id="specRequirements"
            rows={3}
            placeholder={t("specRequirementsPlaceholder")}
            {...register("specRequirements")}
          />
        </Field>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label={t("packagingTier")} htmlFor="packagingTier">
            <Controller
              control={control}
              name="packagingTier"
              render={({ field }) => (
                <ChoiceSelect
                  id="packagingTier"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t("selectPlaceholder")}
                  options={options(PACKAGING_TIERS, "packagingTiers")}
                />
              )}
            />
          </Field>
          <Field label={t("privateLabel")} htmlFor="privateLabel">
            <Controller
              control={control}
              name="privateLabel"
              render={({ field }) => (
                <ChoiceSelect
                  id="privateLabel"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t("selectPlaceholder")}
                  options={options(PRIVATE_LABEL_OPTIONS, "privateLabels")}
                />
              )}
            />
          </Field>
        </div>
        <Field label={t("message")} htmlFor="message">
          <Textarea id="message" rows={4} placeholder={t("messagePlaceholder")} {...register("message")} />
        </Field>
      </FieldGroup>

      <FieldGroup legend={t("sectionContact")}>
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
            <Input id="phone" type="tel" autoComplete="tel" {...register("phone")} />
          </Field>
        </div>
      </FieldGroup>

      <div className="space-y-1.5">
        <label htmlFor="consent" className="flex cursor-pointer items-start gap-3 text-sm text-muted-foreground">
          <input
            id="consent"
            type="checkbox"
            className="mt-0.5 size-4 shrink-0 cursor-pointer accent-accent"
            aria-invalid={errors.consent ? true : undefined}
            {...register("consent")}
          />
          <span>
            {t.rich("consent", {
              privacy: (chunks) => (
                <Link href="/privacy" target="_blank" rel="noopener" className="text-accent underline-offset-2 hover:underline">
                  {chunks}
                </Link>
              ),
            })}
          </span>
        </label>
        {errors.consent && <p className="text-xs text-destructive">{t("consentRequired")}</p>}
      </div>

      {/* The form is long on mobile and the selects at the top can't take
          focus, so a failed submit must say so next to the button. */}
      {submitCount > 0 && Object.keys(errors).length > 0 && (
        <p role="alert" className="text-sm text-destructive">
          {t("fixErrors")}
        </p>
      )}

      <SubmitStatus
        state={state}
        successTitle={t("successTitle")}
        successText={t("success")}
        referenceText={(leadId) => t("reference", { leadId })}
        errorText={t("error")}
        undeliveredText={(email) => t("errorDelivery", { email })}
      />

      <Button type="submit" size="lg" disabled={isSubmitting} className="cursor-pointer">
        {isSubmitting ? tc("sending") : t("submit")}
      </Button>
    </form>
  );
}
