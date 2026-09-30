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

## Quiet-luxury refinement (2026-09-30)

Thesis: **premium sourcing house × institutional ingredient platform.**
Quiet luxury — confident contrast, editorial photography, disciplined
typography, generous negative space, fewer UI boxes, restrained bronze and
deliberate asymmetry. Not a coffee shop, not a SaaS dashboard.

- Surfaces alternate deliberately: `bg-deep` black-olive (`--deep`
  `#131B16`, ivory `--deep-foreground` `#F6F1E4`, stays dark in both
  themes) → ivory → forest (`bg-primary`) → ivory → sand (`bg-muted`) →
  black-olive → ivory → forest footer.
- One dominant photograph per composition, at most one inset, framed by a
  1px hairline rule (no thick frames); no badges over crops.
  Representative-image disclosures are real captions, set directly beneath
  the visible image and describing only what is visible at that breakpoint.
  An image appears once per page. The homepage hero carries no
  coffee-family visual.
- Sequences are ruled and numbered (serif bronze numerals, hairline
  `border-foreground/15` rules); evidence is ruled rows; technology is one
  backbone rule with status markers (filled = operating now, ring = being
  built, faint ring = roadmap). No card grids, pills or icon tiles on the
  homepage.
- Actions: primary = solid ivory/forest block, `h-12 px-7`, sharp corners;
  secondary = underlined text link (`underline-offset-8`,
  `decoration-accent/50`). No decorative arrows.
- `--radius` is `0.25rem`. No drop shadows except the floating CTA's soft
  separation shadow.
- Type: headings `font-medium` Playfair, not semibold; H1 3 lines on
  desktop, ≤4 on mobile. Body ≥16px; labels ≥12px (`text-xs`) with wide
  tracking. Header is 80px with a 48px mark.

## Luminous direction (2026-09-30, supersedes the dark surfaces above)

Review feedback: the black-olive full-height hero plus a dark industrial
image made the brand feel heavy, closed and factory-led. Thesis kept
(premium sourcing house × institutional ingredient platform); the *form*
of premium changes from dark editorial to **luminous** — daylight,
precision and openness. Not a colour swap and not a beige lifestyle site.

- **Light is the default for every first visit.** `ThemeProvider` uses
  `defaultTheme="light"` without `enableSystem`; an OS dark preference no
  longer darkens the site. Dark stays available from the header toggle.
  `theme-color` is the paper `#FBFAF7`.
- **Surfaces:** paper `--background #FBFAF7` (brighter, less yellow than the
  old ivory), white `--card #FFFFFF`, and mist `--muted #F0F2ED` (a pale,
  slightly sage daylight neutral replacing the beige sand). Border
  `#DFE2D9`. Homepage rhythm: luminous hero → white → mist (proof) →
  paper (portfolio) → white (evidence) → mist (technology) → paper (split
  CTA) → forest footer. No `bg-deep` or forest section bands on the homepage
  (guarded by `tests/platform-experience.test.ts`).
- **Forest is ink, not a room:** `--primary #1F2E25` sets headlines, key
  figures and solid primary actions; the footer is the single dark block.
- **`.bg-luminous`** (globals.css): paper with a white bloom behind the
  headline and a faint champagne / sage warmth toward the photograph. It is
  a wash, not a decorative gradient; no glass or blur.
- **Photography in daylight:** the hero composition is unchanged (processing
  image + air-freight inset + caption), but the photograph sits on paper
  with no darkening overlay; the inset sits on a 1px `foreground/15`
  hairline. Only a light `saturate-[0.9]` is applied; files are untouched.
- Proof figures are forest serif numerals on hairline rules on mist; the
  custom-sourcing plate is mist on a hairline; split-CTA plates are white
  on a hairline (buyer, solid forest action) and mist (supplier, outline).

### Final refinement (2026-09-30)

- **Homepage rhythm (updated):** luminous hero → white (operating
  standard) → daylight mist (proof) → white (portfolio) → luminous
  (evidence) → daylight mist (technology) → paper (split CTA) → forest
  footer. **`.bg-daylight`** is mist lifted by a white bloom from above, a
  faint sage settle below and a 1px top hairline — same palette as
  `.bg-luminous`, no new colours, so the middle carries light instead of
  reading as flat grey stock.
