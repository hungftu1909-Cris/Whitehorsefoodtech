import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { PACKAGING_CHANNELS, PACKAGING_STRUCTURES } from "../src/lib/packaging.ts";
import { PRODUCT_CATEGORIES } from "../src/lib/nav.ts";

test("packaging architecture publishes the complete reference framework", () => {
  assert.equal(PACKAGING_STRUCTURES.length, 27);
  assert.equal(PACKAGING_CHANNELS.length, 4);
  assert.equal(new Set(PACKAGING_STRUCTURES.map((structure) => structure.code)).size, 27);
  assert.deepEqual(
    PACKAGING_CHANNELS.map((channel) => channel.id),
    ["sample", "professional", "retail", "industrial"]
  );
});

test("every structure is bilingual, scoped and mapped", () => {
  const validFamilies = new Set<string>(PRODUCT_CATEGORIES.map((category) => category.slug));
  const validChannels = new Set(PACKAGING_CHANNELS.map((channel) => channel.id));
  for (const structure of PACKAGING_STRUCTURES) {
    assert.match(structure.code, /^S\d{2}$/);
    assert.ok(structure.name.en.trim() && structure.name.vi.trim());
    assert.ok(structure.dimensions.trim());
    assert.ok(structure.fill.en.trim() && structure.fill.vi.trim());
    assert.ok(structure.channels.length && structure.channels.every((channel) => validChannels.has(channel)));
    assert.ok(structure.families.length && structure.families.every((family) => validFamilies.has(family)));
  }
});

test("all five families are covered and the downloadable source exists", () => {
  const covered = new Set<string>(PACKAGING_STRUCTURES.flatMap((structure) => structure.families));
  for (const family of PRODUCT_CATEGORIES.map((category) => category.slug)) {
    assert.ok(covered.has(family), `${family} has at least one structure`);
  }
  assert.ok(fs.existsSync("public/documents/whitehorse-foodtech-packaging-architecture.pdf"));
});
