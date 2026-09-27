import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import en from "../messages/en.json" with { type: "json" };
import vi from "../messages/vi.json" with { type: "json" };
import { scanText, scanRepo, FORBIDDEN_CLAIMS } from "../scripts/claims.mjs";

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

/** Every leaf path, including array indexes, e.g. "home.segments.items[2].title". */
function leafPaths(value: Json, prefix = ""): string[] {
  if (Array.isArray(value)) return value.flatMap((v, i) => leafPaths(v, `${prefix}[${i}]`));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) => leafPaths(v, prefix ? `${prefix}.${k}` : k));
  }
  return [prefix];
}

function leafValues(value: Json, prefix = ""): [string, string][] {
  if (Array.isArray(value)) return value.flatMap((v, i) => leafValues(v, `${prefix}[${i}]`));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) => leafValues(v, prefix ? `${prefix}.${k}` : k));
  }
  return [[prefix, String(value)]];
}

function get(obj: Json, path: string): Json {
  return path.split(".").reduce<Json>((o, k) => (o as Record<string, Json>)[k], obj);
}

test("EN and VI message catalogs have identical key structure", () => {
  const enKeys = new Set(leafPaths(en as Json));
  const viKeys = new Set(leafPaths(vi as Json));
  assert.deepEqual([...enKeys].filter((k) => !viKeys.has(k)), [], "keys missing in vi.json");
  assert.deepEqual([...viKeys].filter((k) => !enKeys.has(k)), [], "keys missing in en.json");
});

test("no empty translations", () => {
  for (const [locale, catalog] of [["en", en], ["vi", vi]] as const) {
    const empty = leafValues(catalog as Json).filter(([, v]) => v.trim() === "");
    assert.deepEqual(empty, [], `empty strings in ${locale}.json`);
  }
});

test("ICU placeholders and rich-text tags match between locales", () => {
  const viValues = new Map(leafValues(vi as Json));
  const tokens = (s: string) => [...s.matchAll(/\{(\w+)\}|<(\w+)>/g)].map((m) => m[0]).sort();
  for (const [key, enValue] of leafValues(en as Json)) {
    assert.deepEqual(tokens(viValues.get(key) ?? ""), tokens(enValue), `placeholder mismatch at ${key}`);
  }
});

test("message catalogs contain no forbidden claims or placeholders", () => {
  for (const file of ["messages/en.json", "messages/vi.json"]) {
    const findings = scanText(fs.readFileSync(file, "utf8"), file);
    assert.deepEqual(findings, [], JSON.stringify(findings, null, 2));
  }
});

test("the whole public surface (messages, blog, src) passes the claims scan", () => {
  const findings = scanRepo();
  assert.deepEqual(findings, [], JSON.stringify(findings, null, 2));
});

test("the scanner still catches the claims Phase 1 removed", () => {
  const removed = [
    "100K+ Metric tons exported every year",
    "3,000+ partner growing regions",
    "3.000+ vùng trồng đối tác",
    "30+ countries reached",
    "Every lot is traceable back to its growing region",
    "Mỗi lô hàng đều truy xuất được",
    "We partner exclusively with manufacturing facilities",
    "respond within 1–2 business days",
    "phản hồi trong 1–2 ngày làm việc",
    "5 years in export trade",
    "our manufacturing partners run modern facilities; visit our factory",
    "[Placeholder — add leadership]",
    "WHC001 Green Robusta",
    "Partnered with VPBank",
  ];
  for (const claim of removed) {
    assert.ok(scanText(claim).length > 0, `not caught: ${claim}`);
  }
  assert.ok(FORBIDDEN_CLAIMS.length >= 10);
});

