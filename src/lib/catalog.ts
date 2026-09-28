// Product catalog data model — the single source for product families'
// sourcing ranges and Whitehorse's confirmed product codes (SKUs).
//
// Three layers (see docs/product-range-sources.md):
//   1. /products                         — the five families
//   2. /products/<family>                — ranges + confirmed codes
//   3. /products/<family>/<sku-slug>     — confirmed code detail
//
// Truth rules encoded here:
// - A "confirmed code" is a product Whitehorse has defined (WHCF001–009).
//   It is NOT a statement that it is in stock, sample-ready or
//   export-ready: availability is confirmed per request.
// - `reference` values are typical reference parameters backed by a
//   primary source (docs/product-range-sources.md). Anything without such a
//   source has no `reference` and renders as "agreed per order".
// - Ranges describe what can be sourced or developed on request, never
//   guaranteed stock, origin, certification or capability.
//
// Import-free (types only) so node:test and validations.ts can load it.

export type Localized = { en: string; vi: string };

export type FamilySlug = "coffee" | "coconut" | "birds-nest" | "fruit" | "nuts-spices-botanicals";

/**
 * CEO-confirmed core portfolio as of 2026-09-28. These are defined SKUs,
 * not a statement of stock, supplier availability or export readiness.
 * Only the nine coffee SKUs currently have public detail pages.
 */
export const DEFINED_SKU_COUNTS = {
  coffee: 9,
  coconut: 5,
  "birds-nest": 2,
  fruit: 9,
  "nuts-spices-botanicals": 4,
} as const satisfies Record<FamilySlug, number>;

export const DEFINED_SKU_TOTAL = Object.values(DEFINED_SKU_COUNTS).reduce((total, count) => total + count, 0);

export const DEFINED_SKU_PREFIXES = {
  coffee: "WHCF",
  coconut: "WHCO",
  "birds-nest": "WHBN",
  fruit: "WHFR",
  "nuts-spices-botanicals": "WHNSB",
} as const satisfies Record<FamilySlug, string>;

/**
 * The complete code directory for the CEO-confirmed 29-SKU portfolio.
 * Non-coffee codes are intentionally presented at family/range level until
 * their individual public specification pages are approved.
 */
export function definedCodesFor(family: FamilySlug): string[] {
  const prefix = DEFINED_SKU_PREFIXES[family];
  return Array.from({ length: DEFINED_SKU_COUNTS[family] }, (_, index) =>
    `${prefix}${String(index + 1).padStart(3, "0")}`
  );
}

export type CatalogImage = {
  src: string;
  alt: Localized;
  /**
   * "editorial": generic photographs from the website-edit brief.
   * "concept-pack": the owner's packaging concept render for that exact
   * code or range (docs/image-inventory.md) — provisional artwork with the
   * source label untouched, never a photo of stock or a final label.
   * "studio": text-free studio representation of an ingredient format.
   * Every kind carries a visible badge.
   */
  kind: "editorial" | "concept-pack" | "studio";
};

export type SpecRow = {
  label: Localized;
  /** Typical reference value; omit when no primary source supports a number. */
  reference?: Localized;
  /** Test method / standard the buyer and supplier would agree on. */
  method?: string;
  /** Key into docs/product-range-sources.md, for review. */
  source?: string;
};

export type CatalogRange = {
  id: string;
  family: FamilySlug;
  name: Localized;
  summary: Localized;
  formats: Localized[];
  /** General specification fields a buyer specifies for this range. */
  specFields: Localized[];
  /**
   * Indicative values from the CEO product briefs (2026-09-27), shown as
   * "indicative — confirmed against the supplier's specification per
   * order". Never a lot result, guarantee or stock statement
   * (docs/claim-registry.md row 24).
   */
  indicative?: Localized[];
  /**
   * Range-level visuals, filled from RANGE_IMAGES below. A range has no
   * official SKU code, so these illustrate the product form and are never
   * presented as a confirmed code, stock or approved packaging.
   */
  images?: CatalogImage[];
};

export type CatalogSku = {
  code: string;
  slug: string;
  family: FamilySlug;
  range: string;
  name: Localized;
  /** One line for cards: format · main application. */
  line: Localized;
  summary: Localized;
  applications: Localized[];
  specs: SpecRow[];
  images: CatalogImage[];
};

const AGREED: Localized = { en: "Agreed per order", vi: "Thống nhất theo đơn hàng" };
export const AGREED_PER_ORDER = AGREED;

// ---------------------------------------------------------------- images
const IMG = {
  cups: {
    src: "/images/catalog/coffee/coffee-ground-whole-instant.jpg",
    alt: {
      en: "Ground coffee, roasted beans and instant coffee granules in three cups",
      vi: "Cà phê xay, cà phê hạt rang và cà phê hòa tan dạng hạt trong ba chiếc cốc",
    },
    kind: "editorial",
  },
  spoons: {
    src: "/images/catalog/coffee/coffee-roasted-ground-instant-spoons.jpg",
    alt: {
      en: "Roasted coffee beans in a wooden bowl with spoons of ground and instant coffee",
      vi: "Cà phê hạt rang trong bát gỗ cùng thìa cà phê xay và cà phê hòa tan",
    },
    kind: "editorial",
  },
  bowls: {
    src: "/images/catalog/coffee/coffee-green-roasted-ground-bowls.jpg",
    alt: {
      en: "Green coffee beans and ground coffee in wooden bowls on roasted beans",
      vi: "Cà phê nhân xanh và cà phê xay trong bát gỗ trên nền cà phê hạt rang",
    },
    kind: "editorial",
  },
  flatlay: {
    src: "/images/catalog/coffee/coffee-green-roasted-flatlay.jpg",
    alt: {
      en: "Green and roasted coffee beans with ground coffee in white dishes and wooden scoops",
      vi: "Cà phê nhân xanh, cà phê rang và cà phê xay trong đĩa trắng và muỗng gỗ",
    },
    kind: "editorial",
  },
} satisfies Record<string, CatalogImage>;

