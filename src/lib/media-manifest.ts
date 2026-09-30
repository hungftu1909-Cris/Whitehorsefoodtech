// Canonical product media manifest — the ONLY place product imagery is
// assigned. Every slot is keyed by a stable Whitehorse identifier (family
// slug, range id, SKU code), never by array position, so reordering
// PRODUCT_CATEGORIES, CATALOG_RANGES or CATALOG_SKUS cannot change which
// file a product shows.
//
// Rules (enforced by tests/media-manifest.test.ts):
// - image01 / image02 are filled only with a verified asset for THAT
//   family / range / code. No fallbacks, no padding, no modulo reuse.
// - image02 must be a different file AND a different source photograph
//   (a re-crop or re-encode of image01 is not a second image).
// - A range or SKU never borrows its family's highlight photograph (or a
//   crop of it) and never borrows another product's pack.
// - An asset belongs to exactly one family; cross-family paths are rejected.
// - When no verified asset exists the slot says so ("missing") and the UI
//   renders an image-free, specification-led card — never a stand-in.
// - `sha256` pins the exact approved bytes; source files are never altered.
//
// Provenance per file: docs/asset-provenance.md and docs/image-inventory.md;
// audit table: docs/media-audit.md.
//
// Import-free (types only) so node:test can load it.

import type { FamilySlug, Localized, RangeId } from "./catalog";

export type MediaKind =
  /** Owner- or user-supplied ingredient photograph/composition, no label. */
  | "editorial"
  /** Owner's provisional Whitehorse packaging render, label untouched. Always badged. */
  | "concept-pack"
  /** Crop of an owner-supplied ingredient image showing one product form, no label. */
  | "studio";

export type MediaAsset = {
  id: string;
  src: string;
  alt: Localized;
  kind: MediaKind;
  /** The one family this asset may appear under. */
  family: FamilySlug;
  /** Original file the public asset was derived from (same file ⇒ same photograph). */
  sourceFile: string;
  /** Crop region inside `sourceFile`, when the asset is a crop of a larger image. */
  region?: string;
  /** SKU codes printed on the source pack (packaging renders only). */
  codes?: string[];
  /** SHA-256 of the public file — pins the approved bytes. */
  sha256: string;
  /** Commercial-use rights. All current assets await written confirmation. */
  rights: "pending-confirmation";
};

export type MediaStatus = "verified-pair" | "verified-single" | "missing";

export type MediaSlot = {
  image01: AssetId | null;
  image02: AssetId | null;
  status: MediaStatus;
  /** Why the slot is not a verified pair; shown in docs/media-audit.md. */
  gap?: string;
};

export type SkuMediaSlot = MediaSlot & {
  /** True only for codes with a public detail page (coffee today). */
  publicPage: boolean;
};

const L = (en: string, vi: string): Localized => ({ en, vi });

// -------------------------------------------------------------- assets
const COFFEE_DOCX = "Đề xuất chỉnh sửa Website.docx";

const coffeePack = <I extends string>(id: I, code: string, sha256: string, sourceFile: string, en: string, vi: string) => ({
  id,
  src: `/images/catalog/coffee/packs/${id.replace(/^coffee-pack-/, "")}-concept-pack.webp`,
  alt: L(`Packaging concept render for ${code}: ${en}`, `Hình render bao bì ý tưởng cho ${code}: ${vi}`),
  kind: "concept-pack",
  family: "coffee",
  sourceFile: `WHITEHORSE_01_COFFEE/02_sku_packshots_ivory/${sourceFile}`,
  codes: [code],
  sha256,
  rights: "pending-confirmation",
}) satisfies MediaAsset;

const pack = <I extends string>(
  family: FamilySlug,
  id: I,
  file: string,
  sourceFile: string,
  codes: string[],
  sha256: string,
  en: string,
  vi: string
) => ({
  id,
  src: `/images/catalog/${family}/packs/${file}.webp`,
  alt: L(`Packaging concept render: ${en}`, `Hình render bao bì ý tưởng: ${vi}`),
  kind: "concept-pack",
  family,
  sourceFile,
  codes,
  sha256,
  rights: "pending-confirmation",
}) satisfies MediaAsset;

