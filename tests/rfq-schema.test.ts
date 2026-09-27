import { test } from "node:test";
import assert from "node:assert/strict";
import fixture from "./fixtures/rfq-valid.json" with { type: "json" };
import {
  COFFEE_FORMAT_CODES,
  PRODUCT_SLUG_TO_FAMILY,
  contactSchema,
  parseRfqPrefill,
  rfqSchema,
} from "../src/lib/validations.ts";
import { PRODUCT_CATEGORIES } from "../src/lib/nav.ts";

const valid = () => structuredClone(fixture) as Record<string, unknown>;
const minimal = {
  intent: "quote",
  product: "coconut",
  volume: "5 t/month",
  country: "Japan",
  name: "A",
  company: "B",
  email: "a@example.com",
  consent: true,
};

test("the full fixture is valid", () => {
  const r = rfqSchema.safeParse(valid());
  assert.ok(r.success, JSON.stringify(!r.success && r.error.issues));
});

test("only the core fields are required", () => {
  assert.ok(rfqSchema.safeParse(minimal).success);
  for (const key of ["intent", "product", "volume", "country", "name", "company", "email", "consent"]) {
    const input: Record<string, unknown> = { ...minimal };
    delete input[key];
    assert.equal(rfqSchema.safeParse(input).success, false, `${key} should be required`);
  }
});

test("consent must be explicitly true", () => {
  for (const consent of [false, "true", 1, undefined, null]) {
    assert.equal(rfqSchema.safeParse({ ...minimal, consent }).success, false, `consent=${String(consent)}`);
  }
});

test("coffee format codes: WHCF001–009 only, and only for coffee", () => {
  assert.deepEqual(
    [...COFFEE_FORMAT_CODES],
    Array.from({ length: 9 }, (_, i) => `WHCF00${i + 1}`)
  );
  for (const sku of COFFEE_FORMAT_CODES) {
    assert.ok(rfqSchema.safeParse({ ...minimal, product: "coffee", sku }).success, sku);
  }
  assert.ok(rfqSchema.safeParse({ ...minimal, product: "coffee", sku: "" }).success, "empty = no format");
  for (const sku of ["WHC001", "WHCF010", "whcf001", "WHCF01"]) {
    assert.equal(rfqSchema.safeParse({ ...minimal, product: "coffee", sku }).success, false, sku);
  }
  assert.equal(rfqSchema.safeParse({ ...minimal, product: "fruit", sku: "WHCF001" }).success, false);
});

test("enumerated fields reject unknown values", () => {
  for (const [field, bad] of [
    ["intent", "buy-now"],
    ["product", "tea"],
    ["frequency", "daily"],
    ["timing", "yesterday"],
    ["packagingTier", "gold"],
    ["privateLabel", "maybe"],
    ["incoterm", "XYZ"],
    ["locale", "fr"],
  ] as const) {
    assert.equal(rfqSchema.safeParse({ ...minimal, [field]: bad }).success, false, `${field}=${bad}`);
  }
});

test("free text is length-bounded and email must be valid", () => {
  assert.equal(rfqSchema.safeParse({ ...minimal, message: "x".repeat(3001) }).success, false);
  assert.equal(rfqSchema.safeParse({ ...minimal, company: "x".repeat(161) }).success, false);
  assert.equal(rfqSchema.safeParse({ ...minimal, utm_source: "x".repeat(151) }).success, false);
  assert.equal(rfqSchema.safeParse({ ...minimal, email: "not-an-email" }).success, false);
});

test("a filled honeypot still validates (the route fakes success)", () => {
  const r = rfqSchema.safeParse({ ...minimal, company_website: "http://spam.example" });
  assert.ok(r.success);
  assert.equal(r.data.company_website, "http://spam.example");
});

test("prefill accepts slugs, family keys, intents and format codes only", () => {
  assert.deepEqual(parseRfqPrefill({ product: "birds-nest", intent: "sample" }), { product: "birdsNest", intent: "sample" });
  assert.deepEqual(parseRfqPrefill({ product: "coconut" }), { product: "coconut" });
  assert.deepEqual(parseRfqPrefill({ sku: "whcf007" }), { product: "coffee", sku: "WHCF007", range: "coffee-soluble" });
  assert.deepEqual(parseRfqPrefill({ product: "fruit", sku: "WHCF001" }), { product: "coffee", sku: "WHCF001", range: "coffee-green" });
  // Catalog links: range implies family; "specification" is an alias.
  assert.deepEqual(parseRfqPrefill({ product: "coconut", range: "coconut-oil", intent: "specification" }), { product: "coconut", range: "coconut-oil", intent: "spec-sheet" });
  assert.deepEqual(parseRfqPrefill({ range: "fruit-puree" }), { product: "fruit", range: "fruit-puree" });
  // A range from another family, or an unknown range, is dropped.
  assert.deepEqual(parseRfqPrefill({ product: "coffee", range: "fruit-puree" }), { product: "coffee" });
  assert.deepEqual(parseRfqPrefill({ range: "../etc" }), {});
  assert.deepEqual(parseRfqPrefill({ product: ["coffee", "fruit"], intent: "spec-sheet" }), { product: "coffee", intent: "spec-sheet" });
  assert.deepEqual(parseRfqPrefill({ product: "<script>", intent: "free", sku: "WHC001" }), {});
  assert.deepEqual(parseRfqPrefill({}), {});
});

test("prefill slug map covers exactly the product routes", () => {
  assert.deepEqual(
    Object.fromEntries(PRODUCT_CATEGORIES.map((c) => [c.slug, c.categoryKey])),
    PRODUCT_SLUG_TO_FAMILY
  );
});

test("contact schema: required fields, bounds, optional context", () => {
  const ok = { name: "A", company: "B", email: "a@example.com", message: "Hi" };
  assert.ok(contactSchema.safeParse(ok).success);
  assert.ok(contactSchema.safeParse({ ...ok, locale: "vi", sourcePath: "/vi/contact" }).success);
  assert.equal(contactSchema.safeParse({ ...ok, message: "" }).success, false);
  assert.equal(contactSchema.safeParse({ ...ok, message: "x".repeat(5001) }).success, false);
});
