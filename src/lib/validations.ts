import { z } from "zod";

// Honeypot field: real users never fill this in (it's visually hidden). Any
// non-empty value still passes *validation* — the route handler is what
// treats it as spam and fake-succeeds, so bots aren't tipped off by a 400.
const honeypot = z.string().optional().or(z.literal(""));

export const contactSchema = z.object({
  name: z.string().trim().min(1),
  company: z.string().trim().min(1),
  email: z.string().trim().email(),
  phone: z.string().trim().optional().or(z.literal("")),
  message: z.string().trim().min(1),
  company_website: honeypot, // honeypot
});
export type ContactInput = z.infer<typeof contactSchema>;

export const rfqSchema = z.object({
  name: z.string().trim().min(1),
  company: z.string().trim().min(1),
  email: z.string().trim().email(),
  phone: z.string().trim().optional().or(z.literal("")),
  country: z.string().trim().min(1),
  product: z.enum(["coffee", "coconut", "birdsNest", "fruit", "nutsSpicesBotanicals", "other"]),
  volume: z.string().trim().min(1),
  incoterm: z.string().trim().optional().or(z.literal("")),
  message: z.string().trim().optional().or(z.literal("")),
  company_website: honeypot, // honeypot
});
export type RfqInput = z.infer<typeof rfqSchema>;