test("status markers keep facts and targets distinguishable", () => {
  for (const [locale, catalog, targetWord] of [
    ["en", en, "target"],
    ["vi", vi, "Mục tiêu"],
  ] as const) {
    const items = get(catalog as Json, "about.status.items") as { tag: string; value: string }[];
    const target = items.find((i) => i.value === "30–50");
    assert.ok(target, `${locale}: 30–50 target missing`);
    assert.match(target.tag, new RegExp(targetWord, "i"), `${locale}: 30–50 must be tagged as a target`);
    const network = items.find((i) => i.value === "20+");
    assert.ok(network, `${locale}: 20+ network marker missing`);
    assert.doesNotMatch(network.tag, new RegExp(targetWord, "i"), `${locale}: 20+ is current, not a target`);
    for (const item of items) assert.notEqual(item.value.trim(), "0", `${locale}: zero-value marker`);
  }
  // The network page repeats the same pair with the same tagging.
  assert.match(String(get(en as Json, "clients.network.target.tag")), /target/i);
  assert.match(String(get(vi as Json, "clients.network.target.tag")), /Mục tiêu/);
});

test("public concepts use the Phase 1 names", () => {
  assert.equal(get(en as Json, "nav.certifications"), "Quality & Qualification");
  assert.equal(get(en as Json, "nav.process"), "How We Work");
  assert.equal(get(en as Json, "nav.clients"), "Network");
  assert.equal(get(en as Json, "certifications.hero.title"), "Quality & supplier qualification");
});

test("sales copy promises follow-up, not a response time", () => {
  for (const catalog of [en, vi]) {
    const all = leafValues(catalog as Json).map(([, v]) => v).join("\n");
    assert.doesNotMatch(all, /business days|ngày làm việc/);
  }
  assert.match(String(get(en as Json, "home.ctaBanner.subtitle")), /reviews qualified requests and follows up with the next commercial step/);
});

test("legal pages read as complete notices but stay out of the index", () => {
  assert.equal(get(en as Json, "legal.privacyTitle"), "Privacy Notice");
  assert.equal(get(en as Json, "legal.termsTitle"), "Website Terms");
  assert.equal(get(en as Json, "footer.privacy"), get(en as Json, "legal.privacyTitle"));
  assert.equal(get(vi as Json, "footer.terms"), get(vi as Json, "legal.termsTitle"));
  for (const catalog of [en, vi]) {
    const legal = JSON.stringify(get(catalog as Json, "legal"));
    assert.doesNotMatch(legal, /interim|being prepared|tạm thời|đang được hoàn thiện|placeholder/i);
  }
  // Presentation is neutral, but legal review is still pending: keep noindex
  // and sitemap exclusion until reviewed text is in.
  for (const page of ["privacy", "terms"]) {
    const src = fs.readFileSync(`src/app/[locale]/${page}/page.tsx`, "utf8");
    assert.match(src, /index: false/);
    assert.match(src, /Legal review pending/);
  }
  const sitemap = fs.readFileSync("src/app/sitemap.ts", "utf8");
  const indexable = sitemap.slice(sitemap.indexOf("INDEXABLE_STATIC_PATHS = ["), sitemap.indexOf("];"));
  assert.doesNotMatch(indexable, /privacy|terms/);
});

test("value-prop and hero copy is confident, not apologetic", () => {
  for (const catalog of [en, vi]) {
    const all = leafValues(catalog as Json).map(([, v]) => v).join("\n");
    assert.doesNotMatch(all, /track record we don't have|thành tích chúng tôi chưa có|as a new company|là một công ty mới/i);
  }
  assert.match(String(get(en as Json, "home.hero.subtitle")), /For each order, we agree sample availability, specifications, documentation requirements and COA scope with you\./);
});

test("vision and ecosystem copy stays labelled and logo-free", () => {
  assert.match(String(get(en as Json, "about.vision.note")), /not a current service/i);
  assert.match(String(get(vi as Json, "about.vision.note")), /chưa phải dịch vụ/i);
  for (const catalog of [en, vi]) {
    const body = String(get(catalog as Json, "about.ecosystem.body"));
    assert.match(body, /Balance Life/);
    assert.doesNotMatch(body, /vpbank/i);
  }
});
