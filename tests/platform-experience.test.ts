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

test("network gives buyers and Vietnamese suppliers equal entry paths", () => {
  const network = fs.readFileSync("src/app/[locale]/clients/page.tsx", "utf8");
  const contact = fs.readFileSync("src/app/[locale]/contact/page.tsx", "utf8");
  const contactForm = fs.readFileSync("src/components/forms/contact-form.tsx", "utf8");

  assert.match(network, /buyerAction[\s\S]*href: "#join-network"/);
  assert.match(network, /supplierAction[\s\S]*href: "\/suppliers\/apply"/);
  assert.match(network, /href: "\/rfq"/);
  assert.match(network, /distributionCta/);
  assert.match(network, /topic: "distribution"/);
  assert.match(network, /<SplitCta/);
  assert.match(contact, /topic === "distribution"/);
  assert.match(contact, /distributionPrefill/);
  assert.match(contactForm, /defaultMessage/);
});

test("quality page presents the phased digital supply-chain architecture", () => {
  const quality = fs.readFileSync("src/app/[locale]/certifications/page.tsx", "utf8");
  const home = fs.readFileSync("src/components/home/platform-map.tsx", "utf8");

  assert.match(quality, /technology\.layers/);
  assert.match(quality, /technology\.backboneNodes/);
  assert.match(quality, /technology\.statusLabels/);
  assert.match(quality, /snap-x/);
  assert.match(quality, /BrainCircuit/);
  assert.match(home, /technology\.nodes/);
  assert.match(home, /technology\.ai/);
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
  assert.match(gateway, /localStorage\?\.setItem/);
  assert.match(gateway, /catch \{/);
  assert.match(supplier, /siteConfig\.zalo/);
});

test("homepage tells the platform story in order, with the operating standard before the catalogue", () => {
  const home = fs.readFileSync("src/app/[locale]/page.tsx", "utf8");
  const order = ["<Hero", "<OperatingSystem", "<ProofStrip", "<ProductsPreview", "<EvidenceLayer", "<PlatformMap", "<SplitCta"];
  const positions = order.map((marker) => home.indexOf(marker));
  for (const [i, pos] of positions.entries()) assert.ok(pos > -1, `homepage renders ${order[i]}`);
  assert.deepEqual([...positions].sort((a, b) => a - b), positions, "homepage section order");
});

test("hero is platform-level: one dominant network image, one inset, captioned, and a current capability", async () => {
  const hero = fs.readFileSync("src/components/home/hero.tsx", "utf8");
  assert.doesNotMatch(hero, /images\/catalog\//, "no single product family leads the hero");
  for (const src of ["quality-processing.webp", "network-air-freight.webp"]) {
    assert.ok(hero.includes(src), `hero uses ${src}`);
  }
  assert.doesNotMatch(hero, /coffee-harvest|images\/[^"]*coffee/i, "no coffee-family visual in the hero");
  assert.doesNotMatch(hero, /process-partner-facility/, "no third-party-branded facility image");
  assert.doesNotMatch(hero, /border-\[\d+px\]/, "inset uses a 1px rule, not a thick frame");
  assert.match(hero, /href="\/products"\s+className="[^"]*min-h-11/, "secondary CTA is at least 44px tall");
  assert.match(hero, /t\("imageCaptionMobile"\)[\s\S]*<\/figcaption>\s*<\/figure>/, "mobile caption sits in the figure under the image");
  const en = (await import("../messages/en.json", { with: { type: "json" } })).default;
  const vi = (await import("../messages/vi.json", { with: { type: "json" } })).default;
  for (const catalog of [en, vi]) {
    assert.doesNotMatch(JSON.stringify(catalog.home.hero.images), /coffee|cà phê/i, "hero alt text names no coffee visual");
    assert.match(catalog.home.hero.imageCaption, /Whitehorse/, "non-ownership disclosure stays visible");
    assert.match(catalog.home.hero.imageCaptionMobile, /Whitehorse/, "mobile disclosure stays visible");
  }
  assert.equal((hero.match(/<Image\b/g) ?? []).length, 2, "one dominant image and at most one inset");
  assert.doesNotMatch(hero, /\.label\}/, "no category badges over the crops");
  assert.match(hero, /t\("imageCaption"\)/);
  assert.match(hero, /t\("standard\.status"\)/);
  assert.doesNotMatch(hero, /CircleDashed|t\("building"\)/, "no building-status card in the hero");
  assert.match(hero, /PRODUCT_CATEGORIES\.map/);
  assert.match(hero, /CUSTOM_SOURCING_HREF/);
  assert.equal((hero.match(/^\s+priority\s*$/gm) ?? []).length, 1, "one priority image");
  assert.doesNotMatch(hero, /"use client"/);
});

test("current portfolio gives every collection equal weight plus a custom-sourcing path", () => {
  const preview = fs.readFileSync("src/components/home/products-preview.tsx", "utf8");
  const family = fs.readFileSync("src/app/[locale]/products/[slug]/page.tsx", "utf8");
  for (const source of [preview, family]) assert.doesNotMatch(source, /=== "coffee"/, "no coffee-only accent treatment");
  assert.doesNotMatch(preview, /col-span/, "no family card is larger than another");
  assert.match(preview, /PRODUCT_CATEGORIES\.map/);
  assert.match(preview, /href=\{CUSTOM_SOURCING_HREF\}/);
  assert.match(preview, /id="custom-sourcing"/);
  for (const nav of ["src/components/layout/site-header.tsx", "src/components/layout/mobile-nav.tsx"]) {
    const source = fs.readFileSync(nav, "utf8");
    assert.match(source, /CUSTOM_SOURCING_HREF/);
    assert.match(source, /currentPortfolio/);
  }
});

test("custom-sourcing links prefill the RFQ as another ingredient and unknown params stay ignored", async () => {
  const { CUSTOM_SOURCING_HREF } = await import("../src/lib/nav.ts");
  const { parseRfqPrefill } = await import("../src/lib/validations.ts");
  assert.equal(CUSTOM_SOURCING_HREF.pathname, "/rfq");
  assert.deepEqual(parseRfqPrefill(CUSTOM_SOURCING_HREF.query), { product: "other", intent: "quote" });
  assert.deepEqual(parseRfqPrefill({ product: "tea", utm_source: "x", intent: "nonsense" }), {});
});

test("homepage technology layers carry the same truthful statuses as the Quality page", async () => {
  const en = (await import("../messages/en.json", { with: { type: "json" } })).default;
  const vi = (await import("../messages/vi.json", { with: { type: "json" } })).default;
  for (const catalog of [en, vi]) {
    const home = catalog.home.platform.technology.nodes.map((node: { status: string }) => node.status);
    const quality = catalog.certifications.technology.layers.map((layer: { status: string }) => layer.status);
    assert.deepEqual(home, quality);
    assert.deepEqual(Object.keys(catalog.home.platform.statusLabels), ["current", "building", "roadmap"]);
  }
});

test("audience gateway is a platform entry with a current-proof line", () => {
  const gateway = fs.readFileSync("src/components/layout/audience-gateway.tsx", "utf8");
  assert.match(gateway, /Enter the Whitehorse platform/);
  assert.match(gateway, /Premium ingredients from Vietnam\. One qualified supply workflow\./);
  assert.match(gateway, /Global buyers/);
  assert.match(gateway, /Nhà cung cấp Việt Nam/);
  assert.match(gateway, /29 defined core SKUs · 50\+ screened suppliers · 10\+ market relationships/);
  assert.match(gateway, /Zalo/);
});

test("evidence section is image-free and does not repeat the hero image", () => {
  const evidence = fs.readFileSync("src/components/home/evidence-layer.tsx", "utf8");
  assert.doesNotMatch(evidence, /<Image\b|\.webp|\.jpg/);
});

test("homepage refinement: quiet actions, readable labels and no card grids", () => {
  const files = [
    ...fs.readdirSync("src/components/home").map((f) => `src/components/home/${f}`).filter((f) => !f.endsWith("value-proposition.tsx")),
    "src/components/sections/split-cta.tsx",
    "src/components/layout/floating-cta-bar.tsx",
    "src/components/layout/audience-gateway.tsx",
  ];
  for (const file of files) {
    const source = fs.readFileSync(file, "utf8");
    assert.doesNotMatch(source, /\bArrow(Right|UpRight)\b/, `${file}: no decorative arrows on actions`);
    assert.doesNotMatch(source, /text-\[0\.[0-6]\d*rem\]/, `${file}: labels are at least 12px`);
  }
  for (const section of ["operating-system", "evidence-layer", "platform-map", "products-preview", "proof-strip"]) {
    const source = fs.readFileSync(`src/components/home/${section}.tsx`, "utf8");
    assert.doesNotMatch(source, /rounded-xl|rounded-full[^"]*px-|shadow-\[/, `${section}: no card, pill or shadow treatment`);
  }
  assert.match(fs.readFileSync("src/components/home/products-preview.tsx", "utf8"), /showCounter=\{false\}/);
});

test("luminous direction: the default homepage is light, not a dark editorial surface", () => {
  const hero = fs.readFileSync("src/components/home/hero.tsx", "utf8");
  assert.match(hero, /<section className="bg-luminous\b/, "hero opens on the luminous paper surface");
  assert.doesNotMatch(hero, /from-deep|from-primary\/|bg-gradient-to-/, "no darkening overlay on the hero photograph");
  assert.match(fs.readFileSync("src/app/globals.css", "utf8"), /\.bg-luminous \{/);

  const homeSurfaces = [
    ...fs.readdirSync("src/components/home").map((f) => `src/components/home/${f}`),
    "src/components/sections/split-cta.tsx",
  ];
  for (const file of homeSurfaces) {
    const source = fs.readFileSync(file, "utf8");
    // Forest stays for solid primary actions; it is not a section or plate surface.
    assert.doesNotMatch(source, /\bbg-deep\b|<section[^>]*\bbg-primary\b|"bg-primary text-primary-foreground"/, `${file}: no dark band on the homepage`);
  }

  const layout = fs.readFileSync("src/app/[locale]/layout.tsx", "utf8");
  assert.match(layout, /defaultTheme="light"/, "first visit is light regardless of OS preference");
  assert.doesNotMatch(layout, /defaultTheme="system"|\benableSystem\s/, "OS dark mode does not darken the default experience");
});

test("final refinement: content-first mobile hero, neutral family order, accessible touch targets", async () => {
  const hero = fs.readFileSync("src/components/home/hero.tsx", "utf8");
  // Below lg the headline and primary action precede the photograph and its disclosure.
  const h1 = hero.indexOf("<h1");
  const cta = hero.indexOf('t("ctaPrimary")');
  const figure = hero.indexOf("<figure");
  assert.ok(h1 > -1 && cta > h1 && figure > cta, "h1 → primary CTA → figure in source order");
  assert.match(hero, /<figure className="[^"]*lg:absolute/, "figure leaves the flow from lg");
  assert.match(hero, /max-w-7xl[^"]*lg:static/, "desktop figure is positioned against the section");

  const { PRODUCT_CATEGORIES } = await import("../src/lib/nav.ts");
  assert.notEqual(PRODUCT_CATEGORIES[0].slug, "coffee", "coffee does not lead hero list, grid, footer or menus");
  const en = (await import("../messages/en.json", { with: { type: "json" } })).default;
  const vi = (await import("../messages/vi.json", { with: { type: "json" } })).default;
  for (const catalog of [en, vi]) {
    const items = catalog.home.productsPreview.items as Record<string, { title: string }>;
    assert.deepEqual(Object.keys(items).sort(), PRODUCT_CATEGORIES.map((c) => c.categoryKey).sort(), "homepage copy keyed per family");
  }
  assert.match(fs.readFileSync("src/components/home/products-preview.tsx", "utf8"), /items\[category\.categoryKey\]/);

  const mobileNav = fs.readFileSync("src/components/layout/mobile-nav.tsx", "utf8");
  assert.match(mobileNav, /aria-label=\{t\("openMenu"\)\}/, "hamburger is labelled as opening the menu");
  assert.equal(en.nav.openMenu, "Open menu");
  assert.equal(vi.nav.openMenu, "Mở menu");
  assert.match(mobileNav, /className="size-11[^"]*xl:hidden"/, "hamburger is 44px");
  for (const file of ["src/components/ui/dialog.tsx", "src/components/ui/sheet.tsx"]) {
    assert.match(fs.readFileSync(file, "utf8"), /absolute top-2 right-2 size-11/, `${file}: close button is 44px`);
  }

  const split = fs.readFileSync("src/components/sections/split-cta.tsx", "utf8");
  assert.doesNotMatch(split, /<p className="mt-auto/, "split CTA bodies start on the same line");
  assert.match(split, /mt-auto flex flex-col gap-3/, "split CTA actions share a baseline");

  const layout = fs.readFileSync("src/app/[locale]/layout.tsx", "utf8");
  assert.match(layout, /<ThemeColor \/>/, "browser chrome follows an explicit dark choice");
});
