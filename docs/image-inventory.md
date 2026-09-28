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

## Label rule (CEO, Issue #1, 2026-09-28)

Source label artwork is **never** redrawn, retouched, translated or
regenerated. Processing is limited to crop, padding on the render's own
studio ground, resize and WebP encoding (`export_pack.py` logic: bounding
box of the pack × margin, framed 4:3). Every visual below is tagged:

- **Source label** — the supplied render, label untouched (all packs are
  the owner's provisional concept renders; shown as "Concept packaging" /
  "Bao bì ý tưởng", never as approved packaging or stock).
- **Source-derived composition** — a crop/reframe of a supplied image.
- **Concept / no official label** — neutral ingredient visual, no pack.

## Coffee — confirmed codes (WHCF001–009) · label status: Source label

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

## Coconut — 5 defined core SKUs, presented at range level

The source packs print WHCO001–005. They are part of the 29-SKU defined
core portfolio (claim registry row 9), but do not yet have public detail
pages, so the images remain mapped to **ranges** and alt text does not use
the codes. Family hero gallery: Drive studio image (studio
representation) + line-up render (concept packaging).

| Range → product | Public file | Source file (`WHITEHORSE_02_COCONUT/`) | Source SHA-256 (16) | Label status | Why |
|---|---|---|---|---|---|
| Milk & cream → coconut milk | `public/images/catalog/coconut/packs/coconut-milk-carton-concept-pack.webp` | `02_sku_packshots_ivory/02_whco001_s12_1_l_professional_front34_2400.jpg` | `9c7c2d60a1ea6fb0` | Source label | 1 L aseptic carton; no "Buyer sample" |
| Milk & cream → coconut cream | `public/images/catalog/coconut/packs/coconut-cream-bib-concept-pack.webp` | `02_sku_packshots_ivory/07_whco002_s13_20_kg_industrial_front34_2400.jpg` | `47ee94ca56248e15` | Source label | 20 kg BIB carton — a different shape from the milk carton (the 1 L cream carton is pixel-identical to milk except the label) |
| Powders & solids → desiccated coconut | `public/images/catalog/coconut/packs/desiccated-coconut-pouch-concept-pack.webp` | `02_sku_packshots_ivory/10_whco003_s15_1_kg_professional_front34_2400.jpg` | `e1d64662efe93259` | Source label | window shows the flakes |
| Powders & solids → coconut milk powder | `public/images/catalog/coconut/packs/coconut-milk-powder-pouch-concept-pack.webp` | `02_sku_packshots_ivory/13_whco004_s15_500_g_1_kg_professional_front34_2400.jpg` | `38ab76be37e62885` | Source label | powder pouch |
| Blossom sugar → coconut blossom sugar | `public/images/catalog/coconut/packs/coconut-blossom-sugar-pouch-concept-pack.webp` | `02_sku_packshots_ivory/17_whco005_s15_250_300_500_g_retail_front34_2400.jpg` | `c13a0e32e8b2f98d` | Source label | window shows the sugar |
| Family hero, 2nd image | `public/images/catalog/coconut/packs/coconut-lineup-concept-pack.webp` | `01_category_studio/coconut_lineup_square_3000.jpg` | `03c81b8215dfffc8` | Source label (line-up) | one pack per product form |

## Bird's nest — 2 defined core SKUs, presented at range level

The source packs print WHBN001–002, part of the 29-SKU defined core
portfolio, and "From Vietnam's coastal caves" — kept untouched under the
label rule; the SKU/range note states label text is illustrative, and the
origin wording is listed as an open claim for owner confirmation.