const ASSET_LIST = [
  // Coffee — user-supplied photographs (website-edit brief DOCX)
  {
    id: "coffee-photo-flatlay",
    src: "/images/catalog/coffee/coffee-green-roasted-flatlay.jpg",
    alt: L("Green and roasted coffee beans with ground coffee in white dishes and wooden scoops",
      "Cà phê nhân xanh, cà phê rang và cà phê xay trong đĩa trắng và muỗng gỗ"),
    kind: "editorial", family: "coffee", sourceFile: `${COFFEE_DOCX}#word/media/image4.jpg`,
    sha256: "c304ff1e397bf22eb50ae79ff8ba80a790506d6ac8dfe07d0cd48673f79dd0c4", rights: "pending-confirmation",
  },
  {
    id: "coffee-photo-cups",
    src: "/images/catalog/coffee/coffee-ground-whole-instant.jpg",
    alt: L("Ground coffee, roasted coffee beans and instant coffee granules in three cups",
      "Cà phê xay, cà phê hạt rang và cà phê hòa tan dạng hạt trong ba chiếc cốc"),
    kind: "editorial", family: "coffee", sourceFile: `${COFFEE_DOCX}#word/media/image1.jpg`,
    sha256: "f8c9eec0001046e349e679de3d9c53ad7df18af51feab256b0aca4d2c9ea0025", rights: "pending-confirmation",
  },
  {
    id: "coffee-photo-bowls",
    src: "/images/catalog/coffee/coffee-green-roasted-ground-bowls.jpg",
    alt: L("Green coffee beans and ground coffee in wooden bowls on roasted beans",
      "Cà phê nhân xanh và cà phê xay trong bát gỗ trên nền cà phê hạt rang"),
    kind: "editorial", family: "coffee", sourceFile: `${COFFEE_DOCX}#word/media/image3.jpg`,
    sha256: "e66463d5ebe916c4b5ed8a047279e4c3280fb24652348c1a2c449d997734c5a0", rights: "pending-confirmation",
  },
  {
    id: "coffee-photo-spoons",
    src: "/images/catalog/coffee/coffee-roasted-ground-instant-spoons.jpg",
    alt: L("Roasted coffee beans in a wooden bowl with spoons of ground and instant coffee",
      "Cà phê hạt rang trong bát gỗ cùng thìa cà phê xay và cà phê hòa tan"),
    kind: "editorial", family: "coffee", sourceFile: `${COFFEE_DOCX}#word/media/image2.jpg`,
    sha256: "40945f1ec9cb1232317124c07637c94d679961820808b1a146df6a7c49740b2a", rights: "pending-confirmation",
  },
  // Coffee — one packaging concept render per confirmed code
  coffeePack("coffee-pack-whcf001", "WHCF001", "51149bc316200105b14b13072a360b380a172033affedbf10cf5adcbf9b642e6", "02_whcf001_s15_2_5_kg_professional_front34_2400.jpg",
    "green Robusta coffee beans in a 2–5 kg barrier pouch", "cà phê nhân Robusta trong túi barrier 2–5 kg"),
  coffeePack("coffee-pack-whcf002", "WHCF002", "4956bdf100093657abfd15616581beaa0cbb020dbe35066c29dd4610e70a2654", "05_whcf002_s15_2_5_kg_professional_front34_2400.jpg",
    "green Arabica coffee beans in a 2–5 kg barrier pouch", "cà phê nhân Arabica trong túi barrier 2–5 kg"),
  coffeePack("coffee-pack-whcf003", "WHCF003", "9ef2f8b4de7a65de72fb2f9e19a04dcbdd155fd3f66a2ea3aa8ae2fdd2b054a1", "08_whcf003_s15_2_5_kg_professional_front34_2400.jpg",
    "fine green Robusta in a 2–5 kg barrier pouch", "Robusta nhân loại Fine trong túi barrier 2–5 kg"),
  coffeePack("coffee-pack-whcf004", "WHCF004", "525b120c0c013b2b4ecff102a407497a039f14ca8e0fbe7931a1eb6e3ae15d92", "10_whcf004_s05_1_kg_professional_front34_2400.jpg",
    "roasted whole-bean coffee in a 1 kg pouch", "cà phê rang nguyên hạt trong túi 1 kg"),
  coffeePack("coffee-pack-whcf005", "WHCF005", "5e1a356206382324851dc38add498ebdbffe6c2924bee14545517b423fc356c6", "12_whcf005_s15_250_g_retail_front34_2400.jpg",
    "roasted and ground coffee in a 250 g pouch", "cà phê rang xay trong túi 250 g"),
  coffeePack("coffee-pack-whcf006", "WHCF006", "8aee83a25957ac3dbcdb254864d65387f70e2abe3d1eb1ea363bec17929746f5", "32_whcf006_s11_250_ml_retail_front34_2400.jpg",
    "cold brew black coffee in a 250 ml can", "cold brew cà phê đen trong lon 250 ml"),
  coffeePack("coffee-pack-whcf007", "WHCF007", "13bca013a6fe04f75b5564256a3baea196e2d43c82803da21494afee0435a0d9", "18_whcf007_s17_20_25_kg_industrial_front34_2400.jpg",
    "spray-dried instant coffee in a 20–25 kg lined carton", "cà phê hòa tan sấy phun trong thùng carton có lót 20–25 kg"),
  coffeePack("coffee-pack-whcf008", "WHCF008", "725c94cdb73be5cb1e13a1589c2ca75e97f2d100d2c6b09a86a3abe07afdd467", "24_whcf008_s09_20_2_g_retail_front34_2400.jpg",
    "agglomerated instant coffee in a carton of 20 × 2 g sticks", "cà phê hòa tan tạo hạt trong hộp 20 gói 2 g"),
  coffeePack("coffee-pack-whcf009", "WHCF009", "657ae3c122338b138c1ad8771642d1b299feacc9e7a1d354c6a43fb1ea1f91f7", "28_whcf009_s10_100_g_retail_front34_2400.jpg",
    "freeze-dried instant coffee in a 100 g jar", "cà phê hòa tan sấy thăng hoa trong hũ 100 g"),
  // Coffee — second approved pack format of the same code (label untouched, code printed)
  coffeePack("coffee-pack-whcf005-retail-box", "WHCF005", "acde368cf734564e69c55d20b201f10efa310cf9bc0571a33aafb6e6aab5c8f8", "14_whcf005_s07_10_11_g_retail_front34_2400.jpg",
    "roasted and ground coffee in a retail box of 10 × 11 g", "cà phê rang xay trong hộp bán lẻ 10 × 11 g"),
  coffeePack("coffee-pack-whcf006-pouch", "WHCF006", "4dd1f2c8394b3691a99fe862d6571a01ef915bd1d40040723b37be47121843d6", "33_whcf006_s25_20_g_retail_front34_2400.jpg",
    "cold brew black coffee in a 20 g retail pouch", "cold brew cà phê đen trong túi bán lẻ 20 g"),
  coffeePack("coffee-pack-whcf009-pouch", "WHCF009", "cfb6e3d4298bb2354479c5b509346959b87ed6cd557ee54ce24fb2defe13eb04", "29_whcf009_s15_100_g_retail_front34_2400.jpg",
    "freeze-dried instant coffee in a 100 g retail pouch", "cà phê hòa tan sấy thăng hoa trong túi bán lẻ 100 g"),

  // Coconut
  {
    id: "coconut-photo-composition",
    src: "/images/catalog/editorial/coconut-real-products.webp",
    alt: L("Owner-supplied product photograph of coconut, milk, cream, flakes, milk powder and coconut sugar",
      "Ảnh sản phẩm do Whitehorse cung cấp gồm dừa, sữa, kem, dừa sấy, bột sữa dừa và đường dừa"),
    kind: "editorial", family: "coconut", sourceFile: "owner:Coconut.jpg",
    sha256: "6bde4811c434613d74e19a7cdeefc9c96801fb47abbe9894c92d6a694c52ac51", rights: "pending-confirmation",
  },
  pack("coconut", "coconut-pack-lineup", "coconut-lineup-concept-pack", "WHITEHORSE_02_COCONUT/01_category_studio/coconut_lineup_square_3000.jpg",
    ["WHCO001", "WHCO002", "WHCO003", "WHCO004", "WHCO005"], "d7cbb6135c8ba83379ff88b251009ab6b8929d6d8fc27c18db7eda846d22c83c",
    "coconut line-up — milk and cream cartons, desiccated coconut, coconut milk powder and coconut blossom sugar pouches",
    "bộ sản phẩm dừa — hộp sữa và kem dừa, túi dừa sấy, bột sữa dừa và đường hoa dừa"),
  pack("coconut", "coconut-pack-milk-carton", "coconut-milk-carton-concept-pack", "WHITEHORSE_02_COCONUT/02_sku_packshots_ivory/02_whco001_s12_1_l_professional_front34_2400.jpg",
    ["WHCO001"], "bc99d4c85efc79acef61df703a2dedf906d9a7252ecd9b74eb632b47475158d7",
    "coconut milk in a 1 L aseptic carton", "sữa dừa trong hộp giấy vô trùng 1 L"),
  pack("coconut", "coconut-pack-cream-bib", "coconut-cream-bib-concept-pack", "WHITEHORSE_02_COCONUT/02_sku_packshots_ivory/07_whco002_s13_20_kg_industrial_front34_2400.jpg",
    ["WHCO002"], "d988e4a73ce47fb6ba45f670c5f50e69e54a8bdfec154358d61e8d502b240d6e",
    "coconut cream in a 20 kg bag-in-box carton", "kem dừa trong thùng bag-in-box 20 kg"),
  pack("coconut", "coconut-pack-desiccated-pouch", "desiccated-coconut-pouch-concept-pack", "WHITEHORSE_02_COCONUT/02_sku_packshots_ivory/10_whco003_s15_1_kg_professional_front34_2400.jpg",
    ["WHCO003"], "1c27af8e8ab34a3e9dacce7e5b17b518f4b9b2a44578760bbcac31a270fed237",
    "desiccated coconut, fine grade, in a 1 kg pouch with window", "dừa sấy khô loại mịn trong túi 1 kg có cửa sổ"),
  pack("coconut", "coconut-pack-milk-powder-pouch", "coconut-milk-powder-pouch-concept-pack", "WHITEHORSE_02_COCONUT/02_sku_packshots_ivory/13_whco004_s15_500_g_1_kg_professional_front34_2400.jpg",
    ["WHCO004"], "f067be03f7dc4f4afce820359363187cfc3e05e468cce2e77415fd531335db6d",
    "coconut milk powder in a 500 g / 1 kg pouch", "bột sữa dừa trong túi 500 g / 1 kg"),
  pack("coconut", "coconut-pack-blossom-sugar-pouch", "coconut-blossom-sugar-pouch-concept-pack", "WHITEHORSE_02_COCONUT/02_sku_packshots_ivory/17_whco005_s15_250_300_500_g_retail_front34_2400.jpg",
    ["WHCO005"], "5bb2dfafaa7a8b98b3499f7f811ea9c549765dc1dfa37694d518723379737cdb",
    "coconut blossom sugar in a retail pouch with window", "đường hoa dừa trong túi bán lẻ có cửa sổ"),

  // Bird's nest
  {
    id: "birds-nest-photo-composition",
    src: "/images/catalog/editorial/birds-nest-real-products.webp",
    alt: L("Owner-supplied product photograph of cleaned bird's nest with prepared bird's nest, red dates, rock sugar and honey",
      "Ảnh sản phẩm do Whitehorse cung cấp gồm tổ yến làm sạch, yến chưng, táo đỏ, đường phèn và mật ong"),
    kind: "editorial", family: "birds-nest", sourceFile: "owner:Yến.jpg",
    sha256: "dfc38df498234de0ace71d0f6a84478135d62903e5b1b3d294e207fb5e2b506b", rights: "pending-confirmation",
  },
  pack("birds-nest", "birds-nest-pack-lineup", "birds-nest-lineup-concept-pack", "WHITEHORSE_03_BIRD_S_NEST/01_category_studio/bird_s_nest_lineup_square_3000.jpg",
    ["WHBN001", "WHBN002"], "2dd42c1087f7c6ff6d9c97b32e80ec7ae5562f72431cc8b9c7a95c9a8b78e984",
    "bird's nest line-up — a cleaned-nest rigid box and an instant bird's nest carton",
    "bộ sản phẩm yến — hộp cứng yến làm sạch và hộp yến ăn liền"),
  pack("birds-nest", "birds-nest-pack-cleaned-box", "cleaned-birds-nest-box-concept-pack", "WHITEHORSE_03_BIRD_S_NEST/02_sku_packshots_ivory/05_whbn002_s19_50_g_retail_front34_2400.jpg",
    ["WHBN002"], "808f08279da3426c09fb84c6c530992ec5260017d094e91321689d5ed5bb79ce",
    "cleaned edible bird's nest in a 50 g rigid box", "yến sào làm sạch trong hộp cứng 50 g"),
  pack("birds-nest", "birds-nest-pack-instant-sachet", "instant-birds-nest-sachet-concept-pack", "WHITEHORSE_03_BIRD_S_NEST/02_sku_packshots_ivory/01_whbn001_s23_10_g_retail_front34_2400.jpg",
    ["WHBN001"], "b44a778be642cf8d3434d45fcff541903981827513b6f9c9a62cb7c6b8010fed",
    "instant bird's nest in a 10 g serving sachet", "yến ăn liền trong gói 10 g"),
  pack("birds-nest", "birds-nest-pack-instant-carton", "instant-birds-nest-carton-concept-pack", "WHITEHORSE_03_BIRD_S_NEST/02_sku_packshots_ivory/03_whbn001_s20_10_10_g_retail_front34_2400.jpg",
    ["WHBN001"], "fefeba2781c249185946ef66273cb3f9b68888654db1d7453bfcac37ea4dd611",
    "instant bird's nest in a carton of 10 × 10 g sachets", "yến ăn liền trong hộp 10 gói 10 g"),

  // Fruit
  {
    id: "fruit-photo-composition",
    src: "/images/catalog/editorial/fruit-real-products.webp",
    alt: L("Owner-supplied product photograph showing mango, soursop and passion fruit in dried, powder, concentrate and purée formats",
      "Ảnh sản phẩm do Whitehorse cung cấp, thể hiện xoài, mãng cầu và chanh dây ở dạng sấy, bột, cô đặc và puree"),
    kind: "editorial", family: "fruit", sourceFile: "owner:Trái cây.jpg",
    sha256: "08fc3ca3ddef7805d50ccb97cfa1fac77051a5f9e5e03bbab37e0f1a835553cf", rights: "pending-confirmation",
  },
  pack("fruit", "fruit-pack-soft-dried-mango-pouch", "soft-dried-mango-pouch-concept-pack", "WHITEHORSE_04_FRUIT/02_sku_packshots_ivory/01_whfr001_s15_500_g_professional_front34_2400.jpg",
    ["WHFR001"], "f48e32127ad5ca6995db69a096b2e99d72853e168847e103a6bddc4f8e520d66",
    "soft-dried mango in a 500 g pouch", "xoài sấy dẻo trong túi 500 g"),
  pack("fruit", "fruit-pack-passion-fruit-concentrate-bib", "passion-fruit-concentrate-bib-concept-pack", "WHITEHORSE_04_FRUIT/04_3d_glb/25_whfr006_s13_20_kg_industrial.glb",
    ["WHFR006"], "fc3ba3d5d210363bdd45fc401a11e1d813aec3f30570c772a2dd471dc8df22de",
    "passion fruit concentrate in a 20 kg bag-in-box carton", "chanh dây cô đặc trong thùng bag-in-box 20 kg"),
  {
    id: "fruit-crop-soft-dried-soursop",
    src: "/images/catalog/fruit/studio/soft-dried-soursop-studio.webp",
    alt: L("Dried soursop pieces in a wooden bowl beside a halved soursop", "Mãng cầu sấy trong bát gỗ bên quả mãng cầu bổ đôi"),
    kind: "studio", family: "fruit", sourceFile: "owner:Trái cây 2.png", region: "(980,60)-(1520,465)",
    sha256: "42bb48c70941d0b684e3f2f0716ed9b84964e9a192af2e17bdf323222881a5b4", rights: "pending-confirmation",
  },
  {
    id: "fruit-crop-freeze-dried-mango",
    src: "/images/catalog/fruit/studio/freeze-dried-mango-studio.webp",
    alt: L("Freeze-dried mango cubes in a bowl", "Xoài sấy thăng hoa dạng hạt lựu trong bát"),
    kind: "studio", family: "fruit", sourceFile: "owner:Trái cây 2.png", region: "(530,75)-(990,420)",
    sha256: "a973adf503965553243b2067085e5cf9e41872d1ce834b9bd79634b7439efded", rights: "pending-confirmation",
  },
  {
    id: "fruit-crop-passion-fruit-powder",
    src: "/images/catalog/fruit/studio/passion-fruit-powder-studio.webp",
    alt: L("Passion fruit powder in a bowl beside a halved passion fruit", "Bột chanh dây trong bát bên quả chanh dây bổ đôi"),
    kind: "studio", family: "fruit", sourceFile: "owner:Trái cây 2.png", region: "(1060,550)-(1520,895)",
    sha256: "94214bc7fd6a8c8c27460f8eb22040426558e07a684cef1fc9c2705429208676", rights: "pending-confirmation",
  },
  {
    id: "fruit-crop-passion-fruit-puree",
    src: "/images/catalog/fruit/studio/passion-fruit-puree-studio.webp",
    alt: L("Passion fruit purée in a bowl with whole and halved passion fruit", "Puree chanh dây trong bát cùng chanh dây nguyên quả và bổ đôi"),
    kind: "studio", family: "fruit", sourceFile: "owner:Trái cây 2.png", region: "(500,530)-(1020,920)",
    sha256: "1ed0095749734a92cec059c9d9269ba7f7bbe8adecb54b5e38eeab9b313e9eaa", rights: "pending-confirmation",
  },

  // Nuts, spices & botanicals
  {
    id: "nsb-photo-composition",
    src: "/images/catalog/editorial/nuts-spices-real-products.webp",
    alt: L("Owner-supplied product photograph of cashew kernels, black pepper, star anise and cinnamon",
      "Ảnh sản phẩm do Whitehorse cung cấp gồm nhân hạt điều, hồ tiêu đen, hoa hồi và quế"),
    kind: "editorial", family: "nuts-spices-botanicals", sourceFile: "owner:Hạt quế hồi.jpg",
    sha256: "b529b888a1e478d2c602369bd755e6c97c41b0d225fd193c071891ee7469f0c0", rights: "pending-confirmation",
  },
  {
    id: "nsb-crop-star-anise",
    src: "/images/catalog/nuts-spices-botanicals/studio/star-anise-studio.webp",
    alt: L("Whole star anise on a wooden surface", "Hoa hồi nguyên cánh trên mặt gỗ"),
    kind: "studio", family: "nuts-spices-botanicals", sourceFile: "Đề xuất chỉnh sửa Website 4.docx#image2.png", region: "(440,540)-(800,810)",
    sha256: "e5951c83af121a015c5dc6b2cb8fb2609f90a1a29fc008abd78de329022047aa", rights: "pending-confirmation",
  },
  {
    id: "nsb-photo-cashew-tree",
    src: "/images/catalog/nuts-spices-botanicals/cashew-tree-origin.webp",
    alt: L("Cashew apples with their nuts on the tree", "Quả điều cùng hạt điều trên cây"),
    kind: "editorial", family: "nuts-spices-botanicals", sourceFile: "owner:Ảnh WEB/HẠt điều.jpg",
    sha256: "03c003d703c43fd2448bc2b748596c083daf229221a6361647c7abe925ac90c4", rights: "pending-confirmation",
  },
] as const satisfies readonly MediaAsset[];

