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

export type CatalogImage = {
  src: string;
  alt: Localized;
  /** Editorial references from the website-edit brief (docs/asset-provenance.md). */
  kind: "editorial";
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

/** Family hero images (editorial). Families without one fall back to their card artwork. */
export const FAMILY_HERO_IMAGE: Partial<Record<FamilySlug, CatalogImage>> = {
  coffee: IMG.cups,
};

// ---------------------------------------------------------------- ranges
const r = (
  family: FamilySlug,
  id: string,
  name: Localized,
  summary: Localized,
  formats: Localized[],
  specFields: Localized[]
): CatalogRange => ({ id, family, name, summary, formats, specFields });

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

  // Coconut
  r("coconut", "coconut-water", L("Coconut water", "Nước dừa"),
    L("Not-from-concentrate and concentrated coconut water for beverages.",
      "Nước dừa không cô đặc (NFC) và cô đặc cho ngành đồ uống."),
    [L("NFC", "NFC"), L("Concentrate", "Cô đặc"), L("Powder", "Dạng bột")],
    [L("Brix and pH", "Độ Brix và pH"), L("Heat treatment", "Phương pháp xử lý nhiệt"), L("Packaging", "Bao bì")]),
  r("coconut", "coconut-milk-cream", L("Coconut milk & cream", "Sữa & kem dừa"),
    L("Coconut milk, light milk and cream at the fat level your application needs.",
      "Sữa dừa, sữa dừa loãng và kem dừa theo hàm lượng béo ứng dụng cần."),
    [L("Milk", "Sữa dừa"), L("Cream", "Kem dừa"), L("Powder", "Dạng bột")],
    [L("Fat content", "Hàm lượng chất béo"), L("Stabilisers (if any)", "Chất ổn định (nếu có)"), L("Sterilisation and pack", "Tiệt trùng và bao bì")]),
  r("coconut", "coconut-desiccated", L("Desiccated coconut", "Dừa sấy khô"),
    L("Desiccated coconut in fine, medium and other cuts for bakery and confectionery.",
      "Dừa sấy khô dạng mịn, vừa và các kiểu cắt khác cho bánh và kẹo."),
    [L("Fine", "Mịn"), L("Medium", "Vừa"), L("Flakes and chips", "Vảy và lát")],
    [L("Cut and particle size", "Kiểu cắt và cỡ hạt"), L("Fat and moisture", "Hàm lượng béo và độ ẩm"), L("Colour", "Màu sắc")]),
  r("coconut", "coconut-oil", L("Coconut oil", "Dầu dừa"),
    L("Virgin and refined coconut oil for food manufacturing.",
      "Dầu dừa nguyên chất và tinh luyện cho sản xuất thực phẩm."),
    [L("Virgin", "Nguyên chất"), L("Refined", "Tinh luyện")],
    [L("Extraction method", "Phương pháp ép/chiết"), L("Free fatty acids", "Axit béo tự do"), L("Packaging", "Bao bì")]),
  r("coconut", "coconut-sugar-flour", L("Coconut sugar, syrup & flour", "Đường, mật & bột dừa"),
    L("Coconut sap sugar and syrup, and coconut flour, sourced on request.",
      "Đường và mật hoa dừa, bột dừa — tìm nguồn theo yêu cầu."),
    [L("Sugar", "Đường"), L("Syrup", "Mật"), L("Flour", "Bột")],
    [L("Moisture and colour", "Độ ẩm và màu sắc"), L("Particle size", "Cỡ hạt"), L("Packaging", "Bao bì")]),
  r("coconut", "coconut-frozen", L("Frozen & fresh-processed coconut", "Dừa đông lạnh & sơ chế"),
    L("Frozen coconut meat, water and fresh-processed formats for foodservice and manufacturing.",
      "Cơm dừa, nước dừa đông lạnh và dạng sơ chế cho foodservice và sản xuất."),
    [L("Frozen meat", "Cơm dừa đông lạnh"), L("Frozen water", "Nước dừa đông lạnh")],
    [L("Cut and format", "Kiểu cắt và dạng"), L("Freezing and cold chain", "Cấp đông và chuỗi lạnh"), L("Packaging", "Bao bì")]),

  // Bird's nest
  r("birds-nest", "birds-nest-raw-cleaned", L("Raw & cleaned nest", "Yến thô & yến tinh chế"),
    L("Raw and cleaned swiftlet nest, subject to each destination market's import rules.",
      "Yến thô và yến đã làm sạch, tuân theo quy định nhập khẩu của từng thị trường đích."),
    [L("Raw", "Yến thô"), L("Cleaned", "Yến tinh chế")],
    [L("Nest type and cleaning method", "Loại tổ và phương pháp làm sạch"), L("Moisture", "Độ ẩm"),
     L("Market access and facility registration", "Điều kiện tiếp cận thị trường và đăng ký cơ sở")]),
  r("birds-nest", "birds-nest-whole-broken", L("Whole & broken grades", "Tổ nguyên & yến vụn"),
    L("Whole cups, strips and broken pieces graded by shape and size.",
      "Tổ nguyên, sợi yến và yến vụn phân loại theo hình dạng và kích cỡ."),
    [L("Whole cup", "Tổ nguyên"), L("Strips", "Sợi"), L("Broken", "Vụn")],
    [L("Grade and piece size", "Hạng và kích cỡ"), L("Moisture", "Độ ẩm"), L("Packaging", "Bao bì")]),
  r("birds-nest", "birds-nest-powder-extract", L("Powder, freeze-dried & extract", "Bột, sấy thăng hoa & chiết xuất"),
    L("Ingredient formats developed on request for nutrition applications.",
      "Dạng nguyên liệu phát triển theo yêu cầu cho ứng dụng dinh dưỡng."),
    [L("Powder", "Bột"), L("Freeze-dried", "Sấy thăng hoa"), L("Extract", "Chiết xuất")],
    [L("Format and concentration", "Dạng và nồng độ"), L("Carrier (if any)", "Chất mang (nếu có)"), L("Documentation required by market", "Hồ sơ thị trường yêu cầu")]),
  r("birds-nest", "birds-nest-rtd-oem", L("RTD & OEM formulations", "Nước yến & công thức OEM"),
    L("Ready-to-drink and OEM formulations developed under the buyer's brand.",
      "Nước yến pha sẵn và công thức OEM phát triển dưới thương hiệu của khách hàng."),
    [L("Bottled RTD", "Nước yến đóng chai"), L("OEM formula", "Công thức OEM")],
    [L("Nest content and recipe", "Hàm lượng yến và công thức"), L("Sweetness", "Độ ngọt"), L("Sterilisation and shelf life", "Tiệt trùng và hạn dùng")]),

  // Fruit
  r("fruit", "fruit-fresh", L("Fresh fruit", "Trái cây tươi"),
    L("Tropical fruit sourced for fresh export where the destination market allows.",
      "Trái cây nhiệt đới tìm nguồn cho xuất khẩu tươi khi thị trường đích cho phép."),
    [L("Dragon fruit", "Thanh long"), L("Mango", "Xoài"), L("Passion fruit", "Chanh dây")],
    [L("Variety and grade", "Giống và hạng"), L("Phytosanitary and market access", "Kiểm dịch thực vật và tiếp cận thị trường"), L("Cold chain", "Chuỗi lạnh")]),
  r("fruit", "fruit-frozen", L("Frozen & IQF", "Đông lạnh & IQF"),
    L("Quick-frozen fruit pieces and halves for manufacturing and foodservice.",
      "Trái cây cấp đông nhanh dạng miếng và nửa quả cho sản xuất và foodservice."),
    [L("IQF pieces", "Miếng IQF"), L("Block frozen", "Đông khối")],
    [L("Cut and size", "Kiểu cắt và kích cỡ"), L("Brix", "Độ Brix"), L("Freezing and cold chain", "Cấp đông và chuỗi lạnh")]),
  r("fruit", "fruit-puree", L("Purée & pulp", "Puree & thịt quả"),
    L("Fruit purées and pulps for beverages, dairy and bakery.",
      "Puree và thịt quả cho đồ uống, sản phẩm sữa và bánh."),
    [L("Purée", "Puree"), L("Pulp", "Thịt quả")],
    [L("Brix and pH", "Độ Brix và pH"), L("Seeds and fibre", "Hạt và xơ"), L("Aseptic or frozen", "Vô trùng hoặc đông lạnh")]),
  r("fruit", "fruit-juice", L("NFC juice & concentrate", "Nước ép NFC & cô đặc"),
    L("Not-from-concentrate juices and juice concentrates for beverage manufacturing.",
      "Nước ép không cô đặc và nước ép cô đặc cho sản xuất đồ uống."),
    [L("NFC", "NFC"), L("Concentrate", "Cô đặc")],
    [L("Brix and acidity", "Độ Brix và độ axit"), L("Heat treatment", "Xử lý nhiệt"), L("Packaging", "Bao bì")]),
  r("fruit", "fruit-dried", L("Dried & freeze-dried", "Sấy khô & sấy thăng hoa"),
    L("Dried and freeze-dried pieces for snacks, cereal and bakery.",
      "Trái cây sấy khô và sấy thăng hoa dạng miếng cho snack, ngũ cốc và bánh."),
    [L("Dried", "Sấy khô"), L("Freeze-dried", "Sấy thăng hoa")],
    [L("Cut and size", "Kiểu cắt và kích cỡ"), L("Moisture", "Độ ẩm"), L("Added sugar (if any)", "Đường bổ sung (nếu có)")]),
  r("fruit", "fruit-powder", L("Fruit powder & ingredients", "Bột trái cây & nguyên liệu"),
    L("Spray-dried and freeze-dried fruit powders for beverages and nutrition.",
      "Bột trái cây sấy phun và sấy thăng hoa cho đồ uống và dinh dưỡng."),
    [L("Spray-dried", "Sấy phun"), L("Freeze-dried", "Sấy thăng hoa")],
    [L("Carrier (if any)", "Chất mang (nếu có)"), L("Mesh size", "Độ mịn (mesh)"), L("Moisture", "Độ ẩm")]),

  // Nuts, spices & botanicals
  r("nuts-spices-botanicals", "nsb-whole-raw", L("Whole & raw", "Nguyên hạt & thô"),
    L("Representative Vietnamese items such as cashew, pepper, cinnamon and star anise, sourced on request.",
      "Các mặt hàng Việt Nam tiêu biểu như điều, hồ tiêu, quế và hồi, tìm nguồn theo yêu cầu."),
    [L("Cashew", "Hạt điều"), L("Black & white pepper", "Tiêu đen & tiêu trắng"), L("Cinnamon", "Quế"), L("Star anise", "Hoa hồi")],
    [L("Item and origin area", "Mặt hàng và vùng nguồn"), L("Moisture", "Độ ẩm"), L("Packaging", "Bao bì")]),
  r("nuts-spices-botanicals", "nsb-cleaned-graded", L("Cleaned & graded", "Làm sạch & phân loại"),
    L("Cleaned, sorted and graded to the buyer's grade designation (e.g. cashew kernel grades).",
      "Làm sạch, phân loại theo hạng khách hàng chỉ định (ví dụ các hạng nhân điều)."),
    [L("Kernel grades", "Hạng nhân"), L("Sorted spices", "Gia vị đã phân loại")],
    [L("Grade designation", "Hạng chỉ định"), L("Defects and foreign matter", "Khuyết tật và tạp chất"), L("Microbiology", "Chỉ tiêu vi sinh")]),
  r("nuts-spices-botanicals", "nsb-powder", L("Ground & powder", "Xay & dạng bột"),
    L("Ground spices and botanical powders, including steam-treated options to discuss.",
      "Gia vị xay và bột thảo mộc, bao gồm lựa chọn xử lý hơi nước để trao đổi."),
    [L("Ground spices", "Gia vị xay"), L("Botanical powders", "Bột thảo mộc")],
    [L("Mesh size", "Độ mịn (mesh)"), L("Treatment (e.g. steam)", "Phương pháp xử lý (ví dụ hơi nước)"), L("Microbiology", "Chỉ tiêu vi sinh")]),
  r("nuts-spices-botanicals", "nsb-oil-extract", L("Oils & extracts", "Tinh dầu & chiết xuất"),
    L("Essential oils and extracts such as cinnamon or star anise oil, developed on request.",
      "Tinh dầu và chiết xuất như tinh dầu quế hoặc hồi, phát triển theo yêu cầu."),
    [L("Essential oil", "Tinh dầu"), L("Extract", "Chiết xuất")],
    [L("Active marker content", "Hàm lượng hoạt chất chỉ thị"), L("Extraction method", "Phương pháp chiết"), L("Packaging", "Bao bì")]),
  r("nuts-spices-botanicals", "nsb-custom", L("Buyer-specific processing", "Chế biến theo yêu cầu"),
    L("Roasted, seasoned, blended or cut to the buyer's specification.",
      "Rang, tẩm vị, phối trộn hoặc cắt theo thông số của khách hàng."),
    [L("Roasted", "Rang"), L("Blends", "Phối trộn"), L("Custom cuts", "Cắt theo yêu cầu")],
    [L("Process and recipe", "Quy trình và công thức"), L("Allergen handling", "Kiểm soát chất gây dị ứng"), L("Packaging", "Bao bì")]),
];

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
    images: [IMG.bowls, IMG.flatlay],
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
    images: [IMG.flatlay, IMG.bowls],
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
    images: [IMG.bowls, IMG.flatlay],
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
    images: [IMG.cups, IMG.spoons],
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
    images: [IMG.spoons, IMG.cups],
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
    images: [IMG.spoons, IMG.cups],
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
    images: [IMG.cups, IMG.spoons],
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
    images: [IMG.spoons, IMG.cups],
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
    images: [IMG.cups, IMG.spoons],
  },
];

/** Packaging options a buyer can raise per family (discussed, confirmed per order). */
export const PACKAGING_OPTIONS: Partial<Record<FamilySlug, Localized[]>> = {
  coffee: [
    L("Green beans: 60 kg jute bags with a hermetic inner liner, or bulk", "Cà phê nhân: bao đay 60 kg có lót trong kín khí, hoặc hàng rời"),
    L("Roasted and soluble: valve bags, jars, drums or bag-in-box", "Cà phê rang và hòa tan: túi van, hũ, thùng phuy hoặc bag-in-box"),
    L("Private label: drip bags, single-serve sachets and retail boxes", "Nhãn hàng riêng: túi lọc, gói single-serve và hộp bán lẻ"),
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
