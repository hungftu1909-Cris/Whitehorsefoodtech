# Image inventory — CEO SKU image folder (2026-09-28)

Source (CEO's machine, read-only):
`D:\Working\WK 2\White Horse\BM Foodtech\Anh SKU\Anh san pham` — four zips
plus a saved browser page (`Claude Code.html`, not an image source).

| Zip | Size | Contents | README status line |
|---|---|---|---|
| `WHITEHORSE_01_COFFEE.zip` | 250 MB | 4 category studio renders, 35 packs × (front 2400², rear 2000², cutout PNG, GLB) | "REFERENCE / PROVISIONAL — FINAL DIELINE SUBJECT TO SUPPLIER OR CO-PACKER CONFIRMATION. Concept renders, not production artwork." |
| `WHITEHORSE_02_COCONUT.zip` | 108 MB | 4 category renders, 18 packs (WHCO001–005) | same |
| `WHITEHORSE_03_BIRD_S_NEST.zip` | 39 MB | 4 category renders, 7 packs (WHBN001–002) | same |
| `WHITEHORSE_04_FRUIT.zip` | 106 MB | 4 category renders, packshots for 7 of 26 packs (WHFR001–002 only); the rest GLB only | same |
| Nuts, spices & botanicals | — | **No zip in the folder** | — |

All 150 JPEGs are 3D renders of **Whitehorse-branded packaging** (brand
mark, "Origin Signature", "From Vietnam's …", net weight, code). None is a
photograph of product or stock. Text inside an image is a public claim, so
every file used was read at full resolution.

## Used on the site

One front three-quarter render per confirmed code. Each is centre-framed
on its own ivory ground to 4:3, 1600×1200 WebP (q80, 27–42 KB), shown first
in the SKU gallery and on SKU cards with the visible badge "Concept
packaging" / "Bao bì ý tưởng" and, on the SKU page, the note that label
text is illustrative and the final pack is confirmed per order. The
existing coffee editorial photo stays as the second image.

| Code (site name) | Public file | Source file (`WHITEHORSE_01_COFFEE/02_sku_packshots_ivory/`) | Source SHA-256 (16) | Why this pack |
|---|---|---|---|---|
| WHCF001 Green Robusta | `public/images/catalog/coffee/packs/whcf001-concept-pack.webp` | `02_whcf001_s15_2_5_kg_professional_front34_2400.jpg` | `b0d6b78c262a8c04` | B2B pouch; no "Buyer sample" wording |
| WHCF002 Green Arabica | `public/images/catalog/coffee/packs/whcf002-concept-pack.webp` | `05_whcf002_s15_2_5_kg_professional_front34_2400.jpg` | `8bc7190aaaadd5e6` | same template, Arabica label and cherries |
| WHCF003 Fine Green Robusta | `public/images/catalog/coffee/packs/whcf003-concept-pack.webp` | `08_whcf003_s15_2_5_kg_professional_front34_2400.jpg` | `5e7a4b8a5e410323` | same template, "Fine Green" label |
| WHCF004 Roasted Robusta | `public/images/catalog/coffee/packs/whcf004-concept-pack.webp` | `10_whcf004_s05_1_kg_professional_front34_2400.jpg` | `2007669cb7a4f466` | whole-bean pouch |
| WHCF005 Roasted & Ground | `public/images/catalog/coffee/packs/whcf005-concept-pack.webp` | `12_whcf005_s15_250_g_retail_front34_2400.jpg` | `3ed0c5830f5cfb34` | ground-coffee pouch |
| WHCF006 Cold Brew | `public/images/catalog/coffee/packs/whcf006-concept-pack.webp` | `32_whcf006_s11_250_ml_retail_front34_2400.jpg` | `5278127667f85381` | RTD can shows the liquid format |
| WHCF007 Spray-Dried Instant | `public/images/catalog/coffee/packs/whcf007-concept-pack.webp` | `18_whcf007_s17_20_25_kg_industrial_front34_2400.jpg` | `48c1ebc2af862ec4` | industrial carton (B2B) |
| WHCF008 Agglomerated Instant | `public/images/catalog/coffee/packs/whcf008-concept-pack.webp` | `24_whcf008_s09_20_2_g_retail_front34_2400.jpg` | `53695576f537a49c` | stick carton, distinct from WHCF007 |
| WHCF009 Freeze-Dried Instant | `public/images/catalog/coffee/packs/whcf009-concept-pack.webp` | `28_whcf009_s10_100_g_retail_front34_2400.jpg` | `405310ed12988d51` | jar, distinct from WHCF008 |

## Not used, and why

| Files | Reason |
|---|---|
| All `*_rear34_*.jpg` | Rear "Product Passport" panels (checked on WHCF001; every pack uses the same template) have misaligned fields (PROCESS reads "Screen size, grade 1 (export)", ORIGIN reads "Naturally sundried"), a grade/export claim, "TBD" values and a QR code to `wh.vn/p/…` whose destination is not verified. |
| Coffee `*_s18_*` export sacks (03, 06, 09) | Front spec block prints "TBD / buyer spec" — unfinished text. The three are pixel-identical apart from the label. |
| Coffee `*_s01_*`, `*_s02_*`, `*_s03_*` sample packs | Print "BUYER SAMPLE" — reads as sample availability (claim registry row 9). |
| Coffee 19–21 (`sku_tbd`, 3-in-1 premix) | Not a confirmed code or range on the site. |
| Coffee 2 g sticks (16, 23, 26) | Edge-on view, label unreadable; 23 and 26 are identical renders. |
| Coffee 24 vs 27, 25 vs 30 vs 35 | Identical renders across codes; only one of each is used (24 → WHCF008). |
| Coconut WHCO001–005, Bird's nest WHBN001–002, Fruit WHFR001–006 | These codes are **not confirmed codes** on the site (only WHCF001–009 are; claim registry row 9). Publishing the packs would publish the codes. Bird's nest packs also print "From Vietnam's coastal caves" (unverified origin; bird's nest wording must stay conservative). Fruit packs cover pineapple, banana, jackfruit and dragon fruit, which are not in the CEO product brief ranges (mango, soursop, passion fruit), and 19 of 26 have no packshot. |
| All `01_category_studio` renders (16) | Branded pack line-ups with label text; family visuals must be text-free (Phase 3 brief). |
| `Claude Code.html` + `_files` | Saved web page, not image source material. |

## Gaps (no image generated)

No image-generation tool was available in this session, so no new studio
images were created. Ranges keep their text-led cards (by design they
carry no imagery); family visuals keep the owner's Drive studio images.
To add SKU imagery for coconut, bird's nest, fruit or nuts & spices, the
owner must first confirm the codes and pack text (then this table gets
new rows), or supply text-free studio photography per range.