/** One packaging concept render per confirmed code (front three-quarter view). */
const PACK = (code: string, en: string, vi: string): CatalogImage => ({
  src: `/images/catalog/coffee/packs/${code.toLowerCase()}-concept-pack.webp`,
  alt: {
    en: `Packaging concept render for ${code}: ${en}`,
    vi: `Hình render bao bì ý tưởng cho ${code}: ${vi}`,
  },
  kind: "concept-pack",
});

// Family-level visuals (cards, family hero, About mosaic) live in
// src/lib/family-images.ts.

// ---------------------------------------------------------------- ranges
const r = (
  family: FamilySlug,
  id: string,
  name: Localized,
  summary: Localized,
  formats: Localized[],
  specFields: Localized[],
  indicative?: Localized[]
): CatalogRange => ({ id, family, name, summary, formats, specFields, ...(indicative ? { indicative } : {}) });

const L = (en: string, vi: string): Localized => ({ en, vi });

export const CATALOG_RANGES: CatalogRange[] = [
  // Coffee
  r("coffee", "coffee-green", L("Green coffee", "Cà phê nhân xanh"),
    L("Robusta and Arabica green beans graded by screen size, moisture and defects.",
      "Cà phê nhân Robusta và Arabica phân loại theo cỡ sàng, độ ẩm và tỷ lệ khuyết tật."),
    [L("Robusta", "Robusta"), L("Arabica", "Arabica"), L("Fine Robusta", "Robusta loại Fine")],
    [L("Species and grade", "Loài và hạng"), L("Screen size", "Cỡ sàng"), L("Moisture", "Độ ẩm"),
     L("Defects and foreign matter", "Khuyết tật và tạp chất"), L("Processing method", "Phương pháp chế biến"),
     L("Crop year and growing area", "Niên vụ và vùng trồng")]),
  r("coffee", "coffee-roasted", L("Roasted whole bean & ground", "Cà phê rang nguyên hạt & rang xay"),
    L("Robusta, Arabica and blends, roasted to an agreed profile, whole or ground.",
      "Robusta, Arabica và phối trộn, rang theo profile thống nhất, nguyên hạt hoặc xay."),
    [L("Whole bean", "Nguyên hạt"), L("Ground", "Xay"), L("Blends", "Phối trộn")],
    [L("Blend and roast profile", "Tỷ lệ phối trộn và profile rang"), L("Grind size", "Cỡ xay"),
     L("Moisture", "Độ ẩm"), L("Packaging and degassing", "Bao bì và van thoát khí")]),
  r("coffee", "coffee-soluble", L("Soluble coffee", "Cà phê hòa tan"),
    L("Spray-dried, agglomerated and freeze-dried instant coffee for manufacturing and private label.",
      "Cà phê hòa tan sấy phun, tạo hạt và sấy thăng hoa cho sản xuất và nhãn hàng riêng."),
    [L("Spray-dried", "Sấy phun"), L("Agglomerated", "Tạo hạt"), L("Freeze-dried", "Sấy thăng hoa")],
    [L("Drying technology", "Công nghệ sấy"), L("Bean blend", "Tỷ lệ phối trộn hạt"), L("Moisture", "Độ ẩm"),
     L("Bulk density and solubility", "Tỷ trọng khối và độ hòa tan")]),
  r("coffee", "coffee-extract", L("Extract & concentrate", "Chiết xuất & cô đặc"),
    L("Liquid coffee extracts and concentrates developed to an agreed strength for beverage applications.",
      "Chiết xuất và cà phê cô đặc dạng lỏng, phát triển theo nồng độ thống nhất cho ứng dụng đồ uống."),
    [L("Extract", "Chiết xuất"), L("Concentrate", "Cô đặc")],
    [L("Strength (e.g. Brix or TDS)", "Nồng độ (ví dụ Brix hoặc TDS)"), L("Bean blend and roast", "Phối trộn và mức rang"),
     L("Preservation and shelf life", "Phương pháp bảo quản và hạn dùng")]),
  r("coffee", "coffee-cold-brew", L("Cold brew & RTD base", "Cold brew & nền RTD"),
    L("Cold brew concentrates and ready-to-drink coffee bases for beverage brands and foodservice.",
      "Cold brew cô đặc và nền cà phê pha sẵn cho thương hiệu đồ uống và foodservice."),
    [L("Concentrate", "Cô đặc"), L("Ready-to-drink base", "Nền pha sẵn")],
    [L("Strength and dilution ratio", "Nồng độ và tỷ lệ pha loãng"), L("Sweetened or unsweetened", "Có đường hoặc không đường"),
     L("Processing and shelf life", "Quy trình xử lý và hạn dùng")]),
  r("coffee", "coffee-single-serve", L("Drip, single-serve & private label", "Túi lọc, single-serve & nhãn hàng riêng"),
    L("Drip bags, sachets and retail-ready formats developed under the buyer's brand.",
      "Túi lọc, gói nhỏ và bao bì bán lẻ phát triển dưới thương hiệu của khách hàng."),
    [L("Drip bags", "Túi lọc"), L("Sachets", "Gói nhỏ"), L("Retail boxes", "Hộp bán lẻ")],
    [L("Coffee format and dose", "Dạng cà phê và định lượng"), L("Pack format and artwork", "Quy cách bao bì và thiết kế"),
     L("Minimum order and lead time", "Số lượng tối thiểu và thời gian sản xuất")]),

  // Coconut — CEO product brief "Đề xuất chỉnh sửa Website 1" (2026-09-27)
  r("coconut", "coconut-milk-cream", L("Coconut milk & cream", "Sữa & kem dừa"),
    L("Coconut milk and cream at the fat level your application needs, in standard or customised formulations.",
      "Sữa dừa và kem dừa theo hàm lượng béo ứng dụng cần, công thức tiêu chuẩn hoặc tùy chỉnh."),
    [L("Coconut milk", "Sữa dừa"), L("Coconut cream", "Kem dừa")],
    [L("Fat content", "Hàm lượng chất béo"), L("Standard or customised formulation", "Công thức tiêu chuẩn hoặc tùy chỉnh"),
     L("Organic or conventional (per supplier certification)", "Hữu cơ hoặc thông thường (theo chứng nhận của nhà cung cấp)"),
     L("Sterilisation and pack", "Tiệt trùng và bao bì")],
    [L("Coconut milk: fat 16–32%", "Sữa dừa: béo 16–32%"),
     L("Coconut cream: fat 30–32%; no dairy, no added sugar", "Kem dừa: béo 30–32%; không sữa động vật, không thêm đường")]),
  r("coconut", "coconut-powders-solids", L("Coconut powders & solids", "Bột dừa & dừa sấy"),
    L("Desiccated coconut and coconut milk powder for bakery, confectionery, beverages and food processing.",
      "Dừa sấy khô và bột sữa dừa cho bánh, kẹo, đồ uống và chế biến thực phẩm."),
    [L("Desiccated coconut", "Dừa sấy khô"), L("Coconut milk powder", "Bột sữa dừa")],
    [L("Grade and particle size", "Hạng và cỡ hạt"), L("Moisture", "Độ ẩm"), L("Fat and protein", "Hàm lượng béo và đạm"),
     L("Packaging", "Bao bì")],
    [L("Desiccated coconut: fine, medium or other grades; moisture 3–5%; fat varies by grade",
       "Dừa sấy khô: hạng mịn, vừa hoặc hạng khác; độ ẩm 3–5%; hàm lượng béo theo hạng"),
     L("Coconut milk powder: fine powder; moisture < 3%; fat 40–62%; protein 3–8%",
       "Bột sữa dừa: bột mịn; độ ẩm < 3%; béo 40–62%; đạm 3–8%")]),
  r("coconut", "coconut-blossom-sugar", L("Coconut blossom sugar", "Đường hoa dừa"),
    L("Coconut blossom sugar as a fine powder for food, beverage and retail applications.",
      "Đường hoa dừa dạng bột mịn cho thực phẩm, đồ uống và bán lẻ."),
    [L("Fine powder", "Bột mịn")],
    [L("Moisture", "Độ ẩm"), L("Colour and particle size", "Màu sắc và cỡ hạt"),
     L("Organic certification (supplier, site and scope)", "Chứng nhận hữu cơ (nhà cung cấp, cơ sở và phạm vi)"), L("Packaging", "Bao bì")],
    [L("Fine powder; moisture around 3%", "Bột mịn; độ ẩm khoảng 3%"),
     L("Organic option where the supplier holds valid certification for that product", "Lựa chọn hữu cơ khi nhà cung cấp có chứng nhận hợp lệ cho sản phẩm đó")]),

  // Bird's nest — CEO product brief "Đề xuất chỉnh sửa Website 2"
  r("birds-nest", "birds-nest-cleaned", L("Cleaned edible bird's nest", "Yến sào làm sạch"),
    L("Selected edible bird's nest, fully cleaned and packed in jars or vacuum packs. Destination-market import rules apply.",
      "Yến sào tuyển chọn, làm sạch hoàn toàn, đóng hũ hoặc túi hút chân không. Áp dụng quy định nhập khẩu của thị trường đích."),
    [L("Cleaned whole nest", "Tổ yến làm sạch"), L("Jars", "Hũ"), L("Vacuum packs", "Túi hút chân không")],
    [L("Nest grade and shape", "Hạng và hình dạng tổ"), L("Cleaning method", "Phương pháp làm sạch"), L("Moisture", "Độ ẩm"),
     L("Market access and facility registration", "Điều kiện tiếp cận thị trường và đăng ký cơ sở")]),
  r("birds-nest", "birds-nest-instant", L("Instant & ready-to-prepare", "Yến ăn liền & chế biến sẵn"),
    L("Instant and ready-to-prepare bird's nest formats configured to the buyer's recipe and brand.",
      "Yến ăn liền và chế biến sẵn, cấu hình theo công thức và thương hiệu của khách hàng."),
    [L("Instant", "Ăn liền"), L("Ready-to-prepare", "Chế biến sẵn")],
    [L("Formula and nest content", "Công thức và hàm lượng yến"), L("Serving size", "Khẩu phần"), L("Flavour", "Hương vị"),
     L("Packaging format", "Quy cách bao bì"), L("Preparation method", "Cách sử dụng")]),
  r("birds-nest", "birds-nest-oem", L("Concentrate, extract, powder & blends (OEM)", "Cô đặc, chiết xuất, bột & công thức (OEM)"),
    L("Further bird's nest ingredient formats developed as OEM for nutrition and functional applications.",
      "Các dạng nguyên liệu yến khác phát triển theo OEM cho ứng dụng dinh dưỡng và chức năng."),
    [L("Concentrate", "Cô đặc"), L("Extract", "Chiết xuất"), L("Powder", "Bột"), L("Functional blend", "Công thức chức năng")],
    [L("Format and concentration", "Dạng và nồng độ"), L("Carrier (if any)", "Chất mang (nếu có)"),
     L("Documentation required by market", "Hồ sơ thị trường yêu cầu")]),

  // Fruit — CEO product brief "Đề xuất chỉnh sửa Website 3"
  r("fruit", "fruit-soft-dried", L("Soft-dried fruit", "Trái cây sấy dẻo"),
    L("Soft-dried mango and soursop for snacks, bakery and confectionery.",
      "Xoài và mãng cầu sấy dẻo cho snack, bánh và kẹo."),
    [L("Soft-dried mango", "Xoài sấy dẻo"), L("Soft-dried soursop", "Mãng cầu sấy dẻo")],
    [L("Moisture", "Độ ẩm"), L("Piece size", "Kích cỡ miếng"), L("With or without added sugar", "Có hoặc không thêm đường"),
     L("Packaging", "Bao bì")]),
  r("fruit", "fruit-freeze-dried", L("Freeze-dried fruit", "Trái cây sấy thăng hoa"),
    L("Freeze-dried mango as pieces or powder for beverages, cereal, bakery and nutrition.",
      "Xoài sấy thăng hoa dạng miếng hoặc bột cho đồ uống, ngũ cốc, bánh và dinh dưỡng."),
    [L("Pieces", "Miếng"), L("Powder", "Bột")],
    [L("Moisture", "Độ ẩm"), L("Piece size or mesh", "Kích cỡ miếng hoặc độ mịn (mesh)"), L("Packaging", "Bao bì")],
    [L("Freeze-dried mango: moisture 3–5% max; pieces or powder (80–100 mesh)",
       "Xoài sấy thăng hoa: độ ẩm tối đa 3–5%; dạng miếng hoặc bột (80–100 mesh)")]),
  r("fruit", "fruit-concentrate-powder", L("Concentrate & powder", "Cô đặc & bột"),
    L("Passion fruit concentrate and passion fruit powder for beverage bases and flavouring.",
      "Chanh dây cô đặc và bột chanh dây cho nền đồ uống và tạo hương."),
    [L("Passion fruit concentrate", "Chanh dây cô đặc"), L("Spray-dried powder", "Bột sấy phun"), L("Freeze-dried powder", "Bột sấy thăng hoa")],
    [L("Concentrate: Brix, acidity, pH, pulp/seed content, aseptic pack", "Cô đặc: Brix, độ axit, pH, hàm lượng thịt quả/hạt, bao bì vô trùng"),
     L("Powder: fruit solids, carrier option, moisture, solubility, particle size", "Bột: hàm lượng chất khô trái cây, chất mang, độ ẩm, độ hòa tan, cỡ hạt")]),
  r("fruit", "fruit-frozen-puree", L("Frozen purée", "Puree đông lạnh"),
    L("Frozen passion fruit purée for beverages, dairy, desserts and foodservice.",
      "Puree chanh dây đông lạnh cho đồ uống, sản phẩm sữa, tráng miệng và foodservice."),
    [L("Frozen passion fruit purée", "Puree chanh dây đông lạnh")],
    [L("Fruit ratio", "Tỷ lệ trái cây"), L("Seed and pulp", "Hạt và thịt quả"), L("Brix", "Độ Brix"), L("Cold chain", "Chuỗi lạnh")]),

  // Nuts, spices & botanicals — CEO product brief "Đề xuất chỉnh sửa Website 4"
  r("nuts-spices-botanicals", "nsb-nuts", L("Nuts", "Hạt"),
    L("Cashew kernels, raw or roasted, graded to the buyer's grade designation.",
      "Nhân hạt điều, sống hoặc rang, phân loại theo hạng khách hàng chỉ định."),
    [L("Raw kernels", "Nhân sống"), L("Roasted kernels", "Nhân rang")],
    [L("Grade (e.g. WW240, WW320, SW240)", "Hạng (ví dụ WW240, WW320, SW240)"), L("Count", "Số hạt"), L("Moisture", "Độ ẩm"),
     L("Packaging", "Bao bì")],
    [L("Packaging: vacuum-packed tins of 22.68 kg, or retail packs", "Bao bì: thùng thiếc hút chân không 22,68 kg, hoặc gói bán lẻ")]),
  r("nuts-spices-botanicals", "nsb-spices", L("Spices", "Gia vị"),
    L("Whole black pepper, freeze-dried cinnamon and freeze-dried star anise for manufacturing, blending and extraction.",
      "Hồ tiêu đen nguyên hạt, quế sấy thăng hoa và hoa hồi sấy thăng hoa cho sản xuất, phối trộn và chiết xuất."),
    [L("Whole black pepper", "Hồ tiêu đen nguyên hạt"), L("Freeze-dried cinnamon: sticks or powder", "Quế sấy thăng hoa: thanh hoặc bột"),
     L("Freeze-dried star anise: whole, broken or powder", "Hoa hồi sấy thăng hoa: nguyên cánh, vụn hoặc bột")],
    [L("Density and moisture", "Dung trọng và độ ẩm"), L("Sterilisation option", "Lựa chọn tiệt trùng"),
     L("Particle size (mesh), colour and aroma", "Cỡ hạt (mesh), màu sắc và mùi thơm"), L("Packaging", "Bao bì")],
    [L("Whole black pepper: density 500–570 g/l; moisture ≤ 13%", "Hồ tiêu đen nguyên hạt: dung trọng 500–570 g/l; độ ẩm ≤ 13%")]),
];

