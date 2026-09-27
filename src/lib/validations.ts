import { z } from "zod";
import { CATALOG_RANGES, CATALOG_SKUS } from "./catalog.ts";

// This module is shared by the client forms, the API routes and the
// node:test suite. Local imports must be import-free modules referenced
// with an explicit ".ts" extension (node:test can't resolve extensionless
// or "@/" paths). tests/rfq-schema.test.ts checks that
// PRODUCT_SLUG_TO_FAMILY matches src/lib/nav.ts.

// Honeypot field: real users never fill this in (it's visually hidden). Any
// non-empty value still passes *validation* — the route handler is what
// treats it as spam and fake-succeeds, so bots aren't tipped off by a 400.
const honeypot = z.string().max(500).optional().or(z.literal(""));

const optionalText = (max: number) => z.string().trim().max(max).optional().or(z.literal(""));
const optionalChoice = <T extends readonly [string, ...string[]]>(values: T) =>
  z.enum(values).optional().or(z.literal(""));

export const PRODUCT_FAMILIES = [
  "coffee",
  "coconut",
  "birdsNest",
  "fruit",
  "nutsSpicesBotanicals",
  "other",
] as const;
export type ProductFamily = (typeof PRODUCT_FAMILIES)[number];

/** /products/<slug> → product family, for RFQ links from product pages. */
export const PRODUCT_SLUG_TO_FAMILY: Record<string, ProductFamily> = {
  coffee: "coffee",
  coconut: "coconut",
  "birds-nest": "birdsNest",
  fruit: "fruit",
  "nuts-spices-botanicals": "nutsSpicesBotanicals",
};

export const RFQ_INTENTS = ["quote", "sample", "spec-sheet"] as const;

/**
 * Whitehorse's confirmed coffee product codes (details in
 * src/lib/catalog.ts). Offered as RFQ "format of interest" choices and
 * shown as product-code pages; listing one does not mean it is available,
 * sample-ready or export-ready — that is confirmed per request.
 */
export const COFFEE_FORMAT_CODES = [
  "WHCF001", // Green Robusta
  "WHCF002", // Green Arabica
  "WHCF003", // Fine Green Robusta
  "WHCF004", // Roasted Robusta
  "WHCF005", // Roasted & Ground
  "WHCF006", // Cold Brew
  "WHCF007", // Spray-Dried Instant
  "WHCF008", // Agglomerated Instant
  "WHCF009", // Freeze-Dried Instant
] as const;

export const ORDER_FREQUENCIES = ["one-off", "monthly", "quarterly", "annual", "not-sure"] as const;
export const ORDER_TIMINGS = ["asap", "1-3-months", "3-6-months", "6-plus-months", "exploring"] as const;
export const PACKAGING_TIERS = [
  "discovery-sample",
  "professional-horeca",
  "retail-private-label",
  "industrial-export",
  "not-sure",
] as const;
export const PRIVATE_LABEL_OPTIONS = ["yes", "no", "not-sure"] as const;
export const INCOTERMS = ["EXW", "FCA", "FOB", "CFR", "CIF", "DAP", "DDP", "not-sure"] as const;
const FORM_LOCALES = ["en", "vi"] as const;

// Context captured by the form (not typed by the buyer) so sales can see
// where a lead came from. Bounded like everything else.
const leadContext = {
  locale: optionalChoice(FORM_LOCALES),
  sourcePath: optionalText(300),
  utm_source: optionalText(150),
  utm_medium: optionalText(150),
  utm_campaign: optionalText(150),
  utm_term: optionalText(150),
  utm_content: optionalText(150),
};

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  company: z.string().trim().min(1).max(160),
  email: z.string().trim().max(254).email(),
  phone: optionalText(40),
  message: z.string().trim().min(1).max(5000),
  ...leadContext,
  company_website: honeypot, // honeypot
});
export type ContactInput = z.infer<typeof contactSchema>;

