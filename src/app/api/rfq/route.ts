import { NextResponse } from "next/server";
import { rfqSchema } from "@/lib/validations";
import { deliver } from "@/lib/mailer";
import { buildRfqEmail } from "@/lib/lead-email";
import { generateLeadId, outcomeToHttp } from "@/lib/lead-delivery";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const parsed = rfqSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }
  const data = parsed.data;

  // Honeypot tripped — pretend success so bots aren't tipped off, but
  // deliver and log nothing.
  if (data.company_website) {
    return NextResponse.json({ ok: true });
  }

  const leadId = generateLeadId("rfq");
  const { subject, html } = buildRfqEmail(data, leadId);
  const outcome = await deliver({
    leadId,
    kind: "rfq",
    subject,
    html,
    replyTo: data.email,
    summary: {
      company: data.company,
      email: data.email,
      product: data.product,
      sku: data.sku || undefined,
      intent: data.intent,
      country: data.country,
      volume: data.volume,
      locale: data.locale || undefined,
      sourcePath: data.sourcePath || undefined,
      utm_source: data.utm_source || undefined,
      utm_campaign: data.utm_campaign || undefined,
      message: data.message || undefined,
    },
  });

  const { status, body: responseBody } = outcomeToHttp(outcome, leadId);
  return NextResponse.json(responseBody, { status });
}
