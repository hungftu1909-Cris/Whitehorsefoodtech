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
    "a world-class ingredient platform",
    "a revolutionary supply chain",
    "your one-stop sourcing partner",
    "tinh hoa nông sản Việt",
    "chắp cánh cho nông sản Việt",
    "vươn tầm thế giới",
    "Whitehorse bảo chứng chất lượng",
    "Vietnam's leading ingredient platform",
    "100% organic coconut blossom sugar",
    "Cleaned bird's nest, export-grade",
    "đường hoa dừa hữu cơ 100%",
    "30–50 export-qualified suppliers (2026 objective)",
    "Mục tiêu 2026: 30-50 nhà cung cấp",
    "dự kiến trong 2026",
  ];
  for (const claim of removed) {
    assert.ok(scanText(claim).length > 0, `not caught: ${claim}`);
  }
  assert.ok(FORBIDDEN_CLAIMS.length >= 10);
});

test("proof markers: 50+ suppliers and 10+ markets are current; 3,000+ / 10,000+ are vision on About only", () => {
  const TAGS = {
    en: { current: /^Current$/, vision: /^Three-year vision$/ },
    vi: { current: /^Hiện tại$/, vision: /^Tầm nhìn 3 năm$/ },
  } as const;
  for (const [locale, catalog] of [["en", en], ["vi", vi]] as const) {
    const tags = TAGS[locale];
    const items = get(catalog as Json, "about.status.items") as { tag: string; value: string; label: string }[];
    const byValue = (v: string) => items.find((i) => i.value.replace(".", ",") === v);
    assert.match(byValue("50+")!.tag, tags.current, `${locale}: 50+ suppliers is a current fact`);
    assert.match(byValue("10+")!.tag, tags.current, `${locale}: 10+ markets is a current fact`);
    assert.match(byValue("3,000+")!.tag, tags.vision, `${locale}: 3,000+ is vision`);
    assert.match(byValue("10,000+")!.tag, tags.vision, `${locale}: 10,000+ is vision`);
    assert.equal(items.find((i) => i.value === "20+"), undefined, `${locale}: no 20+ headline`);
    for (const item of items) assert.notEqual(item.value.trim(), "0", `${locale}: zero-value marker`);
    // Network page: current facts only, same tag.
    assert.match(String(get(catalog as Json, "clients.network.current.tag")), tags.current);
    assert.match(String(get(catalog as Json, "clients.network.suppliers.tag")), tags.current);
    assert.equal(String(get(catalog as Json, "clients.network.suppliers.stat")), "50+");
    // Homepage proof strip: current facts only, no vision figures.
    const proof = (get(catalog as Json, "home.proof.items") as { value: string }[]).map((i) => i.value);
    assert.deepEqual(proof, ["50+", "10+", "5"]);
    assert.doesNotMatch(JSON.stringify(get(catalog as Json, "home")), /(3[.,]000|10[.,]000)\+/);
  }
  // The old 30–50 / 2026 supplier objective is retired everywhere, and the
  // vision figures only appear in their tagged About items.
  for (const catalog of [en, vi]) {
    for (const [key, value] of leafValues(catalog as Json)) {
      assert.doesNotMatch(value, /30\s?[–-]\s?50|2026 objective|Mục tiêu 2026/, `retired supplier objective at ${key}`);
      if (/(3[.,]000|10[.,]000)\+/.test(value)) {
        assert.match(key, /^about\.status\.items\[\d\]\.value$/, `untagged figure at ${key}: ${value}`);
      }
    }
  }
});

test("OEM/ODM/OBM is stated as partner-delivered capability, never universal", () => {
  for (const [catalog, partners] of [[en, /suitable manufacturing partners/], [vi, /đối tác sản xuất phù hợp/]] as const) {
    assert.match(String(get(catalog as Json, "home.hero.subtitle")), partners);
    assert.match(String(get(catalog as Json, "home.value.modelsBody")), partners);
    assert.match(String(get(catalog as Json, "home.value.note")), /MOQ/);
    assert.match(String(get(catalog as Json, "rfq.form.modelNote")), /OEM, ODM/);
  }
  for (const catalog of [en, vi]) {
    const all = leafValues(catalog as Json).map(([, v]) => v).join("\n");
    assert.doesNotMatch(all, /(OEM|ODM|OBM)[^.\n]*(for (all|every) (product|SKU|famil))|mọi (sản phẩm|SKU)[^.\n]*(OEM|ODM|OBM)/i);
  }
});

