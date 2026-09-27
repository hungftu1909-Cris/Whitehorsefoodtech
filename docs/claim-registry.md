# Public claim registry

Every statement on whitehorsefoodtech.com that a buyer could rely on in due
diligence is listed here with its truth class, the person who owns the
evidence, the exact permitted wording, the evidence needed, the stronger
readings that are **prohibited**, and when it must be re-checked.

**Rule:** no new public claim (numbers, partners, markets, certifications,
capacity, response times, "every/exclusive/leading/highest" wording)
ships without a row in this file. `npm run check:claims` blocks retired
and prohibited wording; `npm test` enforces the fact/objective/vision
tags. If a blocked claim later becomes evidenced, update the rule in
`scripts/claims.mjs` in the same commit as the row here.

Legal identity facts come only from `src/lib/site.ts`
(Certificate of Business Registration, first registered 2026-08-10) — never
retype them into copy. JSON-LD carries Organization facts only (legal
name, tax ID, founding date, address, contact) — **no** market, supplier
or buyer figures, and no Product/Offer schema.

## Truth classes

| Class | Meaning | How it must read on the site |
|---|---|---|
| **FACT** | True today and evidenced (document, register, signed record, CEO-supplied and logged). | Plain present tense; tag "Current" / "Hiện tại" where shown as a figure. |
| **PROGRAM SIGNAL** | Real, current activity that is not yet a finished result. | Present progressive, with what is *not* yet confirmed stated explicitly. |
| **TARGET** | A dated objective with a defined scope. | Always tagged with its date ("2026 objective" / "Mục tiêu 2026"); never next to a fact without its tag. |
| **VISION** | Long-term direction; no delivery commitment. | Tagged "Three-year vision" / "Tầm nhìn 3 năm", or labelled "Long-term direction · Vision — not a current service". |

No public phase/stage language ("Phase 1", "giai đoạn 1") and no startup
apology language; the tags carry the truth boundary.

## Active claims

Effective date: **2026-09-27** (branch `feat/phase2-product-platform-experience`)
unless noted.

