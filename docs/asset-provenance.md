# Asset provenance registry

Every image rendered on the public site must have a row here: where it
came from, what it may be used for, and its licence status. Images whose
licence is not confirmed may be used locally and on protected Vercel
Preview deployments only — **confirm production rights before promoting to
Production.**

## Catalog imagery from the website-edit brief (added 2026-09-27)

Source document: `C:\Users\AD\Downloads\Đề xuất chỉnh sửa Website.docx`
(user-supplied, 1,327,652 bytes, modified 2026-09-27 21:13 +07:00,
SHA-256 `47905895b8fea8130b1eff1bc957717ee39031bce13cffdfdde6cc7e84121e09`).
The original DOCX was only read; it was not modified or committed.

The four embedded images carry no EXIF/XMP/IPTC metadata (no author,
credit or copyright fields), so their origin cannot be established from
the files. Their style is consistent with commercial stock photography.
They show generic coffee (green beans, roasted beans, ground and instant
coffee) with **no text, logos, seals or claims**.

| Public file | Embedded source (DOCX `word/media/`) | Source SHA-256 | Derived SHA-256 | Processing | Intended use | Licence status |
|---|---|---|---|---|---|---|
| `public/images/catalog/coffee/coffee-ground-whole-instant.jpg` | `image1.jpg` (2048×1365) | `04c8f8f5072661370da3fc1eff7c72dbb58caba22b8a19146f902678140edb12` | `f8c9eec0001046e349e679de3d9c53ad7df18af51feab256b0aca4d2c9ea0025` | Resized to 1600×1066, JPEG q80 progressive | Coffee family secondary image; roasted/instant range and SKU galleries (homepage hero until 2026-09-30) | User-supplied; **production rights confirmation pending** |
| `public/images/catalog/coffee/coffee-roasted-ground-instant-spoons.jpg` | `image2.jpg` (1600×1068) | `25596b840df03b98470fa8fa82796f02336ef66ba54c679e5d8553f9d92e288a` | `40945f1ec9cb1232317124c07637c94d679961820808b1a146df6a7c49740b2a` | Re-encoded 1600×1068, JPEG q80 progressive | Roasted/ground/instant range and SKU galleries | User-supplied; **production rights confirmation pending** |
| `public/images/catalog/coffee/coffee-green-roasted-ground-bowls.jpg` | `image3.jpg` (2048×1365) | `e13e514397e214ca4d2e589279e95b71e55bde11bbd0f2b9107c934acbc1519b` | `e66463d5ebe916c4b5ed8a047279e4c3280fb24652348c1a2c449d997734c5a0` | Resized to 1600×1066, JPEG q80 progressive | Green coffee range and SKU galleries | User-supplied; **production rights confirmation pending** |
| `public/images/catalog/coffee/coffee-green-roasted-flatlay.jpg` | `image4.jpg` (2048×1365) | `7361b182a8df0113e4a2d491f22f1cec7b4a32f129f19a561005bb298bb1b55b` | `c304ff1e397bf22eb50ae79ff8ba80a790506d6ac8dfe07d0cd48673f79dd0c4` | Resized to 1600×1066, JPEG q80 progressive | Green/roasted range and SKU galleries | User-supplied; **production rights confirmation pending** |

**How they are presented:** as product-family imagery, not packshots of a
specific Whitehorse SKU. Visual-type badges were removed on 2026-09-28 for
a cleaner catalog; descriptive alt text states what is shown, never a
product claim.

