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

export type FamilyImageKind = "editorial" | "studio";

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
    src: `${STUDIO_IMAGE_DIR}/coconut.jpg`,
    alt: {
      en: "Studio arrangement of coconut ingredient formats: desiccated coconut, coconut milk powder and coconut oil",
      vi: "Sắp đặt studio các dạng nguyên liệu dừa: dừa sấy, bột sữa dừa và dầu dừa",
    },
    kind: "studio",
  },
  "birds-nest": {
    src: `${STUDIO_IMAGE_DIR}/birds-nest.jpg`,
    alt: {
      en: "Studio arrangement of cleaned bird's nest pieces and bird's nest in dried form",
      vi: "Sắp đặt studio yến sào đã làm sạch dạng tổ và dạng sợi khô",
    },
    kind: "studio",
  },
  fruit: {
    src: `${STUDIO_IMAGE_DIR}/fruit.jpg`,
    alt: {
      en: "Studio arrangement of fruit ingredient formats: fruit powders, freeze-dried pieces and fruit concentrate",
      vi: "Sắp đặt studio các dạng nguyên liệu trái cây: bột trái cây, miếng sấy thăng hoa và nước cốt cô đặc",
    },
    kind: "studio",
  },
  "nuts-spices-botanicals": {
    src: `${STUDIO_IMAGE_DIR}/nuts-spices-botanicals.jpg`,
    alt: {
      en: "Studio arrangement of cashew nuts, black pepper, cinnamon and star anise",
      vi: "Sắp đặt studio hạt điều, hạt tiêu đen, quế và hoa hồi",
    },
    kind: "studio",
  },
};

export function familyImage(family: FamilySlug): FamilyImage {
  return FAMILY_IMAGES[family];
}

/** The four families shown in the About hero mosaic, in reading order. */
export const ABOUT_MOSAIC_FAMILIES: FamilySlug[] = ["coffee", "coconut", "fruit", "nuts-spices-botanicals"];
