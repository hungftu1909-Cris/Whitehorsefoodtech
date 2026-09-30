# Whitehorse Foodtech — Website

Bilingual (EN/VI) B2B website for Whitehorse Foodtech, a premium
agricultural ingredient sourcing and connection platform linking suitable
Vietnamese farms, cooperatives and processing factories with international
distributors, food and beverage manufacturers, foodservice groups and
brands. Five product families (coconut, fruit, nuts, spices & botanicals, coffee,
bird's nest) with 29 defined core SKUs; mix, blend and custom
formulation development is handled per request. Built
with Next.js 16 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui and
`next-intl`.

## Stack

- **Framework:** Next.js 16 (App Router, static generation where possible)
- **Styling:** Tailwind CSS v4 + shadcn/ui (Base UI primitives)
- **i18n:** `next-intl` — locales `en` (default) and `vi`, always-prefixed
  routes (`/en/...`, `/vi/...`)
- **Forms:** `react-hook-form` + `zod`, submitted to `/api/contact` and
  `/api/rfq`. Delivery rules in `src/lib/lead-delivery.ts`, SMTP transport
  in `src/lib/mailer.ts` (see "Lead delivery" below)
- **Blog:** MDX files in `content/blog/<locale>/*.mdx`, rendered with
  `next-mdx-remote`
- **Design system:** see [`design-system/whitehorse-foodtech/MASTER.md`](design-system/whitehorse-foodtech/MASTER.md)
  for the full color/typography/spacing spec

## Getting started

```bash
npm ci
npm run dev
```

Visit `http://localhost:3000` (redirects to `/en`).

```bash
npm run build          # production build
npm run start          # run the production build locally
npm run lint           # ESLint
npm test               # node:test suites in tests/ (no extra dependencies)
npm run check:claims   # public-claims + placeholder scan (exit 1 on findings)
```

Run `npx tsc --noEmit --incremental false` for a full type check (on a
fresh checkout, run `npx next typegen` or a build first so `next-env.d.ts`
exists).

## Project structure

```
src/app/[locale]/        Pages (App Router, one segment per locale)
src/app/api/              Contact + RFQ form API routes
src/components/           UI components (layout, sections, forms, home, ui/)
src/i18n/                 next-intl routing, navigation, request config
src/lib/                  site facts, SEO, blog, validation, lead delivery
messages/en.json          English copy
messages/vi.json          Vietnamese copy (same keys — enforced by tests)
content/blog/en|vi/*.mdx  Blog posts per locale
scripts/                  claims scanner
tests/                    node:test suites + fixtures
docs/                     deployment guides, claim registry
design-system/            Brand design system reference (MASTER.md)
brand/                    Source brand assets (logo, etc.)
```

## Content rules

- **Public claims** — every number, partner, certification, capacity or
  response-time statement must have a row in
  [`docs/claim-registry.md`](docs/claim-registry.md) with its truth class
  (FACT / PROGRAM SIGNAL / TARGET / VISION). Targets and vision are always
  labelled as such. `npm run check:claims` blocks the wording that was
  removed in Phase 1 (unsupported volumes, "every lot", "exclusively",
  response-time promises, placeholders…).
- **Legal identity** — name, registration/tax code, date and address live
  only in `src/lib/site.ts`; copy that needs them uses placeholders filled
  from there.
- **Specifications** are indicative until confirmed in a contract/COA; the
  product pages say so next to the spec list.
- **Product catalog** — one typed, bilingual source: `src/lib/catalog.ts`
  (families' sourcing ranges + defined SKU counts + published code pages).
  Three layers: `/products` → `/products/<family>` (ranges and any published codes)
  → `/products/<family>/<code>` (e.g. `/products/coffee/whcf007`).
  The defined portfolio contains 29 core SKUs: coffee 9, coconut 5,
  bird's nest 2, fruit 9, and nuts/spices/botanicals 4. Coffee codes
  `WHCF001`–`WHCF009` currently have public detail pages. Defined SKUs are
  not a statement of stock or export readiness. A number may appear in a
  "typical reference parameter" only with a primary source listed in
  [`docs/product-range-sources.md`](docs/product-range-sources.md)
  (tests enforce this); otherwise it reads "agreed per order". Only
  BreadcrumbList/ItemList schema — no Product/Offer schema.
- **Proof figures** — current facts (50+ screened suppliers, 10+ markets)
  and the three-year vision (3,000+ / 10,000+) are always tagged as such.
  The homepage proof strip shows current facts only; vision figures
  appear on About only. See the claim registry rows 3–6.
- **Blog translations** — EN and VI slugs differ. Give both versions of an
  article the same `translationKey` in frontmatter; hreflang, the sitemap
  and the language switcher use it (tests fail on a missing or duplicated
  pair). An article without a translation simply omits the key.
- **Photos** — a missing image renders nothing (no placeholder panel).
  Every rendered image needs a row in
  [`docs/asset-provenance.md`](docs/asset-provenance.md). See
  [`public/images/README.md`](public/images/README.md).

## Lead delivery

`LEAD_DELIVERY_MODE` controls Contact/RFQ delivery (details in
`.env.example`):

- `smtp` — email via SMTP. SMTP not configured → HTTP 503; send failure →
  502. The form only shows success when the email was accepted.
- `log` — redacted summary in the server log, success returned. Local dev /
  Vercel Preview only; refused in Vercel Production.
- unset — `smtp` in production, `log` elsewhere.

Every accepted lead gets a reference such as `RFQ-20260927-7K3QXM`, shown to
the buyer and put in the email subject. `/rfq` accepts
`?product=<slug>&range=<range-id>&sku=WHCF00x&intent=quote|sample|spec-sheet`
(`specification` is an alias of `spec-sheet`) to prefill the form; every
value is whitelisted and older links keep working. Catalog pages build
these links with `src/lib/rfq-links.ts`. Multi-product requests in one
form are a documented follow-up (today: one family/range/code per request,
the rest in "Additional details").

## Before you launch

- [x] **Logo** — `brand/logo-source.png` is the original;
      `brand/logo-mark.png` the cropped emblem; `public/brand/mark-*.png`,
      `src/app/icon.png`, `src/app/apple-icon.png` are generated from it.
- [x] **Product artwork** — all 5 families (`public/images/products/*`,
      4:3 crop) are in (concept mock-ups; see "Imagery" below).
- [ ] **Imagery** — `about.jpg`/`factory.jpg` are not rendered because
      the artwork contains unsupported claims; product mock-ups carry
      packaging wording ("organic & natural") and are captioned as
      illustrative. Replace with claim-free, licensed imagery (see
      [`public/images/README.md`](public/images/README.md)). Blog covers
      are optional.
- [ ] **Claim evidence** — see "Evidence needed" in
      [`docs/claim-registry.md`](docs/claim-registry.md): dated market log
      behind "10+ markets", dated supplier list and screening criteria behind
      "50+ screened suppliers", Balance Life naming permission, supplier
      assessment checklist.
- [ ] **Catalog image rights** — the four coffee images from the
      website-edit brief are user-supplied and stock-style; confirm
      commercial licence before Production (see
      [`docs/asset-provenance.md`](docs/asset-provenance.md)).
- [ ] **Leadership & testimonials** — sections are hidden until approved
      names/bios/quotes exist. Never publish a company's name, logo or quote
      without written permission.
- [ ] **Legal review** — `/privacy` (Privacy Notice) and `/terms` (Website
      Terms) are concise notices that have **not** been reviewed by counsel.
      They stay `noindex` and out of the sitemap until a lawyer familiar
      with the target markets (e.g. Decree 13/2023/NĐ-CP, GDPR) approves
      final text (claim registry row 16).
- [ ] **Email delivery** — SMTP env vars set in Vercel **Production** scope
      only, `RFQ_MAIL_TO` owned by the sales team (see
      [`docs/deployment-vercel.md`](docs/deployment-vercel.md)).
- [ ] **Domain** — production `NEXT_PUBLIC_SITE_URL` must be
      `https://www.whitehorsefoodtech.com` (apex redirects to www).
- [ ] **Social links** — `siteConfig.social` is still empty.

## Deployment

Source is on GitHub: https://github.com/hungftu1909-Cris/Whitehorsefoodtech

- [`docs/deployment-vercel.md`](docs/deployment-vercel.md) — current
  target: Vercel (zero-config, auto-deploy on push, recommended)
- [`docs/deployment-namecheap-vps.md`](docs/deployment-namecheap-vps.md) —
  alternative: Namecheap VPS (Node.js + PM2 + Nginx + Let's Encrypt)
- [`docs/deployment.md`](docs/deployment.md) — alternative: Hostinger
  Node.js hosting
