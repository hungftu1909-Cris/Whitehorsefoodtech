// About narrative (EN/VI parity and truth labels) and family imagery.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import en from "../messages/en.json" with { type: "json" };
import vi from "../messages/vi.json" with { type: "json" };
import { ABOUT_MOSAIC_FAMILIES, FAMILY_MEDIA, familyMedia } from "../src/lib/media-manifest.ts";
import type { FamilySlug } from "../src/lib/catalog.ts";
import { PRODUCT_CATEGORIES } from "../src/lib/nav.ts";

type About = typeof en.about;
const ABOUT_PAGE = fs.readFileSync("src/app/[locale]/about/page.tsx", "utf8");
const PROVENANCE = fs.readFileSync("docs/asset-provenance.md", "utf8");

// ------------------------------------------------------------------ About

test("About has every narrative section in EN and VI with the brief's structure", () => {
  for (const [locale, about] of [["en", en.about], ["vi", vi.about]] as [string, About][]) {
    for (const key of ["hero", "thesis", "bottlenecks", "role", "control", "mission", "vision", "direction", "ecosystem", "cta"] as const) {
      assert.ok(about[key], `${locale}: about.${key}`);
    }
    assert.equal(about.bottlenecks.items.length, 6, `${locale}: six bottlenecks`);
    assert.equal(about.role.capabilities.length, 4, `${locale}: four capabilities`);
    assert.equal(about.control.steps.length, 6, `${locale}: six control points`);
    assert.equal(about.vision.roles.length, 4, `${locale}: four long-term roles`);
    for (const k of ["ctaProducts", "ctaRfq", "mosaicLabel"] as const) assert.ok(about.hero[k].trim(), `${locale}: hero.${k}`);
    for (const k of ["buyerCta", "supplierCta"] as const) assert.ok(about.cta[k].trim(), `${locale}: cta.${k}`);
  }
});

test("About uses the approved headline, mission, vision and closing copy", () => {
  assert.equal(vi.about.hero.title, "Nâng chuẩn nguyên liệu Việt cho chuỗi giá trị toàn cầu.");
  assert.equal(en.about.hero.title, "Raising the standard of Vietnamese ingredients for global value chains.");
  assert.match(vi.about.hero.subtitle, /^Whitehorse Foodtech đang xây dựng nền tảng nguyên liệu B2B/);
  assert.match(en.about.hero.subtitle, /^Whitehorse Foodtech is building a premium B2B ingredient platform/);
  assert.equal(vi.about.bottlenecks.title, "Tiềm năng lớn. Giá trị giữ lại còn hạn chế.");
  assert.deepEqual(vi.about.bottlenecks.items.map((i) => i.title), [
    "Công nghệ sau thu hoạch",
    "R&D và phát triển ứng dụng",
    "Tiêu chuẩn và hồ sơ chất lượng",
    "Thương hiệu nguyên liệu",
    "Mạng lưới tiếp cận thị trường",
    "Doanh nghiệp nền tảng",
  ]);
  assert.deepEqual(en.about.role.capabilities.map((i) => i.title), [
    "Curated Supply",
    "Application-led Products",
    "Quality & Product Intelligence",
    "Market Connection",
  ]);
  assert.deepEqual(vi.about.control.steps.map((s) => s.title), [
    "Vùng nguyên liệu", "Thu mua", "Chế biến", "Kiểm nghiệm", "Hồ sơ lô hàng", "Phản hồi và cải tiến",
  ]);
  assert.match(vi.about.mission.body, /được lựa chọn vì giá trị — không chỉ vì xuất xứ\.$/);
  assert.match(en.about.mission.body, /chosen for their value—not only their origin\.$/);
  assert.match(vi.about.vision.body, /^Trở thành nền tảng nguyên liệu cao cấp của Việt Nam/);
  assert.deepEqual(en.about.vision.roles.map((r) => r.title), [
    "Premium Ingredient Platform",
    "Deep-processing Technology Layer",
    "Vietnamese Agricultural Value-chain Architect",
    "Bridge to Global Ingredient Markets",
  ]);
  assert.equal(vi.about.cta.title, "Bắt đầu từ một yêu cầu nguyên liệu cụ thể.");
});

test("About keeps its truth boundaries", () => {
  for (const about of [en.about, vi.about]) {
    // QA/QC is being built, not a current guarantee.
    assert.match(about.control.body, /progressively building|đang từng bước xây dựng/);
    // Vision figures appear only in the tagged status items (about.status).
    const rendered = Object.fromEntries(Object.entries(about).filter(([key]) => key !== "status"));
    assert.doesNotMatch(JSON.stringify(rendered), /(3[.,]000|10[.,]000)\+/);
    // Nothing claims to remove every intermediary.
    assert.doesNotMatch(JSON.stringify(rendered), /every intermediar|all intermediar|mọi (tầng )?trung gian|loại bỏ (hoàn toàn )?trung gian/i);
  }
  assert.doesNotMatch(ABOUT_PAGE, /StatusMarkers|about\.jpg|factory\.jpg/);
  assert.match(ABOUT_PAGE, /href: "\/rfq"/, "buyer CTA goes to RFQ");
  assert.match(ABOUT_PAGE, /href: "\/suppliers\/apply"/, "supplier CTA goes to the localized registration route");
  assert.equal((ABOUT_PAGE.match(/<h1\b/g) ?? []).length, 1, "one h1");
});

