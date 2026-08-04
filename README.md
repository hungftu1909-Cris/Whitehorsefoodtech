# Whitehorse Foodtech — Website

Bilingual (EN/VI) B2B export website for Whitehorse Foodtech (coffee,
freeze-dried fruit powder and premium agri raw materials), built with
Next.js 16 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui and
`next-intl`.

## Stack

- **Framework:** Next.js 16 (App Router, static generation where possible)
- **Styling:** Tailwind CSS v4 + shadcn/ui (Base UI primitives)
- **i18n:** `next-intl` — locales `en` (default) and `vi`, always-prefixed
  routes (`/en/...`, `/vi/...`)
- **Forms:** `react-hook-form` + `zod`, submitted to `/api/contact` and
  `/api/rfq`, emailed via `nodemailer` (see `src/lib/mailer.ts`)
- **Blog:** MDX files in `content/blog/<locale>/*.mdx`, rendered with
  `next-mdx-remote`
- **Design system:** see [`design-system/whitehorse-foodtech/MASTER.md`](design-system/whitehorse-foodtech/MASTER.md)
  for the full color/typography/spacing spec

## Getting started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` (redirects to `/en`).

```bash
npm run build   # production build
npm run start   # run the production build locally
npm run lint    # ESLint
```

## Project structure

```
src/app/[locale]/        Pages (App Router, one segment per locale)
src/app/api/              Contact + RFQ form API routes
src/components/           UI components (layout, sections, forms, home, ui/)
src/i18n/                 next-intl routing, navigation, request config
messages/en.json          English copy
messages/vi.json          Vietnamese copy
content/blog/en|vi/*.mdx  Blog posts per locale
design-system/            Brand design system reference (MASTER.md)
brand/                    Source brand assets (logo, etc.)
```

## Before you launch

This site was scaffolded with **placeholder content** (marked `[Placeholder — ...]`
in `messages/en.json` / `messages/vi.json`) because real content wasn't
available yet. Search both files for `[Placeholder` and `TODO` to find every
spot that needs a real answer before this goes live. In particular:

- [x] **Logo** — real logo received and wired in: `brand/logo-source.png` is
      the original; `brand/logo-mark.png` is the cropped emblem (source of
      truth for re-exports); `public/brand/mark-*.png`, `src/app/icon.png`,
      `src/app/apple-icon.png` and the OG image are all generated from it.
      If a vector/SVG source becomes available later, re-export from that
      instead for crisper edges at all sizes.
- [ ] **Photography** — drop licensed/real photos into `public/images/...`
      using the exact filenames listed in [`public/images/README.md`](public/images/README.md)
      and they replace the placeholders automatically (see
      `src/components/ui/smart-image.tsx`).
- [ ] **Company details** — `src/lib/site.ts` has placeholder address, phone
      and email. Update these (they feed the footer, contact page and
      structured data).
- [ ] **Certifications** — `certifications.items` in both message files list
      generic certification types (ISO 22000, HACCP, organic, FDA). **Only
      list certifications actually held**, with certificate numbers/validity
      where applicable — do not publish unverified claims.
- [ ] **Testimonials & client logos** — `home.testimonial` and the `/clients`
      page are placeholders. Never publish a company's name, logo or quote
      without their written permission.
- [ ] **About page stats/team** — `about.stats.items` and `about.team` need
      real figures and leadership bios.
- [ ] **Legal pages** — `/privacy` and `/terms` are stubs. Have a lawyer
      familiar with your target markets (e.g. GDPR for EU buyers) review
      before launch.
- [ ] **Email delivery** — copy `.env.example` to `.env.local` and fill in
      real SMTP credentials, or the contact/RFQ forms will only log
      submissions to the server console instead of emailing them.
- [ ] **Domain** — set `NEXT_PUBLIC_SITE_URL` to the real production domain
      (used in canonical URLs, sitemap.xml, OG tags).

## Deployment (GitHub → Hostinger)

See [`docs/deployment.md`](docs/deployment.md) for the step-by-step guide to
pushing this repo to GitHub and deploying it on Hostinger's Node.js hosting.
