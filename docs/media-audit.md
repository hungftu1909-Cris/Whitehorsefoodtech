# Product media audit — 2026-09-30 (updated after owner-source audit)

Branch `feat/platform-repositioning`. Canonical source:
`src/lib/media-manifest.ts` (typed, keyed by family slug / range id / SKU
code). Guard tests: `tests/media-manifest.test.ts`. Inventory tool:
`node scripts/media-inventory.mjs` (path, W×H, bytes, SHA-256, dHash; flags
byte duplicates and near-identical re-crops).

## Root cause of the mixed / duplicated product images

1. **Range padding (commit `0f6f0f1`).** `catalog.ts` padded every range to
   exactly two images with `RANGE_FALLBACKS` (the family's own photos), and
   `tests/catalog.test.ts` *required* two images per range. Result: all six
   coffee range cards showed the same flatlay/spoons pair; freeze-dried
   fruit, frozen purée, nuts, spices and blossom-sugar cards showed the
   family photo as "02"; the bird's-nest OEM card showed a family photo it
   has nothing to do with.
2. **Same photograph as 01 and 02.** `editorial/<family>-real-products.webp`
   and `studio/<family>.jpg` are two encodes of the *same* owner photo
   (asset-provenance lists the same source SHA-256; dHash distance 4–7).
   Fruit and nuts/spices used them as family 01/02, so the "second view"
   was the first view re-cropped. The same pair padded the OEM range.
3. **Shared SKU "02".** Coffee codes used four shared editorial photos as
   their second image (e.g. WHCF004/007/009 all `cups`), so adjacent cards
   crossfaded into the same picture — a family photo presented as a SKU image.
4. **Order change exposed it.** `49f73b6` moved fruit and nuts next to
   coconut on the homepage; image lookup itself was keyed by slug, but the
   fallback typographic panel numbered families by array position, and
   nothing guarded that image identity is independent of order.
5. **Manual chooser.** SKU pages used a thumbnail switcher (`SkuGallery`),
   contrary to the hover / ~8s auto-advance pattern; the touch cycle was 8s
   total (~4s per view).

## What changed

- One manifest; `images` removed from catalog data; `family-images.ts`,
  `RANGE_FALLBACKS`, `RANGE_IMAGES`, `SkuGallery` deleted. `RangeId` is a
  typed union so every range must have a slot.
- image02 only when a verified, *different source* image of that
  family/range/code exists; otherwise one still image or an image-free
  specification plate (`SpecPlate`) — no counter, no crossfade.
- Rejected on disk (kept, never mapped): `studio/{coconut,birds-nest,fruit,nuts-spices-botanicals}.jpg`
  (re-crops of the family photos) and `nuts-spices-botanicals/studio/cashew-kernels-studio.webp`
  (crop of the nuts family photo). `brand/marketing/*` are generated boards
  with baked-in claims — not usable. `public/images/products/*` stay retired.
- Touch devices: 16s cycle = each view ~8s. Desktop: hover/focus only.
- `/products` lists ranges in `PRODUCT_CATEGORIES` family order.

## Audit table

Status: **verified (2)** = two distinct verified images; **verified (1)** =
one image, second missing; **missing** = no verified image — rendered
image-free. All rights: *pending written confirmation* (see
`docs/asset-provenance.md`). Generated from `src/lib/media-manifest.ts`.

### Families

| ID | image01 | image02 | Provenance (source file) | Status |
|---|---|---|---|---|
| coffee | `coffee/coffee-green-roasted-flatlay.jpg` | `coffee/coffee-ground-whole-instant.jpg` | Đề xuất chỉnh sửa Website.docx#word/media/image4.jpg; Đề xuất chỉnh sửa Website.docx#word/media/image1.jpg | **verified (2)** |
| coconut | `editorial/coconut-real-products.webp` | `coconut/packs/coconut-lineup-concept-pack.webp` | owner:Coconut.jpg; 01_category_studio/coconut_lineup_square_3000.jpg | **verified (2)** |
| birds-nest | `editorial/birds-nest-real-products.webp` | `birds-nest/packs/birds-nest-lineup-concept-pack.webp` | owner:Yến.jpg; 01_category_studio/bird_s_nest_lineup_square_3000.jpg | **verified (2)** |
| fruit | `editorial/fruit-real-products.webp` | — | owner:Trái cây.jpg | verified (1) · 02 missing — No second family-level fruit photograph: studio/fruit.jpg re-crops image01; Trái cây 2.png is the source of four fruit range crops; the zip family/line-up renders show 'Buyer sample', jackfruit and pineapple packs outside the brochure register |
| nuts-spices-botanicals | `editorial/nuts-spices-real-products.webp` | `nuts-spices-botanicals/cashew-tree-origin.webp` | owner:Hạt quế hồi.jpg; owner:Ảnh WEB/HẠt điều.jpg | **verified (2)** |

### Ranges

| ID | image01 | image02 | Provenance (source file) | Status |
|---|---|---|---|---|
| coffee-green | `coffee/coffee-green-roasted-ground-bowls.jpg` | — | Đề xuất chỉnh sửa Website.docx#word/media/image3.jpg | verified (1) · 02 missing — One range photograph; the confirmed codes carry their own packs |
| coffee-roasted | `coffee/coffee-roasted-ground-instant-spoons.jpg` | — | Đề xuất chỉnh sửa Website.docx#word/media/image2.jpg | verified (1) · 02 missing — One range photograph; the confirmed codes carry their own packs |
| coffee-soluble | — | — | — | **missing** — The only instant-coffee photograph is the coffee family's second highlight image |
| coffee-extract | — | — | — | **missing** — No extract or concentrate imagery in the repository |
| coffee-cold-brew | — | — | — | **missing** — No range-level cold brew imagery; the WHCF006 can belongs to that code |
| coffee-single-serve | — | — | — | **missing** — No drip-bag, sachet or retail-box imagery in the repository |
| coconut-milk-cream | `coconut/packs/coconut-milk-carton-concept-pack.webp` | `coconut/packs/coconut-cream-bib-concept-pack.webp` | 02_whco001_s12_1_l_professional_front34_2400.jpg; 07_whco002_s13_20_kg_industrial_front34_2400.jpg | **verified (2)** |
| coconut-powders-solids | `coconut/packs/desiccated-coconut-pouch-concept-pack.webp` | `coconut/packs/coconut-milk-powder-pouch-concept-pack.webp` | 10_whco003_s15_1_kg_professional_front34_2400.jpg; 13_whco004_s15_500_g_1_kg_professional_front34_2400.jpg | **verified (2)** |
| coconut-blossom-sugar | `coconut/packs/coconut-blossom-sugar-pouch-concept-pack.webp` | — | 17_whco005_s15_250_300_500_g_retail_front34_2400.jpg | verified (1) · 02 missing — One pack render (WHCO005); no second blossom-sugar asset |
| birds-nest-cleaned | `birds-nest/packs/cleaned-birds-nest-box-concept-pack.webp` | — | 05_whbn002_s19_50_g_retail_front34_2400.jpg | verified (1) · 02 missing — One usable pack (WHBN002); other boxes are near-identical, 'Buyer sample' or 'NET WT. TBD' |
| birds-nest-instant | `birds-nest/packs/instant-birds-nest-sachet-concept-pack.webp` | `birds-nest/packs/instant-birds-nest-carton-concept-pack.webp` | 01_whbn001_s23_10_g_retail_front34_2400.jpg; 03_whbn001_s20_10_10_g_retail_front34_2400.jpg | **verified (2)** |
| birds-nest-oem | — | — | — | **missing** — No source shows concentrate, extract, powder or blend formats |
| fruit-soft-dried | `fruit/packs/soft-dried-mango-pouch-concept-pack.webp` | `fruit/studio/soft-dried-soursop-studio.webp` | 01_whfr001_s15_500_g_professional_front34_2400.jpg; owner:Trái cây 2.png | **verified (2)** |
| fruit-freeze-dried | `fruit/studio/freeze-dried-mango-studio.webp` | — | owner:Trái cây 2.png | verified (1) · 02 missing — One crop; no freeze-dried mango pack exists |
| fruit-concentrate-powder | `fruit/packs/passion-fruit-concentrate-bib-concept-pack.webp` | `fruit/studio/passion-fruit-powder-studio.webp` | 04_3d_glb/25_whfr006_s13_20_kg_industrial.glb; owner:Trái cây 2.png | **verified (2)** |
| fruit-frozen-puree | `fruit/studio/passion-fruit-puree-studio.webp` | — | owner:Trái cây 2.png | verified (1) · 02 missing — One crop; no frozen purée pack exists |
| nsb-nuts | — | — | — | **missing** — No standalone cashew image; the only one is a crop of the family photograph |
| nsb-spices | `nuts-spices-botanicals/studio/star-anise-studio.webp` | — | Đề xuất chỉnh sửa Website 4.docx#image2.png | verified (1) · 02 missing — Star anise only; no standalone black pepper or cinnamon image |

### SKU codes (29)

| Code | image01 | image02 | Provenance (source file) | Status |
|---|---|---|---|---|
| WHCF001 (page) | `coffee/packs/whcf001-concept-pack.webp` | — | 02_whcf001_s15_2_5_kg_professional_front34_2400.jpg | verified (1) · 02 missing — No usable second view of this code: other formats are 'Buyer sample', 'TBD' export sacks, edge-on sticks or renders identical to another code's pack; rear panels carry claims/TBD/unverified QR |
| WHCF002 (page) | `coffee/packs/whcf002-concept-pack.webp` | — | 05_whcf002_s15_2_5_kg_professional_front34_2400.jpg | verified (1) · 02 missing — No usable second view of this code: other formats are 'Buyer sample', 'TBD' export sacks, edge-on sticks or renders identical to another code's pack; rear panels carry claims/TBD/unverified QR |
| WHCF003 (page) | `coffee/packs/whcf003-concept-pack.webp` | — | 08_whcf003_s15_2_5_kg_professional_front34_2400.jpg | verified (1) · 02 missing — No usable second view of this code: other formats are 'Buyer sample', 'TBD' export sacks, edge-on sticks or renders identical to another code's pack; rear panels carry claims/TBD/unverified QR |
| WHCF004 (page) | `coffee/packs/whcf004-concept-pack.webp` | — | 10_whcf004_s05_1_kg_professional_front34_2400.jpg | verified (1) · 02 missing — Only other retail format (250 g pouch) is the same pouch and label as image01 — not a distinct view |
| WHCF005 (page) | `coffee/packs/whcf005-concept-pack.webp` | `coffee/packs/whcf005-retail-box-concept-pack.webp` | 12_whcf005_s15_250_g_retail_front34_2400.jpg; 14_whcf005_s07_10_11_g_retail_front34_2400.jpg | **verified (2)** |
| WHCF006 (page) | `coffee/packs/whcf006-concept-pack.webp` | `coffee/packs/whcf006-pouch-concept-pack.webp` | 32_whcf006_s11_250_ml_retail_front34_2400.jpg; 33_whcf006_s25_20_g_retail_front34_2400.jpg | **verified (2)** |
| WHCF007 (page) | `coffee/packs/whcf007-concept-pack.webp` | — | 18_whcf007_s17_20_25_kg_industrial_front34_2400.jpg | verified (1) · 02 missing — 20 × 2 g box is visually indistinguishable from WHCF008's pack at card size; 2 g stick is edge-on; 100 g is 'Buyer sample' |
| WHCF008 (page) | `coffee/packs/whcf008-concept-pack.webp` | — | 24_whcf008_s09_20_2_g_retail_front34_2400.jpg | verified (1) · 02 missing — No usable second view of this code: other formats are 'Buyer sample', 'TBD' export sacks, edge-on sticks or renders identical to another code's pack; rear panels carry claims/TBD/unverified QR |
| WHCF009 (page) | `coffee/packs/whcf009-concept-pack.webp` | `coffee/packs/whcf009-pouch-concept-pack.webp` | 28_whcf009_s10_100_g_retail_front34_2400.jpg; 29_whcf009_s15_100_g_retail_front34_2400.jpg | **verified (2)** |
| WHCO001 (range level) | `coconut/packs/coconut-milk-carton-concept-pack.webp` | — | 02_whco001_s12_1_l_professional_front34_2400.jpg | verified (1) · 02 missing — One pack render |
| WHCO002 (range level) | `coconut/packs/coconut-cream-bib-concept-pack.webp` | — | 07_whco002_s13_20_kg_industrial_front34_2400.jpg | verified (1) · 02 missing — One pack render |
| WHCO003 (range level) | `coconut/packs/desiccated-coconut-pouch-concept-pack.webp` | — | 10_whco003_s15_1_kg_professional_front34_2400.jpg | verified (1) · 02 missing — One pack render |
| WHCO004 (range level) | `coconut/packs/coconut-milk-powder-pouch-concept-pack.webp` | — | 13_whco004_s15_500_g_1_kg_professional_front34_2400.jpg | verified (1) · 02 missing — One pack render |
| WHCO005 (range level) | `coconut/packs/coconut-blossom-sugar-pouch-concept-pack.webp` | — | 17_whco005_s15_250_300_500_g_retail_front34_2400.jpg | verified (1) · 02 missing — One pack render |
| WHBN001 (range level) | `birds-nest/packs/instant-birds-nest-sachet-concept-pack.webp` | `birds-nest/packs/instant-birds-nest-carton-concept-pack.webp` | 01_whbn001_s23_10_g_retail_front34_2400.jpg; 03_whbn001_s20_10_10_g_retail_front34_2400.jpg | **verified (2)** |
| WHBN002 (range level) | `birds-nest/packs/cleaned-birds-nest-box-concept-pack.webp` | — | 05_whbn002_s19_50_g_retail_front34_2400.jpg | verified (1) · 02 missing — One usable pack render |
| WHFR001 (range level) | `fruit/packs/soft-dried-mango-pouch-concept-pack.webp` | — | 01_whfr001_s15_500_g_professional_front34_2400.jpg | verified (1) · 02 missing — Brochure and Packaging Architecture agree: soft-dried mango. Other mango formats repeat the same pouch |
| WHFR002 (range level) | — | — | — | **missing** — Register conflict: brochure = freeze-dried mango; Packaging Architecture/zip = soft-dried pineapple. No freeze-dried mango pack exists |
| WHFR003 (range level) | — | — | — | **missing** — Brochure = soft-dried soursop; the zip WHFR003 pack is labelled jackfruit — not usable |
| WHFR004 (range level) | — | — | — | **missing** — Register conflict: brochure = passion fruit (concentrate per per-code artwork); Packaging Architecture = soft-dried banana. No matching pack |
| WHFR005 (range level) | — | — | — | **missing** — Brochure = passion fruit (purée per per-code artwork); render zip WHFR005 = dragon fruit. No matching pack |
| WHFR006 (range level) | — | — | — | **missing** — Register conflict: the concentrate BIB prints WHFR006 (Packaging Architecture), brochure lists WHFR006 as passion fruit powder. Pack shown at range level only |
| WHFR007 (range level) | — | — | — | **missing** — Not in the brochure or Packaging Architecture — code has no named product in any owner document |
| WHFR008 (range level) | — | — | — | **missing** — Not in the brochure or Packaging Architecture — code has no named product in any owner document |
| WHFR009 (range level) | — | — | — | **missing** — Not in the brochure or Packaging Architecture — code has no named product in any owner document |
| WHNSB001 (range level) | — | — | — | **missing** — Cashew kernel (brochure). No pack; only per-code label illustration (captioned WHNSP001), not used |
| WHNSB002 (range level) | — | — | — | **missing** — Black pepper (brochure). No pack; only per-code label illustration (captioned WHNSP002), not used |
| WHNSB003 (range level) | — | — | — | **missing** — Cinnamon (brochure). No pack; only per-code label illustration (captioned WHNSP003), not used |
| WHNSB004 (range level) | — | — | — | **missing** — Star anise (brochure). No pack; only per-code label illustration (captioned WHNSP004), not used |

## Owner-source audit (2026-09-30, second pass)

Checked before declaring anything missing (all read-only, nothing modified):
`D:\Working\WK 2\White Horse\BM Foodtech\Anh SKU\` — `Anh san pham\`
(four render zips: 150 packshots, cutouts, GLBs, category studio shots;
`Whitehorse Brochure.pdf`; `Packaging Architecture.pdf`; five CEO brief
DOCX; `Ảnh WEB…zip`), `Vector\` + `Vector sửa\` + `drive-download…zip`
(per-code illustrations), `WHC001–006.jpg`, `Whitehorse Brochure 2026 ver
01.pdf` (older `WHC###` scheme); `Anh upload\` (generated marketing boards
with claims); `Whitehorse_Product_Naming_Coding_Standard_v1.0.docx`.
Register reconciliation and every rejected candidate:
`docs/image-inventory.md` → "Owner code register" and "Coffee — second
pack format".

