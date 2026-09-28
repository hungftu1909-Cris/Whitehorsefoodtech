import { NextResponse } from "next/server";
import { supplierSchema } from "@/lib/validations";
import { deliver } from "@/lib/mailer";
import { buildSupplierEmail } from "@/lib/lead-email";
import { generateLeadId, outcomeToHttp } from "@/lib/lead-delivery";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const parsed = supplierSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }
  const data = parsed.data;

  // Honeypot hits fake-succeed without delivery, logs or a reference.
  if (data.company_website) {
    return NextResponse.json({ ok: true });
  }

  const leadId = generateLeadId("supplier");
  const { subject, html } = buildSupplierEmail(data, leadId);
  const outcome = await deliver({
    leadId,
    kind: "supplier",
    subject,
    html,
    replyTo: data.email || undefined,
    summary: {
      company: data.companyName,
      email: data.email || undefined,
      supplierType: data.supplierType,
      qaState: data.qaState,
      capabilities: data.capabilities.join(","),
      product: data.productFamilies.join(","),
      country: data.country,
      locale: data.locale || undefined,
      sourcePath: data.sourcePath || undefined,
      utm_source: data.utm_source || undefined,
      utm_campaign: data.utm_campaign || undefined,
      message: data.notes || undefined,
    },
  });

  const { status, body: responseBody } = outcomeToHttp(outcome, leadId);
  return NextResponse.json(responseBody, { status });
}
