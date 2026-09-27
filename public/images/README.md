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
| Product card (homepage + `/products` listing, 4:3 crop) | `public/images/products/<slug>-card.jpg` |
| Product detail page (4:3 crop) | `public/images/products/<slug>-detail.jpg` |
| Catalog editorial images (family hero, product-code cards and galleries) | `public/images/catalog/<family>/*.jpg`, wired in `src/lib/catalog.ts` — always shown with an "Editorial image" badge |

Product slugs (used in both `-card` and `-detail` filenames):

- `coffee`
- `coconut`
- `birds-nest`
- `fruit`
- `nuts-spices-botanicals`

Example: the Coffee category needs `public/images/products/coffee-card.jpg`
(shown on homepage + `/products`) and `public/images/products/coffee-detail.jpg`
(shown on `/products/coffee`).

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
- Product images are concept mock-ups with packaging wording ("100%
  natural", "organic & natural"). Every render shows a visible "Concept
  artwork" badge (pass `badge` to `SmartImage`; tests enforce it) and the
  detail page adds a caption. Alt text alone is not a disclosure. Replacing them
  with claim-free artwork is a pending founder decision
  (`docs/claim-registry.md` row 15).
- Never present a partner's or stock photo as "our factory".
- Client/partner logos are not wired into this system: they need the
  company's written permission, and naming suppliers/buyers publicly is a
  business decision (see `src/app/[locale]/clients/page.tsx`).