**Before Production:** obtain written confirmation of the licence (e.g.
the stock-library licence or photographer's permission) covering
commercial website use, and record the licence reference here.

## Family imagery (added 2026-09-28, branch `feat/phase3-premium-about-studio`)

**Superseded 2026-09-30 (media audit).** Single source of truth is now
`src/lib/media-manifest.ts` (`FAMILY_MEDIA`, `RANGE_MEDIA`, `SKU_MEDIA`,
keyed by family slug / range id / SKU code), rendered through
`DualImageFrame` / `SpecPlate`. Full mapping, root cause and gaps:
`docs/media-audit.md`.

| Family | image01 | image02 | Status |
|---|---|---|---|
| Coffee | `public/images/catalog/coffee/coffee-green-roasted-flatlay.jpg` | `public/images/catalog/coffee/coffee-ground-whole-instant.jpg` | Verified pair. Production rights pending (as above). |
| Coconut | `public/images/catalog/editorial/coconut-real-products.webp` | `public/images/catalog/coconut/packs/coconut-lineup-concept-pack.webp` | Verified pair (concept packaging labelled) |
| Bird's nest | `public/images/catalog/editorial/birds-nest-real-products.webp` | `public/images/catalog/birds-nest/packs/birds-nest-lineup-concept-pack.webp` | Verified pair (concept packaging labelled) |
| Fruit | `public/images/catalog/editorial/fruit-real-products.webp` | — | **02 missing.** `studio/fruit.jpg` was used as 02 until 2026-09-30 but is the same photograph (`Trái cây.jpg`) re-cropped — retired from use |
| Nuts, spices & botanicals | `public/images/catalog/editorial/nuts-spices-real-products.webp` | `public/images/catalog/nuts-spices-botanicals/cashew-tree-origin.webp` | Verified pair since 2026-09-30 (see below). `studio/nuts-spices-botanicals.jpg` re-crops image01 — retired from use |

### Nuts family second image (added 2026-09-30)

| Public file | Source | Source SHA-256 | Derived SHA-256 | Processing | Licence status |
|---|---|---|---|---|---|
| `public/images/catalog/nuts-spices-botanicals/cashew-tree-origin.webp` | Owner zip `Ảnh WEB-20260928T141117Z-1-001.zip` → `Ảnh WEB/HẠt điều.jpg` (2048×1366) | `82079de95b0be0f9571a43755d94ddaf48cc184b3f225949bf1a11b0ea18c899` | `03c003d703c43fd2448bc2b748596c083daf229221a6361647c7abe925ac90c4` | Centre crop to 4:3 (1821×1366 at x=114), resize 1600×1200, WebP q80 | Owner-supplied; photographer/licence to be recorded before Production |

Cashew apples with their nuts on the tree — text-free, no logos; a
different photograph from the family composition. Presented as a family
origin image (alt says what it shows), never as a kernel lot or a WHNSB001
product image.

### Owner-supplied product photographs (added 2026-09-28)

The four original product compositions in the owner's image folder are now
used as the primary family visuals. They are paired with a different visual
mode (source-label 3D packaging for coconut and bird's nest; a restrained
studio composition for fruit and nuts/spices), giving every family two
images without presenting a concept pack as photographed stock. Processing
is limited to a centred 4:3 crop, resize to 1600×1200 and WebP encoding.

| Public file | Owner source | Source SHA-256 | Derived SHA-256 | Intended use | Licence status |
|---|---|---|---|---|---|
| `public/images/catalog/editorial/coconut-real-products.webp` | `Coconut.jpg` | `53768f91476dcab15deb1cb1d69dfb83f543df5f5469c3a46b811e58be26414f` | `6bde4811c434613d74e19a7cdeefc9c96801fb47abbe9894c92d6a694c52ac51` | Coconut family primary image | Owner-supplied; generator/photographer and commercial-use terms to be recorded |
| `public/images/catalog/editorial/birds-nest-real-products.webp` | `Yến.jpg` | `cbebe6f6d9ed29ca6ddaacf35c7e1f0195836b8f30b4b79e73c2ea53915cfc26` | `dfc38df498234de0ace71d0f6a84478135d62903e5b1b3d294e207fb5e2b506b` | Bird's-nest family primary image | same |
| `public/images/catalog/editorial/fruit-real-products.webp` | `Trái cây.jpg` | `f1bfcd7b95b0dc20023cb355d77261fb9a0b0aea2b3a2a39a8873d02265bdb2e` | `08fc3ca3ddef7805d50ccb97cfa1fac77051a5f9e5e03bbab37e0f1a835553cf` | Fruit family primary image | same |
| `public/images/catalog/editorial/nuts-spices-real-products.webp` | `Hạt quế hồi.jpg` | `8f0b4fe9870d26ef94ac156060333c1d520d7000942f821889a717c1f87a2773` | `b529b888a1e478d2c602369bd755e6c97c41b0d225fd193c071891ee7469f0c0` | Nuts, spices & botanicals family primary image | same |

**Public meaning:** “owner-supplied product photograph” describes the
composition shown, not a specific inventory lot, supplier batch, certificate,
origin record or availability claim. Exact product, source and final
specification are still confirmed per request.

### Studio image sources (added 2026-09-28; not rendered since 2026-09-30)

These four files are re-crops of the owner photographs above (same source
SHA-256). Showing one beside its editorial encode presented one photograph
as two images, so they are listed in `REJECTED_MEDIA` and no longer mapped.

Source: the owner's shared Google Drive folder
`https://drive.google.com/drive/folders/1Qs95WmumHthaNYqngoZrWBmv_qIJVVLt`
(downloaded 2026-09-28). The same compositions are embedded in the CEO
product briefs "Đề xuất chỉnh sửa Website 1–4.docx" (uploaded to the
session 2026-09-28). The files carry no author/credit metadata; their
style is consistent with AI-generated studio imagery. They show generic
ingredient formats with **no text, logos, seals, badges or retail
packaging** (checked visually at full resolution, including all four
corners for generator watermarks).

| Public file | Drive source file | Source size | Source SHA-256 | Derived size | Derived SHA-256 | Processing |
|---|---|---|---|---|---|---|
| `public/images/catalog/studio/coconut.jpg` | `Coconut.jpg` | 1248×816 | `53768f91476dcab15deb1cb1d69dfb83f543df5f5469c3a46b811e58be26414f` | 1088×816 | `78e2eaa5da6afdc60c43c2f921c593648318ad3d1ca38b4c2faac2754862c3a1` | Centre crop to 4:3, JPEG q82 progressive, no upscaling |
| `public/images/catalog/studio/birds-nest.jpg` | `Yến.jpg` | 1248×832 | `cbebe6f6d9ed29ca6ddaacf35c7e1f0195836b8f30b4b79e73c2ea53915cfc26` | 1109×832 | `71010527711a4776771b749328c8f7006f84f8208777bee292cf3f7d3975b404` | same |
| `public/images/catalog/studio/fruit.jpg` | `Trái cây.jpg` | 1248×832 | `f1bfcd7b95b0dc20023cb355d77261fb9a0b0aea2b3a2a39a8873d02265bdb2e` | 1109×832 | `fccbd9200637531d6bafb4ba6a67bbbbff6549f324cd0e4013bc44c316930c3e` | same |
| `public/images/catalog/studio/nuts-spices-botanicals.jpg` | `Hạt quế hồi.jpg` | 1008×1024 | `8f0b4fe9870d26ef94ac156060333c1d520d7000942f821889a717c1f87a2773` | 1008×756 | `39648b9765be38e16e816915ac6729fe869891f5cf28c7254deba44b6b9c4721` | same |

**Licence status:** owner-supplied; **generator/licence terms not yet
recorded** — confirm the tool and its commercial-use terms (or the
photographer's permission) before Production.

The folder's remaining coffee and product photos duplicate or resemble
existing catalog imagery and are not used. Selected process, logistics and
farm-stage images are documented below and are captioned as representative
network stages, never as Whitehorse-owned facilities or a specific shipment.

**Rules for a studio file** (check visually before committing):
text-free; no logos, seals, badges, certification marks, claims or retail
packaging; 4:3, JPEG under 400 KB; `alt` in `FAMILY_IMAGES` must describe
what the image actually shows. Record the source, date, SHA-256 and
licence terms in a new row here.

**How they are presented:** editorial and studio compositions have no
visual-type badge. Concept packaging remains labelled and carries its
per-order disclosure. Neither mode is presented as a
specific inventory lot, supplier batch, certification/traceability evidence
or stock availability.

**Homepage portfolio treatment (2026-09-30, final refinement):** several
family images sit on warm peach studio sweeps, which read beige on the
light page. The fix is presentation only: on the homepage grid each
family visual sits on a cool mist mount (`bg-muted`, 12–16px, hairline)
on a white section, with CSS `brightness-[1.03] saturate-[0.82]`. The
source files, crops and `FAMILY_IMAGES` mapping are unchanged; no image was
added, generated, retouched or recoloured on disk. Inner pages keep their
existing treatment.

**Retired:** `public/images/products/*-card.jpg` / `*-detail.jpg`
(packaging mock-ups with "100% natural", "organic & natural" and similar
wording) are no longer referenced by any code
(`tests/about-imagery.test.ts` blocks the paths). The files remain on disk
in this branch; delete them before Production so they are not publicly
reachable by URL.

## Range visuals — coconut, bird's nest, fruit, nuts & spices (added 2026-09-28)

Packs: `public/images/catalog/{coconut,birds-nest,fruit}/packs/` — same
source folder and label rule as the coffee renders below (the fruit BIB is
rendered from the source GLB). Neutral crops:
`public/images/catalog/{fruit,nuts-spices-botanicals}/studio/` — from the
owner's Drive images and the CEO brief DOCX. Per-file source, hash, label
status and range mapping: `docs/image-inventory.md`. Shown only at range
level (defined SKUs without public code-level pages). Concept packaging
keeps the visible "Concept packaging" / "Bao bì ý tưởng" label; ordinary
product imagery has no visual-type badge.

## Coffee packaging concept renders (added 2026-09-28)

Source: CEO folder `D:\Working\WK 2\White Horse\BM Foodtech\Anh SKU\Anh san pham\WHITEHORSE_01_COFFEE.zip`
(README: "Concept renders, not production artwork"). Full per-file
mapping, source hashes, selection reasons and every file **not** used:
`docs/image-inventory.md`.

| Public file |
|---|
| `public/images/catalog/coffee/packs/whcf001-concept-pack.webp` |
| `public/images/catalog/coffee/packs/whcf002-concept-pack.webp` |
| `public/images/catalog/coffee/packs/whcf003-concept-pack.webp` |
| `public/images/catalog/coffee/packs/whcf004-concept-pack.webp` |
| `public/images/catalog/coffee/packs/whcf005-concept-pack.webp` |
| `public/images/catalog/coffee/packs/whcf006-concept-pack.webp` |
| `public/images/catalog/coffee/packs/whcf007-concept-pack.webp` |
| `public/images/catalog/coffee/packs/whcf008-concept-pack.webp` |
| `public/images/catalog/coffee/packs/whcf009-concept-pack.webp` |

**How they are presented:** first image on the SKU page and SKU cards,
with the visible badge "Concept packaging" / "Bao bì ý tưởng" and the SKU
page note that label text is illustrative and the final pack, label and
specification are confirmed with the supplier or co-packer per order.
Never as a photograph of stock or a final label.

## Platform and supply-network imagery (added 2026-09-28)

Source: owner-supplied folder `Ảnh WEB-20260928T141117Z-1-001.zip`.
Selected images show real stages that can occur across the supply network:
processing, partner facilities, harvest/collection and logistics. They are
shown only with an explicit representative-image caption. They must not be
read as a claim that Whitehorse owns the pictured facility, contracted the
pictured people, or handled the pictured shipment.

| Public file | Source file | Derived size | Derived SHA-256 | Processing / use |
|---|---|---|---|---|
| `public/images/platform/quality-processing.webp` | `1.jpg` | 1200×675 | `1a06b5f57437bde9d03b8a7b1623fba33eda8953431ca53f14f7468b177c771b` | Centre crop 16:9, WebP q82; Quality hero; homepage hero primary image (LCP) since 2026-09-30 |
| `public/images/platform/process-container-loading.webp` | `1.png` | 1200×675 | `32c40939c3934d36b3c88a0e428b1cc0c8e5611281561a6b6365af14ab4e5d63` | Centre crop 16:9, WebP q82; How We Work hero |
| `public/images/platform/process-partner-facility.webp` | `4.jpg` | 1200×675 | `0c4252e96ed2f332b7330f527432ac81e50d6a1943d9d3e347590177ad343b95` | Centre crop 16:9, WebP q82; partner-facility section |
| `public/images/platform/network-coffee-harvest.webp` | `THU GOM CAFE.jpg` | 1200×675 | `90d84593a2f414d48ce5c2164dba84a270a377542dbb7b5494a84fada51d7740` | Centre crop 16:9, WebP q82; Network hero. Not used on the homepage (removed from the hero inset 2026-09-30: coffee-family visual) |
| `public/images/platform/network-air-freight.webp` | `ảnh máy bay.jpg` | 1200×675 | `90081b405ef9d7fd77a7b62f1900c6a90b1b225278553e25ddc5469e1feace9f` | Centre crop 16:9, WebP q82; Network inset; homepage hero inset since 2026-09-30 (only place it appears on the homepage) |
| `public/images/platform/origin-harvest.webp` | `THU CAFE.jpg` (1200×800, SHA-256 `3e11dc75f5123cbb942d67b1bf32e91a3940beb1f302559defcc73d12ef65fde`) | 464×580 | `64c26e581b3c838d5e9dff602af9fd77c5bbf131c1eab9ad58f2d312c66f9d0e` | 4:5 crop at (372,216), native resolution (no upscaling), WebP q82. Crop starts below a small third-party badge on the cap. Homepage hero growing-area tile since 2026-09-30. Location is not recorded in the source; shown as "harvest at a growing area", never as a named region or a Whitehorse farm |

**Licence status:** owner-supplied; photographer/source and commercial-use
rights still need to be recorded before Production replacement or reuse
outside this website.

**Licence status:** owner-supplied renders of Whitehorse's own concept
packaging; tool/designer and rights to be recorded before Production.

## Homepage hero composition (decided 2026-09-30, branch `feat/platform-repositioning`)

**Three-photo composition (owner request, 2026-09-30 evening).** The owner
asked for the hero to combine a Vietnamese growing area, the freeze-drying
photograph and the cargo aircraft. Every genuine origin photograph in the
supplied material (`Ảnh WEB…zip`) shows coffee farms, so the growing-area
tile is `origin-harvest.webp` (from `THU CAFE.jpg`); this owner instruction
supersedes the earlier "no coffee-family visual in the hero" decision below.
`THU GOM CAFE.jpg` stays the Network hero, so no photograph repeats across
those two heroes. Rejected: `ẢNH CAFE.jpg` (1100×734, too small),
`cafe trên cây 2.jpg` (cherries only, no sense of place), all
`Anh SKU/Vector` landscapes (generated label backgrounds) and
`about.jpg` / `factory.jpg` (claims). One caption beneath the collage names
all three stages and states they are not Whitehorse-owned farms, facilities
or a specific shipment; no location is claimed for the photographs.


The platform brief removed the coffee-only hero (`coffee-ground-whole-instant.jpg`)
without replacing it with another single family, a five-product collage,
carousel, video or generated imagery. Audit of the existing owner-supplied
and provenance-recorded assets:

| Candidate | Decision | Reason |
|---|---|---|
| `platform/quality-processing.webp` | **Used — dominant image (LCP)** | Real processing stage (freeze-drying trays, hygiene clothing); no logos or text; not tied to one family |
| `platform/network-air-freight.webp` | **Used — single restrained inset (desktop only)** | Real export stage (palletised air cargo at a freighter); no legible third-party branding; not tied to one family |
| `platform/network-coffee-harvest.webp` | Not used on the homepage (removed 2026-09-30) | Shows coffee cherries — a coffee-family visual. The homepage hero must not feel coffee-led, even as an inset. Kept on Network |
| `platform/process-partner-facility.webp` | Not used on the homepage | Visible third-party equipment brand ("BUHLER") and coffee-sack print ("KHO 03", green coffee) — third-party branding and coffee-led |
| `platform/process-container-loading.webp` | Not used on the homepage | Kept on How We Work |
| Catalog / studio / concept-pack images | Not used in hero | Product imagery belongs below the platform proposition (current portfolio section) |
| `hero.jpg`, `about.jpg`, `factory.jpg` | Not used | Generated concept artwork; about/factory carry unsupported claims |

**Luxury refinement (2026-09-30):** the three-tile collage and its
per-tile stage badges were retired. The hero is now one dominant image on
the black-olive surface with one inset (framed by a 1px hairline rule).
The disclosure is unchanged in substance and still visible, set as a
proper caption directly beneath the visible image, outside the headline
focal area, and naming only what is visible at that breakpoint:

- Desktop (processing image + air-freight inset): "Representative
  supply-network stages — ingredient processing and export air freight.
  Not Whitehorse-owned facilities or a specific shipment."
  (`home.hero.imageCaption`)
- Mobile (processing image only; the inset is hidden): "Representative
  supply-network stage — ingredient processing. Not a Whitehorse-owned
  facility or a specific lot." (`home.hero.imageCaptionMobile`)

VI equivalents use the same keys. The caption makes no location claim for
the air-freight scene. Images get a light CSS desaturation
(`saturate-[0.82–0.85]`) and a surface gradient only; the files themselves
are unchanged. No image was added, generated or retouched.

**Luminous direction (2026-09-30):** same two images, same composition and
same captions, but the hero now sits on the light paper surface instead of
black olive. The dark surface gradient over the processing image was
removed; both images carry only `saturate-[0.9]`. No image was added,
generated or retouched.

**Follow-up (2026-09-30):** the coffee-harvest inset was replaced by the
air-freight image so the hero carries no coffee-family visual. To avoid
showing the same photograph twice, the homepage evidence section is now
image-free (typographic statement + ruled scope rows).

**Asset gap:** no single truthful master image shows Vietnamese origin +
qualification/evidence + global connection across several ingredients. A
commissioned real photo shoot is needed (see the PR description): sample
review / specification check with real documents, multi-ingredient origin
(e.g. coconut, fruit, spices at source) and export packing at a partner
site — with written permission from each pictured site and person.

## Pre-existing imagery

| File | Status |
|---|---|
| `public/images/hero.jpg` | Generated/concept artwork, no text. **Not rendered** (no code reference). Licence/provenance confirmation pending (claim registry row 15). |
| `public/images/products/*-card.jpg`, `*-detail.jpg` | Concept mock-ups with packaging wording ("100% natural", "organic & natural"). **Retired 2026-09-28 — not rendered** (replaced by `FAMILY_IMAGES`). |
| `public/images/about.jpg`, `public/images/factory.jpg` | **Not rendered** — the artwork contains unsupported claims. Kept on disk only. The About page uses the family mosaic instead. |
| `public/images/blog/*` | Not in this branch (user-owned, untracked in the original worktree). |

## Rules

- Never download images from competitor or arbitrary websites.
- No third-party branding, seals, certification marks, "organic", "100%
  natural", awards or other unverified claims inside images.
- Text inside an image is a public claim; the claims scanner cannot read
  it, so check artwork visually before adding it.