export type AssetId = (typeof ASSET_LIST)[number]["id"];

export const MEDIA_ASSETS = Object.fromEntries(ASSET_LIST.map((asset) => [asset.id, asset])) as Record<AssetId, MediaAsset>;

/**
 * Files on disk that are deliberately NOT used, and why. Tests keep these
 * out of every slot so a future edit cannot quietly reintroduce them.
 */
export const REJECTED_MEDIA: Record<string, string> = {
  "/images/catalog/studio/coconut.jpg": "Same photograph as coconut-photo-composition (owner Coconut.jpg), different crop",
  "/images/catalog/studio/birds-nest.jpg": "Same photograph as birds-nest-photo-composition (owner Yến.jpg), different crop",
  "/images/catalog/studio/fruit.jpg": "Same photograph as fruit-photo-composition (owner Trái cây.jpg), different crop",
  "/images/catalog/studio/nuts-spices-botanicals.jpg": "Same photograph as nsb-photo-composition (owner Hạt quế hồi.jpg), different crop",
  "/images/catalog/nuts-spices-botanicals/studio/cashew-kernels-studio.webp": "Crop of the family photograph (owner Hạt quế hồi.jpg); would reuse the family image as the nuts range image",
};

// -------------------------------------------------------------- slots
const pair = (image01: AssetId, image02: AssetId): MediaSlot => ({ image01, image02, status: "verified-pair" });
const single = (image01: AssetId, gap: string): MediaSlot => ({ image01, image02: null, status: "verified-single", gap });
const missing = (gap: string): MediaSlot => ({ image01: null, image02: null, status: "missing", gap });