Resolved from supplied material in this pass:
- **WHCF005 / WHCF006 / WHCF009 image02** — the same code's second approved
  pack format (retail box, 20 g pouch, 100 g pouch), code printed on label.
- **Nuts, spices & botanicals family image02** — owner web-folder photo of
  cashew apples and nuts on the tree (different photograph from image01).
- **WHNSB vs WHNSP** — WHNSB is canonical (brochure, Packaging
  Architecture, claim registry, site); WHNSP appears only on illustration
  artwork captions/filenames.

## Coverage summary

| Level | Verified pair | Single (02 missing) | Missing |
|---|---|---|---|
| Families (5) | 4 — coffee, coconut, bird's nest, nuts/spices | 1 — fruit | 0 |
| Ranges (18) | 5 | 7 | 6 — coffee-soluble, coffee-extract, coffee-cold-brew, coffee-single-serve, birds-nest-oem, nsb-nuts |
| SKU codes (29) | 4 — WHCF005, WHCF006, WHCF009 (public pages); WHBN001 (range level) | 13 — WHCF001–004, 007, 008; WHCO001–005; WHBN002; WHFR001 | 12 — WHFR002–009, WHNSB001–004 |

## Genuine gaps — exact item needed from the owner

| Item | What exists | What is needed |
|---|---|---|
| Fruit family image02 | Only re-crops of image01, the range-crop source, and zip renders showing "Buyer sample"/jackfruit/pineapple | A second text-free fruit photograph (mango, soursop or passion fruit) that is not `Trái cây.jpg` / `Trái cây 2.png` |
| WHCF001–003, 004, 007, 008 image02 | Sample ("Buyer sample"), "TBD" sacks, same-pouch or cross-code-identical renders | An approved second format/angle per code without sample/TBD text |
| coffee-soluble / extract / cold-brew / single-serve ranges | Only images owned by specific codes or the family pair | Range-level imagery (instant formats, liquid extract, cold brew, drip bags/sachets) |
| birds-nest-oem range | Nothing matching concentrate/extract/powder/blend | OEM format imagery |
| nsb-nuts range; WHNSB001–004 | Illustrations only (captioned WHNSP) | Cashew/pepper/cinnamon/star-anise packs or product photos |
| Fruit register | Brochure vs Packaging Architecture conflict on WHFR002/004/005/006 | Owner decision on the fruit code register |
| WHFR007–009 | Not named in any owner document; site states 29 codes (claim registry row 9) vs brochure 26 | Owner confirmation of the three codes or of the count |
| Rights | Every asset "pending confirmation" | Written licence/permission per source before Production |