// ---------------------------------------------------------------- imagery

test("every family has a keyed highlight slot with EN/VI alt text", () => {
  assert.deepEqual(Object.keys(FAMILY_MEDIA).sort(), PRODUCT_CATEGORIES.map((c) => c.slug).sort());
  for (const family of Object.keys(FAMILY_MEDIA) as FamilySlug[]) {
    for (const image of familyMedia(family)) {
      assert.ok(image.alt.en.trim() && image.alt.vi.trim(), `${family} alt`);
      assert.ok(image.src.startsWith("/images/catalog/"), `${family} lives under /images/catalog`);
    }
  }
  assert.deepEqual([...ABOUT_MOSAIC_FAMILIES].sort(), PRODUCT_CATEGORIES.map((c) => c.slug).sort(), "About mosaic shows all five families");
  assert.equal(ABOUT_MOSAIC_FAMILIES[1], "birds-nest", "bird's nest sits in the top row");
});

test("every family leads with an editorial image; second views are genuine or absent", () => {
  for (const family of Object.keys(FAMILY_MEDIA) as FamilySlug[]) {
    const [first, second] = familyMedia(family);
    assert.equal(first.kind, "editorial", `${family} leads with an editorial image`);
    if (second) assert.notEqual(second.sourceFile, first.sourceFile, `${family} second view is a different photograph`);
  }
  assert.equal(familyMedia("coconut")[1].kind, "concept-pack");
  assert.equal(familyMedia("birds-nest")[1].kind, "concept-pack");
  // Their only other family image on disk is the same photograph re-cropped.
  assert.equal(familyMedia("fruit").length, 1);
  assert.equal(familyMedia("nuts-spices-botanicals").length, 1);
});

test("family images on disk are optimised and have provenance", () => {
  for (const image of (Object.keys(FAMILY_MEDIA) as FamilySlug[]).flatMap(familyMedia)) {
    const file = path.join("public", image.src);
    assert.ok(fs.existsSync(file), `${image.src} missing`);
    assert.ok(fs.statSync(file).size < 400 * 1024, `${image.src} not optimised`);
    assert.ok(PROVENANCE.includes(image.src.replace(/^\//, "public/")), `${image.src} not in asset-provenance.md`);
  }
});

test("About keeps one concise request-specific image caption", () => {
  assert.match(ABOUT_PAGE, /showBadge=\{false\}/);
  assert.match(ABOUT_PAGE, /<figcaption[\s\S]*?t\("hero\.imageCaption"\)/);
  assert.match(en.about.hero.imageCaption, /Ingredient-family imagery.*confirmed per request/);
  assert.match(vi.about.hero.imageCaption, /Hình ảnh theo nhóm nguyên liệu.*xác nhận theo từng yêu cầu/);
  for (const f of ["src/app/[locale]/products/page.tsx", "src/app/[locale]/products/[slug]/page.tsx", "src/components/home/products-preview.tsx"]) {
    assert.doesNotMatch(fs.readFileSync(f, "utf8"), /showBadge/, f);
  }
});

test("About lead is tightened but keeps the thesis", () => {
  const words = (s: string) => s.trim().split(/\s+/).length;
  assert.ok(words(en.about.hero.subtitle) <= 36, `EN lead ${words(en.about.hero.subtitle)} words`);
  assert.ok(words(vi.about.hero.subtitle) <= 58, `VI lead ${words(vi.about.hero.subtitle)} words`);
  assert.match(en.about.hero.subtitle, /farmers and processors more directly/);
  assert.match(vi.about.hero.subtitle, /trực tiếp hơn nông hộ và nhà máy chế biến/);
});

test("only concept packaging keeps a visible image label", () => {
  assert.equal("editorialBadge" in en.catalog, false);
  assert.equal("editorialBadge" in vi.catalog, false);
  assert.equal("studioBadge" in en.products, false);
  assert.equal("studioBadge" in vi.products, false);
  assert.equal("studioNote" in en.products, false);
  assert.equal("studioNote" in vi.products, false);
  assert.equal(en.catalog.conceptPackBadge, "Concept packaging");
  assert.equal(vi.catalog.conceptPackBadge, "Bao bì ý tưởng");
  assert.match(en.catalog.conceptPackNote, /Not a photograph of stock/);
  assert.match(vi.catalog.conceptPackNote, /Không phải ảnh chụp hàng có sẵn/);
});

test("no retired concept-art paths or labels in user-facing code", () => {
  const files: string[] = [];
  const walk = (d: string) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(ts|tsx|json|mdx)$/.test(e.name)) files.push(p);
  });
  ["src", "messages", "content"].forEach(walk);
  for (const f of files) {
    const src = fs.readFileSync(f, "utf8");
    assert.doesNotMatch(src, /\/images\/products\/|images\/(about|factory)\.jpg|-card\.jpg|-detail\.jpg/, f);
    assert.doesNotMatch(src, /Concept artwork|Hình minh họa ý tưởng|artworkBadge|artworkAlt|artworkNote/, f);
  }
});
