import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("approved brochure is a real public PDF and company profile stays gated", () => {
  const brochure = "public/documents/whitehorse-foodtech-brochure.pdf";
  assert.ok(fs.existsSync(brochure), "brochure is published under /public/documents");
  const handle = fs.openSync(brochure, "r");
  const signature = Buffer.alloc(5);
  fs.readSync(handle, signature, 0, signature.length, 0);
  fs.closeSync(handle);
  assert.equal(signature.toString("ascii"), "%PDF-");

  const component = fs.readFileSync("src/components/sections/commercial-documents.tsx", "utf8");
  assert.match(component, /hasPublicFile\(COMPANY_PROFILE_PATH\)/, "profile link depends on the approved file existing");
  assert.match(component, /aria-disabled="true"/, "missing profile has an explicit non-clickable state");
});

test("commercial documents are discoverable from products, footer and sitemap", () => {
  assert.match(fs.readFileSync("src/app/[locale]/products/page.tsx", "utf8"), /<CommercialDocuments/);
  assert.match(fs.readFileSync("src/components/layout/site-footer.tsx", "utf8"), /href: "\/documents"/);
  assert.match(fs.readFileSync("src/app/sitemap.ts", "utf8"), /"\/documents"/);
});
