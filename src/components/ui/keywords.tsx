import { Fragment } from "react";

const KEYWORD = /<k>(.*?)<\/k>/g;

/**
 * Renders copy with a few marked keywords: `<k>QA/QC</k>` becomes semibold
 * forest ink (light ink on dark forest bands — see `.kw` in globals.css) — a
 * weight change as well as a colour change, so emphasis never relies on
 * colour alone. Use sparingly (one to three per block). Works for
 * `t.raw()` strings and raw message arrays; plain strings pass through.
 * Server-safe (no hooks).
 */
export function Keywords({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(KEYWORD)) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    parts.push(
      <strong key={match.index} className="kw">
        {match[1]}
      </strong>
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <Fragment>{parts}</Fragment>;
}

/** Plain text (for metadata, aria labels): keyword markers removed. */
export const stripKeywords = (text: string) => text.replace(KEYWORD, "$1");
