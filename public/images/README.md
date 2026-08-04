# Real photos go here

Drop a file at the exact path below and it replaces the placeholder
automatically — no code changes needed (see `src/components/ui/smart-image.tsx`).
JPG, PNG or WebP all work; landscape orientation, at least 1200px wide
recommended.

| Where it's used | File path |
|---|---|
| Homepage hero | `public/images/hero.jpg` |
| About page (team/office) | `public/images/about.jpg` |
| Process page (factory) | `public/images/factory.jpg` |
| Blog cover — per post | `public/images/blog/<post-slug>.jpg` (slug = the `.mdx` filename in `content/blog/en|vi/`) |
| Product card (homepage + `/products` listing) | `public/images/products/<slug>-card.jpg` |
| Product detail page | `public/images/products/<slug>-detail.jpg` |

Product slugs (used in both `-card` and `-detail` filenames):

- `coffee`
- `freeze-dried-fruit-powder`
- `processed-birds-nest`
- `premium-agri-raw-materials`

Example: the Coffee category needs `public/images/products/coffee-card.jpg`
(shown on homepage + `/products`) and `public/images/products/coffee-detail.jpg`
(shown on `/products/coffee`).

Client/partner logos on `/clients` are a separate case — those must be the
*actual* client's logo (with their permission), not stock photography, so
they aren't wired into this system. Ask a developer to swap them in
`src/app/[locale]/clients/page.tsx` once you have approved logos.
