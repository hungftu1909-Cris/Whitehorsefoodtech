// Public-claims guardrail. Scans everything that can end up on the public
// site — message catalogs, blog MDX and source (alt text, hard-coded
// strings, comments) — for wording that was removed in Phase 1 because it
// could not be evidenced, plus leftover placeholder text.
//
// Used by scripts/check-claims.mjs (CLI, non-zero exit on findings) and by
// tests/messages.test.ts. docs/ is deliberately NOT scanned: the claim
// registry has to quote the forbidden wording it replaces.
//
// Before adding a new public claim, record it in docs/claim-registry.md.
// If a pattern here blocks a claim that has since been evidenced, change
// the pattern in the same commit as the registry entry.

import fs from "node:fs";
import path from "node:path";

/** @typedef {{ id: string, pattern: RegExp, reason: string }} ClaimRule */

/** @type {ClaimRule[]} */
export const FORBIDDEN_CLAIMS = [
  { id: "volume-100k", pattern: /\b100\s?K\b/i, reason: "Unsupported export volume (100K+ t/yr)." },
  { id: "tons-exported", pattern: /metric tons? exported|tấn xuất khẩu mỗi năm/i, reason: "Unsupported export volume." },
  // 3,000+ / 10,000+ are permitted only as the tagged three-year VISION
  // (claim registry rows 18–19; tests/messages.test.ts enforces the tag).
  // The retired "3,000+ partner growing regions" wording stays blocked.
  { id: "regions-3000", pattern: /\b3[.,]000\s?\+\s*(partner|growing|vùng)/i, reason: "Retired partner-region claim; 3,000+ may only appear as the tagged three-year vision." },
  { id: "supplier-20", pattern: /\b20\+\s*(supplier|organisation|organization|tổ chức|nhà cung cấp)/i, reason: "The 20+ supplier figure is not used as a public headline." },
  { id: "served-exported", pattern: /\b(countries|markets)\s+(we\s+)?(serve|served)\b|\bexported\s+to\b|\b(our|whitehorse(?:'s)?)\s+export track record|recurring buyers|repeat buyers|quốc gia đã xuất khẩu|đã xuất khẩu (sang|tới)/i, reason: "Market relationships are not shipments, service or a track record." },
  { id: "highest-standards", pattern: /highest (quality )?standards|tiêu chuẩn cao nhất/i, reason: "Use rigorous defined criteria aligned with buyer requirements instead." },
  { id: "internal-systems", pattern: /\bWB(IS|OS)\b/, reason: "Internal system names are not public." },
  { id: "phase-language", pattern: /\bphase\s*[12]\b|giai đoạn [12]\b/i, reason: "No public phase/stage language in the core story." },
  { id: "countries-30", pattern: /\b30\+?\s+(countries|quốc gia)/i, reason: "Unsupported countries-served claim." },
  { id: "years-export", pattern: /\b\d+\s+years?\s+(in|of)\s+(export|experience)|năm kinh nghiệm/i, reason: "Unsupported years-of-experience claim (company registered 2026)." },
  { id: "every-lot", pattern: /\bevery\s+(lot|facility|facilities|shipment)\b/i, reason: "Universal QA/traceability claim." },
  { id: "every-lot-vi", pattern: /mỗi lô hàng đều|mọi nhà máy|mọi cơ sở/i, reason: "Universal QA/traceability claim (VI)." },
  { id: "exclusive", pattern: /\bexclusive(ly)?\b|độc quyền|chỉ hợp tác/i, reason: "Exclusivity claim." },
  { id: "own-factory", pattern: /\bour\s+(own\s+)?(factory|factories|facility|facilities|plant|plants)\b|nhà máy của chúng tôi/i, reason: "Implies Whitehorse owns/operates processing sites." },
  { id: "response-sla", pattern: /\b1\s*[–-]\s*2\s+(business|working)\s+days?\b|1\s*[–-]\s*2\s+ngày làm việc/i, reason: "Response-time promise not confirmed; use the agreed follow-up wording." },
  // Scoped to self-description: blog posts legitimately discuss bank
  // guarantees and Vietnam's national export rankings.
  { id: "leading", pattern: /\b(world|industry|market)[- ]leading\b|(doanh nghiệp|nhà cung cấp|công ty) hàng đầu/i, reason: "Unsupported superlative." },
  { id: "guarantee", pattern: /\bwe guarantee\b|\bguaranteed (quality|supply|delivery|consistency)\b|chúng tôi (cam kết|bảo đảm|đảm bảo) 100%/i, reason: "Guarantee language needs contract backing." },
  { id: "globally-delivered", pattern: /globally delivered|giao khắp toàn cầu/i, reason: "Implies an existing global delivery record." },
  { id: "sku-prefix", pattern: /\bWHC0\d{2}\b/, reason: "Wrong coffee format prefix — codes are WHCF001–WHCF009." },
  { id: "vpbank", pattern: /vpbank/i, reason: "Not a confirmed direct partner; publication needs explicit written permission (see claim registry)." },
  { id: "placeholder", pattern: /\[Placeholder|Nội dung mẫu|photo(graphy)? needed|image needed/i, reason: "Placeholder text on a public page." },
  // Legal pages are concise notices pending legal review; that status is
  // recorded internally (claim registry row 16), not announced publicly.
  { id: "unfinished-legal", pattern: /interim notice|being prepared|thông báo tạm thời|đang được hoàn thiện/i, reason: "Public page announces itself as unfinished." },
  { id: "counter-artifact", pattern: /(^|[^\d])0K\+|\b0\.000\+/, reason: "Count-up animation artifact." },
];

const ROOTS = [
  { dir: "messages", ext: [".json"] },
  { dir: "content", ext: [".mdx", ".md"] },
  { dir: "src", ext: [".ts", ".tsx"] },
];

function walk(dir, exts, out) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, exts, out);
    else if (exts.includes(path.extname(entry.name))) out.push(full);
  }
  return out;
}

/** Files scanned by default, relative to `root`. */
export function claimTargets(root = process.cwd()) {
  return ROOTS.flatMap(({ dir, ext }) => walk(path.join(root, dir), ext, [])).map((f) =>
    path.relative(root, f).split(path.sep).join("/")
  );
}

/**
 * @param {string} text
 * @param {string} file label used in findings
 * @returns {{ file: string, line: number, id: string, reason: string, excerpt: string }[]}
 */
export function scanText(text, file = "<text>") {
  const findings = [];
  text.split(/\r?\n/).forEach((lineText, i) => {
    for (const rule of FORBIDDEN_CLAIMS) {
      const match = lineText.match(rule.pattern);
      if (match) {
        const start = Math.max(0, (match.index ?? 0) - 40);
        findings.push({
          file,
          line: i + 1,
          id: rule.id,
          reason: rule.reason,
          excerpt: lineText.slice(start, start + 120).trim(),
        });
      }
    }
  });
  return findings;
}

export function scanRepo(root = process.cwd()) {
  return claimTargets(root).flatMap((file) =>
    scanText(fs.readFileSync(path.join(root, file), "utf8"), file)
  );
}