/** Two distinct highlight images per family where the repository has them. */
export const FAMILY_MEDIA: Record<FamilySlug, MediaSlot> = {
  coffee: pair("coffee-photo-flatlay", "coffee-photo-cups"),
  coconut: pair("coconut-photo-composition", "coconut-pack-lineup"),
  "birds-nest": pair("birds-nest-photo-composition", "birds-nest-pack-lineup"),
  fruit: single("fruit-photo-composition",
    "No second family-level fruit photograph: studio/fruit.jpg re-crops image01; Trái cây 2.png is the source of four fruit range crops; the zip family/line-up renders show 'Buyer sample', jackfruit and pineapple packs outside the brochure register"),
  "nuts-spices-botanicals": pair("nsb-photo-composition", "nsb-photo-cashew-tree"),
};

export const RANGE_MEDIA: Record<RangeId, MediaSlot> = {
  "coffee-green": single("coffee-photo-bowls", "One range photograph; the confirmed codes carry their own packs"),
  "coffee-roasted": single("coffee-photo-spoons", "One range photograph; the confirmed codes carry their own packs"),
  "coffee-soluble": missing("The only instant-coffee photograph is the coffee family's second highlight image"),
  "coffee-extract": missing("No extract or concentrate imagery in the repository"),
  "coffee-cold-brew": missing("No range-level cold brew imagery; the WHCF006 can belongs to that code"),
  "coffee-single-serve": missing("No drip-bag, sachet or retail-box imagery in the repository"),
  "coconut-milk-cream": pair("coconut-pack-milk-carton", "coconut-pack-cream-bib"),
  "coconut-powders-solids": pair("coconut-pack-desiccated-pouch", "coconut-pack-milk-powder-pouch"),
  "coconut-blossom-sugar": single("coconut-pack-blossom-sugar-pouch", "One pack render (WHCO005); no second blossom-sugar asset"),
  "birds-nest-cleaned": single("birds-nest-pack-cleaned-box", "One usable pack (WHBN002); other boxes are near-identical, 'Buyer sample' or 'NET WT. TBD'"),
  "birds-nest-instant": pair("birds-nest-pack-instant-sachet", "birds-nest-pack-instant-carton"),
  "birds-nest-oem": missing("No source shows concentrate, extract, powder or blend formats"),
  "fruit-soft-dried": pair("fruit-pack-soft-dried-mango-pouch", "fruit-crop-soft-dried-soursop"),
  "fruit-freeze-dried": single("fruit-crop-freeze-dried-mango", "One crop; no freeze-dried mango pack exists"),
  "fruit-concentrate-powder": pair("fruit-pack-passion-fruit-concentrate-bib", "fruit-crop-passion-fruit-powder"),
  "fruit-frozen-puree": single("fruit-crop-passion-fruit-puree", "One crop; no frozen purée pack exists"),
  "nsb-nuts": missing("No standalone cashew image; the only one is a crop of the family photograph"),
  "nsb-spices": single("nsb-crop-star-anise", "Star anise only; no standalone black pepper or cinnamon image"),
};

