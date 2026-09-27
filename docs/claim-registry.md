# Public claim registry

Every statement on whitehorsefoodtech.com that a buyer could rely on in due
diligence is listed here with its truth class, the person who owns the
evidence, the exact public wording and when it must be re-checked.

**Rule:** no new public claim (numbers, partners, certifications, capacity,
response times, "every/exclusive/leading" wording) ships without a row in
this file. `npm run check:claims` blocks the wording that Phase 1 removed;
if a blocked claim later becomes evidenced, update the rule in
`scripts/claims.mjs` in the same commit as the row here.

Legal identity facts come only from `src/lib/site.ts`
(Certificate of Business Registration, first registered 2026-08-10) — never
retype them into copy.

## Truth classes

| Class | Meaning | How it must read on the site |
|---|---|---|
| **FACT** | True today and evidenced (document, register, signed record). | Plain present tense. |
| **PROGRAM SIGNAL** | Real, current activity that is not yet a finished result (e.g. an initiative in development). | Present progressive ("is working with…", "is being developed"), with what is *not* yet confirmed stated explicitly. |
| **TARGET** | A goal with a defined scope and horizon. | Always labelled as a target ("Phase 1 target", "Mục tiêu giai đoạn 1"), never next to a fact without its tag. |
| **VISION** | Long-term direction; no delivery commitment. | Labelled "Long-term direction · Vision — not a current service". At most one short paragraph (About). |

## Active claims

Effective date for all rows: **2026-09-27** (Phase 1 branch
`feat/phase1-truth-seo-rfq`).

| # | Claim | Class | Evidence owner | Evidence on file | Public wording (EN / VI) and location | Review by |
|---|---|---|---|---|---|---|
| 1 | Legal entity: White Horse Food Tech JSC / Công ty Cổ phần Công nghệ Thực phẩm Bạch Mã, business reg./tax code 0111597790, Hanoi, first registered 2026-08-10 | FACT | Founder (legal) | Certificate of Business Registration | Footer legal line; JSON-LD `legalName`, `taxID`, `foundingDate`; About/status "2026 — Registered in Hanoi as a Vietnamese joint stock company" / "Đăng ký tại Hà Nội, là công ty cổ phần Việt Nam" | On any registration change |
| 2 | 20+ supplier organisations in the working network, across engagement and assessment stages; not all qualified, active or export-ready | FACT (founder-supplied) | Founder | Founder statement 2026-09-27. **Gap:** a dated list of organisations with their stage (contacted / engaged / under assessment / qualified / active / export-ready) should be kept internally to back this number | Home + About status markers, tag "Current"/"Hiện tại"; Network page card "20+ Supplier organisations in our working network" with the stage caveat | 2026-10-31, then monthly |
| 3 | 30–50 qualified suppliers | TARGET (Phase 1) | Founder | Phase 1 plan | Status markers and Network page, always tagged "Phase 1 target" / "Mục tiêu giai đoạn 1"; "Qualification is specific to each product, site and market" | End of Phase 1, or when the qualified count changes |
| 4 | Supplier qualification is product-, site- and market-specific; certificates belong to a specific supplier/site/scope and are shared per order | FACT (process) | Founder / quality lead | Internal supplier-assessment checklist (**gap:** write it down if not yet documented) | Quality & Supplier Qualification page; home teaser; How We Work step 2 | 2026-12-31 |
| 5 | Standards checked during assessment: ISO 22000 / FSSC 22000, HACCP, organic (USDA/EU), FDA facility registration / FSVP info | FACT (process) — **not** a claim that Whitehorse or all suppliers hold them | Quality lead | Assessment checklist | Quality page items, "not a claim that each supplier holds all of them" | 2026-12-31 |
| 6 | Coffee is the focus category; coconut, bird's nest, fruit, nuts/spices/botanicals are sourced or developed on request | FACT (commercial focus) | Founder | Phase 1 plan | Home hero/segments/product preview badges; Products hero; per-category status badge | Whenever a category's status changes |
| 7 | Coffee formats WHCF001–WHCF009 (Green Robusta … Freeze-Dried Instant) | FACT (internal codes) — not availability | Founder / sales | Product plan | **Only** as "Coffee format of interest (optional)" choices in the RFQ form with "doesn't mean it is in stock or export-ready". No SKU pages, no Product/Offer schema | Before any SKU page is built |
| 8 | Product specifications (screen size, moisture, mesh, packaging) | Indicative reference | Sales / quality | Industry-typical ranges | "Indicative specifications" + note "Final specifications are confirmed in your contract and the certificate of analysis (COA)" on every product page | When supplier spec sheets exist |
| 9 | Process commitments: specification agreed in writing, samples/COA arranged per order, documents prepared with logistics/documentation partners, suppliers still in assessment are identified | FACT (process commitment) | Founder / sales lead | Sales SOP (**gap:** confirm it is written down) | Home trust strip, value props, How We Work | 2026-12-31 |
| 10 | Follow-up promise | FACT (process) | Sales lead | Lead routing: `RFQ_MAIL_TO` inbox has an owner | "Our sales team reviews qualified requests and follows up with the next commercial step." (No response-time promise) | When an SLA is agreed |
| 11 | Balance Life circular-agriculture initiative | PROGRAM SIGNAL | Founder | Founder confirmation 2026-09-27 that Whitehorse is working with Balance Life. **Gap:** written confirmation from Balance Life that it may be named publicly | About → "Ecosystem development": "Whitehorse Foodtech is currently working with Balance Life around a circular-agriculture initiative. The broader initiative brings together production, value-chain and finance participants. … participant names, scale and implementation scope will be disclosed only once they are formally confirmed." No logos. No other participant named | 2026-10-31 |
| 12 | Open platform for Vietnamese agriculture (supplier qualification, specs, lot information) | VISION | Founder | — | About → labelled "Long-term direction / Vision — not a current service". WBIS/WBOS stay internal and unnamed; no Platform nav item | Annually |
| 13 | Focus export markets: North America, EU, East Asia, Middle East | TARGET | Founder | — | Network page, section "Focus export markets": "the markets Whitehorse Foodtech is prioritising as it builds buyer relationships" (no shipment or market-presence claim) | 2026-12-31 |
| 14 | Mission ("We build a better food system …") | VISION | Founder | — | About mission block (quoted) | Annually |
| 15 | Images | Illustrative | Founder | **Gap:** provenance/licence of all current imagery (it appears to be generated concept artwork) | `hero.jpg` only (no text in the artwork), alt "Illustrative image …". **Not rendered:** `about.jpg` (artwork text "> 3,000 cooperatives", "hundreds of factories", "hundreds of markets") and `factory.jpg` (Whitehorse-branded factory, trucks and lab; global-delivery slogan) — both contradict rows 2–3 and the partner-facility model. Product images are concept mock-ups whose packaging text says "100% natural", "organic & natural", "strict quality control": every render (home cards, /products cards, product detail) carries a **visible** "Concept artwork" / "Hình minh họa ý tưởng" badge on the image, alt "illustrative concept artwork", and the detail page adds a caption that label text in the image is not a specification, certification or claim. **Founder decision:** replace product artwork with claim-free imagery, or confirm the label claims per product | Before any paid campaign; when artwork is replaced |
| 16 | Privacy Notice and Website Terms (/privacy, /terms) | FACT (concise notices) — **legal review pending** | Founder (legal) | Text drafted 2026-09-27; **not yet reviewed by counsel** (Decree 13/2023/NĐ-CP, GDPR for EU buyers) | Public pages read as complete notices ("Last updated: 27 September 2026") without announcing their status; they stay `noindex` and out of `sitemap.xml` until reviewed. Do not describe them as legally reviewed anywhere | Before indexing; before any EU-targeted campaign |

