// Catalog data integrity and truth rules (src/lib/catalog.ts).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  CATALOG_RANGES,
  CATALOG_SKUS,
  DEFINED_SKU_COUNTS,
  DEFINED_SKU_TOTAL,
  definedCodesFor,
  PACKAGING_OPTIONS,
  relatedSkus,
  type Localized,
  type FamilySlug,
} from "../src/lib/catalog.ts";
import { COFFEE_FORMAT_CODES, parseRfqPrefill, rfqSchema } from "../src/lib/validations.ts";
import { rfqHref } from "../src/lib/rfq-links.ts";
import { PRODUCT_CATEGORIES } from "../src/lib/nav.ts";
import { FAMILY_MEDIA, MEDIA_ASSETS, familyMedia, rangeMedia, skuMedia } from "../src/lib/media-manifest.ts";

const SOURCES = fs.readFileSync("docs/product-range-sources.md", "utf8");
const PROVENANCE = fs.readFileSync("docs/asset-provenance.md", "utf8");

function localized(): Localized[] {
  const out: Localized[] = [];
  for (const r of CATALOG_RANGES) out.push(r.name, r.summary, ...r.formats, ...r.specFields);
  for (const s of CATALOG_SKUS) {
    out.push(s.name, s.line, s.summary, ...s.applications, ...skuMedia(s.code).map((i) => i.alt));
    for (const row of s.specs) out.push(row.label, ...(row.reference ? [row.reference] : []));
  }
  return out;
}

test("every text in the catalog exists in EN and VI", () => {
  for (const text of localized()) {
    assert.ok(text.en.trim() && text.vi.trim(), JSON.stringify(text));
  }
});

test("published detail-page codes are exactly WHCF001–WHCF009", () => {
  assert.deepEqual(CATALOG_SKUS.map((s) => s.code), [...COFFEE_FORMAT_CODES]);
  assert.equal(new Set(CATALOG_SKUS.map((s) => s.slug)).size, CATALOG_SKUS.length);
  for (const sku of CATALOG_SKUS) {
    assert.equal(sku.slug, sku.code.toLowerCase());
    assert.equal(sku.family, "coffee", "only coffee has published SKU detail pages");
  }
});

test("defined core portfolio is 29 SKUs across five families", () => {
  assert.deepEqual(DEFINED_SKU_COUNTS, {
    coffee: 9,
    coconut: 5,
    "birds-nest": 2,
    fruit: 9,
    "nuts-spices-botanicals": 4,
  });
  assert.equal(DEFINED_SKU_TOTAL, 29);
  assert.deepEqual(definedCodesFor("coffee"), COFFEE_FORMAT_CODES);
  assert.deepEqual(definedCodesFor("coconut"), ["WHCO001", "WHCO002", "WHCO003", "WHCO004", "WHCO005"]);
  assert.deepEqual(definedCodesFor("birds-nest"), ["WHBN001", "WHBN002"]);
  assert.deepEqual(definedCodesFor("fruit"), ["WHFR001", "WHFR002", "WHFR003", "WHFR004", "WHFR005", "WHFR006", "WHFR007", "WHFR008", "WHFR009"]);
  assert.deepEqual(definedCodesFor("nuts-spices-botanicals"), ["WHNSB001", "WHNSB002", "WHNSB003", "WHNSB004"]);
});

test("families, ranges and codes are consistent", () => {
  const families = PRODUCT_CATEGORIES.map((c) => c.slug);
  assert.deepEqual(families, ["coconut", "fruit", "nuts-spices-botanicals", "coffee", "birds-nest"], "platform order: coffee is not first");
  assert.equal(new Set(CATALOG_RANGES.map((r) => r.id)).size, CATALOG_RANGES.length, "range ids unique");
  for (const family of families) {
    assert.ok(CATALOG_RANGES.some((r) => r.family === family), `${family} has ranges`);
  }
  for (const sku of CATALOG_SKUS) {
    const range = CATALOG_RANGES.find((r) => r.id === sku.range);
    assert.ok(range && range.family === sku.family, `${sku.code} range`);
    assert.ok(relatedSkus(sku).every((s) => s.code !== sku.code));
  }
});

