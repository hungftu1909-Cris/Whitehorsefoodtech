# Product media audit — 2026-09-30

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
`docs/asset-provenance.md`).

### Families

| ID | image01 | image02 | Provenance (source file) | Status |
|---|---|---|---|---|
| coffee | `coffee/coffee-green-roasted-flatlay.jpg` | `coffee/coffee-ground-whole-instant.jpg` | Đề xuất chỉnh sửa Website.docx#word/media/image4.jpg; Đề xuất chỉnh sửa Website.docx#word/media/image1.jpg | **verified (2)** |
| coconut | `editorial/coconut-real-products.webp` | `coconut/packs/coconut-lineup-concept-pack.webp` | owner:Coconut.jpg; 01_category_studio/coconut_lineup_square_3000.jpg | **verified (2)** |
| birds-nest | `editorial/birds-nest-real-products.webp` | `birds-nest/packs/birds-nest-lineup-concept-pack.webp` | owner:Yến.jpg; 01_category_studio/bird_s_nest_lineup_square_3000.jpg | **verified (2)** |
| fruit | `editorial/fruit-real-products.webp` | — | owner:Trái cây.jpg | verified (1) · 02 missing — No second family-level fruit image: studio/fruit.jpg is the same photograph re-cropped; no fruit line-up covers the brief's products |
| nuts-spices-botanicals | `editorial/nuts-spices-real-products.webp` | — | owner:Hạt quế hồi.jpg | verified (1) · 02 missing — No second family-level image: studio/nuts-spices-botanicals.jpg is the same photograph re-cropped; no packaging source exists |

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
| WHCF001 (page) | `coffee/packs/whcf001-concept-pack.webp` | — | 02_whcf001_s15_2_5_kg_professional_front34_2400.jpg | verified (1) · 02 missing — No second SKU-specific asset: rear panels were rejected (claims, TBD values, unverified QR); shared editorial photos are not SKU images |
| WHCF002 (page) | `coffee/packs/whcf002-concept-pack.webp` | — | 05_whcf002_s15_2_5_kg_professional_front34_2400.jpg | verified (1) · 02 missing — No second SKU-specific asset: rear panels were rejected (claims, TBD values, unverified QR); shared editorial photos are not SKU images |
| WHCF003 (page) | `coffee/packs/whcf003-concept-pack.webp` | — | 08_whcf003_s15_2_5_kg_professional_front34_2400.jpg | verified (1) · 02 missing — No second SKU-specific asset: rear panels were rejected (claims, TBD values, unverified QR); shared editorial photos are not SKU images |
| WHCF004 (page) | `coffee/packs/whcf004-concept-pack.webp` | — | 10_whcf004_s05_1_kg_professional_front34_2400.jpg | verified (1) · 02 missing — No second SKU-specific asset: rear panels were rejected (claims, TBD values, unverified QR); shared editorial photos are not SKU images |
| WHCF005 (page) | `coffee/packs/whcf005-concept-pack.webp` | — | 12_whcf005_s15_250_g_retail_front34_2400.jpg | verified (1) · 02 missing — No second SKU-specific asset: rear panels were rejected (claims, TBD values, unverified QR); shared editorial photos are not SKU images |
| WHCF006 (page) | `coffee/packs/whcf006-concept-pack.webp` | — | 32_whcf006_s11_250_ml_retail_front34_2400.jpg | verified (1) · 02 missing — No second SKU-specific asset: rear panels were rejected (claims, TBD values, unverified QR); shared editorial photos are not SKU images |
| WHCF007 (page) | `coffee/packs/whcf007-concept-pack.webp` | — | 18_whcf007_s17_20_25_kg_industrial_front34_2400.jpg | verified (1) · 02 missing — No second SKU-specific asset: rear panels were rejected (claims, TBD values, unverified QR); shared editorial photos are not SKU images |
| WHCF008 (page) | `coffee/packs/whcf008-concept-pack.webp` | — | 24_whcf008_s09_20_2_g_retail_front34_2400.jpg | verified (1) · 02 missing — No second SKU-specific asset: rear panels were rejected (claims, TBD values, unverified QR); shared editorial photos are not SKU images |
| WHCF009 (page) | `coffee/packs/whcf009-concept-pack.webp` | — | 28_whcf009_s10_100_g_retail_front34_2400.jpg | verified (1) · 02 missing — No second SKU-specific asset: rear panels were rejected (claims, TBD values, unverified QR); shared editorial photos are not SKU images |
| WHCO001 (range level) | `coconut/packs/coconut-milk-carton-concept-pack.webp` | — | 02_whco001_s12_1_l_professional_front34_2400.jpg | verified (1) · 02 missing — One pack render |
| WHCO002 (range level) | `coconut/packs/coconut-cream-bib-concept-pack.webp` | — | 07_whco002_s13_20_kg_industrial_front34_2400.jpg | verified (1) · 02 missing — One pack render |
| WHCO003 (range level) | `coconut/packs/desiccated-coconut-pouch-concept-pack.webp` | — | 10_whco003_s15_1_kg_professional_front34_2400.jpg | verified (1) · 02 missing — One pack render |
| WHCO004 (range level) | `coconut/packs/coconut-milk-powder-pouch-concept-pack.webp` | — | 13_whco004_s15_500_g_1_kg_professional_front34_2400.jpg | verified (1) · 02 missing — One pack render |
| WHCO005 (range level) | `coconut/packs/coconut-blossom-sugar-pouch-concept-pack.webp` | — | 17_whco005_s15_250_300_500_g_retail_front34_2400.jpg | verified (1) · 02 missing — One pack render |
| WHBN001 (range level) | `birds-nest/packs/instant-birds-nest-sachet-concept-pack.webp` | `birds-nest/packs/instant-birds-nest-carton-concept-pack.webp` | 01_whbn001_s23_10_g_retail_front34_2400.jpg; 03_whbn001_s20_10_10_g_retail_front34_2400.jpg | **verified (2)** |
| WHBN002 (range level) | `birds-nest/packs/cleaned-birds-nest-box-concept-pack.webp` | — | 05_whbn002_s19_50_g_retail_front34_2400.jpg | verified (1) · 02 missing — One usable pack render |
| WHFR001 (range level) | `fruit/packs/soft-dried-mango-pouch-concept-pack.webp` | — | 01_whfr001_s15_500_g_professional_front34_2400.jpg | verified (1) · 02 missing — One pack render; SKU name register not in the repository |
| WHFR002 (range level) | — | — | — | **missing** — Source pack WHFR002 is pineapple, outside the brief's ranges — not used |
| WHFR003 (range level) | — | — | — | **missing** — Source pack WHFR003 is jackfruit with soursop artwork (label/art mismatch) — not used |
| WHFR004 (range level) | — | — | — | **missing** — Source pack WHFR004 is banana, outside the brief's ranges — not used |
| WHFR005 (range level) | — | — | — | **missing** — Source pack WHFR005 is dragon fruit, outside the brief's ranges — not used |
| WHFR006 (range level) | `fruit/packs/passion-fruit-concentrate-bib-concept-pack.webp` | — | 04_3d_glb/25_whfr006_s13_20_kg_industrial.glb | verified (1) · 02 missing — One pack render; SKU name register not in the repository |
| WHFR007 (range level) | — | — | — | **missing** — SKU name register not in the repository; no source pack prints this code |
| WHFR008 (range level) | — | — | — | **missing** — SKU name register not in the repository; no source pack prints this code |
| WHFR009 (range level) | — | — | — | **missing** — SKU name register not in the repository; no source pack prints this code |
| WHNSB001 (range level) | — | — | — | **missing** — No packaging source exists for nuts, spices & botanicals |
| WHNSB002 (range level) | — | — | — | **missing** — No packaging source exists for nuts, spices & botanicals |
| WHNSB003 (range level) | — | — | — | **missing** — No packaging source exists for nuts, spices & botanicals |
| WHNSB004 (range level) | — | — | — | **missing** — No packaging source exists for nuts, spices & botanicals |