| # | Claim | Class | Evidence owner | Evidence needed / on file | Permitted public wording (EN / VI) and location | Prohibited stronger interpretations | Review by |
|---|---|---|---|---|---|---|---|
| 1 | Legal entity: White Horse Food Tech JSC / Công ty Cổ phần Công nghệ Thực phẩm Bạch Mã, reg./tax code 0111597790, Hanoi, first registered 2026-08-10 | FACT | CEO (legal) | Certificate of Business Registration (on file) | Footer legal line; JSON-LD `legalName`, `taxID`, `foundingDate`; "Established in 2026" in value props | "Years of experience", "since …" earlier than 2026 | On any registration change |
| 2 | Positioning: premium agricultural ingredient sourcing and connection platform linking suitable farms, cooperatives and processing factories with international distributors, F&B manufacturers, foodservice groups and brands; organises requirements, source selection, samples/specs, quality documents, commercial alignment and delivery | FACT (business model) | CEO | CEO brief 2026-09-27 | Meta, Home hero, About story, Network hero. VI: "Whitehorse Foodtech là nền tảng kết nối nguồn nguyên liệu nông nghiệp cao cấp của Việt Nam — từ nông hộ, hợp tác xã và nhà máy chế biến phù hợp — …" | Owning farms or factories; direct farm-level sourcing at scale; "only coffee"; exclusive supply | 2026-12-31 |
| 3 | **10+ markets** with active buyer relationships and commercial conversations: Russia, Japan, Qatar, Israel, South Korea, China, United States, Canada, Australia, Germany, Italy, France, Belgium, Netherlands | FACT (CEO-supplied) | CEO | CEO statement 2026-09-27. **Evidence needed:** dated internal log per market (buyer organisation, contact date, stage of conversation) kept by sales | Proof strip (tag "Current"): "10+ — Markets with active buyer relationships and commercial conversations"; Network: "Markets with active buyer relationships and conversations" + the country list. VI: "Thị trường có quan hệ khách hàng và trao đổi thương mại đang diễn ra" | "Countries served", "exported to", "shipments to", "customers in 14 countries", "recurring buyers", "export track record", "30+ distributors", naming buyers | 2026-10-31, then monthly |
| 4 | **30–50 export-qualified suppliers** assessed and ranked against a rigorous Whitehorse framework aligned with international buyer requirements | TARGET (dated: 2026) | CEO / quality lead | CEO objective. **Evidence needed:** written qualification framework (criteria, scoring/ranking) and a dated count of qualified suppliers per product/site/market | Proof strip + Network (tag "2026 objective" / "Mục tiêu 2026"). Qualification "specific to product, site and market" | "30–50 qualified suppliers today", "our network of 30–50 suppliers", "highest standards", "certified suppliers" | Monthly; end of 2026 |
| 5 | **3,000+ cooperatives/source groups** and **10,000+ active buyers** within the network's visibility and relationship reach | VISION (three-year) | CEO | CEO three-year vision 2026-09-27 | Proof strip + Network (tag "Three-year vision" / "Tầm nhìn 3 năm"): "Cooperatives and source groups within the network's visibility and relationship reach"; "Active buyers within the network's relationship reach"; Network: "The visibility and relationship reach we are building the network towards over the next three years" | Any present-tense reading: "3,000+ partner cooperatives", "network of 10,000 buyers", "3,000+ partner growing regions" (retired, blocked) | Annually |
| 6 | Supplier network exists across engagement and assessment stages (qualitative, no number) | FACT | CEO | Internal supplier stage list (**gap:** keep it dated) | Network hero: "works with Vietnamese supplier organisations — cooperatives, processors and growing groups — at different stages of engagement and assessment" | "20+" as a public headline (retired, blocked); "all qualified / export-ready" | 2026-12-31 |
| 7 | Supplier qualification is product-, site- and market-specific; certificates belong to a specific supplier/site/scope and are shared per order | FACT (process) | Quality lead | Assessment checklist (**gap:** write it down) | Quality page; How We Work step 2; catalog "per request" note | Whitehorse holds ISO/HACCP/organic/FDA; universal QA/QC | 2026-12-31 |
| 8 | Standards checked during assessment: ISO 22000 / FSSC 22000, HACCP, organic (USDA/EU), FDA registration / FSVP info | FACT (process) | Quality lead | Assessment checklist | Quality page items | "Certified", "compliant", "highest standards" | 2026-12-31 |
| 9 | **Confirmed product codes WHCF001–WHCF009** (Green Robusta … Freeze-Dried Instant) with product-code pages under `/products/coffee/whcf00x` | FACT (defined codes) — not availability | CEO / sales | CEO product list (WHCF prefix confirmed 2026-09-27) | "Confirmed product codes — products Whitehorse has defined and can quote by code. Availability, final specification and COA scope are confirmed for each request." VI: "Mã sản phẩm đã xác định …" | In stock, export-ready, sample-ready, price, lead time, origin region, certification; Product/Offer schema | Before adding any code |
| 10 | **Typical reference parameters** on product-code pages: green coffee moisture ≤ 12.5% (ISO 6673; ICO Res. 420, TCVN 4193:2014), screen grades S16 / S18 (ISO 4150; TCVN 4193) | Reference (primary-sourced) | Quality lead | `docs/product-range-sources.md` | Table titled "Typical reference parameters" with "final specification, test method, documentation and COA scope are agreed per order". All other rows read "Agreed per order" with the method named | Guaranteed spec, lot result, COA; brief values not in a primary source (black/broken ≤2%, foreign matter ≤0.5/0.1%, roasted/instant moisture ≤4–5%, "specialty-grade") | When supplier spec sheets exist |
| 11 | Sourcing & custom-development ranges (27 ranges across five families; representative items such as cashew, pepper, cinnamon, star anise) | FACT (scope of sourcing) | CEO / sales | `src/lib/catalog.ts`; sources doc | "Broader formats we can source or develop on request, matched to suppliers whose product, site and documentation fit your specification." Each range lists formats and the fields a buyer specifies | Stock, availability, guaranteed origin or capability; bird's nest authenticity/purity/health claims; facility registration (e.g. GACC) | 2026-12-31 |
| 12 | Packaging options (coffee): jute bags with inner liner, valve bags, jars, drums, bag-in-box, drip bags, sachets, retail boxes | Options to discuss | Sales | Brief input | "Packaging options to discuss … confirmed per order" | "Available", third-party brand names (e.g. liner brands) | 2026-12-31 |
| 13 | Process commitments: specification agreed in writing, samples/COA arranged per order, documents coordinated with logistics/documentation partners, suppliers' qualification status disclosed | FACT (process commitment) | CEO / sales lead | Sales SOP (**gap:** confirm written) | Home trust strip, value props, How We Work, catalog "How a request works" | Universal testing, owned labs | 2026-12-31 |
| 14 | Follow-up promise | FACT (process) | Sales lead | `RFQ_MAIL_TO` owner | "Our sales team reviews qualified requests and follows up with the next commercial step." | Response-time SLA | When an SLA is agreed |
| 15 | Images | Illustrative / editorial | CEO | `docs/asset-provenance.md`. **Production rights confirmation pending** for all four catalog coffee images (user-supplied, stock-style, no metadata) and for `hero.jpg` | Catalog coffee images always carry a visible "Editorial image" / "Ảnh minh họa" badge with descriptive alt text; product mock-ups keep the visible "Concept artwork" badge; `about.jpg` / `factory.jpg` are not rendered | Presenting editorial images as the exact product, a Whitehorse facility or lot | Before Production promotion |
| 16 | Privacy Notice and Website Terms | FACT (concise notices) — **legal review pending** | CEO (legal) | Not yet reviewed by counsel | Neutral pages, "Last updated: 27 September 2026"; `noindex`, out of sitemap | "Legally reviewed", "GDPR-compliant" | Before indexing |
| 17 | Balance Life circular-agriculture initiative | PROGRAM SIGNAL | CEO | CEO confirmation. **Gap:** Balance Life's written consent to be named | About → Ecosystem development (no logos, no other participant named) | Partnership, investment, joint venture | 2026-10-31 |
| 18 | Direct QA/QC capability at key sourcing points; open platform for Vietnamese agriculture | VISION | CEO | — | About → "Long-term direction · Vision — not a current service" | Current in-house QA/QC; internal system names (WBIS/WBOS) | Annually |
| 19 | Mission ("We build a better food system …") | VISION | CEO | — | About mission block | — | Annually |

