import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("quality, process and network open with image-led concise platform heroes", () => {
  const expectations = {
    certifications: ["quality-processing.webp", 't("hero.imageNote")'],
    process: ["process-container-loading.webp", "process-partner-facility.webp"],
    clients: ["network-coffee-harvest.webp", "network-air-freight.webp"],
  } as const;

  for (const [route, markers] of Object.entries(expectations)) {
    const source = fs.readFileSync(`src/app/[locale]/${route}/page.tsx`, "utf8");
    assert.match(source, /<PlatformPageHero/);
    for (const marker of markers) assert.ok(source.includes(marker), `${route} includes ${marker}`);
  }
});

test("catalog two-view imagery is shared and touch devices rotate automatically", () => {
  const cards = fs.readFileSync("src/components/catalog/cards.tsx", "utf8");
  const family = fs.readFileSync("src/components/catalog/family-visual.tsx", "utf8");
  const detail = fs.readFileSync("src/app/[locale]/products/[slug]/page.tsx", "utf8");
  const css = fs.readFileSync("src/app/globals.css", "utf8");

  assert.match(cards, /<DualImageFrame/g);
  assert.match(family, /<DualImageFrame/);
  assert.match(detail, /<DualImageFrame/);
  assert.match(css, /@media \(hover: none\)/);
  assert.match(css, /dual-frame-secondary 8s/);
});

test("one-time audience gateway routes buyers to English and suppliers to Vietnamese", () => {
  const gateway = fs.readFileSync("src/components/layout/audience-gateway.tsx", "utf8");
  const layout = fs.readFileSync("src/app/[locale]/layout.tsx", "utf8");
  const supplier = fs.readFileSync("src/app/[locale]/suppliers/apply/page.tsx", "utf8");

  assert.match(layout, /<AudienceGateway/);
  assert.match(gateway, /pathname === "\/"/);
  assert.match(gateway, /href="\/products"[\s\S]*locale="en"/);
  assert.match(gateway, /href="\/suppliers\/apply"[\s\S]*locale="vi"/);
  assert.match(gateway, /localStorage\.setItem/);
  assert.match(supplier, /siteConfig\.zalo/);
});
