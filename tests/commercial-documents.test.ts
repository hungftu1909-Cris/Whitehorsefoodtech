import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("approved brochure and packaging architecture are real public PDFs while company profile stays gated", () => {
  for (const document of [
    "public/documents/whitehorse-foodtech-brochure.pdf",
    "public/documents/whitehorse-foodtech-packaging-architecture.pdf",
  ]) {
    assert.ok(fs.existsSync(document), `${document} is published`);
    const handle = fs.openSync(document, "r");
    const signature = Buffer.alloc(5);
    fs.readSync(handle, signature, 0, signature.length, 0);
    fs.closeSync(handle);
    assert.equal(signature.toString("ascii"), "%PDF-");
  }

  const component = fs.readFileSync("src/components/sections/commercial-documents.tsx", "utf8");
  assert.match(component, /hasPublicFile\(COMPANY_PROFILE_PATH\)/, "profile link depends on the approved file existing");
  assert.match(component, /aria-disabled="true"/, "missing profile has an explicit non-clickable state");
});

test("commercial documents are discoverable from products, footer and sitemap", () => {
  assert.match(fs.readFileSync("src/app/[locale]/products/page.tsx", "utf8"), /<CommercialDocuments/);
  assert.match(fs.readFileSync("src/components/layout/site-footer.tsx", "utf8"), /href: "\/documents"/);
  assert.match(fs.readFileSync("src/components/layout/site-footer.tsx", "utf8"), /href: "\/packaging"/);
  assert.match(fs.readFileSync("src/app/sitemap.ts", "utf8"), /"\/documents"/);
  assert.match(fs.readFileSync("src/app/sitemap.ts", "utf8"), /"\/packaging"/);
});
