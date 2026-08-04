import fs from "node:fs";
import path from "node:path";

/**
 * Checks whether a file exists under /public for the given site-relative
 * path (e.g. "/images/products/coffee-card.jpg"). Server-only.
 */
export function hasPublicFile(relPath: string): boolean {
  if (!relPath.startsWith("/")) return false;
  const filePath = path.join(process.cwd(), "public", relPath);
  return fs.existsSync(filePath);
}
