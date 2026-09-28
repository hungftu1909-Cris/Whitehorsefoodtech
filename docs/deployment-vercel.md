# Deployment: Vercel

Vercel (made by the Next.js team) is the simplest path for this project —
zero server management, auto-deploys on every push to `main`, free HTTPS,
and native support for the app's SSR pages + `/api/contact` and `/api/rfq`
serverless functions. Steps below are done **by you** in your own Vercel
account — connecting GitHub requires your own OAuth login, which an AI
assistant can't do on your behalf.

## 1. Import the project

1. Go to https://vercel.com and sign in (GitHub login is easiest).
2. **Add New → Project**.
3. Authorize Vercel's GitHub App if prompted, then select the repo:
   `hungftu1909-Cris/Whitehorsefoodtech`.
4. Framework Preset should auto-detect **Next.js** — leave build settings
   as default (`npm run build`, output handled automatically).

## 2. Environment variables

Before clicking Deploy, add these (Project Settings → Environment
Variables — or during the import screen), same keys as `.env.example`:

| Key | Scope | Value |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Production | `https://www.whitehorsefoodtech.com` — the **www** host. The apex domain redirects to www, so an apex value would make every canonical/hreflang/sitemap URL point at a redirect. Leave unset on Preview (the code default is also www). |
| `LEAD_DELIVERY_MODE` | Production: `smtp` (or leave unset) · Preview: leave unset | Unset resolves to `smtp` in Production and `log` in Preview. Never set `log` in Production — it is refused with HTTP 503. |
| `SMTP_HOST` | **Production only** | SMTP host (`smtp.gmail.com` for Google Workspace) |
| `SMTP_PORT` | Production only | `587` |
| `SMTP_USER` | Production only | sending mailbox |
| `SMTP_PASS` | Production only | Google App Password (not the account password) |
| `MAIL_FROM` | Production only | sender address |
| `MAIL_TO` | Production only | inbox for Contact messages (and RFQs if `RFQ_MAIL_TO` is unset) |
| `RFQ_MAIL_TO` | Production only | optional sales inbox for quote requests |

**Delivery behaviour** (see `src/lib/lead-delivery.ts`):

- Production with SMTP configured → the form succeeds only after the SMTP
  server accepts the email; the buyer sees a reference such as
  `RFQ-20260927-7K3QXM`, which is also in the email subject.
- Production **without** SMTP → HTTP 503 and the form tells the buyer to
  email sales@ directly. This is intentional: a lead is never reported as
  received when it wasn't. Fix the env vars rather than switching to `log`.
- SMTP send error → HTTP 502, same message to the buyer; the Vercel
  function log has a redacted line with the reference, product, country,
  company and masked email so sales can follow up.
- Preview deployments (SMTP vars scoped to Production only) → `log` mode:
  submissions succeed and appear only as redacted lines in the function
  logs. Preview can therefore never email the real inbox.

## 3. Deploy

Click **Deploy**. First build takes ~1–2 minutes. You'll get a live URL like
`whitehorsefoodtech.vercel.app` immediately.

From now on, every `git push` to `main` auto-deploys; every pull request
gets its own preview URL automatically.

## 4. Connect the custom domain

1. In the Vercel project → **Settings → Domains**, add `whitehorsefoodtech.com`
   and `www.whitehorsefoodtech.com`.
2. Vercel shows you the exact DNS records to add. In Namecheap's
   **Advanced DNS** for the domain, typically:

   | Type | Host | Value |
   |---|---|---|
   | A Record | `@` | `76.76.21.21` (Vercel shows the current correct IP — use theirs) |
   | CNAME | `www` | `cname.vercel-dns.com` |

   (Use whatever values Vercel's Domains screen actually displays — they
   occasionally change the target IP/CNAME.)
3. Wait for DNS propagation (usually well under an hour); Vercel
   auto-issues an SSL certificate once it verifies the domain.

**Note:** this replaces the Namecheap VPS A-record approach from
`docs/deployment-namecheap-vps.md` — a domain can only point to one place
at a time. If the VPS was already set up for this site, remove/replace
those A records with the ones above.

## After deploy — sanity checks

- `https://www.whitehorsefoodtech.com/en` and `/vi` both load, and the
  apex `https://whitehorsefoodtech.com` redirects to www
- View source: `<link rel="canonical">`, `hreflang` links and
  `/sitemap.xml` `<loc>` values all start with `https://www.`
- `/sitemap.xml` and `/robots.txt` resolve; `/sitemap.xml` has no
  `/privacy` or `/terms` entries
- On a **Preview** URL: submit `/rfq` and `/contact` and confirm a
  `[lead] … logged (mode=log)` line in the function logs
- **Production inbox check** — only as a single internal test, done by the
  founder on purpose after promotion: submit one RFQ with the subject
  company "TEST — ignore" and confirm it arrives at `RFQ_MAIL_TO` (or
  `MAIL_TO`) with the reference in the subject. Do not script or repeat
  submissions against production.
