// Image inventory: path, dimensions, bytes, SHA-256 and a 64-bit
// difference hash (dHash) for every raster image under public/ and brand/.
// Flags byte-identical files and visually near-identical pairs (dHash
// Hamming distance <= NEAR), which catch re-crops and re-encodes of the
// same source photograph.
//
// Usage: node scripts/media-inventory.mjs [--json]

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";

const ROOTS = ["public", "brand"];
const EXT = /\.(png|jpe?g|webp|avif|gif)$/i;
const NEAR = 12;

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : EXT.test(entry.name) ? [full] : [];
  });
}

async function dhash(file) {
  const { data } = await sharp(file).greyscale().resize(9, 8, { fit: "fill" }).raw().toBuffer({ resolveWithObject: true });
  let bits = 0n;
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) bits = (bits << 1n) | (data[y * 9 + x] > data[y * 9 + x + 1] ? 1n : 0n);
  }
  return bits;
}

const hamming = (a, b) => {
  let v = a ^ b;
  let n = 0;
  while (v) { n += Number(v & 1n); v >>= 1n; }
  return n;
};

const rows = [];
for (const file of ROOTS.flatMap(walk).sort()) {
  const buf = fs.readFileSync(file);
  const meta = await sharp(buf).metadata();
  rows.push({
    path: file.split(path.sep).join("/"),
    width: meta.width,
    height: meta.height,
    bytes: buf.length,
    sha256: crypto.createHash("sha256").update(buf).digest("hex"),
    dhash: await dhash(buf),
  });
}

const bySha = Map.groupBy(rows, (r) => r.sha256);
const byteDuplicates = [...bySha.values()].filter((g) => g.length > 1).map((g) => g.map((r) => r.path));
const near = [];
for (let i = 0; i < rows.length; i++) {
  for (let j = i + 1; j < rows.length; j++) {
    if (rows[i].sha256 === rows[j].sha256) continue;
    const d = hamming(rows[i].dhash, rows[j].dhash);
    if (d <= NEAR) near.push({ a: rows[i].path, b: rows[j].path, distance: d });
  }
}

if (process.argv.includes("--json")) {
  console.log(JSON.stringify({ rows: rows.map((r) => ({ ...r, dhash: r.dhash.toString(16).padStart(16, "0") })), byteDuplicates, near }, null, 2));
} else {
  console.log("| Path | W×H | Bytes | SHA-256 (16) | dHash |");
  console.log("|---|---|---|---|---|");
  for (const r of rows) {
    console.log(`| \`${r.path}\` | ${r.width}×${r.height} | ${r.bytes} | \`${r.sha256.slice(0, 16)}\` | \`${r.dhash.toString(16).padStart(16, "0")}\` |`);
  }
  console.log(`\nByte-identical groups: ${byteDuplicates.length}`);
  for (const g of byteDuplicates) console.log(`- ${g.join("  =  ")}`);
  console.log(`\nVisually near-identical pairs (dHash distance <= ${NEAR}): ${near.length}`);
  for (const n of near.sort((x, y) => x.distance - y.distance)) console.log(`- ${n.distance}: ${n.a}  ~  ${n.b}`);
}
