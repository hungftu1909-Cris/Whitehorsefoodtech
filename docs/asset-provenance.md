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

## Pre-existing imagery

| File | Status |
|---|---|
| `public/images/hero.jpg` | Generated/concept artwork, no text. Rendered (homepage). Licence/provenance confirmation pending (claim registry row 15). |
| `public/images/products/*-card.jpg`, `*-detail.jpg` | Concept mock-ups with packaging wording ("100% natural", "organic & natural"). Rendered only with a visible "Concept artwork" badge. Replacement with claim-free artwork is a pending owner decision. |
| `public/images/about.jpg`, `public/images/factory.jpg` | **Not rendered** — the artwork contains unsupported claims. Kept on disk only. |
| `public/images/blog/*` | Not in this branch (user-owned, untracked in the original worktree). |

## Rules

- Never download images from competitor or arbitrary websites.
- No third-party branding, seals, certification marks, "organic", "100%
  natural", awards or other unverified claims inside images.
- Text inside an image is a public claim; the claims scanner cannot read
  it, so check artwork visually before adding it.