test("markets are described as relationships, never as shipments or service", () => {
  for (const catalog of [en, vi]) {
    const all = leafValues(catalog as Json).map(([, v]) => v).join("\n");
    assert.doesNotMatch(all, /countries (we )?serve|exported to|export track record|recurring buyers|highest standards|\bWB(IS|OS)\b/i);
  }
  assert.match(String(get(en as Json, "clients.regions")), /Russia, Japan, Qatar, Israel, South Korea, China, the United States, Canada, Australia, Germany, Italy, France, Belgium and the Netherlands/);
});

test("positioning is the five-family platform, not coffee-only", () => {
  for (const catalog of [en, vi]) {
    const heroes = [get(catalog as Json, "meta.title"), get(catalog as Json, "meta.description"), get(catalog as Json, "home.hero.title")].join(" ");
    assert.doesNotMatch(heroes, /coffee ingredients for|nguyên liệu cà phê việt nam cho/i);
  }
  assert.match(String(get(en as Json, "about.hero.subtitle")), /premium B2B ingredient platform connecting farmers and processors more directly/);
});

test("public navigation retains the approved concepts while page headlines stay concise", () => {
  assert.equal(get(en as Json, "nav.certifications"), "Quality & Qualification");
  assert.equal(get(en as Json, "nav.process"), "How We Work");
  assert.equal(get(en as Json, "nav.clients"), "Network");
  assert.equal(get(en as Json, "certifications.hero.title"), "Evidence before claims.");
});

test("digital supply-chain technology is complete but clearly future-facing", () => {
  for (const [locale, catalog] of [["en", en], ["vi", vi]] as const) {
    const technology = get(catalog as Json, "certifications.technology") as {
      status: string;
      subtitle: string;
      backboneNodes: string[];
      layers: { title: string; status: "current" | "building" | "roadmap" }[];
      aiTitle: string;
      note: string;
    };
    const titles = technology.layers.map((layer) => layer.title).join(" ");

    assert.equal(technology.layers.length, 6, `${locale}: six connected technology layers`);
    assert.equal(technology.backboneNodes.length, 8, `${locale}: eight records in the data backbone`);
    assert.deepEqual(
      technology.layers.map((layer) => layer.status),
      ["roadmap", "building", "roadmap", "current", "roadmap", "current"],
      `${locale}: each layer has a truthful delivery status`,
    );
    assert.match(titles, /IoT/);
    assert.match(titles, /WMS/);
    assert.match(titles, /TMS/);
    assert.match(technology.aiTitle, /AI/);
    assert.match(`${technology.status} ${technology.subtitle} ${technology.note}`, /phased|giai đoạn/i);
    assert.match(technology.note, /vary|thay đổi/i);
  }
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
  assert.match(String(get(en as Json, "home.hero.subtitle")), /for distributors, manufacturers, foodservice groups and brands\.$/);
});

test("vision and ecosystem copy stays labelled and logo-free", () => {
  assert.match(String(get(en as Json, "about.direction.note")), /not a current service/i);
  // Direct QA/QC is strategic direction, only inside the labelled vision.
  assert.match(String(get(en as Json, "about.direction.body")), /direct quality-assurance and quality-control capability/);
  assert.match(String(get(vi as Json, "about.direction.note")), /chưa phải dịch vụ/i);
  assert.match(String(get(en as Json, "about.vision.rolesNote")), /not current services/i);
  assert.match(String(get(vi as Json, "about.vision.rolesNote")), /chưa phải dịch vụ/i);
  for (const catalog of [en, vi]) {
    const body = String(get(catalog as Json, "about.ecosystem.body"));
    assert.match(body, /Balance Life/);
    assert.doesNotMatch(body, /vpbank/i);
  }
});
