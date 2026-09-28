import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  supplierSchema,
  SUPPLIER_CAPABILITIES,
  SUPPLIER_PRODUCT_FAMILIES,
  SUPPLIER_QA_STATES,
  SUPPLIER_TYPES,
} from "../src/lib/validations.ts";
import { generateLeadId, resolveSmtpConfig } from "../src/lib/lead-delivery.ts";
import { publicSupplierTemplateUrl } from "../src/lib/supplier-intake.ts";

const valid = {
  contract: "supplier_public_intake@1",
  idempotencyKey: "123e4567-e89b-42d3-a456-426614174000",
  supplierType: "factory",
  companyName: "Example Foods",
  country: "Vietnam",
  originRegion: "Ben Tre",
  contactName: "Nguyen An",
  email: "an@example.com",
  phoneZalo: "",
  productFamilies: ["coconut"],
  capabilities: ["processing", "manufacturing"],
  qaState: "documentsAvailable",
  consent: true,
  submittedAt: "2026-09-28T09:00:00.000Z",
};

test("supplier intake minimum, version and contact rule", () => {
  assert.ok(supplierSchema.safeParse(valid).success);
  assert.ok(supplierSchema.safeParse({ ...valid, email: "", phoneZalo: "0962677790" }).success);
  assert.equal(supplierSchema.safeParse({ ...valid, email: "", phoneZalo: "" }).success, false);
  assert.equal(supplierSchema.safeParse({ ...valid, contract: "supplier_public_intake@2" }).success, false);
  assert.equal(supplierSchema.safeParse({ ...valid, idempotencyKey: "same-request" }).success, false);
  assert.equal(supplierSchema.safeParse({ ...valid, consent: false }).success, false);
});

test("supplier enums, arrays, bounds and honeypot", () => {
  assert.deepEqual([...SUPPLIER_TYPES], ["farmer", "cooperative", "factory", "company"]);
  assert.equal(SUPPLIER_PRODUCT_FAMILIES.length, 5);
  assert.equal(SUPPLIER_CAPABILITIES.length, 4);
  assert.equal(SUPPLIER_QA_STATES.length, 4);
  assert.equal(supplierSchema.safeParse({ ...valid, supplierType: "broker" }).success, false);
  assert.equal(supplierSchema.safeParse({ ...valid, productFamilies: [] }).success, false);
  assert.equal(supplierSchema.safeParse({ ...valid, capabilities: [] }).success, false);
  assert.equal(supplierSchema.safeParse({ ...valid, notes: "x".repeat(2001) }).success, false);
  const bot = supplierSchema.safeParse({ ...valid, company_website: "https://spam.example" });
  assert.ok(bot.success);
});

test("supplier references and routing are isolated", () => {
  assert.equal(
    generateLeadId("supplier", new Date("2026-09-28T09:00:00Z"), (b) => b.fill(0)),
    "SUP-20260928-222222"
  );
  const env = {
    SMTP_HOST: "smtp.invalid",
    SMTP_USER: "robot@example.com",
    SMTP_PASS: "secret",
    MAIL_TO: "info@example.com",
    SUPPLIER_MAIL_TO: "procurement@example.com",
  };
  assert.equal(resolveSmtpConfig(env, "supplier")?.to, "procurement@example.com");
  assert.equal(resolveSmtpConfig(env, "contact")?.to, "info@example.com");
});

test("detailed template CTA accepts public HTTPS only", () => {
  assert.equal(publicSupplierTemplateUrl(undefined), undefined);
  assert.equal(publicSupplierTemplateUrl("http://example.com/template.xlsx"), undefined);
  assert.equal(publicSupplierTemplateUrl("https://localhost/template.xlsx"), undefined);
  assert.equal(publicSupplierTemplateUrl("https://user:pass@example.com/a"), undefined);
  assert.equal(
    publicSupplierTemplateUrl("https://files.example.com/supplier.xlsx"),
    "https://files.example.com/supplier.xlsx"
  );
});

test("localized routes and supplier CTAs are wired without replacing Contact", () => {
  const root = new URL("../", import.meta.url);
  const page = readFileSync(new URL("src/app/[locale]/suppliers/apply/page.tsx", root), "utf8");
  const home = readFileSync(new URL("src/app/[locale]/page.tsx", root), "utf8");
  const about = readFileSync(new URL("src/app/[locale]/about/page.tsx", root), "utf8");
  const network = readFileSync(new URL("src/app/[locale]/clients/page.tsx", root), "utf8");
  const contact = readFileSync(new URL("src/app/[locale]/contact/page.tsx", root), "utf8");
  assert.match(page, /SupplierForm/);
  for (const source of [home, about, network]) assert.match(source, /\/suppliers\/apply/);
  assert.match(contact, /ContactForm/);
});