// ---------------------------------------------------------------- range images
// Source renders from the CEO folder, label untouched (docs/image-inventory.md).
// One distinct pack per named product; ranges without a suitable source
// stay text-only rather than borrow another product's image.
const RPACK = (family: FamilySlug, file: string, en: string, vi: string): CatalogImage => ({
  src: `/images/catalog/${family}/packs/${file}.webp`,
  alt: { en: `Packaging concept render: ${en}`, vi: `Hình render bao bì ý tưởng: ${vi}` },
  kind: "concept-pack",
});
/** Source-derived crop of an owner-supplied studio image — no pack, no label. */
const STUDIO = (family: FamilySlug, file: string, en: string, vi: string): CatalogImage => ({
  src: `/images/catalog/${family}/studio/${file}.webp`,
  alt: { en: en[0].toUpperCase() + en.slice(1), vi: vi[0].toUpperCase() + vi.slice(1) },
  kind: "studio",
});

const FAMILY_EDITORIAL: Record<Exclude<FamilySlug, "coffee">, CatalogImage> = {
  coconut: {
    src: "/images/catalog/editorial/coconut-real-products.webp",
    alt: L("Owner-supplied coconut product photograph", "Ảnh sản phẩm dừa do Whitehorse cung cấp"),
    kind: "editorial",
  },
  "birds-nest": {
    src: "/images/catalog/editorial/birds-nest-real-products.webp",
    alt: L("Owner-supplied bird's nest product photograph", "Ảnh sản phẩm yến do Whitehorse cung cấp"),
    kind: "editorial",
  },
  fruit: {
    src: "/images/catalog/editorial/fruit-real-products.webp",
    alt: L("Owner-supplied fruit product photograph", "Ảnh sản phẩm trái cây do Whitehorse cung cấp"),
    kind: "editorial",
  },
  "nuts-spices-botanicals": {
    src: "/images/catalog/editorial/nuts-spices-real-products.webp",
    alt: L("Owner-supplied nuts and spices product photograph", "Ảnh sản phẩm hạt và gia vị do Whitehorse cung cấp"),
    kind: "editorial",
  },
};

