# Phase 3 — Premium About & Studio Imagery

## Scope and safety
- Base commit: feat/phase2-product-platform-experience at 163d49a. Work only on feat/phase3-premium-about-studio.
- Do not touch main, merge, promote or deploy Production. Preserve Phase 2 taxonomy, filters, SKU routes, RFQ, truth hierarchy, i18n, SEO, accessibility and responsive behavior.
- Read AGENTS.md, CLAUDE.md, docs/claim-registry.md, docs/asset-provenance.md and tests first. Run lint/typecheck/tests/build/claim checks, visually inspect, commit/push this branch and create protected Vercel Preview only.

## Positioning
Whitehorse is building Vietnam's premium B2B ingredient platform: connecting farmers and processors more directly with food manufacturers, brands, ingredient users and distribution partners, while reducing non-value-adding layers. It is not a mass marketplace, catalogue wholesaler, certification body, or owner of every farm/factory/technology.

Premium must be demonstrated through specifications, applications, evidence, QA/QC discipline and editorial restraint. Never use self-awarded claims such as leading/world-class/revolutionary/one-stop/tinh hoa/chắp cánh/vươn tầm. Do not claim to remove every intermediary or currently “bảo chứng chất lượng”. Say Whitehorse is building a quality-assurance infrastructure that organises evidence, process and accountability. Processing capability is within the partner network.

## Rebuild /[locale]/about
Create a quiet, premium editorial narrative, not a pitch-deck grid. Maintain idiomatic EN/VI parity.

1. Hero eyebrow: WHITEHORSE FOODTECH / PREMIUM INGREDIENT PLATFORM
VI H1: Nâng chuẩn nguyên liệu Việt cho chuỗi giá trị toàn cầu.
VI lead: Whitehorse Foodtech đang xây dựng nền tảng nguyên liệu B2B kết nối trực tiếp hơn giữa nông hộ, nhà máy chế biến với các nhà sản xuất thực phẩm, thương hiệu, đơn vị sử dụng nguyên liệu và đối tác phân phối. Bằng cách rút ngắn những tầng trung gian không tạo thêm giá trị, chúng tôi hướng tới một chuỗi cung ứng minh bạch hơn, hiệu quả hơn và đáng tin cậy hơn.
EN H1: Raising the standard of Vietnamese ingredients for global value chains.
EN lead: Whitehorse Foodtech is building a premium B2B ingredient platform that connects farmers and processors more directly with food manufacturers, brands, ingredient users and distribution partners. By reducing non-value-adding layers, we aim to create a supply chain that is more transparent, efficient and trusted.
CTAs: products and RFQ. Right: clean 2x2 ingredient mosaic. Never use public/images/about.jpg because it contains unsupported claims.

2. Brand thesis: “Việt Nam không thiếu nông sản chất lượng. Điều còn thiếu là một hệ thống đủ mạnh để chuyển lợi thế ấy thành nguyên liệu có tiêu chuẩn rõ ràng, ứng dụng phù hợp và khả năng tiếp cận thị trường bền vững.” Close: “Whitehorse được hình thành để thu hẹp khoảng cách đó.”

3. Bottlenecks. H2: Tiềm năng lớn. Giá trị giữ lại còn hạn chế. Six numbered editorial items, not decorative icon cards: Công nghệ sau thu hoạch; R&D và phát triển ứng dụng; Tiêu chuẩn và hồ sơ chất lượng; Thương hiệu nguyên liệu; Mạng lưới tiếp cận thị trường; Doanh nghiệp nền tảng.

4. Whitehorse role. H2: Từ nguồn cung phân mảnh đến một nền tảng nguyên liệu có thể tin cậy. Explain it is a connection/orchestration layer across supply, processing capability, product/application data and market demand. Four capabilities: Curated Supply; Application-led Products; Quality & Product Intelligence; Market Connection.

