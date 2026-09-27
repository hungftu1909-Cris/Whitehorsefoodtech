// Mail delivery behaviour with a fake transport only — no SMTP connection
// is ever opened and process.env is never read by the code under test.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  deliverLead,
  formatLogSummary,
  generateLeadId,
  isProductionDeployment,
  outcomeToHttp,
  redactEmail,
  resolveDeliveryMode,
  resolveSmtpConfig,
  type LeadEnv,
  type LeadMessage,
  type SmtpConfig,
} from "../src/lib/lead-delivery.ts";

const SMTP: LeadEnv = {
  SMTP_HOST: "smtp.invalid",
  SMTP_PORT: "587",
  SMTP_USER: "robot@example.com",
  SMTP_PASS: "s3cret-app-password",
  MAIL_TO: "info@example.com",
};

const message = (): LeadMessage => ({
  leadId: "RFQ-20260927-ABCDEF",
  kind: "rfq",
  subject: "[RFQ] test",
  html: "<p>test</p>",
  replyTo: "buyer@example.com",
  summary: {
    company: "Example GmbH",
    email: "jane.doe@buyer.example",
    product: "coffee",
    intent: "quote",
    country: "Germany",
    message: "Confidential pricing details that must never reach the logs",
  },
});

function recorder() {
  const lines: string[] = [];
  const logger = {
    info: (...a: unknown[]) => lines.push(a.join(" ")),
    warn: (...a: unknown[]) => lines.push(a.join(" ")),
    error: (...a: unknown[]) => lines.push(a.join(" ")),
  };
  return { lines, logger };
}

function fakeTransport(behaviour: "ok" | "throw" = "ok") {
  const calls: { config: SmtpConfig; message: LeadMessage }[] = [];
  const send = async (config: SmtpConfig, msg: LeadMessage) => {
    calls.push({ config, message: msg });
    if (behaviour === "throw") {
      throw Object.assign(new Error("Invalid login: 535 5.7.8 Username and Password not accepted"), {
        code: "EAUTH",
        responseCode: 535,
      });
    }
  };
  return { calls, send };
}

test("mode: explicit LEAD_DELIVERY_MODE wins; default is smtp only in production", () => {
  assert.equal(resolveDeliveryMode({ LEAD_DELIVERY_MODE: "log", NODE_ENV: "production" }), "log");
  assert.equal(resolveDeliveryMode({ LEAD_DELIVERY_MODE: " SMTP " }), "smtp");
  assert.equal(resolveDeliveryMode({ NODE_ENV: "development" }), "log");
  assert.equal(resolveDeliveryMode({}), "log");
  assert.equal(resolveDeliveryMode({ NODE_ENV: "production" }), "smtp");
  assert.equal(resolveDeliveryMode({ NODE_ENV: "production", VERCEL_ENV: "preview" }), "log");
  assert.equal(resolveDeliveryMode({ NODE_ENV: "production", VERCEL_ENV: "production" }), "smtp");
  assert.equal(resolveDeliveryMode({ LEAD_DELIVERY_MODE: "carrier-pigeon", NODE_ENV: "production" }), "smtp");
  assert.equal(isProductionDeployment({ VERCEL_ENV: "preview", NODE_ENV: "production" }), false);
});

test("SMTP config: all of host/user/pass/recipient required; RFQs may route separately", () => {
  assert.equal(resolveSmtpConfig({}, "rfq"), null);
  assert.equal(resolveSmtpConfig({ ...SMTP, SMTP_PASS: "" }, "rfq"), null);
  assert.equal(resolveSmtpConfig({ ...SMTP, MAIL_TO: "" }, "contact"), null);
  const rfq = resolveSmtpConfig({ ...SMTP, RFQ_MAIL_TO: "sales@example.com" }, "rfq");
  const contact = resolveSmtpConfig({ ...SMTP, RFQ_MAIL_TO: "sales@example.com" }, "contact");
  assert.equal(rfq?.to, "sales@example.com");
  assert.equal(contact?.to, "info@example.com");
  assert.equal(resolveSmtpConfig(SMTP, "rfq")?.to, "info@example.com");
  assert.equal(rfq?.from, "robot@example.com");
  assert.equal(resolveSmtpConfig({ ...SMTP, SMTP_PORT: "465" }, "rfq")?.secure, true);
});