| Range → product | Public file | Source file (`WHITEHORSE_03_BIRD_S_NEST/`) | Source SHA-256 (16) | Label status | Why |
|---|---|---|---|---|---|
| Cleaned nest | `public/images/catalog/birds-nest/packs/cleaned-birds-nest-box-concept-pack.webp` | `02_sku_packshots_ivory/05_whbn002_s19_50_g_retail_front34_2400.jpg` | `e5c52ee00957eece` | Source label | rigid box; the industrial carton prints "NET WT. TBD" and the sample box is near-identical |
| Instant & ready-to-prepare → sachet | `public/images/catalog/birds-nest/packs/instant-birds-nest-sachet-concept-pack.webp` | `02_sku_packshots_ivory/01_whbn001_s23_10_g_retail_front34_2400.jpg` | `78618afc6bd0469c` | Source label | single-serve sachet |
| Instant & ready-to-prepare → carton | `public/images/catalog/birds-nest/packs/instant-birds-nest-carton-concept-pack.webp` | `02_sku_packshots_ivory/03_whbn001_s20_10_10_g_retail_front34_2400.jpg` | `7f13dc7bbcb29c17` | Source label | 10 × 10 g carton (5 × 10 g is pixel-identical) |
| Concentrate, extract, powder & blends (OEM) | — (text-only card) | none | — | Concept / no official label | No source shows these forms; a crop of the Drive "Yến 2" photo showed dates, honey and prepared nest, which would misrepresent OEM formats, so it was rejected |
| Family hero, 2nd image | `public/images/catalog/birds-nest/packs/birds-nest-lineup-concept-pack.webp` | `01_category_studio/bird_s_nest_lineup_square_3000.jpg` | `aae4a637232dbf60` | Source label (line-up) | box + carton |

## Fruit — 9 defined core SKUs, presented at range level

