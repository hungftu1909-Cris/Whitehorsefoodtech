// Counter removal, placeholder cleanup and SEO serialization guards.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { serializeJsonLd } from "../src/lib/json-ld.ts";
import { buildRfqEmail, escapeHtml } from "../src/lib/lead-email.ts";
import type { RfqInput } from "../src/lib/validations.ts";
import fixture from "./fixtures/rfq-valid.json" with { type: "json" };

function sourceFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    return e.isDirectory() ? sourceFiles(full) : /\.(ts|tsx)$/.test(e.name) ? [full] : [];
  });
}

test("the count-up counter is gone (it server-rendered 0 / 0K+ / 0.000+)", () => {
  assert.equal(fs.existsSync("src/components/ui/animated-counter.tsx"), false);
  const users = sourceFiles("src").filter((f) => /AnimatedCounter|animated-counter/.test(fs.readFileSync(f, "utf8")));
  assert.deepEqual(users, []);
});

test("no public 'photo needed' placeholder panels remain", () => {
  assert.equal(fs.existsSync("src/components/ui/image-placeholder.tsx"), false);
  const users = sourceFiles("src").filter((f) => /ImagePlaceholder|placeholderLabel/.test(fs.readFileSync(f, "utf8")));
  assert.deepEqual(users, []);
});

test("claim-bearing artwork (about.jpg, factory.jpg) is not rendered anywhere", () => {
  // Their artwork itself shows unsupported claims (3,000+ cooperatives,
  // hundreds of factories, a Whitehorse-branded plant) that no text scan
  // can see — see docs/claim-registry.md row 15.
  const users = sourceFiles("src").filter((f) => /images\/(about|factory)\.jpg/.test(fs.readFileSync(f, "utf8")));
  assert.deepEqual(users, []);
});

test("family visuals carry a VISIBLE editorial/studio label everywhere they render", () => {
  // Alt text alone is not a disclosure a sighted buyer sees.
  const renders = sourceFiles("src").filter((f) => /<FamilyVisual\b/.test(fs.readFileSync(f, "utf8")));
  assert.deepEqual(renders.sort(), [
    path.join("src", "app", "[locale]", "about", "page.tsx"),
    path.join("src", "app", "[locale]", "products", "[slug]", "page.tsx"),
    path.join("src", "app", "[locale]", "products", "page.tsx"),
    path.join("src", "components", "home", "products-preview.tsx"),
  ].sort());
  for (const f of renders) {
    const src = fs.readFileSync(f, "utf8");
    assert.match(src, /editorial: tc(at)?\("editorialBadge"\)|editorialBadge/, `${f} passes the editorial label`);
    assert.match(src, /studio: tp?\("studioBadge"\)/, `${f} passes the studio label`);
  }
  const visual = fs.readFileSync("src/components/catalog/family-visual.tsx", "utf8");
  assert.match(visual, /<ImageBadge>\{image\.kind === "studio" \? labels\.studio : labels\.editorial\}<\/ImageBadge>/);
  assert.match(visual, /object-cover/);
  const detail = fs.readFileSync("src/app/[locale]/products/[slug]/page.tsx", "utf8");
  assert.match(detail, /studioNote/, "detail page explains the studio representation");
  assert.match(detail, /<FamilyVisual[\s\S]*?priority/, "detail hero image has priority");
});

test("hero copy is server-visible (not wrapped in <Reveal>)", () => {
  const hero = fs
    .readFileSync("src/components/home/hero.tsx", "utf8")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "") // JSX comments may mention <Reveal>
    .replace(/\/\/.*$/gm, "");
  const h1 = hero.indexOf("<h1");
  const lastRevealOpen = hero.lastIndexOf("<Reveal", h1);
  const lastRevealClose = hero.lastIndexOf("</Reveal>", h1);
  assert.ok(lastRevealOpen === -1 || lastRevealClose > lastRevealOpen, "H1 must not sit inside <Reveal>");
  const layout = fs.readFileSync("src/app/[locale]/layout.tsx", "utf8");
  assert.match(layout, /<noscript>/);
});

test("JSON-LD serialization cannot close its <script> tag", () => {
  const out = serializeJsonLd({ description: "</script><script>alert(1)</script>" });
  assert.doesNotMatch(out, /</);
  assert.deepEqual(JSON.parse(out), { description: "</script><script>alert(1)</script>" });
});

test("RFQ email escapes buyer input and keeps the subject on one line", () => {
  const { subject, html } = buildRfqEmail(
    { ...(fixture as unknown as RfqInput), company: "Evil\r\nBcc: x@example.com", consent: true },
    "RFQ-20260927-ABCDEF"
  );
  assert.doesNotMatch(subject, /[\r\n]/);
  assert.match(subject, /^\[RFQ\]\[sample\]\[Coffee Ingredients \/ WHCF007\]\[Germany\]/);
  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /&lt;script&gt;/);
  assert.equal(escapeHtml(`<a href="x">'&`), "&lt;a href=&quot;x&quot;&gt;&#39;&amp;");
});
