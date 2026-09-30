// Canonical media manifest (src/lib/media-manifest.ts): stable-id keying,
// honest 01/02 pairs, no cross-family or cross-product reuse, and no
// dependence on the order families, ranges or codes are listed in.
import { test } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import {
  FAMILY_MEDIA,
  MEDIA_ASSETS,
  RANGE_MEDIA,
  REJECTED_MEDIA,
  SKU_MEDIA,
  familyMedia,
  rangeMedia,
  resolveSlot,
  sameSourceImage,
  skuMedia,
  type MediaAsset,
  type MediaSlot,
} from "../src/lib/media-manifest.ts";
import {
  CATALOG_RANGES,
  CATALOG_SKUS,
  RANGE_ID_LIST,
  definedCodesFor,
  rangesFor,
  skusFor,
  type FamilySlug,
} from "../src/lib/catalog.ts";
import { PRODUCT_CATEGORIES } from "../src/lib/nav.ts";

const FAMILIES = PRODUCT_CATEGORIES.map((c) => c.slug) as FamilySlug[];

/** Path prefixes an asset of each family may live under. */
const FAMILY_PATHS: Record<FamilySlug, string[]> = {
  coffee: ["/images/catalog/coffee/"],
  coconut: ["/images/catalog/coconut/", "/images/catalog/editorial/coconut-"],
  "birds-nest": ["/images/catalog/birds-nest/", "/images/catalog/editorial/birds-nest-"],
  fruit: ["/images/catalog/fruit/", "/images/catalog/editorial/fruit-"],
  "nuts-spices-botanicals": ["/images/catalog/nuts-spices-botanicals/", "/images/catalog/editorial/nuts-spices-"],
};

type OwnedSlot = { key: string; family: FamilySlug; slot: MediaSlot };
const skuFamily = (code: string) =>
  FAMILIES.find((family) => definedCodesFor(family).includes(code))!;
const ALL_SLOTS: OwnedSlot[] = [
  ...FAMILIES.map((family) => ({ key: `family:${family}`, family, slot: FAMILY_MEDIA[family] })),
  ...CATALOG_RANGES.map((range) => ({ key: `range:${range.id}`, family: range.family, slot: RANGE_MEDIA[range.id] })),
  ...Object.entries(SKU_MEDIA).map(([code, slot]) => ({ key: `sku:${code}`, family: skuFamily(code), slot })),
];

