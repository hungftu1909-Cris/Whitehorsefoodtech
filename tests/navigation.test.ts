// Header information architecture: fewer top-level items, nothing unreachable.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { BUYER_NAV, COMPANY_NAV, MAIN_NAV, PRODUCT_CATEGORIES, SUPPLIER_HREF } from "../src/lib/nav.ts";
import en from "../messages/en.json" with { type: "json" };
import vi from "../messages/vi.json" with { type: "json" };

const header = fs.readFileSync("src/components/layout/site-header.tsx", "utf8");
const mobile = fs.readFileSync("src/components/layout/mobile-nav.tsx", "utf8");

test("every existing page stays reachable from the consolidated header and mobile menu", () => {
  const menuHrefs = new Set(["/products", ...BUYER_NAV.map((i) => i.href), ...COMPANY_NAV.map((i) => i.href)]);
  for (const item of MAIN_NAV) assert.ok(menuHrefs.has(item.href), `${item.href} is in the header or company menu`);
  for (const source of [header, mobile]) {
    assert.match(source, /BUYER_NAV\.map/);
    assert.match(source, /COMPANY_NAV\.map/);
    assert.match(source, /PRODUCT_CATEGORIES\.map/);
    assert.match(source, /href="\/packaging"/);
    assert.match(source, /href="\/rfq"/);
    assert.match(source, /href=\{SUPPLIER_HREF\}/);
  }
  assert.equal(SUPPLIER_HREF, "/suppliers/apply");
  assert.ok(PRODUCT_CATEGORIES.length === 5);
});

test("header labels, language names and skip link exist in EN and VI", () => {
  for (const nav of [en.nav, vi.nav]) {
    for (const key of ["company", "qualityShort", "forSuppliers", "language", "allProducts", "skipToContent", "closeMenu"] as const) {
      assert.ok(String(nav[key]).trim(), key);
    }
    assert.deepEqual(nav.localeNames, { en: "English", vi: "Tiếng Việt" });
  }
  assert.match(fs.readFileSync("src/components/layout/locale-switcher.tsx", "utf8"), /role="group" aria-label=\{t\("language"\)\}/);
  assert.match(fs.readFileSync("src/app/[locale]/layout.tsx", "utf8"), /href="#main-content"[\s\S]*id="main-content"/);
});