test("non-coffee ranges follow the CEO product briefs", () => {
  const ids = (family: string) => CATALOG_RANGES.filter((r) => r.family === family).map((r) => r.id);
  assert.deepEqual(ids("coconut"), ["coconut-milk-cream", "coconut-powders-solids", "coconut-blossom-sugar"]);
  assert.deepEqual(ids("birds-nest"), ["birds-nest-cleaned", "birds-nest-instant", "birds-nest-oem"]);
  assert.deepEqual(ids("fruit"), ["fruit-soft-dried", "fruit-freeze-dried", "fruit-concentrate-powder", "fruit-frozen-puree"]);
  assert.deepEqual(ids("nuts-spices-botanicals"), ["nsb-nuts", "nsb-spices"]);
  for (const family of ["coconut", "birds-nest", "fruit", "nuts-spices-botanicals"] as const) {
    assert.ok(PACKAGING_OPTIONS[family]?.length, `${family} has packaging options`);
  }
});

test("indicative values stay on ranges, never on confirmed codes, and carry no certification claims", () => {
  for (const range of CATALOG_RANGES) {
    if (!range.indicative) continue;
    assert.notEqual(range.family, "coffee", "coffee uses primary-sourced reference parameters only");
    for (const line of range.indicative) {
      assert.ok(line.en.trim() && line.vi.trim(), JSON.stringify(line));
      assert.doesNotMatch(line.en + line.vi, /100\s?%|export[- ]grade|guarantee|certified|đạt chuẩn|bảo đảm/i, line.en);
    }
  }
  const all = JSON.stringify(CATALOG_RANGES);
  assert.doesNotMatch(all, /BNE-(CLN|INS)/, "bird's nest codes are not published as confirmed codes");
  assert.doesNotMatch(all, /full documentation and quality control|carefully selected|high-quality/i);
});

test("a number in a reference value always cites a primary source", () => {
  for (const sku of CATALOG_SKUS) {
    for (const row of sku.specs) {
      if (row.reference && /\d/.test(row.reference.en + row.reference.vi)) {
        assert.ok(row.source, `${sku.code} "${row.label.en}" has a number but no source`);
      }
      if (row.source) {
        for (const part of row.source.split(";")) {
          assert.ok(SOURCES.includes(part.trim().replace("ICO Res. 420", "Resolution No. 420")), `source "${part}" missing from docs/product-range-sources.md`);
        }
      }
      for (const method of (row.method ?? "").match(/ISO \d+/g) ?? []) {
        assert.ok(SOURCES.includes(method), `method ${method} missing from sources doc`);
      }
    }
  }
});

test("brief values without a primary source are not published", () => {
  const all = JSON.stringify(CATALOG_SKUS);
  for (const unsourced of ["≤2%", "≤ 2%", "0.5%", "0.1%", "4–5%", "specialty-grade", "Specialty-grade"]) {
    assert.ok(!all.includes(unsourced), `unsourced value ${unsourced} published`);
  }
});