const COFFEE_SECOND =
  "No usable second view of this code: other formats are 'Buyer sample', 'TBD' export sacks, edge-on sticks or renders identical to another code's pack; rear panels carry claims/TBD/unverified QR";
const coffeeSku = (image01: AssetId, gap = COFFEE_SECOND): SkuMediaSlot => ({ ...single(image01, gap), publicPage: true });
const rangeLevel = (slot: MediaSlot): SkuMediaSlot => ({ ...slot, publicPage: false });

/**
 * All 29 defined codes. Non-coffee codes have no public page yet; their packs
 * are shown at range level (RANGE_MEDIA) and keyed here by the code printed
 * on the source pack file, so audits can trace each render to its code.
 */
export const SKU_MEDIA: Record<string, SkuMediaSlot> = {
  WHCF001: coffeeSku("coffee-pack-whcf001"),
  WHCF002: coffeeSku("coffee-pack-whcf002"),
  WHCF003: coffeeSku("coffee-pack-whcf003"),
  WHCF004: coffeeSku("coffee-pack-whcf004", "Only other retail format (250 g pouch) is the same pouch and label as image01 — not a distinct view"),
  WHCF005: { ...pair("coffee-pack-whcf005", "coffee-pack-whcf005-retail-box"), publicPage: true },
  WHCF006: { ...pair("coffee-pack-whcf006", "coffee-pack-whcf006-pouch"), publicPage: true },
  WHCF007: coffeeSku("coffee-pack-whcf007", "20 × 2 g box is visually indistinguishable from WHCF008's pack at card size; 2 g stick is edge-on; 100 g is 'Buyer sample'"),
  WHCF008: coffeeSku("coffee-pack-whcf008"),
  WHCF009: { ...pair("coffee-pack-whcf009", "coffee-pack-whcf009-pouch"), publicPage: true },
  WHCO001: rangeLevel(single("coconut-pack-milk-carton", "One pack render")),
  WHCO002: rangeLevel(single("coconut-pack-cream-bib", "One pack render")),
  WHCO003: rangeLevel(single("coconut-pack-desiccated-pouch", "One pack render")),
  WHCO004: rangeLevel(single("coconut-pack-milk-powder-pouch", "One pack render")),
  WHCO005: rangeLevel(single("coconut-pack-blossom-sugar-pouch", "One pack render")),
  WHBN001: rangeLevel(pair("birds-nest-pack-instant-sachet", "birds-nest-pack-instant-carton")),
  WHBN002: rangeLevel(single("birds-nest-pack-cleaned-box", "One usable pack render")),
  WHFR001: rangeLevel(single("fruit-pack-soft-dried-mango-pouch", "Brochure and Packaging Architecture agree: soft-dried mango. Other mango formats repeat the same pouch")),
  WHFR002: rangeLevel(missing("Register conflict: brochure = freeze-dried mango; Packaging Architecture/zip = soft-dried pineapple. No freeze-dried mango pack exists")),
  WHFR003: rangeLevel(missing("Brochure = soft-dried soursop; the zip WHFR003 pack is labelled jackfruit — not usable")),
  WHFR004: rangeLevel(missing("Register conflict: brochure = passion fruit (concentrate per per-code artwork); Packaging Architecture = soft-dried banana. No matching pack")),
  WHFR005: rangeLevel(missing("Brochure = passion fruit (purée per per-code artwork); render zip WHFR005 = dragon fruit. No matching pack")),
  WHFR006: rangeLevel(missing("Register conflict: the concentrate BIB prints WHFR006 (Packaging Architecture), brochure lists WHFR006 as passion fruit powder. Pack shown at range level only")),
  WHFR007: rangeLevel(missing("Not in the brochure or Packaging Architecture — code has no named product in any owner document")),
  WHFR008: rangeLevel(missing("Not in the brochure or Packaging Architecture — code has no named product in any owner document")),
  WHFR009: rangeLevel(missing("Not in the brochure or Packaging Architecture — code has no named product in any owner document")),
  WHNSB001: rangeLevel(missing("Cashew kernel (brochure). No pack; only per-code label illustration (captioned WHNSP001), not used")),
  WHNSB002: rangeLevel(missing("Black pepper (brochure). No pack; only per-code label illustration (captioned WHNSP002), not used")),
  WHNSB003: rangeLevel(missing("Cinnamon (brochure). No pack; only per-code label illustration (captioned WHNSP003), not used")),
  WHNSB004: rangeLevel(missing("Star anise (brochure). No pack; only per-code label illustration (captioned WHNSP004), not used")),
};