- **Mobile hero is content-first:** below `lg` the order is eyebrow →
  headline → subtitle → actions → photograph + disclosure caption →
  standard / portfolio. From `lg` the figure is absolutely positioned
  against the section (the content wrapper is `lg:static`); the desktop
  composition is unchanged.
- **Family order is platform-first:** coconut → fruit → nuts, spices &
  botanicals → coffee → bird's nest (`PRODUCT_CATEGORIES`), shared by the
  hero list, portfolio grid, menus, footer, /products and the sitemap.
  Coffee never leads. Homepage family copy is keyed by `categoryKey`.
- **Portfolio imagery:** photographs sit on a cool mist mount on white with
  a gentle `brightness-[1.03] saturate-[0.82]`, so warm studio sweeps read
  as a gallery, not a beige retail shelf. The custom-sourcing plate uses
  the same mount (white plate inside) so every tile aligns.
- **Split CTA:** bodies start on the same line under the label row;
  actions are pushed to a shared baseline (`mt-auto` on the action row).
- **Touch targets:** hamburger, theme toggle, dialog and sheet close
  buttons are 44px (`size-11`); footer social icons keep a 16px glyph in a
  44px target; the EN / VI switcher widens its hit area with an invisible
  `::after`. The hamburger is labelled `nav.openMenu` (“Open menu” / “Mở
  menu”).
- **Browser chrome:** the server emits the paper `theme-color`;
  `<ThemeColor />` retints it to `#111612` once an explicit dark choice
  (header toggle, stored by next-themes) resolves, and back on light.

## Colors

Light mode is primary (export/B2B site — dark mode is a nice-to-have, not a
requirement). Contrast checked against WCAG AA (4.5:1 body text).

| Token | Hex | Usage |
|---|---|---|
**Platform repositioning (2026-09-30):** Whitehorse is a Vietnam premium
ingredient platform, not a coffee brand. Institutional surfaces moved from
dark-roast brown to deep forest / black olive on warm ivory with a
restrained bronze; Whitehorse brown is retained as the secondary heritage
colour (logo, `--secondary`). Product-family colours may appear only as
restrained category accents.

| Token | Hex | Usage |
|---|---|---|
| `--color-primary` | `#1F2E25` | Deep forest — ink for headlines/figures, primary buttons, footer (was `#3B2314`) |
| `--color-primary-foreground` | `#F8F5EC` | Text/icons on primary |
| `--color-secondary` | `#6B4A2E` | Whitehorse heritage brown — secondary surfaces |
| `--color-accent` | `#7D5F27` | Restrained bronze — eyebrows, links, icons, focus (≥ 4.5:1 on ivory, muted and white) |
| `--color-accent-foreground` | `#FBF8F1` | Text on accent |
| `--color-background` | `#FBFAF7` | Page background (daylight paper; was warm ivory `#FBF8F1`) |
| `--color-foreground` | `#1B221D` | Body text (black olive, not pure black) |
| `--color-card` | `#FFFFFF` | Card surfaces |
| `--color-card-foreground` | `#1B221D` | Text on cards |
| `--color-muted` | `#F0F2ED` | Mist — alternate section bands, plates (was sand `#EFEADD`) |
| `--color-muted-foreground` | `#474A3F` | Secondary/caption text (7.5:1 on muted) |
| `--color-border` | `#DFE2D9` | Hairline borders/dividers |
| `--color-success` | `#4B6043` | "Operating now" / current-status badges |
| `--color-destructive` | `#B3261E` | Form errors |
| `--color-ring` | `#7D5F27` | Focus ring (accent) |

Inside any `.bg-primary` surface (not the primary buttons themselves) the accent switches to a lighter bronze
`#C9A462` (6:1 on `#1F2E25`) with `#1B221D` text on accent fills; see
`src/app/globals.css`.

Dark mode (optional toggle): background `#111612`, foreground `#F1E7D6`,
card `#18201A`, accent `#DDB066`; the light-gold dark-mode primary uses a
dark bronze `#5B4418` accent inside `.bg-primary`.

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