const RANGE_FALLBACKS: Record<FamilySlug, CatalogImage[]> = {
  coffee: [IMG.flatlay, IMG.spoons],
  coconut: [
    FAMILY_EDITORIAL.coconut,
    {
      src: "/images/catalog/studio/coconut.jpg",
      alt: L("Coconut ingredient formats", "Các dạng nguyên liệu dừa"),
      kind: "studio",
    },
  ],
  "birds-nest": [
    FAMILY_EDITORIAL["birds-nest"],
    {
      src: "/images/catalog/studio/birds-nest.jpg",
      alt: L("Bird's nest ingredient formats", "Các dạng nguyên liệu yến"),
      kind: "studio",
    },
  ],
  fruit: [
    FAMILY_EDITORIAL.fruit,
    {
      src: "/images/catalog/studio/fruit.jpg",
      alt: L("Fruit ingredient formats", "Các dạng nguyên liệu trái cây"),
      kind: "studio",
    },
  ],
  "nuts-spices-botanicals": [
    FAMILY_EDITORIAL["nuts-spices-botanicals"],
    {
      src: "/images/catalog/studio/nuts-spices-botanicals.jpg",
      alt: L("Cashew kernels and spice formats", "Nhân hạt điều và các dạng gia vị"),
      kind: "studio",
    },
  ],
};

