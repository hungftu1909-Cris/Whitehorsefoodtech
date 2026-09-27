/**
 * Serializes structured data for a `<script type="application/ld+json">`.
 * JSON.stringify alone does not stop a "</script>" inside a string value
 * from closing the tag early, so `<` is escaped as < (the approach in
 * the Next.js JSON-LD guide). Import-free so node:test can load it.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