## Retired or blocked (by `npm run check:claims` and tests)

| Former / prohibited wording | Why |
|---|---|
| "100K+ metric tons exported every year" | No customs/contract evidence. |
| "30 countries served", "30+ countries reached", "countries we serve", "exported to …", "our export track record", "recurring buyers" | Market relationships are not shipments or service (row 3). |
| "3,000+ partner growing regions" | Retired; 3,000+ only as the tagged vision (row 5). |
| "20+ supplier organisations" as a headline | Replaced by rows 3–6. |
| "Phase 1 target", "giai đoạn 1" | No public phase language. |
| "Highest standards", "tiêu chuẩn cao nhất" | Use rigorous defined criteria aligned with buyer requirements. |
| "5 years in export trade" | Company registered 2026. |
| "Every lot / facility / shipment", "exclusively", "our factory" | Not evidenced; see rows 7, 13. |
| "Formal quote within 1–2 business days" | No SLA (row 14). |
| WBIS / WBOS | Internal systems, not public. |
| Unsourced spec numbers from the brief (see `docs/product-range-sources.md`) | Only primary-sourced typical reference values are published (row 10). |
| "[Placeholder …]", "photo needed", "interim notice / being prepared" | Unfinished public content. |

## Drafts — NOT rendered, do not publish without the listed permission

These texts must not appear in `messages/`, `content/` or `src/` (the
claims scanner fails on "VPBank") until the permission column is
satisfied and the row moves to "Active claims".

| Draft | Class if published | Required before publication | Draft wording |
|---|---|---|---|
| VPBank as a finance participant in the Balance Life initiative | PROGRAM SIGNAL | 1. Explicit written permission from VPBank to be named. 2. Written confirmation from Balance Life. 3. CEO sign-off on exact wording. VPBank must **not** be described as a direct Whitehorse partner unless a direct agreement exists and is evidenced. | EN: "The broader circular-agriculture initiative that Whitehorse Foodtech is working on with Balance Life includes VPBank as a finance participant." VI: "Sáng kiến nông nghiệp tuần hoàn rộng hơn mà Whitehorse Foodtech đang cùng Balance Life thực hiện có sự tham gia của VPBank với vai trò bên tài chính." — VPBank's exact role must be confirmed by VPBank before either sentence is used. |