export const RANGE_IMAGES: Partial<Record<string, CatalogImage[]>> = {
  "coconut-milk-cream": [
    RPACK("coconut", "coconut-milk-carton-concept-pack", "coconut milk in a 1 L aseptic carton", "sữa dừa trong hộp giấy vô trùng 1 L"),
    RPACK("coconut", "coconut-cream-bib-concept-pack", "coconut cream in a 20 kg bag-in-box carton", "kem dừa trong thùng bag-in-box 20 kg"),
  ],
  "coconut-powders-solids": [
    RPACK("coconut", "desiccated-coconut-pouch-concept-pack", "desiccated coconut, fine grade, in a 1 kg pouch with window", "dừa sấy khô loại mịn trong túi 1 kg có cửa sổ"),
    RPACK("coconut", "coconut-milk-powder-pouch-concept-pack", "coconut milk powder in a 500 g / 1 kg pouch", "bột sữa dừa trong túi 500 g / 1 kg"),
  ],
  "coconut-blossom-sugar": [
    RPACK("coconut", "coconut-blossom-sugar-pouch-concept-pack", "coconut blossom sugar in a retail pouch with window", "đường hoa dừa trong túi bán lẻ có cửa sổ"),
  ],
  "birds-nest-cleaned": [
    RPACK("birds-nest", "cleaned-birds-nest-box-concept-pack", "cleaned edible bird's nest in a 50 g rigid box", "yến sào làm sạch trong hộp cứng 50 g"),
  ],
  "birds-nest-instant": [
    RPACK("birds-nest", "instant-birds-nest-sachet-concept-pack", "instant bird's nest in a 10 g serving sachet", "yến ăn liền trong gói 10 g"),
    RPACK("birds-nest", "instant-birds-nest-carton-concept-pack", "instant bird's nest in a carton of 10 × 10 g sachets", "yến ăn liền trong hộp 10 gói 10 g"),
  ],
  "fruit-soft-dried": [
    RPACK("fruit", "soft-dried-mango-pouch-concept-pack", "soft-dried mango in a 500 g pouch", "xoài sấy dẻo trong túi 500 g"),
    STUDIO("fruit", "soft-dried-soursop-studio", "dried soursop pieces in a wooden bowl beside a halved soursop", "mãng cầu sấy trong bát gỗ bên quả mãng cầu bổ đôi"),
  ],
  "fruit-freeze-dried": [
    STUDIO("fruit", "freeze-dried-mango-studio", "freeze-dried mango cubes in a bowl", "xoài sấy thăng hoa dạng hạt lựu trong bát"),
  ],
  "fruit-concentrate-powder": [
    RPACK("fruit", "passion-fruit-concentrate-bib-concept-pack", "passion fruit concentrate in a 20 kg bag-in-box carton", "chanh dây cô đặc trong thùng bag-in-box 20 kg"),
    STUDIO("fruit", "passion-fruit-powder-studio", "passion fruit powder in a bowl beside a halved passion fruit", "bột chanh dây trong bát bên quả chanh dây bổ đôi"),
  ],
  "fruit-frozen-puree": [
    STUDIO("fruit", "passion-fruit-puree-studio", "passion fruit purée in a bowl with whole and halved passion fruit", "puree chanh dây trong bát cùng chanh dây nguyên quả và bổ đôi"),
  ],
  "nsb-nuts": [
    STUDIO("nuts-spices-botanicals", "cashew-kernels-studio", "whole cashew kernels with black peppercorns and star anise", "nhân hạt điều nguyên cùng hạt tiêu đen và hoa hồi"),
  ],
  "nsb-spices": [
    STUDIO("nuts-spices-botanicals", "star-anise-studio", "whole star anise on a wooden surface", "hoa hồi nguyên cánh trên mặt gỗ"),
  ],
};
for (const range of CATALOG_RANGES) {
  const images = [...(RANGE_IMAGES[range.id] ?? [])];
  for (const fallback of RANGE_FALLBACKS[range.family]) {
    if (images.length >= 2) break;
    if (!images.some((image) => image.src === fallback.src)) images.push(fallback);
  }
  range.images = images;
}

