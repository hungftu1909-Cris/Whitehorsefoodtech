/**
 * Prefilled RFQ links from catalog pages. /rfq reads these params through
 * parseRfqPrefill (src/lib/validations.ts), which whitelists every value,
 * so older links (?product=coffee&intent=sample, ?sku=WHCF007) keep working.
 */
export type RfqIntent = "quote" | "sample" | "spec-sheet";

export function rfqHref({
  family,
  range,
  sku,
  intent,
}: {
  family?: string;
  range?: string;
  sku?: string;
  intent: RfqIntent;
}) {
  const query: Record<string, string> = { intent };
  if (family) query.product = family;
  if (range) query.range = range;
  if (sku) query.sku = sku;
  return { pathname: "/rfq" as const, query };
}