## QA evidence

**Vercel preview QA — BLOCKED.** Both preview deployments of `5cc9821`
built successfully (GitHub status `success`, 09:11 UTC):
`https://whitehorsefoodtech-4zxyp6yej-hungftu1909-cris-projects.vercel.app`
and `https://whitehorsefoodtech-vercel-ai4vkur58-hungftu1909-cris-projects.vercel.app`.
Every request returns `302 → vercel.com/sso-api` (Deployment Protection);
the local Vercel CLI token is rejected (`api.vercel.com/v2/user` → 403) and
no connected browser tool was available, so the previews were not viewed.

**Local production build of `5cc9821` (`next build` + `next start`, Chrome
via playwright-core)** — `docs/qa/media-audit-2026-09-30/second-pass-5cc9821/`:
- Media sweep, 11 routes × EN/VI × 1440/390 (44 runs): 0 duplicate media ids
  per page, 0 broken images, 0 horizontal overflow, 0 console errors or
  warnings, 0 counters on single frames, 0 identical 01/02; desktop hover
  shows image02 (opacity 0 → 1). Coffee page: 4 pairs (hero, WHCF005, 006,
  009); nuts family: pair. `media-sweep.json`.
- Journeys, EN/VI × 1440/390: 17 header/footer/menu links resolve (0 ≥ 400);
  `/rfq` and pre-filled `/rfq?...sku=WHCF009` render the form; supplier
  application form renders; `/documents` PDFs (brochure, packaging
  architecture) return 200 `application/pdf`; audience gateway routes buyers
  to `/en/products`, suppliers to `/vi/suppliers/apply`. `journeys.json`.
- Touch auto-advance (unchanged CSS, sampled in real time on the first
  pass): image01 ≈ 0–7.6 s, image02 ≈ 8.4–15.2 s, 16 s cycle.

First pass (`8bb9f30`): `docs/qa/media-audit-2026-09-30/*.jpg`, `sweep-report.json`.