// ---------------------------------------------------------------- confirmed coffee codes
const MOISTURE_GREEN: SpecRow = {
  label: L("Moisture", "Độ ẩm"),
  reference: L("≤ 12.5%", "≤ 12,5%"),
  method: "ISO 6673",
  source: "ICO Res. 420; TCVN 4193:2014",
};
const DEFECTS: SpecRow = {
  label: L("Defects and foreign matter", "Khuyết tật và tạp chất"),
  method: "TCVN 4193 grade; ISO 10470",
};
const PACKAGING: SpecRow = { label: L("Packaging", "Bao bì") };

export const CATALOG_SKUS: CatalogSku[] = [
  {
    code: "WHCF001", slug: "whcf001", family: "coffee", range: "coffee-green",
    name: L("Green Robusta", "Robusta nhân xanh"),
    line: L("Green beans · roasting, trading and soluble production", "Cà phê nhân · rang, thương mại và sản xuất hòa tan"),
    summary: L("Vietnamese Robusta green coffee, graded by screen size, moisture and defects to the grade you specify.",
      "Cà phê nhân Robusta Việt Nam, phân loại theo cỡ sàng, độ ẩm và khuyết tật theo hạng bạn chỉ định."),
    applications: [L("Trading", "Thương mại"), L("Roasting", "Rang"), L("Soluble production", "Sản xuất hòa tan")],
    specs: [
      { label: L("Species", "Loài"), reference: L("Coffea canephora (Robusta)", "Coffea canephora (Robusta)") },
      { label: L("Screen size", "Cỡ sàng"), reference: L("S16 / S18 grades", "Hạng sàng 16 / 18"), method: "ISO 4150", source: "TCVN 4193:2014" },
      MOISTURE_GREEN, DEFECTS,
      { label: L("Processing", "Phương pháp chế biến") },
      PACKAGING,
    ],
    images: [PACK("WHCF001", "green Robusta coffee beans in a 2–5 kg barrier pouch", "cà phê nhân Robusta trong túi barrier 2–5 kg"), IMG.bowls],
  },
  {
    code: "WHCF002", slug: "whcf002", family: "coffee", range: "coffee-green",
    name: L("Green Arabica", "Arabica nhân xanh"),
    line: L("Green beans · roasting and specialty blends", "Cà phê nhân · rang và phối trộn đặc sản"),
    summary: L("Vietnamese Arabica green coffee; screen size, processing method and grade agreed with you per order.",
      "Cà phê nhân Arabica Việt Nam; cỡ sàng, phương pháp chế biến và hạng được thống nhất với bạn theo từng đơn."),
    applications: [L("Roasting", "Rang"), L("Blending", "Phối trộn"), L("Trading", "Thương mại")],
    specs: [
      { label: L("Species", "Loài"), reference: L("Coffea arabica", "Coffea arabica") },
      { label: L("Screen size", "Cỡ sàng"), reference: L("S16 / S18 grades", "Hạng sàng 16 / 18"), method: "ISO 4150", source: "TCVN 4193:2014" },
      MOISTURE_GREEN, DEFECTS,
      { label: L("Processing", "Phương pháp chế biến"), reference: L("Washed or natural — agreed per order", "Chế biến ướt hoặc tự nhiên — thống nhất theo đơn") },
      PACKAGING,
    ],
    images: [PACK("WHCF002", "green Arabica coffee beans in a 2–5 kg barrier pouch", "cà phê nhân Arabica trong túi barrier 2–5 kg"), IMG.flatlay],
  },
  {
    code: "WHCF003", slug: "whcf003", family: "coffee", range: "coffee-green",
    name: L("Fine Green Robusta", "Robusta nhân xanh loại Fine"),
    line: L("Higher-grade green beans · premium roasting", "Cà phê nhân hạng cao · rang cao cấp"),
    summary: L("Carefully selected and processed Robusta for buyers who specify a tighter grade and cup profile.",
      "Robusta được tuyển chọn và chế biến kỹ cho khách hàng yêu cầu hạng và hương vị chặt chẽ hơn."),
    applications: [L("Premium roasting", "Rang cao cấp"), L("Single-origin retail", "Bán lẻ đơn nguồn")],
    specs: [
      { label: L("Species", "Loài"), reference: L("Coffea canephora (Robusta)", "Coffea canephora (Robusta)") },
      { label: L("Screen size", "Cỡ sàng"), reference: L("S16 / S18 grades", "Hạng sàng 16 / 18"), method: "ISO 4150", source: "TCVN 4193:2014" },
      MOISTURE_GREEN, DEFECTS,
      { label: L("Cup profile", "Hương vị (cupping)") },
      PACKAGING,
    ],
    images: [PACK("WHCF003", "fine green Robusta in a 2–5 kg barrier pouch", "Robusta nhân loại Fine trong túi barrier 2–5 kg"), IMG.bowls],
  },
  {
    code: "WHCF004", slug: "whcf004", family: "coffee", range: "coffee-roasted",
    name: L("Roasted Robusta", "Robusta rang"),
    line: L("Whole roasted beans · roasters and foodservice", "Hạt rang nguyên · nhà rang và foodservice"),
    summary: L("Robusta roasted whole bean to an agreed roast profile.",
      "Robusta rang nguyên hạt theo profile rang thống nhất."),
    applications: [L("Foodservice", "Foodservice"), L("Private-label retail", "Bán lẻ nhãn riêng"), L("Blending", "Phối trộn")],
    specs: [
      { label: L("Roast profile", "Profile rang") },
      { label: L("Moisture", "Độ ẩm"), method: "ISO 11294" },
      { label: L("Blend", "Phối trộn"), reference: L("Straight Robusta or blend — agreed", "Robusta nguyên chất hoặc phối trộn — thống nhất") },
      PACKAGING,
    ],
    images: [PACK("WHCF004", "roasted whole-bean coffee in a 1 kg pouch", "cà phê rang nguyên hạt trong túi 1 kg"), IMG.cups],
  },
  {
    code: "WHCF005", slug: "whcf005", family: "coffee", range: "coffee-roasted",
    name: L("Roasted & Ground", "Cà phê rang xay"),
    line: L("Ground coffee · retail and foodservice", "Cà phê xay · bán lẻ và foodservice"),
    summary: L("Robusta, Arabica or blends, roasted and ground to the grind size your brewing method needs.",
      "Robusta, Arabica hoặc phối trộn, rang và xay theo cỡ xay phù hợp phương pháp pha của bạn."),
    applications: [L("Retail", "Bán lẻ"), L("Foodservice", "Foodservice"), L("Drip and filter", "Pha phin và lọc")],
    specs: [
      { label: L("Roast profile", "Profile rang") },
      { label: L("Grind size", "Cỡ xay") },
      { label: L("Moisture", "Độ ẩm"), method: "ISO 11294" },
      PACKAGING,
    ],
    images: [PACK("WHCF005", "roasted and ground coffee in a 250 g pouch", "cà phê rang xay trong túi 250 g"), IMG.spoons],
  },
  {
    code: "WHCF006", slug: "whcf006", family: "coffee", range: "coffee-cold-brew",
    name: L("Cold Brew", "Cold Brew"),
    line: L("Concentrate or RTD base · beverage brands", "Cô đặc hoặc nền RTD · thương hiệu đồ uống"),
    summary: L("Cold brew coffee as a concentrate or ready-to-drink base, developed to your strength and sweetness brief.",
      "Cà phê cold brew dạng cô đặc hoặc nền pha sẵn, phát triển theo yêu cầu nồng độ và độ ngọt của bạn."),
    applications: [L("RTD beverages", "Đồ uống RTD"), L("Foodservice", "Foodservice"), L("Canned coffee", "Cà phê lon")],
    specs: [
      { label: L("Format", "Dạng"), reference: L("Concentrate or RTD base", "Cô đặc hoặc nền pha sẵn") },
      { label: L("Strength and dilution", "Nồng độ và tỷ lệ pha") },
      { label: L("Sweetness", "Độ ngọt"), reference: L("Unsweetened or sweetened — agreed", "Không đường hoặc có đường — thống nhất") },
      { label: L("Processing and shelf life", "Xử lý và hạn dùng") },
      PACKAGING,
    ],
    images: [PACK("WHCF006", "cold brew black coffee in a 250 ml can", "cold brew cà phê đen trong lon 250 ml"), IMG.spoons],
  },
  {
    code: "WHCF007", slug: "whcf007", family: "coffee", range: "coffee-soluble",
    name: L("Spray-Dried Instant", "Cà phê hòa tan sấy phun"),
    line: L("Fine powder · beverage and mix manufacturing", "Bột mịn · sản xuất đồ uống và hỗn hợp"),
    summary: L("Spray-dried soluble coffee powder from Robusta, Arabica or blends.",
      "Bột cà phê hòa tan sấy phun từ Robusta, Arabica hoặc phối trộn."),
    applications: [L("3-in-1 and mixes", "3 trong 1 và hỗn hợp"), L("Beverage manufacturing", "Sản xuất đồ uống"), L("Private label", "Nhãn hàng riêng")],
    specs: [
      { label: L("Drying technology", "Công nghệ sấy"), reference: L("Spray-dried", "Sấy phun") },
      { label: L("Bean blend", "Phối trộn hạt") },
      { label: L("Moisture", "Độ ẩm"), method: "ISO 3726 / ISO 20938" },
      { label: L("Bulk density and solubility", "Tỷ trọng khối và độ hòa tan") },
      PACKAGING,
    ],
    images: [PACK("WHCF007", "spray-dried instant coffee in a 20–25 kg lined carton", "cà phê hòa tan sấy phun trong thùng carton có lót 20–25 kg"), IMG.cups],
  },
  {
    code: "WHCF008", slug: "whcf008", family: "coffee", range: "coffee-soluble",
    name: L("Agglomerated Instant", "Cà phê hòa tan tạo hạt"),
    line: L("Granules · retail jars and private label", "Dạng hạt · hũ bán lẻ và nhãn riêng"),
    summary: L("Agglomerated soluble coffee granules for retail and private-label formats.",
      "Cà phê hòa tan tạo hạt cho bán lẻ và nhãn hàng riêng."),
    applications: [L("Retail", "Bán lẻ"), L("Private label", "Nhãn hàng riêng"), L("Foodservice", "Foodservice")],
    specs: [
      { label: L("Drying technology", "Công nghệ sấy"), reference: L("Agglomerated", "Tạo hạt") },
      { label: L("Bean blend", "Phối trộn hạt") },
      { label: L("Moisture", "Độ ẩm"), method: "ISO 3726 / ISO 20938" },
      { label: L("Granule size and density", "Cỡ hạt và tỷ trọng") },
      PACKAGING,
    ],
    images: [PACK("WHCF008", "agglomerated instant coffee in a carton of 20 × 2 g sticks", "cà phê hòa tan tạo hạt trong hộp 20 gói 2 g"), IMG.spoons],
  },
  {
    code: "WHCF009", slug: "whcf009", family: "coffee", range: "coffee-soluble",
    name: L("Freeze-Dried Instant", "Cà phê hòa tan sấy thăng hoa"),
    line: L("Crystals · premium retail and private label", "Dạng tinh thể · bán lẻ cao cấp và nhãn riêng"),
    summary: L("Freeze-dried soluble coffee for premium retail and private-label programmes.",
      "Cà phê hòa tan sấy thăng hoa cho bán lẻ cao cấp và chương trình nhãn hàng riêng."),
    applications: [L("Premium retail", "Bán lẻ cao cấp"), L("Private label", "Nhãn hàng riêng")],
    specs: [
      { label: L("Drying technology", "Công nghệ sấy"), reference: L("Freeze-dried", "Sấy thăng hoa") },
      { label: L("Bean blend", "Phối trộn hạt") },
      { label: L("Moisture", "Độ ẩm"), method: "ISO 3726 / ISO 20938" },
      { label: L("Particle size and colour", "Cỡ hạt và màu sắc") },
      PACKAGING,
    ],
    images: [PACK("WHCF009", "freeze-dried instant coffee in a 100 g jar", "cà phê hòa tan sấy thăng hoa trong hũ 100 g"), IMG.cups],
  },
];

