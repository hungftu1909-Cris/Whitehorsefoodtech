#!/usr/bin/env node
// Usage: node scripts/check-claims.mjs   (or: npm run check:claims)
// Exits 1 if any public-facing file contains a forbidden claim or
// placeholder. Rules and rationale: scripts/claims.mjs,
// docs/claim-registry.md.

import { claimTargets, scanRepo } from "./claims.mjs";

const files = claimTargets();
const findings = scanRepo();

if (findings.length === 0) {
  console.log(`check-claims: OK — ${files.length} files scanned, no forbidden claims or placeholders.`);
  process.exit(0);
}

console.error(`check-claims: ${findings.length} finding(s) in ${files.length} files scanned:\n`);
for (const f of findings) {
  console.error(`  ${f.file}:${f.line}  [${f.id}] ${f.reason}\n      … ${f.excerpt}`);
}
process.exit(1);
