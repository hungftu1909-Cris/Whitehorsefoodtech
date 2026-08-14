import nodemailer from "nodemailer";

/**
 * Sends a notification email via SMTP.
 *
 * Requires SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_TO, MAIL_FROM in
 * .env (see .env.example). Until those are configured, this logs the
 * submission to the server console instead of failing the request — so the
 * forms work end-to-end in development before real credentials exist.
 *
 * `kind` picks the recipient: RFQ submissions (sales intent) go to
 * RFQ_MAIL_TO when it's set, falling back to MAIL_TO otherwise — so setting
 * only MAIL_TO keeps both forms landing in one inbox, and adding
 * RFQ_MAIL_TO later splits quote requests into sales@ without a code change.
 */
export async function sendMail(opts: {
  subject: string;
  html: string;
  replyTo?: string;
  kind?: "contact" | "rfq";
}) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_TO, RFQ_MAIL_TO, MAIL_FROM } =
    process.env;
  const to = (opts.kind === "rfq" && RFQ_MAIL_TO) || MAIL_TO;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !to) {
    console.warn(
      "[mailer] SMTP not configured — logging submission instead of sending email.\n" +
        `Subject: ${opts.subject}\n${opts.html.replace(/<[^>]+>/g, " ")}`
    );
    return { delivered: false as const };
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT ?? 587),
    secure: Number(SMTP_PORT ?? 587) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  await transporter.sendMail({
    from: MAIL_FROM ?? SMTP_USER,
    to,
    replyTo: opts.replyTo,
    subject: opts.subject,
    html: opts.html,
  });

  return { delivered: true as const };
}

export function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