/** Deterministic shuffle (mulberry32) so failures are reproducible. */
function shuffled<T>(items: readonly T[], seed: number): T[] {
  let a = seed >>> 0;
  const rand = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const srcs = (media: MediaAsset[]) => media.map((image) => image.src);

// ------------------------------------------------------------------ coverage

test("every family, range and defined SKU code has exactly one keyed slot", () => {
  assert.deepEqual(Object.keys(FAMILY_MEDIA).sort(), [...FAMILIES].sort());
  assert.deepEqual(Object.keys(RANGE_MEDIA).sort(), [...RANGE_ID_LIST].sort());
  assert.deepEqual(CATALOG_RANGES.map((r) => r.id).sort(), [...RANGE_ID_LIST].sort(), "catalog ranges use the typed id list");
  const codes = FAMILIES.flatMap(definedCodesFor);
  assert.equal(codes.length, 29);
  assert.deepEqual(Object.keys(SKU_MEDIA).sort(), [...codes].sort());
  for (const sku of CATALOG_SKUS) assert.equal(SKU_MEDIA[sku.code].publicPage, true, `${sku.code} has a public page`);
  const publicCodes = Object.entries(SKU_MEDIA).filter(([, slot]) => slot.publicPage).map(([code]) => code);
  assert.deepEqual(publicCodes.sort(), CATALOG_SKUS.map((s) => s.code).sort(), "only codes with pages are marked public");
});

test("slot status matches its images, and every gap is explained", () => {
  for (const { key, slot } of ALL_SLOTS) {
    const expected = slot.image01 ? (slot.image02 ? "verified-pair" : "verified-single") : "missing";
    assert.equal(slot.status, expected, `${key} status`);
    if (!slot.image01) assert.equal(slot.image02, null, `${key}: no image02 without image01`);
    if (slot.status !== "verified-pair") assert.ok(slot.gap?.trim(), `${key} explains its gap`);
    assert.equal(resolveSlot(slot).length, slot.status === "verified-pair" ? 2 : slot.status === "verified-single" ? 1 : 0, `${key} resolves`);
  }
});

// ------------------------------------------------------------------ pairs

test("image01 and image02 are never the same file, bytes or photograph", () => {
  for (const { key, slot } of ALL_SLOTS) {
    if (!slot.image01 || !slot.image02) continue;
    const [a, b] = [MEDIA_ASSETS[slot.image01], MEDIA_ASSETS[slot.image02]];
    assert.notEqual(slot.image01, slot.image02, `${key}: same asset id twice`);
    assert.notEqual(a.src, b.src, `${key}: same file as 01 and 02`);
    assert.notEqual(a.sha256, b.sha256, `${key}: byte-identical 01 and 02`);
    assert.equal(sameSourceImage(a, b), false, `${key}: 01 and 02 are the same source photograph`);
  }
});

test("the resolver refuses a duplicate second view instead of faking a pair", () => {
  const flat = "coffee-photo-flatlay" as const;
  assert.equal(resolveSlot({ image01: flat, image02: flat, status: "verified-pair" }).length, 1);
  assert.equal(resolveSlot({ image01: null, image02: null, status: "missing" }).length, 0);
  assert.equal(resolveSlot(undefined).length, 0);
});

// ------------------------------------------------------------------ ownership

test("no slot uses an image from another family (paths and ownership)", () => {
  for (const { key, family, slot } of ALL_SLOTS) {
    for (const image of resolveSlot(slot)) {
      assert.equal(image.family, family, `${key} uses ${image.id} owned by ${image.family}`);
      assert.ok(FAMILY_PATHS[family].some((prefix) => image.src.startsWith(prefix)), `${key}: cross-family path ${image.src}`);
      for (const other of FAMILIES.filter((f) => f !== family)) {
        assert.ok(!FAMILY_PATHS[other].some((prefix) => image.src.startsWith(prefix)), `${key}: ${image.src} is a ${other} path`);
      }
    }
  }
});

test("packaging renders are only used for the codes printed on them", () => {
  for (const [code, slot] of Object.entries(SKU_MEDIA)) {
    for (const image of resolveSlot(slot)) {
      assert.equal(image.kind, "concept-pack", `${code} shows packs only`);
      assert.deepEqual(image.codes, [code], `${code} uses a pack printed with ${image.codes?.join(", ")}`);
    }
  }
  for (const range of CATALOG_RANGES) {
    for (const image of rangeMedia(range.id).filter((i) => i.kind === "concept-pack")) {
      assert.ok(image.codes?.length, `${range.id}: ${image.id} records its printed codes`);
      assert.ok(image.codes!.every((c) => definedCodesFor(range.family).includes(c)), `${range.id}: ${image.id} prints a code from another family`);
    }
  }
});

test("ranges and codes never reuse the family highlight photograph (or a crop of it)", () => {
  for (const { key, family, slot } of ALL_SLOTS.filter((s) => !s.key.startsWith("family:"))) {
    for (const image of resolveSlot(slot)) {
      for (const highlight of familyMedia(family)) {
        assert.equal(sameSourceImage(image, highlight), false, `${key}: ${image.id} repeats family image ${highlight.id}`);
      }
    }
  }
});

test("rejected files (re-crops of family photos) are never mapped", () => {
  const used = new Set(ALL_SLOTS.flatMap(({ slot }) => srcs(resolveSlot(slot))));
  for (const [src, reason] of Object.entries(REJECTED_MEDIA)) {
    assert.ok(!used.has(src), `${src} is mapped but rejected: ${reason}`);
    assert.ok(fs.existsSync(path.join("public", src)), `${src} listed as rejected but not on disk`);
  }
  assert.ok(Object.values(MEDIA_ASSETS).every((asset) => !(asset.src in REJECTED_MEDIA)));
});

test("manifest pins the exact approved bytes (source images unaltered)", () => {
  for (const asset of Object.values(MEDIA_ASSETS)) {
    const bytes = fs.readFileSync(path.join("public", asset.src));
    assert.equal(crypto.createHash("sha256").update(bytes).digest("hex"), asset.sha256, `${asset.id} bytes changed`);
  }
  const shas = Object.values(MEDIA_ASSETS).map((a) => a.sha256);
  assert.equal(new Set(shas).size, shas.length, "no two assets are byte duplicates");
});

// ------------------------------------------------------------------ pages

/** Everything one page renders, in order. */
function pageMedia(): Record<string, MediaAsset[]> {
  const pages: Record<string, MediaAsset[]> = {
    home: FAMILIES.flatMap(familyMedia),
    about: FAMILIES.flatMap(familyMedia),
    products: FAMILIES.flatMap((family) => rangesFor(family)).flatMap((range) => rangeMedia(range.id)),
  };
  for (const family of FAMILIES) {
    pages[`family:${family}`] = [
      ...familyMedia(family),
      ...skusFor(family).flatMap((sku) => skuMedia(sku.code)),
      ...rangesFor(family).flatMap((range) => rangeMedia(range.id)),
    ];
  }
  for (const sku of CATALOG_SKUS) {
    // Detail page: its own gallery + related code cards.
    const related = skusFor(sku.family).filter((s) => s.code !== sku.code);
    pages[`sku:${sku.code}`] = [...skuMedia(sku.code), ...related.flatMap((s) => skuMedia(s.code))];
  }
  return pages;
}

test("no page shows the same image (or the same photograph) twice", () => {
  for (const [page, media] of Object.entries(pageMedia())) {
    for (let i = 0; i < media.length; i++) {
      for (let j = i + 1; j < media.length; j++) {
        assert.equal(sameSourceImage(media[i], media[j]), false, `${page}: ${media[i].id} and ${media[j].id} repeat one image`);
      }
    }
  }
});

// ------------------------------------------------------------------ order

test("reordering families, ranges and codes never changes image identity", () => {
  const baseline = new Map<string, string[]>([
    ...FAMILIES.map((f) => [`family:${f}`, srcs(familyMedia(f))] as [string, string[]]),
    ...CATALOG_RANGES.map((r) => [`range:${r.id}`, srcs(rangeMedia(r.id))] as [string, string[]]),
    ...CATALOG_SKUS.map((s) => [`sku:${s.code}`, srcs(skuMedia(s.code))] as [string, string[]]),
  ]);
  for (let seed = 1; seed <= 25; seed++) {
    const families = shuffled(PRODUCT_CATEGORIES, seed).map((c) => c.slug as FamilySlug);
    for (const f of families) assert.deepEqual(srcs(familyMedia(f)), baseline.get(`family:${f}`), `seed ${seed}: ${f}`);
    // Same flattening /products uses, over a shuffled family order.
    for (const range of shuffled(families.flatMap((f) => rangesFor(f)), seed * 7)) {
      assert.deepEqual(srcs(rangeMedia(range.id)), baseline.get(`range:${range.id}`), `seed ${seed}: ${range.id}`);
    }
    for (const sku of shuffled(CATALOG_SKUS, seed * 13)) {
      assert.deepEqual(srcs(skuMedia(sku.code)), baseline.get(`sku:${sku.code}`), `seed ${seed}: ${sku.code}`);
    }
  }
});

test("rendering code never picks product images by position or modulo", () => {
  const files = [
    "src/components/catalog/cards.tsx",
    "src/components/catalog/family-visual.tsx",
    "src/components/catalog/dual-image-frame.tsx",
    "src/components/home/products-preview.tsx",
    "src/app/[locale]/products/page.tsx",
    "src/app/[locale]/products/[slug]/page.tsx",
    "src/app/[locale]/products/[slug]/[sku]/page.tsx",
    "src/app/[locale]/about/page.tsx",
    "src/lib/catalog.ts",
    "src/lib/media-manifest.ts",
  ];
  for (const file of files) {
    const source = fs.readFileSync(file, "utf8");
    if (file !== "src/lib/media-manifest.ts") {
      assert.doesNotMatch(source, /["'`]\/images\/catalog\//, `${file} hardcodes a catalog image path`);
    }
    assert.doesNotMatch(source, /\b(images|media|FAMILY_\w+|RANGE_\w+)\s*\[\s*(i|index|idx)\s*[\]%+-]/, `${file} indexes images by position`);
    assert.doesNotMatch(source, /%\s*\w+\.length/, `${file} uses a modulo fallback`);
    assert.doesNotMatch(source, /family-images|RANGE_FALLBACKS|SkuGallery/, `${file} references retired image plumbing`);
  }
  assert.ok(!fs.existsSync("src/lib/family-images.ts"), "old family image map removed");
  assert.ok(!fs.existsSync("src/components/catalog/sku-gallery.tsx"), "manual thumbnail chooser removed");
});

test("single images stay still: controls and motion exist only for a verified second view", () => {
  const frame = fs.readFileSync("src/components/catalog/dual-image-frame.tsx", "utf8");
  assert.match(frame, /images\[1\]\.src !== primary\.src/, "same-file second view is dropped");
  assert.match(frame, /\{secondary && \(\s*<div className="absolute top-2 right-2/, "01 / 02 control renders only with a real second image");
  assert.match(frame, /if \(!secondary \|\| !autoplay \|\| paused \|\| !inView\) return;/, "no timer for single images, when paused or off screen");
  assert.match(frame, /const displayed[^;]*!manual && hovering/, "a manual choice overrides hover; one value drives images, counter and badge");
});

