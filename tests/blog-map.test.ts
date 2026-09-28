import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  BLOG_LOCALES,
  buildTranslationMap,
  getAllSlugs,
  getLocaleSwitchMap,
  getPost,
  getPostMeta,
  getTranslatedSlugs,
  getTranslationMap,
} from "../src/lib/blog.ts";
import { localeSwitchPath } from "../src/lib/locale-switch.ts";

test("BLOG_LOCALES matches the i18n routing locales", () => {
  const routing = fs.readFileSync("src/i18n/routing.ts", "utf8");
  const locales = routing.match(/locales:\s*\[([^\]]*)\]/)?.[1];
  assert.ok(locales, "could not read locales from routing.ts");
  assert.deepEqual(
    [...locales.matchAll(/"(\w+)"/g)].map((m) => m[1]),
    [...BLOG_LOCALES]
  );
});

test("every post in every locale has a matching translation", () => {
  const map = getTranslationMap();
  const groups = Object.entries(map);
  assert.equal(groups.length, 9, "expected 9 EN/VI article pairs");
  for (const [key, group] of groups) {
    for (const locale of BLOG_LOCALES) {
      const slug = group[locale];
      assert.ok(slug, `translationKey "${key}" has no ${locale} version`);
      assert.ok(getPostMeta(locale, slug), `${locale}/${slug} does not exist`);
    }
  }
  const total = BLOG_LOCALES.reduce((n, l) => n + getAllSlugs(l).length, 0);
  assert.equal(total, 18, "every post file belongs to a pair");
});

test("the removed example article stays removed", () => {
  for (const locale of BLOG_LOCALES) {
    assert.equal(getPost(locale, "understanding-incoterms-for-agri-exports"), null);
  }
});

test("known pair resolves both ways", () => {
  assert.deepEqual(getTranslatedSlugs("vi", "trien-vong-thi-truong-ca-phe-2026"), {
    en: "coffee-market-outlook-2026",
    vi: "trien-vong-thi-truong-ca-phe-2026",
  });
  assert.equal(getLocaleSwitchMap("en")["coffee-market-outlook-2026"]?.vi, "trien-vong-thi-truong-ca-phe-2026");
  assert.deepEqual(getTranslatedSlugs("en", "does-not-exist"), {});
});

test("posts without translationKey get their own single-locale group", () => {
  const map = buildTranslationMap([
    { locale: "en", slug: "a", translationKey: "k" },
    { locale: "vi", slug: "b", translationKey: "k" },
    { locale: "en", slug: "solo" },
  ]);
  assert.deepEqual(map.k, { en: "a", vi: "b" });
  assert.deepEqual(map["en:solo"], { en: "solo" });
});

test("a duplicated translationKey in one locale fails loudly", () => {
  assert.throws(
    () =>
      buildTranslationMap([
        { locale: "en", slug: "a", translationKey: "k" },
        { locale: "en", slug: "b", translationKey: "k" },
      ]),
    /Duplicate blog translationKey/
  );
});

test("blog slugs from the URL cannot escape the content directory", () => {
  assert.equal(getPost("en", "../../package"), null);
  assert.equal(getPost("en", "..%2F..%2Fpackage"), null);
  assert.equal(getPost("en", "Coffee-Market-Outlook-2026"), null);
});

test("locale switcher never targets a missing blog translation", () => {
  const map = { "coffee-market-outlook-2026": { en: "coffee-market-outlook-2026", vi: "trien-vong-thi-truong-ca-phe-2026" }, solo: { en: "solo" } };
  assert.equal(localeSwitchPath("/blog/coffee-market-outlook-2026", "vi", map), "/blog/trien-vong-thi-truong-ca-phe-2026");
  assert.equal(localeSwitchPath("/blog/solo", "vi", map), "/blog");
  assert.equal(localeSwitchPath("/blog/unknown", "vi", map), "/blog");
  assert.equal(localeSwitchPath("/blog", "vi", map), "/blog");
  assert.equal(localeSwitchPath("/products/coffee", "vi", map), "/products/coffee");
  assert.equal(localeSwitchPath("/", "en", map), "/");
});

test("the real switch map round-trips every pair", () => {
  for (const from of BLOG_LOCALES) {
    const map = getLocaleSwitchMap(from);
    for (const slug of getAllSlugs(from)) {
      for (const to of BLOG_LOCALES) {
        const target = localeSwitchPath(`/blog/${slug}`, to, map);
        const targetSlug = target.replace(/^\/blog\/?/, "");
        assert.ok(targetSlug, `${from}/${slug} → ${to} fell back to /blog`);
        assert.ok(getPostMeta(to, targetSlug), `${from}/${slug} → ${to}${target} is a 404`);
      }
    }
  }
});

test("blog dates are real ISO dates (used for sitemap lastModified)", () => {
  for (const locale of BLOG_LOCALES) {
    for (const slug of getAllSlugs(locale)) {
      const date = getPostMeta(locale, slug)!.date;
      assert.match(date, /^\d{4}-\d{2}-\d{2}$/, `${locale}/${slug}`);
      assert.ok(!Number.isNaN(new Date(date).getTime()));
    }
  }
});
