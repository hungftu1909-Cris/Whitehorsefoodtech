import nodemailer from "nodemailer";
import { deliverLead, type LeadMessage, type SendFn } from "@/lib/lead-delivery";

/**
 * The only place that talks to SMTP. Delivery rules (log vs smtp mode,
 * 503/502 outcomes, redacted logging) live in src/lib/lead-delivery.ts;
 * this file just supplies the real nodemailer transport and the process
 * environment. See .env.example for the variables.
 */
const smtpSend: SendFn = async (config, message) => {
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: { user: config.user, pass: config.pass },
  });
  await transporter.sendMail({
    from: config.from,
    to: config.to,
    replyTo: message.replyTo,
    subject: message.subject,
    html: message.html,
  });
};

export function deliver(message: LeadMessage) {
  return deliverLead(message, { env: process.env, send: smtpSend });
}