Source zip: packshot JPEGs exist only for WHFR001 (mango, soft-dried) and
WHFR002 (pineapple, soft-dried); the other 19 packs are GLB models. GLBs
were rendered with `<model-viewer>` in headless Chrome (textures embedded,
label untouched, ivory ground, front three-quarter), then framed like the
JPEG packs. Neutral crops come from the owner's Drive image `Trái cây
2.png` (1536×1024, SHA-256 `31c885e0a3480591…`), a different photograph
from the family hero (`Trái cây.jpg`). No family line-up is shown: the
source line-up features jackfruit and dragon fruit, which are not in the
CEO brief ranges. Family hero stays the single studio image.

| Range → product | Public file | Source | Source SHA-256 (16) | Label status | Why |
|---|---|---|---|---|---|
| Soft-dried → mango | `public/images/catalog/fruit/packs/soft-dried-mango-pouch-concept-pack.webp` | `WHITEHORSE_04_FRUIT/02_sku_packshots_ivory/01_whfr001_s15_500_g_professional_front34_2400.jpg` | `4c34ccecd71730b2` | Source label | only mango pack with a packshot; no "Buyer sample" |
| Soft-dried → soursop | `public/images/catalog/fruit/studio/soft-dried-soursop-studio.webp` | `Trái cây 2.png` crop (980,60)–(1520,465), 540×405 | `31c885e0a3480591` | Source-derived composition (no label) | no soursop pack exists |
| Freeze-dried → mango | `public/images/catalog/fruit/studio/freeze-dried-mango-studio.webp` | `Trái cây 2.png` crop (530,75)–(990,420), 460×345 | `31c885e0a3480591` | Source-derived composition (no label) | no freeze-dried mango pack exists (jackfruit/dragon fruit packs are outside the brief) |
| Concentrate & powder → passion fruit concentrate | `public/images/catalog/fruit/packs/passion-fruit-concentrate-bib-concept-pack.webp` | GLB `WHITEHORSE_04_FRUIT/04_3d_glb/25_whfr006_s13_20_kg_industrial.glb` (label reads "Passion Fruit Concentrate") | `23ac565952b3d2ac` | Source label (rendered from source 3D) | 20 kg BIB matches the brief's aseptic pack |
| Concentrate & powder → passion fruit powder | `public/images/catalog/fruit/studio/passion-fruit-powder-studio.webp` | `Trái cây 2.png` crop (1060,550)–(1520,895), 460×345 | `31c885e0a3480591` | Source-derived composition (no label) | the source "Fruit Powder" pack prints "SKU TBD" and shows no fruit |
| Frozen purée → passion fruit purée | `public/images/catalog/fruit/studio/passion-fruit-puree-studio.webp` | `Trái cây 2.png` crop (500,530)–(1020,920), 520×390 | `31c885e0a3480591` | Source-derived composition (no label) | no frozen purée pack exists |

Fruit sources not used: WHFR002 pineapple, WHFR003 jackfruit, WHFR004
banana, WHFR005 dragon fruit (not in the brief — would imply available
products); WHFR003 jackfruit pack also illustrates a soursop (label/art
mismatch); "Fruit Powder" `sku_tbd` packs print "SKU TBD"; WHFR006 250–500
ml sample bottle (label faces away at every source angle, "Buyer sample");
WHFR006 180–200 kg drum (same product as the BIB).

## Nuts, spices & botanicals — range level

**No source zip exists for this family.** Neutral crops only, no packs:

| Range → product | Public file | Source | Source SHA-256 (16) | Label status | Why |
|---|---|---|---|---|---|
| Nuts → cashew kernels | `public/images/catalog/nuts-spices-botanicals/studio/cashew-kernels-studio.webp` | Drive `Hạt quế hồi.jpg` crop (240,300)–(740,675), 500×375 | `8f0b4fe9870d26ef` | Source-derived composition (no label) | tight crop on the kernels; the family hero shows the full composition |
| Spices → star anise | `public/images/catalog/nuts-spices-botanicals/studio/star-anise-studio.webp` | CEO brief `Đề xuất chỉnh sửa Website 4.docx` image2.png crop (440,540)–(800,810), 360×270 | `d1251224b2d386d9` | Source-derived composition (no label) | the only region of that board with confirmed spices only; the rest shows cardamom, cloves, allspice, fenugreek and mace (not confirmed) and a generator watermark |

Rejected: a black-pepper crop from `Hạt quế hồi.jpg` (280×210, still shows
cashew — too small and ambiguous); Drive `HẠt điều.jpg` (cashew apple on
the tree — not the kernel product).

## Not used, and why

| Files | Reason |
|---|---|
| All `*_rear34_*.jpg` | Rear "Product Passport" panels (checked on WHCF001; every pack uses the same template) have misaligned fields (PROCESS reads "Screen size, grade 1 (export)", ORIGIN reads "Naturally sundried"), a grade/export claim, "TBD" values and a QR code to `wh.vn/p/…` whose destination is not verified. |
| Coffee `*_s18_*` export sacks (03, 06, 09) | Front spec block prints "TBD / buyer spec" — unfinished text. The three are pixel-identical apart from the label. |
| Coffee `*_s01_*`, `*_s02_*`, `*_s03_*` sample packs | Print "BUYER SAMPLE" — reads as sample availability (claim registry row 9). |
| Coffee 19–21 (`sku_tbd`, 3-in-1 premix) | Not a confirmed code or range on the site. |
| Coffee 2 g sticks (16, 23, 26) | Edge-on view, label unreadable; 23 and 26 are identical renders. |
| Coffee 24 vs 27, 25 vs 30 vs 35 | Identical renders across codes; only one of each is used (24 → WHCF008). |
| Coconut `*_s01_*` / `*_s02_*` / `*_s12_330_ml_sample` | Print "BUYER SAMPLE". |
| Coconut 1 L cream carton (06), 200 kg drums (04, 08), industrial cartons (03, 11, 14, 18), sugar 1 kg (16) | Same template as a chosen pack (identical or near-identical render); drums hide the product name behind the rings. |
| Bird's nest 02 (5 × 10 g carton), 04 (sample box), 06 (100 g box), 07 (industrial, "NET WT. TBD") | Duplicate of a chosen render, "Buyer sample" or unfinished text. |
| `01_category_studio` family shots and 16:9 heroes | Family visuals stay text-free studio images (Phase 3 brief); only the square line-ups are used, as a labelled second gallery image. |
| `Claude Code.html` + `_files` | Saved web page, not image source material. |

## Coverage and gaps

| Family | Ranges with a distinct visual | Label status mix | Gaps |
|---|---|---|---|
| Coffee | 9/9 defined SKUs with detail pages (+ editorial second image) | Source label | — |
| Coconut | 3/3 ranges, 5 product visuals + line-up | Source label | — |
| Bird's nest | 2/3 ranges, 3 product visuals + line-up | Source label | OEM range (concentrate/extract/powder/blends): no source |
| Fruit | 4/4 ranges, 6 product visuals | Source label (2) · source-derived (4) | Packs for soursop, freeze-dried mango, passion fruit powder and purée do not exist |
| Nuts, spices & botanicals | 2/2 ranges, 2 visuals | Source-derived (2) | No packs; no standalone pepper or cinnamon image |

No image-generation tool was available in this session, so no new images
were generated; every gap above stays text-only or uses a neutral crop
rather than borrowing another product's image. To close them, the owner
can supply (a) packshots/GLBs for the missing products, or (b) text-free
studio photos per product (OEM bird's nest formats, black pepper,
cinnamon).