5. QA/QC control point. H2: Giá trị không bắt đầu ở giao dịch. Nó bắt đầu tại điểm kiểm soát. Accessible responsive flow: Vùng nguyên liệu -> Thu mua -> Chế biến -> Kiểm nghiệm -> Hồ sơ lô hàng -> Phản hồi và cải tiến. State Whitehorse is progressively building quality-assurance infrastructure so buyers assess supply with clearer evidence, not promises.

6. Mission VI: Nâng vị thế nông sản Việt Nam trong chuỗi giá trị toàn cầu thông qua công nghệ chế biến sâu, năng lực phát triển sản phẩm và một hệ thống chất lượng đủ tin cậy để nguyên liệu Việt được lựa chọn vì giá trị — không chỉ vì xuất xứ.
EN: To elevate the position of Vietnamese agriculture in global value chains through deep-processing capabilities, product development and a quality system that enables Vietnamese ingredients to be chosen for their value—not only their origin.

7. One vision statement plus four long-term roles.
VI: Trở thành nền tảng nguyên liệu cao cấp của Việt Nam, nơi năng lực chế biến sâu, quản trị chất lượng và điều phối chuỗi giá trị hội tụ để đưa nguyên liệu Việt vào những chuỗi cung ứng có giá trị cao trên toàn cầu.
Roles: Premium Ingredient Platform; Deep-processing Technology Layer; Vietnamese Agricultural Value-chain Architect; Bridge to Global Ingredient Markets. Explicitly label these as roles being built toward, not current services.

8. Long-term platform direction: start with ingredients but design for the whole agricultural chain. As data, standards and network mature, connect cooperatives, farmers, factories, labs, logistics and professional buyers. Do not place 3,000+ cooperatives or 10,000+ buyers on About. Keep truth-tagged figures only where claim registry permits.

9. Ecosystem and CTA. Balance Life language must remain cautious/factual. Do not add VPBank or partner logos without documented permission. Close with “Bắt đầu từ một yêu cầu nguyên liệu cụ thể.” Buyer CTA to RFQ; supplier CTA to Contact.

## Imagery
Replace non-coffee family concept panels with authentic-looking, text-free 4:3 studio ingredient images. The approved generated source files are available in the Codex handoff workspace but GitHub's browser upload bridge failed; if unavailable, recreate/extract from the supplied Claude Design project using its taxonomy only, with no logos, claims, badges or retail packaging. Do not touch coffee SKU images. Use best existing real coffee editorial image under public/images/catalog/coffee for coffee family card/detail.

Create one source of truth for family image paths and semantic alt text. Use next/image, correct sizes, detail-hero priority and object-cover. Label generated family visuals accurately:
- VI badge: Hình ảnh studio minh họa
- VI note: Hình ảnh minh họa các dạng nguyên liệu trong nhóm; sản phẩm, nguồn cung và thông số được xác nhận theo từng yêu cầu.
- EN badge: Studio representation
- EN note: A studio representation of ingredient formats in this family; product, source and final specification are confirmed per request.
Never present them as photographed inventory, a supplier batch, certification/traceability evidence or stock availability. Update docs/asset-provenance.md.

## Design direction
Keep ivory, cocoa and restrained champagne; serif editorial headings + clear sans body. Use large type, generous whitespace, hairline separators, numbering and asymmetric compositions. Avoid repetitive rounded cards, icon grids, generic gradients, glassmorphism, smiling-farmer stock, handshakes, glowing maps and containers. Mobile: no overflow, strong reading order, reachable CTAs, vertical QA/QC flow; respect reduced motion.

## Validation/report
Run npm ci if needed, lint, typecheck if configured, npm test, npm run build and npm run check:claims. Add tests for EN/VI About keys, family image mapping and no retired concept-art paths in user-facing code. Inspect /vi/about, /en/about, both home/product indexes and all five VI family pages at desktop/mobile; check console, images, focus, headings, alt and CTAs. Report branch + SHA, file diff, exact checks, routes/widths, protected Preview URL and unresolved image/licensing/claim risks. Do not claim Production readiness.
