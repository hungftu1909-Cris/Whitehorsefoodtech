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
| `public/images/catalog/coffee/coffee-ground-whole-instant.jpg` | `image1.jpg` (2048×1365) | `04c8f8f5072661370da3fc1eff7c72dbb58caba22b8a19146f902678140edb12` | `f8c9eec0001046e349e679de3d9c53ad7df18af51feab256b0aca4d2c9ea0025` | Resized to 1600×1066, JPEG q80 progressive | Coffee family hero; roasted/instant range and SKU galleries | User-supplied; **production rights confirmation pending** |
| `public/images/catalog/coffee/coffee-roasted-ground-instant-spoons.jpg` | `image2.jpg` (1600×1068) | `25596b840df03b98470fa8fa82796f02336ef66ba54c679e5d8553f9d92e288a` | `40945f1ec9cb1232317124c07637c94d679961820808b1a146df6a7c49740b2a` | Re-encoded 1600×1068, JPEG q80 progressive | Roasted/ground/instant range and SKU galleries | User-supplied; **production rights confirmation pending** |
| `public/images/catalog/coffee/coffee-green-roasted-ground-bowls.jpg` | `image3.jpg` (2048×1365) | `e13e514397e214ca4d2e589279e95b71e55bde11bbd0f2b9107c934acbc1519b` | `e66463d5ebe916c4b5ed8a047279e4c3280fb24652348c1a2c449d997734c5a0` | Resized to 1600×1066, JPEG q80 progressive | Green coffee range and SKU galleries | User-supplied; **production rights confirmation pending** |
| `public/images/catalog/coffee/coffee-green-roasted-flatlay.jpg` | `image4.jpg` (2048×1365) | `7361b182a8df0113e4a2d491f22f1cec7b4a32f129f19a561005bb298bb1b55b` | `c304ff1e397bf22eb50ae79ff8ba80a790506d6ac8dfe07d0cd48673f79dd0c4` | Resized to 1600×1066, JPEG q80 progressive | Green/roasted range and SKU galleries | User-supplied; **production rights confirmation pending** |

**How they are presented:** as *editorial references*, not packshots of a
specific Whitehorse SKU. Every render carries a visible "Editorial image" /
"Ảnh minh họa" badge, and alt text describes what is shown (e.g. "green
and roasted coffee beans with ground coffee"), never a product claim.

**Before Production:** obtain written confirmation of the licence (e.g.
the stock-library licence or photographer's permission) covering
commercial website use, and record the licence reference here.

## Family imagery (added 2026-09-28, branch `feat/phase3-premium-about-studio`)

Single source of truth: `src/lib/family-images.ts` (`FAMILY_IMAGES`),
rendered only through `src/components/catalog/family-visual.tsx` on the
homepage preview, `/products`, each family page hero and the About mosaic.
All renders are 4:3, `next/image`, `object-cover`; the family hero has
`priority`.

| Family | File | Kind | Visible label | Status |
|---|---|---|---|---|
| Coffee | `public/images/catalog/coffee/coffee-green-roasted-flatlay.jpg` | Editorial (real photograph, see table above) | "Editorial image" / "Ảnh minh họa" | Rendered. Chosen because it shows green, roasted and ground coffee on an ivory ground. Production rights pending (as above). |
| Coconut | `public/images/catalog/studio/coconut.jpg` | Studio representation | "Studio representation" / "Hình ảnh studio minh họa" + note | Rendered — see sources below |
| Bird's nest | `public/images/catalog/studio/birds-nest.jpg` | Studio representation | same | Rendered |
| Fruit | `public/images/catalog/studio/fruit.jpg` | Studio representation | same | Rendered |
| Nuts, spices & botanicals | `public/images/catalog/studio/nuts-spices-botanicals.jpg` | Studio representation | same | Rendered |

### Studio image sources (added 2026-09-28)

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

**Not used from the same folder:** factory, warehouse, freeze-dryer,
truck/air-cargo and farm/harvest photos. They would read as Whitehorse
facilities, logistics or suppliers (unsupported) or as stock farmer
imagery, which the Phase 3 design direction excludes. The folder's coffee
photos duplicate or resemble the existing catalog coffee images, which
are left unchanged.

**Rules for a studio file** (check visually before committing):
text-free; no logos, seals, badges, certification marks, claims or retail
packaging; 4:3, JPEG under 400 KB; `alt` in `FAMILY_IMAGES` must describe
what the image actually shows. Record the source, date, SHA-256 and
licence terms in a new row here.

**How they are presented:** always with the visible "Studio
representation" badge and, on the family page, the note "A studio
representation of ingredient formats in this family; product, source and
final specification are confirmed per request." Never as photographed
inventory, a supplier batch, certification/traceability evidence or stock
availability.

**Retired:** `public/images/products/*-card.jpg` / `*-detail.jpg`
(packaging mock-ups with "100% natural", "organic & natural" and similar
wording) are no longer referenced by any code
(`tests/about-imagery.test.ts` blocks the paths). The files remain on disk
in this branch; delete them before Production so they are not publicly
reachable by URL.

## Pre-existing imagery

| File | Status |
|---|---|
| `public/images/hero.jpg` | Generated/concept artwork, no text. Rendered (homepage). Licence/provenance confirmation pending (claim registry row 15). |
| `public/images/products/*-card.jpg`, `*-detail.jpg` | Concept mock-ups with packaging wording ("100% natural", "organic & natural"). **Retired 2026-09-28 — not rendered** (replaced by `FAMILY_IMAGES`). |
| `public/images/about.jpg`, `public/images/factory.jpg` | **Not rendered** — the artwork contains unsupported claims. Kept on disk only. The About page uses the family mosaic instead. |
| `public/images/blog/*` | Not in this branch (user-owned, untracked in the original worktree). |

## Rules

- Never download images from competitor or arbitrary websites.
- No third-party branding, seals, certification marks, "organic", "100%
  natural", awards or other unverified claims inside images.
- Text inside an image is a public claim; the claims scanner cannot read
  it, so check artwork visually before adding it.