export const rfqSchema = z
  .object({
    intent: z.enum(RFQ_INTENTS),
    product: z.enum(PRODUCT_FAMILIES),
    sku: optionalChoice(COFFEE_FORMAT_CODES),
    // Catalog range id (src/lib/catalog.ts); must belong to `product`.
    range: optionalText(60),
    application: optionalText(300),
    specRequirements: optionalText(2000),
    volume: z.string().trim().min(1).max(200),
    frequency: optionalChoice(ORDER_FREQUENCIES),
    country: z.string().trim().min(1).max(100),
    destinationPort: optionalText(120),
    timing: optionalChoice(ORDER_TIMINGS),
    packagingTier: optionalChoice(PACKAGING_TIERS),
    privateLabel: optionalChoice(PRIVATE_LABEL_OPTIONS),
    incoterm: optionalChoice(INCOTERMS),
    message: optionalText(3000),
    name: z.string().trim().min(1).max(120),
    company: z.string().trim().min(1).max(160),
    email: z.string().trim().max(254).email(),
    phone: optionalText(40),
    // Must be explicitly ticked — a boolean (not z.literal(true)) so the
    // form can start unticked and still type-check.
    consent: z.boolean().refine((v) => v === true, { message: "consent_required" }),
    ...leadContext,
    company_website: honeypot, // honeypot
  })
  .refine((d) => !d.sku || d.product === "coffee", {
    path: ["sku"],
    message: "Format codes apply to coffee only",
  })
  .refine((d) => !d.range || rangeFamily(d.range) === d.product, {
    path: ["range"],
    message: "Range must belong to the selected product family",
  });
export type RfqInput = z.infer<typeof rfqSchema>;

/** Product family key for a catalog range id, or undefined if unknown. */
export function rangeFamily(rangeId: string): ProductFamily | undefined {
  const range = CATALOG_RANGES.find((r) => r.id === rangeId);
  return range ? PRODUCT_SLUG_TO_FAMILY[range.family] : undefined;
}

/** Ranges selectable in the RFQ form for a product family key. */
export function rangesForProduct(product: string | undefined) {
  return CATALOG_RANGES.filter((r) => PRODUCT_SLUG_TO_FAMILY[r.family] === product);
}

// Friendly intent names used in links, mapped to the stored enum. Old
// links (?intent=spec-sheet) keep working.
const INTENT_ALIASES: Record<string, (typeof RFQ_INTENTS)[number]> = {
  quote: "quote",
  sample: "sample",
  "spec-sheet": "spec-sheet",
  specification: "spec-sheet",
  spec: "spec-sheet",
};

export type RfqPrefill = Partial<Pick<RfqInput, "product" | "intent" | "sku" | "range">>;

/**
 * Reads ?product=&range=&sku=&intent= from an RFQ link (e.g. a catalog
 * CTA) into form defaults. Anything unrecognized is dropped rather than
 * trusted. A coffee format code implies product=coffee and its range; a
 * range implies its family; a range from another family is dropped.
 */
export function parseRfqPrefill(
  params: Record<string, string | string[] | undefined>
): RfqPrefill {
  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim();
  const prefill: RfqPrefill = {};

  const product = first(params.product);
  if (product) {
    const family = (PRODUCT_FAMILIES as readonly string[]).includes(product)
      ? (product as ProductFamily)
      : PRODUCT_SLUG_TO_FAMILY[product];
    if (family) prefill.product = family;
  }

  const intent = INTENT_ALIASES[first(params.intent)?.toLowerCase() ?? ""];
  if (intent) prefill.intent = intent;

  const range = first(params.range)?.toLowerCase();
  const family = range ? rangeFamily(range) : undefined;
  if (range && family && (!prefill.product || prefill.product === family)) {
    prefill.range = range;
    prefill.product = family;
  }

  const sku = first(params.sku)?.toUpperCase();
  if (sku && (COFFEE_FORMAT_CODES as readonly string[]).includes(sku)) {
    prefill.sku = sku as RfqPrefill["sku"];
    prefill.product = "coffee";
    const skuRange = CATALOG_SKUS.find((s) => s.code === sku)?.range;
    if (skuRange) prefill.range = skuRange;
  }

  return prefill;
}
