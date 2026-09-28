"use client";

import { CheckCircle2, AlertCircle } from "lucide-react";
import { siteConfig } from "@/lib/site";

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

/**
 * Non-typed context sent with a lead so sales can see where it came from:
 * site language, the page the visitor came from (same-origin referrer,
 * else the form page) and any UTM parameters on the form page's URL.
 */
export function collectLeadContext(locale: string) {
  const params = new URLSearchParams(window.location.search);
  const utm = Object.fromEntries(
    UTM_KEYS.flatMap((key) => {
      const value = params.get(key);
      return value ? [[key, value.slice(0, 150)]] : [];
    })
  );
  let sourcePath = window.location.pathname;
  try {
    const referrer = new URL(document.referrer);
    if (referrer.origin === window.location.origin) sourcePath = referrer.pathname;
  } catch {
    // no or invalid referrer — keep the form page path
  }
  return { locale, sourcePath: sourcePath.slice(0, 300), ...utm };
}

export type SubmitState =
  | { kind: "idle" }
  | { kind: "success"; leadId?: string }
  | { kind: "error"; undelivered: boolean; leadId?: string };

/**
 * POSTs a lead and maps the API contract to UI state. Success requires
 * both a 2xx status and `ok: true`; 502/503 mean the lead was not
 * delivered, so the UI must say so and point to email instead.
 */
export async function submitLead(url: string, payload: unknown): Promise<SubmitState> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = (await res.json().catch(() => ({}))) as { ok?: boolean; leadId?: string };
    if (res.ok && body.ok === true) return { kind: "success", leadId: body.leadId };
    return {
      kind: "error",
      undelivered: res.status === 502 || res.status === 503,
      leadId: body.leadId,
    };
  } catch {
    return { kind: "error", undelivered: false };
  }
}

/** Inline, persistent result panel (announced to screen readers). */
export function SubmitStatus({
  state,
  successTitle,
  successText,
  referenceText,
  errorText,
  undeliveredText,
  fallbackEmail = siteConfig.salesEmail,
}: {
  state: SubmitState;
  successTitle: string;
  successText: string;
  referenceText: (leadId: string) => string;
  errorText: string;
  undeliveredText: (email: string) => string;
  /** Where to send the visitor when the lead could not be delivered. */
  fallbackEmail?: string;
}) {
  if (state.kind === "idle") return null;

  if (state.kind === "success") {
    return (
      <div role="status" className="flex gap-3 rounded-lg border border-accent/40 bg-accent/10 p-4 text-sm">
        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
        <div>
          <p className="font-semibold text-foreground">{successTitle}</p>
          <p className="mt-1 text-muted-foreground">{successText}</p>
          {state.leadId && (
            <p className="mt-2 font-mono text-xs text-foreground">{referenceText(state.leadId)}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div role="alert" className="flex gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm">
      <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
      <div>
        <p className="text-foreground">
          {state.undelivered ? undeliveredText(fallbackEmail) : errorText}
        </p>
        {state.leadId && (
          <p className="mt-2 font-mono text-xs text-muted-foreground">{referenceText(state.leadId)}</p>
        )}
      </div>
    </div>
  );
}
