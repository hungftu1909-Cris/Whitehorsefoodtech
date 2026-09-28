import type { ContactInput, RfqInput } from "@/lib/validations";
import { CATALOG_RANGES } from "./catalog.ts";

// Internal notification emails for the sales inbox — English labels
// regardless of the buyer's site language (the buyer's locale is included
// as a field). Field order is fixed so a future CRM import can rely
// on it.

const PRODUCT_LABEL: Record<RfqInput["product"], string> = {
  coffee: "Coffee Ingredients",
  coconut: "Coconut Ingredients",
  birdsNest: "Bird's Nest Ingredients",
  fruit: "Fruit Ingredients",
  nutsSpicesBotanicals: "Nuts, Spices & Botanicals",
  other: "Other / not listed",
};

const MODEL_LABEL: Record<RfqInput["model"], string> = {
  bulk: "Bulk ingredient",
  oem: "OEM",
  odm: "ODM",
  obm: "OBM",
};

const COFFEE_FORMAT_LABEL: Record<string, string> = {
  WHCF001: "Green Robusta",
  WHCF002: "Green Arabica",
  WHCF003: "Fine Green Robusta",
  WHCF004: "Roasted Robusta",
  WHCF005: "Roasted & Ground",
  WHCF006: "Cold Brew",
  WHCF007: "Spray-Dried Instant",
  WHCF008: "Agglomerated Instant",
  WHCF009: "Freeze-Dried Instant",
};

export function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Subject fragments: one line, bounded, no header-breaking characters. */
function subjectPart(value: string | undefined, max = 60) {
  const clean = (value ?? "").replace(/[\r\n\t]+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max)}…` : clean;
}

function renderRows(rows: [string, string | undefined][]) {
  return rows
    .map(
      ([label, value]) =>
        `<tr><th align="left" valign="top" style="padding:4px 12px 4px 0">${escapeHtml(label)}</th>` +
        `<td style="padding:4px 0">${value ? escapeHtml(value).replace(/\n/g, "<br/>") : "—"}</td></tr>`
    )
    .join("");
}

export function formatLabel(sku: string | undefined) {
  return sku ? `${sku} · ${COFFEE_FORMAT_LABEL[sku] ?? sku}` : undefined;
}

export function buildRfqEmail(data: RfqInput, leadId: string) {
  const productLabel = PRODUCT_LABEL[data.product];
  const productPart = data.sku ? `${productLabel} / ${data.sku}` : productLabel;
  const subject =
    `[RFQ][${data.intent}][${MODEL_LABEL[data.model]}][${subjectPart(productPart)}][${subjectPart(data.country, 40)}] ` +
    `${subjectPart(data.company)} — ${leadId}`;

  const html = `
    <h2>New RFQ — ${escapeHtml(leadId)}</h2>
    <table cellspacing="0" cellpadding="0">${renderRows([
      ["Reference", leadId],
      ["Intent", data.intent],
      ["Business model", MODEL_LABEL[data.model]],
      ["Product family", productLabel],
      ["Range of interest", data.range ? CATALOG_RANGES.find((r) => r.id === data.range)?.name.en ?? data.range : undefined],
      ["Coffee format of interest", formatLabel(data.sku || undefined)],
      ["Application", data.application],
      ["Specification / certification needs", data.specRequirements],
      ["Estimated volume", data.volume],
      ["Frequency", data.frequency],
      ["Destination country", data.country],
      ["Destination port", data.destinationPort],
      ["Timing", data.timing],
      ["Packaging tier", data.packagingTier],
      ["Packaging / artwork brief", data.packagingBrief],
      ["Target format / formulation brief", data.formatBrief],
      ["Intended market and channel", data.targetMarket],
      ["Brand model", data.brandModel],
      ["Preferred Incoterm", data.incoterm],
      ["Additional details", data.message],
      ["Name", data.name],
      ["Company", data.company],
      ["Email", data.email],
      ["Phone / WhatsApp", data.phone],
      ["Consent to be contacted", data.consent ? "yes" : "no"],
      ["Site language", data.locale],
      ["Source page", data.sourcePath],
      ["UTM source", data.utm_source],
      ["UTM medium", data.utm_medium],
      ["UTM campaign", data.utm_campaign],
      ["UTM term", data.utm_term],
      ["UTM content", data.utm_content],
    ])}</table>
    <p style="color:#666">Format codes are internal "format of interest" choices, not a confirmation of availability.</p>
  `;
  return { subject, html };
}

export function buildContactEmail(data: ContactInput, leadId: string) {
  const subject = `[Contact] ${subjectPart(data.company)} — ${leadId}`;
  const html = `
    <h2>New contact message — ${escapeHtml(leadId)}</h2>
    <table cellspacing="0" cellpadding="0">${renderRows([
      ["Reference", leadId],
      ["Name", data.name],
      ["Company", data.company],
      ["Email", data.email],
      ["Phone", data.phone],
      ["Message", data.message],
      ["Site language", data.locale],
      ["Source page", data.sourcePath],
      ["UTM source", data.utm_source],
      ["UTM medium", data.utm_medium],
      ["UTM campaign", data.utm_campaign],
      ["UTM term", data.utm_term],
      ["UTM content", data.utm_content],
    ])}</table>
  `;
  return { subject, html };
}
