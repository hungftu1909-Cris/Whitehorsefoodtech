/**
 * Lead delivery for the RFQ and Contact forms: mode selection, the outcome
 * → HTTP mapping, reference IDs and log redaction. Pure and import-free:
 * the environment and the SMTP send function are passed in, so the
 * node:test suite exercises every branch without a real transport and
 * without reading the process environment.
 *
 * Contract (see docs/deployment-vercel.md):
 * - LEAD_DELIVERY_MODE=smtp → email via SMTP. Missing config → 503; a send
 *   error → 502. A form never reports success unless the email was
 *   accepted by the SMTP server.
 * - LEAD_DELIVERY_MODE=log → a redacted summary is written to the server
 *   log and the request succeeds. For local development and previews
 *   only: refused (503) in a Vercel Production deployment.
 * - Unset → smtp in production deployments, log everywhere else (local
 *   dev, Vercel Preview).
 */

export type LeadKind = "rfq" | "contact" | "supplier";
export type DeliveryMode = "log" | "smtp";
export type LeadEnv = Record<string, string | undefined>;

export type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  to: string;
};

export type LeadMessage = {
  leadId: string;
  kind: LeadKind;
  subject: string;
  html: string;
  replyTo?: string;
  /** Structured fields for the log line — redacted before logging. */
  summary: LeadSummary;
};

export type LeadSummary = {
  company?: string;
  email?: string;
  product?: string;
  sku?: string;
  intent?: string;
  model?: string;
  supplierType?: string;
  qaState?: string;
  capabilities?: string;
  country?: string;
  volume?: string;
  locale?: string;
  sourcePath?: string;
  utm_source?: string;
  utm_campaign?: string;
  /** Free text is never logged — only its length. */
  message?: string;
};

export type DeliveryOutcome =
  | { status: "delivered"; mode: DeliveryMode }
  | { status: "unavailable"; reason: "smtp-not-configured" | "log-mode-in-production" }
  | { status: "failed"; reason: "send-error" };

export type Logger = Pick<Console, "info" | "warn" | "error">;
export type SendFn = (config: SmtpConfig, message: LeadMessage) => Promise<void>;

/**
 * A real production deployment. On Vercel that is VERCEL_ENV=production
 * only (Preview builds also run with NODE_ENV=production); elsewhere (VPS,
 * local `next start`) NODE_ENV decides.
 */
export function isProductionDeployment(env: LeadEnv): boolean {
  if (env.VERCEL_ENV) return env.VERCEL_ENV === "production";
  return env.NODE_ENV === "production";
}

export function resolveDeliveryMode(env: LeadEnv): DeliveryMode {
  const explicit = env.LEAD_DELIVERY_MODE?.trim().toLowerCase();
  if (explicit === "log" || explicit === "smtp") return explicit;
  return isProductionDeployment(env) ? "smtp" : "log";
}

/**
 * SMTP settings for a lead kind, or null if anything required is missing.
 * RFQs go to RFQ_MAIL_TO when set; supplier registrations go to
 * SUPPLIER_MAIL_TO when set; both fall back to MAIL_TO.
 */
export function resolveSmtpConfig(env: LeadEnv, kind: LeadKind): SmtpConfig | null {
  const host = env.SMTP_HOST?.trim();
  const user = env.SMTP_USER?.trim();
  const pass = env.SMTP_PASS;
  const to =
    ((kind === "rfq" && env.RFQ_MAIL_TO?.trim()) ||
      (kind === "supplier" && env.SUPPLIER_MAIL_TO?.trim()) ||
      env.MAIL_TO?.trim()) ??
    "";
  if (!host || !user || !pass || !to) return null;
  const port = Number(env.SMTP_PORT?.trim() || 587);
  return {
    host,
    port,
    secure: port === 465,
    user,
    pass,
    from: env.MAIL_FROM?.trim() || user,
    to,
  };
}

const ID_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ"; // no 0/O/1/I/L

/**
 * Human-quotable, non-secret reference such as "RFQ-20260927-7K3QXM":
 * kind prefix, UTC date, 6 random characters. It identifies a submission
 * in the inbox and in logs; it grants no access to anything.
 */
export function generateLeadId(
  kind: LeadKind,
  now: Date = new Date(),
  randomValues: (bytes: Uint8Array) => Uint8Array = (b) => crypto.getRandomValues(b)
): string {
  const prefix = kind === "rfq" ? "RFQ" : kind === "supplier" ? "SUP" : "MSG";
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const bytes = randomValues(new Uint8Array(6));
  const suffix = Array.from(bytes, (b) => ID_ALPHABET[b % ID_ALPHABET.length]).join("");
  return `${prefix}-${date}-${suffix}`;
}