// -------------------------------------------------------------- resolvers
/** Same file, or the same source photograph without distinct crop regions. */
export function sameSourceImage(a: MediaAsset, b: MediaAsset): boolean {
  if (a.src === b.src || a.sha256 === b.sha256) return true;
  return a.sourceFile === b.sourceFile && (!a.region || !b.region || a.region === b.region);
}

/**
 * The verified images of a slot: [], [image01] or [image01, image02].
 * Defensive: an image02 that repeats image01 is dropped rather than shown
 * as a fake second view (tests reject such slots outright).
 */
export function resolveSlot(slot: MediaSlot | undefined): MediaAsset[] {
  if (!slot?.image01) return [];
  const first = MEDIA_ASSETS[slot.image01];
  const second = slot.image02 ? MEDIA_ASSETS[slot.image02] : undefined;
  return second && !sameSourceImage(first, second) ? [first, second] : [first];
}

export const familyMedia = (family: FamilySlug) => resolveSlot(FAMILY_MEDIA[family]);
export const rangeMedia = (rangeId: RangeId) => resolveSlot(RANGE_MEDIA[rangeId]);
export const skuMedia = (code: string) => resolveSlot(SKU_MEDIA[code]);

/**
 * About hero composition: all five families. Two larger tiles on top
 * (coffee, the family with confirmed codes, and bird's nest), three below.
 */
export const ABOUT_MOSAIC_FAMILIES: FamilySlug[] = ["coffee", "birds-nest", "coconut", "fruit", "nuts-spices-botanicals"];
