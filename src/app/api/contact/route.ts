import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations";
import { sendMail, escapeHtml } from "@/lib/mailer";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { name, company, email, phone, message, company_website } = parsed.data;

  // Honeypot tripped — pretend success, drop silently.
  if (company_website) {
    return NextResponse.json({ ok: true });
  }

  await sendMail({
    subject: `New contact form message — ${company}`,
    replyTo: email,
    kind: "contact",
    html: `
      <h2>New contact form submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Company:</strong> ${escapeHtml(company)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone || "—")}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
    `,
  });

  return NextResponse.json({ ok: true });
}