export function truncate(value: string, max: number): string {
  return value.length > max ? `${value.slice(0, max)}…` : value;
}

/** "jane.doe@acme.com" → "j***@acme.com" — enough to match an inbox, not to harvest. */
export function redactEmail(email: string): string {
  const at = email.lastIndexOf("@");
  if (at < 1) return "***";
  return `${email[0]}***${email.slice(at)}`;
}

/** Single-line, redacted, length-bounded summary safe to write to logs. */
export function formatLogSummary(message: LeadMessage): string {
  const s = message.summary;
  const oneLine = (v: string) => v.replace(/[\r\n\t]+/g, " ");
  const parts: [string, string | undefined][] = [
    ["kind", message.kind],
    ["intent", s.intent],
    ["model", s.model],
    ["supplier_type", s.supplierType],
    ["qa_state", s.qaState],
    ["capabilities", s.capabilities && truncate(oneLine(s.capabilities), 80)],
    ["product", s.product],
    ["sku", s.sku],
    ["country", s.country && truncate(oneLine(s.country), 60)],
    ["company", s.company && truncate(oneLine(s.company), 60)],
    ["email", s.email && redactEmail(s.email)],
    ["volume", s.volume && truncate(oneLine(s.volume), 60)],
    ["locale", s.locale],
    ["source", s.sourcePath && truncate(oneLine(s.sourcePath), 80)],
    ["utm_source", s.utm_source && truncate(oneLine(s.utm_source), 40)],
    ["utm_campaign", s.utm_campaign && truncate(oneLine(s.utm_campaign), 40)],
    ["message_chars", s.message ? String(s.message.length) : undefined],
  ];
  return parts
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
    .join(" ");
}

/** Error details safe to log: code/response code and a bounded message. */
function describeError(error: unknown): string {
  if (error && typeof error === "object") {
    const e = error as { code?: unknown; responseCode?: unknown; message?: unknown };
    return [
      e.code && `code=${String(e.code)}`,
      e.responseCode && `responseCode=${String(e.responseCode)}`,
      typeof e.message === "string" && `message=${JSON.stringify(truncate(e.message, 200))}`,
    ]
      .filter(Boolean)
      .join(" ");
  }
  return "unknown error";
}

export async function deliverLead(
  message: LeadMessage,
  deps: { env: LeadEnv; send: SendFn; logger?: Logger }
): Promise<DeliveryOutcome> {
  const { env, send, logger = console } = deps;
  const mode = resolveDeliveryMode(env);
  const tag = `[lead] ${message.leadId}`;

  if (mode === "log") {
    if (env.VERCEL_ENV === "production") {
      logger.error(`${tag} NOT DELIVERED: LEAD_DELIVERY_MODE=log is not allowed in Production. ${formatLogSummary(message)}`);
      return { status: "unavailable", reason: "log-mode-in-production" };
    }
    if (isProductionDeployment(env)) {
      logger.warn(`${tag} LEAD_DELIVERY_MODE=log in a production build — leads are only logged, not emailed.`);
    }
    logger.info(`${tag} logged (mode=log) ${formatLogSummary(message)}`);
    return { status: "delivered", mode: "log" };
  }

  const config = resolveSmtpConfig(env, message.kind);
  if (!config) {
    logger.error(`${tag} NOT DELIVERED: SMTP is not configured (mode=smtp). ${formatLogSummary(message)}`);
    return { status: "unavailable", reason: "smtp-not-configured" };
  }

  try {
    await send(config, message);
  } catch (error) {
    logger.error(`${tag} NOT DELIVERED: SMTP send failed (${describeError(error)}). ${formatLogSummary(message)}`);
    return { status: "failed", reason: "send-error" };
  }

  logger.info(`${tag} delivered (mode=smtp) kind=${message.kind}`);
  return { status: "delivered", mode: "smtp" };
}

export type LeadResponseBody =
  | { ok: true; leadId?: string }
  | { ok: false; error: "invalid" | "delivery_unavailable" | "delivery_failed"; leadId?: string };

/** `ok: true` only ever accompanies a delivered lead. */
export function outcomeToHttp(
  outcome: DeliveryOutcome,
  leadId: string
): { status: number; body: LeadResponseBody } {
  switch (outcome.status) {
    case "delivered":
      return { status: 200, body: { ok: true, leadId } };
    case "unavailable":
      return { status: 503, body: { ok: false, error: "delivery_unavailable" } };
    case "failed":
      return { status: 502, body: { ok: false, error: "delivery_failed", leadId } };
  }
}
