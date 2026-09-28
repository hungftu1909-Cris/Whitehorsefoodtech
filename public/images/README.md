# Real photos go here

Drop a file at the exact path below and it appears automatically — no code
changes needed (see `src/components/ui/smart-image.tsx`). If a file is
missing, the page renders **without** an image block (there are no public
"photo needed" placeholders). JPG, PNG or WebP all work; landscape
orientation, at least 1200px wide recommended.

| Where it's used | File path |
|---|---|
| Homepage hero | `public/images/hero.jpg` |
| (not rendered — see Truthfulness) | `public/images/about.jpg`, `public/images/factory.jpg` |
| Blog cover — per post, optional | `public/images/blog/<post-slug>.jpg` (slug = the `.mdx` filename in `content/blog/en|vi/`; EN and VI slugs differ) |
| Family visual (homepage preview, `/products`, family hero, About mosaic — 4:3) | `public/images/catalog/studio/<slug>.jpg` for non-coffee families (text-free studio representation); coffee uses a catalog editorial photo. Wired in `src/lib/family-images.ts` |
| Coffee SKU packaging concept renders (first image per code) | `public/images/catalog/coffee/packs/whcf00N-concept-pack.webp` — see `docs/image-inventory.md`; always shown with "Concept packaging" |
| Catalog editorial images (product-code cards and galleries) | `public/images/catalog/<family>/*.jpg`, wired in `src/lib/catalog.ts` — always shown with an "Editorial image" badge |

Family slugs (studio filenames):

- `coffee`
- `coconut`
- `birds-nest`
- `fruit`
- `nuts-spices-botanicals`

Example: `public/images/catalog/studio/coconut.jpg` appears on the homepage,
`/products`, `/products/coconut` and the About mosaic, with a visible
"Studio representation" badge. Until it exists, a typographic panel is shown.

## Truthfulness

- Text inside an image is a public claim too, and the claims scanner cannot
  read it. Check artwork for numbers, certification words ("organic",
  "100% natural") and branded facilities before adding it.
- `about.jpg` and `factory.jpg` are currently **not rendered** anywhere:
  their artwork shows unsupported claims ("> 3,000 cooperatives",
  "hundreds of factories", a Whitehorse-branded plant). Replace them with
  claim-free images before wiring them back in (tests enforce this).
- `hero.jpg` has no text and is used with "Illustrative image" alt text.
- `catalog/coffee/*.jpg` come from the user-supplied website-edit brief;
  they are editorial references (not packshots of a specific code) and
  their production rights are pending — see `docs/asset-provenance.md`.
- The old `products/*-card.jpg` / `*-detail.jpg` mock-ups carried packaging
  wording ("100% natural", "organic & natural") and are retired — no code
  may reference them (tests enforce it).
- Studio family images must be text-free: no logos, seals, badges, claims
  or retail packaging. They are always labelled "Studio representation"
  and never presented as inventory, a supplier batch or evidence.
- Never present a partner's or stock photo as "our factory".
- Client/partner logos are not wired into this system: they need the
  company's written permission, and naming suppliers/buyers publicly is a
  business decision (see `src/app/[locale]/clients/page.tsx`).