test("every manifest image exists, is optimised and has provenance", () => {
  const INVENTORY = fs.readFileSync("docs/image-inventory.md", "utf8");
  for (const image of Object.values(MEDIA_ASSETS)) {
    const file = path.join("public", image.src);
    assert.ok(fs.existsSync(file), `${image.src} missing`);
    assert.ok(fs.statSync(file).size < 400 * 1024, `${image.src} not optimised`);
    const publicPath = image.src.replace(/^\//, "public/");
    assert.ok(PROVENANCE.includes(publicPath) || INVENTORY.includes(publicPath), `${image.src} has no provenance row`);
    assert.ok(image.alt.en.trim() && image.alt.vi.trim(), `${image.id} alt`);
  }
  assert.match(PROVENANCE, /production rights confirmation pending/i);
});

test("each confirmed code shows only its own packaging render, never a shared image", () => {
  const INVENTORY = fs.readFileSync("docs/image-inventory.md", "utf8");
  const primaries = CATALOG_SKUS.map((s) => skuMedia(s.code)[0].src);
  assert.equal(new Set(primaries).size, primaries.length, "primary SKU images are unique");
  for (const sku of CATALOG_SKUS) {
    const media = skuMedia(sku.code);
    assert.ok(media.length >= 1, `${sku.code} has its pack`);
    for (const image of media) {
      assert.equal(image.kind, "concept-pack", `${sku.code} shows only code-specific packs`);
      assert.ok(image.src.includes(sku.slug), `${sku.code} pack file is named for the code`);
      assert.ok(image.alt.en.includes(sku.code) && image.alt.vi.includes(sku.code), `${sku.code} alt names the code`);
      assert.ok(INVENTORY.includes(image.src.replace(/^\//, "public/")), `${sku.code} in inventory`);
    }
  }
});

test("ranges show only their own verified images, or none", () => {
  const INVENTORY = fs.readFileSync("docs/image-inventory.md", "utf8");
  for (const range of CATALOG_RANGES) {
    const media = rangeMedia(range.id);
    assert.ok(media.length <= 2, `${range.id} has at most two views`);
    for (const image of media) {
      assert.equal(image.family, range.family, `${range.id} image belongs to its family`);
      const publicPath = image.src.replace(/^\//, "public/");
      assert.ok(INVENTORY.includes(publicPath) || PROVENANCE.includes(publicPath), `${image.src} documented`);
      assert.doesNotMatch(image.alt.en + image.alt.vi, /\bWH(CO|BN|FR)\d/, "range alt text never names an unconfirmed code");
    }
    const familyIds = new Set(familyMedia(range.family).map((image) => image.id));
    assert.ok(media.every((image) => !familyIds.has(image.id)), `${range.id} never borrows its family highlight image`);
  }
});

test("family highlight images are two distinct files when both are verified", () => {
  for (const family of PRODUCT_CATEGORIES.map((category) => category.slug) as FamilySlug[]) {
    const media = familyMedia(family);
    assert.ok(media.length >= 1, `${family} has a verified highlight image`);
    assert.equal(media.length, FAMILY_MEDIA[family].status === "verified-pair" ? 2 : 1, `${family} status matches its images`);
    if (media.length === 2) assert.notEqual(media[0].src, media[1].src, `${family} family images differ`);
  }
});

test("catalog request links prefill the RFQ and validate", () => {
  for (const sku of CATALOG_SKUS) {
    for (const intent of ["sample", "spec-sheet", "quote"] as const) {
      const { query } = rfqHref({ family: sku.family, range: sku.range, sku: sku.code, intent });
      const prefill = parseRfqPrefill(query);
      assert.deepEqual(prefill, { product: "coffee", range: sku.range, sku: sku.code, intent });
      const parsed = rfqSchema.safeParse({
        ...prefill, model: "bulk", volume: "1 t", country: "Japan", name: "A", company: "B", email: "a@example.com", consent: true,
      });
      assert.ok(parsed.success, `${sku.code} ${intent}`);
    }
  }
  for (const range of CATALOG_RANGES) {
    const prefill = parseRfqPrefill(rfqHref({ family: range.family, range: range.id, intent: "spec-sheet" }).query);
    assert.equal(prefill.range, range.id);
  }
});

test("no Product/Offer/rating schema anywhere in the source", () => {
  const files: string[] = [];
  const walk = (d: string) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(ts|tsx)$/.test(e.name)) files.push(p);
  });
  walk("src");
  for (const f of files) {
    const src = fs.readFileSync(f, "utf8");
    assert.doesNotMatch(src, /"@type":\s*"(Product|Offer|AggregateOffer|AggregateRating|Review)"/, f);
  }
});