test("log mode: delivered to the log, transport never called, text redacted", async () => {
  const { calls, send } = fakeTransport();
  const { lines, logger } = recorder();
  const outcome = await deliverLead(message(), { env: { NODE_ENV: "development", ...SMTP }, send, logger });
  assert.deepEqual(outcome, { status: "delivered", mode: "log" });
  assert.equal(calls.length, 0);
  const log = lines.join("\n");
  assert.match(log, /RFQ-20260927-ABCDEF/);
  assert.doesNotMatch(log, /Confidential pricing/);
  assert.doesNotMatch(log, /jane\.doe@buyer\.example/);
  assert.match(log, /j\*\*\*@buyer\.example/);
});

test("log mode is refused in a Vercel Production deployment", async () => {
  const { calls, send } = fakeTransport();
  const { logger } = recorder();
  const outcome = await deliverLead(message(), {
    env: { LEAD_DELIVERY_MODE: "log", VERCEL_ENV: "production", NODE_ENV: "production" },
    send,
    logger,
  });
  assert.deepEqual(outcome, { status: "unavailable", reason: "log-mode-in-production" });
  assert.equal(calls.length, 0);
  assert.equal(outcomeToHttp(outcome, "x").status, 503);
});

test("production without SMTP → 503, nothing sent", async () => {
  const { calls, send } = fakeTransport();
  const { lines, logger } = recorder();
  const outcome = await deliverLead(message(), { env: { NODE_ENV: "production" }, send, logger });
  assert.deepEqual(outcome, { status: "unavailable", reason: "smtp-not-configured" });
  assert.equal(calls.length, 0);
  const http = outcomeToHttp(outcome, "RFQ-20260927-ABCDEF");
  assert.equal(http.status, 503);
  assert.equal(http.body.ok, false);
  assert.match(lines.join("\n"), /NOT DELIVERED/);
});

test("SMTP send failure → 502 with the reference; credentials never logged", async () => {
  const { calls, send } = fakeTransport("throw");
  const { lines, logger } = recorder();
  const outcome = await deliverLead(message(), { env: { LEAD_DELIVERY_MODE: "smtp", ...SMTP }, send, logger });
  assert.deepEqual(outcome, { status: "failed", reason: "send-error" });
  assert.equal(calls.length, 1);
  const http = outcomeToHttp(outcome, "RFQ-20260927-ABCDEF");
  assert.deepEqual(http, {
    status: 502,
    body: { ok: false, error: "delivery_failed", leadId: "RFQ-20260927-ABCDEF" },
  });
  const log = lines.join("\n");
  assert.match(log, /EAUTH/);
  assert.doesNotMatch(log, /s3cret-app-password/);
  assert.doesNotMatch(log, /Confidential pricing/);
});

test("SMTP success → 200 with the reference, sent once to the right inbox", async () => {
  const { calls, send } = fakeTransport();
  const { logger } = recorder();
  const outcome = await deliverLead(message(), {
    env: { LEAD_DELIVERY_MODE: "smtp", ...SMTP, RFQ_MAIL_TO: "sales@example.com" },
    send,
    logger,
  });
  assert.deepEqual(outcome, { status: "delivered", mode: "smtp" });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].config.to, "sales@example.com");
  assert.deepEqual(outcomeToHttp(outcome, "RFQ-1"), { status: 200, body: { ok: true, leadId: "RFQ-1" } });
});

test("ok:true is only ever returned for a delivered lead", () => {
  const notDelivered = [
    { status: "unavailable", reason: "smtp-not-configured" },
    { status: "unavailable", reason: "log-mode-in-production" },
    { status: "failed", reason: "send-error" },
  ] as const;
  for (const outcome of notDelivered) {
    const { status, body } = outcomeToHttp(outcome, "id");
    assert.equal(body.ok, false);
    assert.ok(status >= 500);
  }
});

test("lead reference IDs: readable, dated, non-sequential", () => {
  const fixed = generateLeadId("rfq", new Date("2026-09-27T23:59:00Z"), (b) => b.fill(0));
  assert.equal(fixed, "RFQ-20260927-222222");
  assert.match(generateLeadId("contact"), /^MSG-\d{8}-[2-9A-HJKMNP-Z]{6}$/);
  const ids = new Set(Array.from({ length: 200 }, () => generateLeadId("rfq")));
  assert.ok(ids.size > 195, "IDs should not collide in practice");
});

test("log summary redaction", () => {
  assert.equal(redactEmail("jane.doe@acme.com"), "j***@acme.com");
  assert.equal(redactEmail("nonsense"), "***");
  const line = formatLogSummary({
    ...message(),
    summary: { ...message().summary, company: "Evil\nInjected: yes", volume: "x".repeat(500) },
  });
  assert.doesNotMatch(line, /\n/);
  assert.ok(line.length < 600);
  assert.match(line, /message_chars="\d+"/);
});
