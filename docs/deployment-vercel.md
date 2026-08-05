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

| Key | Value |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://whitehorsefoodtech.com` (or your `*.vercel.app` URL until the domain is connected) |
| `SMTP_HOST` | your SMTP host |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | your SMTP username |
| `SMTP_PASS` | your SMTP password |
| `MAIL_FROM` | sender address |
| `MAIL_TO` | inbox that should receive contact/RFQ submissions |

Without these, the contact/RFQ forms still work but only log submissions to
Vercel's function logs instead of emailing them.

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

- `https://whitehorsefoodtech.com/en` and `/vi` both load
- Submit a test message via `/contact` and `/rfq`, confirm it arrives at
  `MAIL_TO` (check Vercel → Project → Logs if it doesn't, to see the
  server-side error)
- `/sitemap.xml` and `/robots.txt` resolve
