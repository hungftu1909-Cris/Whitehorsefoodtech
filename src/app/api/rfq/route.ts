import { NextResponse } from "next/server";
import { rfqSchema } from "@/lib/validations";
import { sendMail, escapeHtml } from "@/lib/mailer";

const PRODUCT_LABEL: Record<string, string> = {
  coffee: "Coffee",
  fruitPowder: "Freeze-Dried Fruit Powder",
  agri: "Premium Agri Raw Materials",
  other: "Other / not listed",
};

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const parsed = rfqSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const {
    name,
    company,
    email,
    phone,
    country,
    product,
    volume,
    incoterm,
    message,
    company_website,
  } = parsed.data;

  if (company_website) {
    return NextResponse.json({ ok: true });
  }

  await sendMail({
    subject: `New quote request — ${company} (${PRODUCT_LABEL[product]})`,
    replyTo: email,
    html: `
      <h2>New RFQ submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Company:</strong> ${escapeHtml(company)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone || "—")}</p>
      <p><strong>Destination country:</strong> ${escapeHtml(country)}</p>
      <p><strong>Product:</strong> ${PRODUCT_LABEL[product]}</p>
      <p><strong>Estimated volume:</strong> ${escapeHtml(volume)}</p>
      <p><strong>Preferred Incoterm:</strong> ${escapeHtml(incoterm || "—")}</p>
      <p><strong>Additional details:</strong></p>
      <p>${escapeHtml(message || "—").replace(/\n/g, "<br/>")}</p>
    `,
  });

  return NextResponse.json({ ok: true });
}