## Removed in Phase 1 (blocked by `npm run check:claims`)

| Former claim | Why removed |
|---|---|
| "100K+ metric tons exported every year" (hero badge, About stats) | No customs/contract evidence; contradicts 2026 registration. |
| "30 countries served" / "30+ countries reached through our trading network" | No shipment evidence. |
| "3,000+ partner growing regions" | No supplier list supports it; replaced by claim #2 and target #3. |
| "5 years in export trade" | Company registered 2026; founder experience would need its own evidence and wording. |
| "Every lot is traceable / tested / graded", "every facility", "every shipment" | Universal QA/QC not evidenced; replaced by per-order commitments (#9). |
| "We partner exclusively with …", "exclusively FDA-registered facilities" | Exclusivity and blanket certification not evidenced; replaced by #4/#5. |
| "Our manufacturing partners run modern, temperature-controlled facilities … at scale"; factory photo as "our processing facility" | Implied owned/assessed capacity; replaced by "Partner facilities" wording and #15. |
| "Formal quote within 1–2 business days" | Response SLA not confirmed; replaced by #10. |
| Blog: "Whitehorse Foodtech has expanded into deeper-processed coffee lines", "…bird's nest line is built to serve", "…fruit powder line already serves" | Unsupported product-line claims inside market-research posts. |
| Example article "Incoterms for agricultural exports" (EN/VI) | Template/example content. |
| "[Placeholder — …]" leadership, testimonials, privacy, terms | Placeholder text on public pages; leadership/testimonials hidden until real, legal pages replaced with interim notices (noindex). |

## Drafts — NOT rendered, do not publish without the listed permission

These texts are kept here only so that approved wording is ready. They must
not appear in `messages/`, `content/` or `src/` (the claims scanner fails
the build on "VPBank") until the permission column is satisfied and the row
moves to "Active claims".

| Draft | Class if published | Required before publication | Draft wording |
|---|---|---|---|
| VPBank as a finance participant in the Balance Life initiative | PROGRAM SIGNAL | 1. Explicit written permission from VPBank to be named. 2. Written confirmation from Balance Life. 3. Founder sign-off on exact wording. VPBank must **not** be described as a direct Whitehorse partner unless a direct agreement exists and is evidenced. | EN: "The broader circular-agriculture initiative that Whitehorse Foodtech is working on with Balance Life includes VPBank as a finance participant." VI: "Sáng kiến nông nghiệp tuần hoàn rộng hơn mà Whitehorse Foodtech đang cùng Balance Life thực hiện có sự tham gia của VPBank với vai trò bên tài chính." — VPBank's exact role must be confirmed by VPBank before either sentence is used. |
