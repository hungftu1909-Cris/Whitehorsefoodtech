import type { FamilySlug, Localized } from "./catalog";

export type PackagingChannel = "sample" | "professional" | "retail" | "industrial";

export type PackagingStructure = {
  code: string;
  name: Localized;
  dimensions: string;
  fill: Localized;
  channels: PackagingChannel[];
  families: FamilySlug[];
};

const L = (en: string, vi: string): Localized => ({ en, vi });

/**
 * Web summary of the 27 master structures in the owner-approved Packaging
 * Architecture. Dimensions are millimetre references, never production
 * dielines. Final fill, film, barrier, seal, closure and printable area are
 * confirmed with the selected supplier or co-packer.
 */
export const PACKAGING_STRUCTURES: PackagingStructure[] = [
  { code: "S01", name: L("Whole-product sample pouch", "Túi mẫu sản phẩm nguyên dạng"), dimensions: "118 × 176 × 50 mm", fill: L("Typically 100–500 g by product", "Thường 100–500 g tùy sản phẩm"), channels: ["sample"], families: ["coffee", "coconut", "nuts-spices-botanicals"] },
  { code: "S02", name: L("Powder sample pouch", "Túi mẫu dạng bột"), dimensions: "112 × 164 × 46 mm", fill: L("Typically 100–250 g", "Thường 100–250 g"), channels: ["sample"], families: ["coffee", "coconut", "fruit", "nuts-spices-botanicals"] },
  { code: "S03", name: L("Liquid qualification sample", "Chai mẫu thẩm định dạng lỏng"), dimensions: "62 × 168 × 62 mm", fill: L("Typically 250–500 ml", "Thường 250–500 ml"), channels: ["sample"], families: ["coffee", "fruit"] },
  { code: "S04", name: L("Roasted-coffee valve pouch", "Túi cà phê rang có van"), dimensions: "140 × 215 × 65 mm", fill: L("250 g reference", "Tham chiếu 250 g"), channels: ["retail"], families: ["coffee"] },
  { code: "S05", name: L("Professional coffee pouch", "Túi cà phê chuyên nghiệp"), dimensions: "170 × 280 × 85 mm", fill: L("1 kg reference", "Tham chiếu 1 kg"), channels: ["professional"], families: ["coffee"] },
  { code: "S06", name: L("Drip filter and individual sachet", "Túi lọc drip và bao riêng"), dimensions: "90 × 105 × 8 mm", fill: L("10–12 g per sachet", "10–12 g mỗi gói"), channels: ["retail"], families: ["coffee"] },
  { code: "S07", name: L("Drip carton, 10 count", "Hộp 10 túi lọc drip"), dimensions: "98 × 150 × 60 mm", fill: L("10 individually sealed filters", "10 túi lọc đóng riêng"), channels: ["retail"], families: ["coffee"] },
  { code: "S08", name: L("Pure instant stick", "Gói cà phê hòa tan nguyên chất"), dimensions: "20 × 110 × 8 mm", fill: L("2 g reference", "Tham chiếu 2 g"), channels: ["retail"], families: ["coffee"] },
  { code: "S09", name: L("Instant stick carton", "Hộp gói cà phê hòa tan"), dimensions: "120 × 88 × 48 mm", fill: L("20 × 2 g reference", "Tham chiếu 20 × 2 g"), channels: ["retail"], families: ["coffee"] },
  { code: "S10", name: L("Soluble coffee jar", "Hũ cà phê hòa tan"), dimensions: "72 × 112 × 72 mm", fill: L("100 g reference", "Tham chiếu 100 g"), channels: ["retail"], families: ["coffee"] },
  { code: "S11", name: L("RTD slim can", "Lon RTD dáng thon"), dimensions: "58 × 146 × 58 mm", fill: L("250 ml reference", "Tham chiếu 250 ml"), channels: ["retail"], families: ["coffee"] },
  { code: "S12", name: L("Aseptic carton", "Hộp giấy vô trùng"), dimensions: "70 × 200 × 70 mm", fill: L("330 ml–1 L by programme", "330 ml–1 L tùy chương trình"), channels: ["sample", "professional"], families: ["coconut"] },
  { code: "S13", name: L("Aseptic bag-in-box", "Bag-in-box vô trùng"), dimensions: "300 × 290 × 230 mm", fill: L("20 kg reference", "Tham chiếu 20 kg"), channels: ["industrial"], families: ["coconut", "fruit"] },
  { code: "S14", name: L("Aseptic bag-in-drum", "Túi vô trùng trong phuy"), dimensions: "230 × 300 × 230 mm", fill: L("180–200 kg reference", "Tham chiếu 180–200 kg"), channels: ["industrial"], families: ["coconut", "fruit"] },
  { code: "S15", name: L("Retail barrier pouch", "Túi barrier bán lẻ"), dimensions: "130 × 190 × 55 mm", fill: L("100 g–1 kg by product", "100 g–1 kg tùy sản phẩm"), channels: ["professional", "retail"], families: ["coffee", "coconut", "fruit", "nuts-spices-botanicals"] },
  { code: "S16", name: L("Freeze-dried high-barrier pouch", "Túi high-barrier cho sản phẩm sấy thăng hoa"), dimensions: "120 × 170 × 48 mm", fill: L("30 / 50 / 100 g references", "Tham chiếu 30 / 50 / 100 g"), channels: ["retail"], families: ["fruit"] },
  { code: "S17", name: L("Industrial lined carton or bag", "Thùng hoặc bao công nghiệp có lớp lót"), dimensions: "340 × 300 × 260 mm", fill: L("10–25 kg or confirmed case count", "10–25 kg hoặc số hộp được xác nhận"), channels: ["industrial"], families: ["coffee", "coconut", "birds-nest", "fruit", "nuts-spices-botanicals"] },
  { code: "S18", name: L("Green-coffee export sack", "Bao xuất khẩu cà phê nhân"), dimensions: "520 × 720 × 230 mm", fill: L("30 / 60 kg reference", "Tham chiếu 30 / 60 kg"), channels: ["industrial"], families: ["coffee"] },
  { code: "S19", name: L("Bird's-nest rigid box", "Hộp cứng yến sào"), dimensions: "180 × 62 × 130 mm", fill: L("50 / 100 g; sample grade-dependent", "50 / 100 g; mẫu tùy hạng"), channels: ["sample", "retail"], families: ["birds-nest"] },
  { code: "S20", name: L("Bird's-nest sachet carton", "Hộp gói yến sào"), dimensions: "108 × 140 × 56 mm", fill: L("5 × 10 g or 10 × 10 g", "5 × 10 g hoặc 10 × 10 g"), channels: ["retail"], families: ["birds-nest"] },
  { code: "S21", name: L("Cashew export carton with vacuum inner", "Thùng xuất khẩu hạt điều có túi hút chân không"), dimensions: "400 × 250 × 300 mm", fill: L("22.68 kg / 50 lb reference", "Tham chiếu 22,68 kg / 50 lb"), channels: ["industrial"], families: ["nuts-spices-botanicals"] },
  { code: "S23", name: L("Bird's-nest serving sachet", "Gói khẩu phần yến sào"), dimensions: "85 × 115 × 10 mm", fill: L("10 g serving; nest content declared separately", "Khẩu phần 10 g; hàm lượng yến công bố riêng"), channels: ["retail"], families: ["birds-nest"] },
  { code: "S25", name: L("Cold-brew steep bag", "Túi ngâm cold brew"), dimensions: "95 × 125 × 12 mm", fill: L("20 g reference", "Tham chiếu 20 g"), channels: ["retail"], families: ["coffee"] },
  { code: "S26", name: L("Steep-bag carton, 10 count", "Hộp 10 túi ngâm cold brew"), dimensions: "112 × 160 × 72 mm", fill: L("10 × 20 g reference", "Tham chiếu 10 × 20 g"), channels: ["retail"], families: ["coffee"] },
  { code: "S27", name: L("Instant premix stick", "Gói premix hòa tan"), dimensions: "40 × 155 × 11 mm", fill: L("16–20 g reference; formula dependent", "Tham chiếu 16–20 g; tùy công thức"), channels: ["retail"], families: ["coffee"] },
  { code: "S28", name: L("Premix stick carton", "Hộp gói premix"), dimensions: "150 × 175 × 60 mm", fill: L("10 / 20 count reference", "Tham chiếu hộp 10 / 20 gói"), channels: ["retail"], families: ["coffee"] },
  { code: "S22", name: L("Premium rigid canister", "Hũ cứng cao cấp"), dimensions: "84 × 130 × 84 mm", fill: L("250 g reference", "Tham chiếu 250 g"), channels: ["retail"], families: ["nuts-spices-botanicals"] },
];

export const PACKAGING_CHANNELS: { id: PackagingChannel; name: Localized; buyer: Localized }[] = [
  { id: "sample", name: L("Buyer sample / qualification", "Mẫu khách hàng / thẩm định"), buyer: L("Procurement, R&D, roasters and import qualification", "Thu mua, R&D, roaster và thẩm định nhập khẩu") },
  { id: "professional", name: L("Professional / HORECA", "Chuyên nghiệp / HORECA"), buyer: L("Cafés, hotels, bakeries, restaurants and small processors", "Café, khách sạn, bakery, nhà hàng và nhà chế biến nhỏ") },
  { id: "retail", name: L("Retail / private label", "Bán lẻ / nhãn riêng"), buyer: L("Distributors, brand owners and retailers", "Nhà phân phối, chủ thương hiệu và nhà bán lẻ") },
  { id: "industrial", name: L("Industrial export / commercial", "Xuất khẩu công nghiệp / thương mại"), buyer: L("Factories and importers moving commercial lots", "Nhà máy và nhà nhập khẩu vận chuyển lô thương mại") },
];