## Coverage summary

| Level | Verified pair | Single (02 missing) | Missing |
|---|---|---|---|
| Families (5) | 3 — coffee, coconut, bird's nest | 2 — fruit, nuts/spices | 0 |
| Ranges (18) | 5 | 7 | 6 — see below |
| SKU codes (29) | 1 — WHBN001 (range level) | 17 — WHCF001–009 (own pack only), WHCO001–005, WHBN002, WHFR001, WHFR006 | 11 — WHFR002–005, WHFR007–009, WHNSB001–004 |

(Missing ranges: coffee-soluble, coffee-extract, coffee-cold-brew,
coffee-single-serve, birds-nest-oem, nsb-nuts — six in total.)

## Open items for the owner

- Supply second SKU-specific images for WHCF001–009 (e.g. an approved
  second angle), a second fruit and nuts/spices family image that is a
  *different* photograph, and imagery for the six image-free ranges.
- Confirm the non-coffee SKU name register (WHFR/WHNSB codes are not named
  in the repository; fruit pack codes 002–005 are outside the brief).
- The "owner-supplied product photograph" compositions are described in
  provenance as consistent with AI-generated studio imagery; confirm their
  origin and commercial-use terms before Production.

## QA evidence

`docs/qa/media-audit-2026-09-30/` — section captures in 01 and forced-02
states (EN/VI, 1440/390). Automated sweep (production build, 11 routes ×
EN/VI × 1440/390): 0 duplicate media ids per page, 0 broken images, 0
horizontal overflow, 0 console errors/warnings, 0 counters on single
frames, 0 identical 01/02. Desktop hover → 02 opacity 1; touch devices
sampled in real time: 01 at 1–7s, 02 at 9–15s, back to 01 at 17s.
Detail pages exist only for coffee codes (other families are range level),
so WHCF001/006/009 were checked as representatives.
