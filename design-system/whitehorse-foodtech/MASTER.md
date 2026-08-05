# Whitehorse Foodtech — Design System (Master)

Curated from the brand logo (dark roast brown horse + bronze gear/globe mark on
cream) and cross-checked against `ui-ux-pro-max` (`--domain color`, `--domain
style`, `--domain typography`) for "premium coffee export / heritage /
B2B international" queries. Auto-suggested generic SaaS-navy / Liquid-Glass
results were rejected as off-brand; the tokens below were hand-tuned instead.
Colors were verified against the real logo file (`brand/logo-source.png`,
supplied 2026-08-04) via pixel sampling — dominant emblem ink colors cluster
around `#48240c`–`#603018`, consistent with the `--color-primary` chosen
below. The cropped emblem mark used across the site lives at
`brand/logo-mark.png` (source) / `public/brand/mark-*.png` (web copies).

Product type: B2B export / premium agriculture (coffee, freeze-dried fruit
powder, agri raw materials). Audience: international buyers/importers +
domestic partners. Tone: heritage, trustworthy, premium, industrial precision
— not flashy SaaS, not rustic-cheap.

## Pattern

Storytelling + trust-building, feature-rich B2B export site — not a SaaS
product marketing site. Sections per landing-style page: Hero → Value pillars
→ Product categories → Certifications/trust strip → Process/factory →
Testimonials/partners → CTA (RFQ).

## Style: "Heritage Editorial"

Custom blend of **Editorial Grid/Magazine** (large photography, generous
whitespace, confident typographic hierarchy) restrained by **Swiss
Modernism** structure (strict grid, mathematical spacing, no gimmicks). No
glassmorphism/liquid-glass — moderate-poor a11y and reads as generic SaaS,
wrong register for an export/agriculture heritage brand.

- Full-bleed photography (coffee cherries, freeze-dried fruit, factory floor)
- Thin 1px bronze rule dividers between sections, not heavy borders
- Generous vertical rhythm (96–160px section padding on desktop)
- Cards: flat, 1px border, no heavy shadow — subtle `shadow-sm` on hover only
- Icons: Lucide (outline), never emoji
- Motion: subtle fade/slide-up on scroll (200–350ms, ease-out), respect
  `prefers-reduced-motion`. No morphing/parallax gimmicks.

## Colors

Light mode is primary (export/B2B site — dark mode is a nice-to-have, not a
requirement). Contrast checked against WCAG AA (4.5:1 body text).

| Token | Hex | Usage |
|---|---|---|
| `--color-primary` | `#3B2314` | Dark roast brown — headers, primary buttons, nav bg |
| `--color-primary-foreground` | `#FBF7EE` | Text/icons on primary |
| `--color-secondary` | `#6B4A2E` | Mid brown — secondary surfaces, hover states |
| `--color-accent` | `#B8863A` | Bronze/gold — CTA highlights, links, active states, icons |
| `--color-accent-foreground` | `#241505` | Text on accent |
| `--color-background` | `#FBF8F1` | Page background (warm cream, matches logo bg) |
| `--color-foreground` | `#241505` | Body text (near-black warm brown, not pure black) |
| `--color-card` | `#FFFFFF` | Card surfaces |
| `--color-card-foreground` | `#241505` | Text on cards |
| `--color-muted` | `#F1E7D6` | Muted section backgrounds, tags |
| `--color-muted-foreground` | `#4A3C2C` | Secondary/caption text (darkened 2026-08 for stronger contrast) |
| `--color-border` | `#E4D6BC` | Hairline borders/dividers |
| `--color-success` | `#4B6043` | Organic/certification badges |
| `--color-destructive` | `#B3261E` | Form errors |
| `--color-ring` | `#B8863A` | Focus ring (accent) |

Dark mode (optional, used for footer / optional toggle): background
`#1C120A`, foreground `#F1E7D6`, card `#241708`, keep the same accent
`#B8863A` (already passes 4.5:1 on dark backgrounds).

Do not use pure black (`#000`) or the generic navy/blue the tool's
auto-search defaulted to — off-brand.

## Typography — "Classic Elegant" pairing

Chosen because both fonts have full Vietnamese diacritic subsets (required
for the bilingual EN/VI site) and read as premium/editorial rather than
generic SaaS-sans.

- Display/headings: **Playfair Display** (600/700), `font-serif`
- Body/UI: **Inter** (400/500/600), `font-sans`
- Google Fonts: `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap&subset=vietnamese`

Scale (desktop → mobile clamps via Tailwind):
- H1: 56/64px → 34px, `font-serif font-semibold tracking-tight leading-[1.05]`
- H2: 40/44px → 28px, `font-serif font-semibold leading-tight`
- H3: 26/28px → 22px, `font-serif font-medium`
- Body: 16–18px, `font-sans leading-relaxed`
- Caption/label: 13px, `font-sans uppercase tracking-wide text-muted-foreground`

## Spacing / density

Standard marketing density (not dashboard-dense): `--space-*` 16–96px scale,
section padding `py-24 md:py-32`, container `max-w-7xl`.

## Effects

- Buttons: solid accent bg, `rounded-md`, no heavy shadow; hover = darken 8%
- Cards: `rounded-lg border border-border bg-card`, hover `shadow-md
  transition-shadow duration-200`
- Section dividers: `border-t border-border` or a 2px accent rule for major
  breaks
- Scroll reveal: `opacity-0 translate-y-4` → `opacity-100 translate-y-0`,
  `duration-300 ease-out`, IntersectionObserver-driven, disabled under
  `prefers-reduced-motion: reduce`

## Anti-patterns to avoid

- Emoji as icons (use `lucide-react`)
- Liquid glass / heavy blur / iridescent gradients (off-brand, poor a11y)
- Stock-photo-generic "handshake" imagery — prefer product/process photography
- Gray-on-gray low-contrast text
- Mixing more than the two type families above

## Pre-delivery checklist

- [ ] Contrast ≥ 4.5:1 for all body text combinations above
- [ ] Focus rings visible (accent ring) on every interactive element
- [ ] `cursor-pointer` on all clickable elements
- [ ] Responsive at 375 / 768 / 1024 / 1440px
- [ ] `prefers-reduced-motion` respected
- [ ] All icons SVG (lucide-react), no emoji