/** Packaging options a buyer can raise per family (discussed, confirmed per order). */
export const PACKAGING_OPTIONS: Partial<Record<FamilySlug, Localized[]>> = {
  coffee: [
    L("Green beans: 60 kg jute bags with a hermetic inner liner, or bulk", "Cà phê nhân: bao đay 60 kg có lót trong kín khí, hoặc hàng rời"),
    L("Roasted and soluble: valve bags, jars, drums or bag-in-box", "Cà phê rang và hòa tan: túi van, hũ, thùng phuy hoặc bag-in-box"),
    L("Private label: drip bags, single-serve sachets and retail boxes", "Nhãn hàng riêng: túi lọc, gói single-serve và hộp bán lẻ"),
  ],
  coconut: [
    L("Bulk and retail-ready formats: cartons, jars, pouches and bags, depending on the product", "Quy cách số lượng lớn và bán lẻ: thùng carton, hũ, túi đứng và bao, tùy sản phẩm"),
    L("Custom specification, formulation and private-label packaging on request", "Thông số, công thức và bao bì nhãn hàng riêng theo yêu cầu"),
  ],
  "birds-nest": [
    L("Cleaned nest: jars or vacuum packs", "Yến làm sạch: hũ hoặc túi hút chân không"),
    L("Instant formats: pack format configured per project", "Dạng ăn liền: quy cách bao bì theo từng dự án"),
  ],
  fruit: [
    L("Aluminium-foil bags with desiccant (1–25 kg) or bulk", "Túi nhôm có gói hút ẩm (1–25 kg) hoặc hàng rời"),
    L("Concentrates: glass bottles or aseptic packs", "Cô đặc: chai thủy tinh hoặc bao bì vô trùng"),
    L("Custom formats on request", "Quy cách khác theo yêu cầu"),
  ],
  "nuts-spices-botanicals": [
    L("Bulk vacuum tins, bags or drums", "Thùng thiếc hút chân không, bao hoặc thùng phuy số lượng lớn"),
    L("Retail jars and private label", "Hũ bán lẻ và nhãn hàng riêng"),
  ],
};

// ---------------------------------------------------------------- queries
export const RANGE_IDS = CATALOG_RANGES.map((range) => range.id);

export function rangesFor(family: FamilySlug) {
  return CATALOG_RANGES.filter((range) => range.family === family);
}
export function skusFor(family: FamilySlug) {
  return CATALOG_SKUS.filter((sku) => sku.family === family);
}
export function findSku(family: string, slug: string) {
  return CATALOG_SKUS.find((sku) => sku.family === family && sku.slug === slug);
}
export function findRange(id: string) {
  return CATALOG_RANGES.find((range) => range.id === id);
}
/** Same range first, then the rest of the family, excluding the SKU itself. */
export function relatedSkus(sku: CatalogSku, limit = 3) {
  const family = skusFor(sku.family).filter((s) => s.code !== sku.code);
  return [...family.filter((s) => s.range === sku.range), ...family.filter((s) => s.range !== sku.range)].slice(0, limit);
}
export function pick(text: Localized, locale: string) {
  return locale === "vi" ? text.vi : text.en;
}
