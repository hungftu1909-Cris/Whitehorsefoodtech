// Family imagery — the single source for every product-family visual
// (homepage preview, /products listing, family detail hero, About mosaic).
//
// Two kinds, each with its own visible label (docs/asset-provenance.md):
// - "editorial": a real photograph from the website-edit brief (coffee).
//   Badge: "Editorial image" / "Ảnh minh họa".
// - "studio": a text-free 4:3 studio representation of the ingredient
//   formats in a family. Badge: "Studio representation" / "Hình ảnh studio
//   minh họa", plus a note that product, source and final specification are
//   confirmed per request. Never presented as photographed inventory, a
//   supplier batch, certification/traceability evidence or availability.
//
// A studio file that is not yet on disk renders as a quiet typographic
// panel (components/catalog/family-visual.tsx) — never as the retired
// packaging mock-ups, which carried unsupported claims.
//
// Before adding or replacing a file: check it visually for text, logos,
// seals, badges or retail packaging, make sure `alt` describes what the
// image actually shows, and add its row to docs/asset-provenance.md.
//
// Import-free (types only) so node:test can load it.

import type { FamilySlug, Localized } from "./catalog";

export type FamilyImageKind = "editorial" | "studio" | "concept-pack";

export type FamilyImage = {
  src: string;
  alt: Localized;
  kind: FamilyImageKind;
};

/** Directory for the generated studio family visuals (4:3, text-free). */
export const STUDIO_IMAGE_DIR = "/images/catalog/studio";

export const FAMILY_IMAGES: Record<FamilySlug, FamilyImage> = {
  coffee: {
    src: "/images/catalog/coffee/coffee-green-roasted-flatlay.jpg",
    alt: {
      en: "Green and roasted coffee beans with ground coffee in white dishes and wooden scoops",
      vi: "Cà phê nhân xanh, cà phê rang và cà phê xay trong đĩa trắng và muỗng gỗ",
    },
    kind: "editorial",
  },
  coconut: {
    src: "/images/catalog/editorial/coconut-real-products.webp",
    alt: {
      en: "Owner-supplied product photograph of coconut, milk, cream, flakes, milk powder and coconut sugar",
      vi: "Ảnh sản phẩm do Whitehorse cung cấp gồm dừa, sữa, kem, dừa sấy, bột sữa dừa và đường dừa",
    },
    kind: "editorial",
  },
  "birds-nest": {
    src: "/images/catalog/editorial/birds-nest-real-products.webp",
    alt: {
      en: "Owner-supplied product photograph of cleaned bird's nest with prepared bird's nest, red dates, rock sugar and honey",
      vi: "Ảnh sản phẩm do Whitehorse cung cấp gồm tổ yến làm sạch, yến chưng, táo đỏ, đường phèn và mật ong",
    },
    kind: "editorial",
  },
  fruit: {
    src: "/images/catalog/editorial/fruit-real-products.webp",
    alt: {
      en: "Owner-supplied product photograph showing mango, soursop and passion fruit in dried, powder, concentrate and purée formats",
      vi: "Ảnh sản phẩm do Whitehorse cung cấp, thể hiện xoài, mãng cầu và chanh dây ở dạng sấy, bột, cô đặc và puree",
    },
    kind: "editorial",
  },
  "nuts-spices-botanicals": {
    src: "/images/catalog/editorial/nuts-spices-real-products.webp",
    alt: {
      en: "Owner-supplied product photograph of cashew kernels, black pepper, star anise and cinnamon",
      vi: "Ảnh sản phẩm do Whitehorse cung cấp gồm nhân hạt điều, hồ tiêu đen, hoa hồi và quế",
    },
    kind: "editorial",
  },
};

/**
 * Second image in a family-page hero gallery: the owner's packaging
 * line-up render, label untouched (docs/image-inventory.md). Shown with the
 * "Concept packaging" badge, never as approved packaging or stock.
 */
export const FAMILY_SECONDARY_IMAGES: Record<FamilySlug, FamilyImage> = {
  coffee: {
    src: "/images/catalog/coffee/coffee-ground-whole-instant.jpg",
    alt: {
      en: "Ground coffee, roasted coffee beans and instant coffee granules in three cups",
      vi: "Cà phê xay, cà phê hạt rang và cà phê hòa tan dạng hạt trong ba chiếc cốc",
    },
    kind: "editorial",
  },
  coconut: {
    src: "/images/catalog/coconut/packs/coconut-lineup-concept-pack.webp",
    alt: {
      en: "Packaging concept line-up for coconut: milk and cream cartons, desiccated coconut, coconut milk powder and coconut blossom sugar pouches",
      vi: "Bộ bao bì ý tưởng nhóm dừa: hộp sữa và kem dừa, túi dừa sấy, bột sữa dừa và đường hoa dừa",
    },
    kind: "concept-pack",
  },
  "birds-nest": {
    src: "/images/catalog/birds-nest/packs/birds-nest-lineup-concept-pack.webp",
    alt: {
      en: "Packaging concept line-up for bird's nest: a cleaned-nest rigid box and an instant bird's nest carton",
      vi: "Bộ bao bì ý tưởng nhóm yến: hộp cứng yến làm sạch và hộp yến ăn liền",
    },
    kind: "concept-pack",
  },
  fruit: {
    src: `${STUDIO_IMAGE_DIR}/fruit.jpg`,
    alt: {
      en: "Studio representation of soft-dried and freeze-dried fruit, concentrate, purée and fruit powders",
      vi: "Hình ảnh studio minh họa trái cây sấy dẻo, sấy thăng hoa, cô đặc, puree và bột trái cây",
    },
    kind: "studio",
  },
  "nuts-spices-botanicals": {
    src: `${STUDIO_IMAGE_DIR}/nuts-spices-botanicals.jpg`,
    alt: {
      en: "Studio representation of cashew kernels, black peppercorns, star anise and cinnamon sticks",
      vi: "Hình ảnh studio minh họa nhân hạt điều, hồ tiêu đen, hoa hồi và quế thanh",
    },
    kind: "studio",
  },
};

// Every family deliberately pairs two different visual modes: an
// owner-supplied photograph with either a source-label 3D packaging render
// or a restrained, text-free studio composition.

export function familyImage(family: FamilySlug): FamilyImage {
  return FAMILY_IMAGES[family];
}

/**
 * About hero composition: all five families. Two larger tiles on top
 * (coffee, the family with confirmed codes, and bird's nest), three below.
 */
export const ABOUT_MOSAIC_FAMILIES: FamilySlug[] = ["coffee", "birds-nest", "coconut", "fruit", "nuts-spices-botanicals"];
