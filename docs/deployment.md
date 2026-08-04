# Deployment: GitHub → Hostinger

## 1. Push to GitHub

```bash
git init                     # if not already a repo
git add -A
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-org>/<your-repo>.git
git push -u origin main
```

If you don't have a repo yet, create one at https://github.com/new (or via
`gh repo create <name> --private --source=. --push` if you have the GitHub
CLI installed and authenticated).

## 2. Hostinger — Node.js hosting

Hostinger's shared **Node.js hosting** (available on Business/Cloud/VPS
plans) can run this app directly. If you're on a plan without Node.js
support, upgrade first — a plain shared/PHP hosting plan cannot run this
site.

### Option A — Git-based deploy (recommended)

1. In **hPanel → Websites → [your site] → Node.js**, create a new
   application:
   - **Node.js version:** 20.x or later
   - **Application root:** the repo root (or a subfolder if you deployed
     into one)
   - **Application startup file:** leave as default; the start command is
     set below
2. Under **Git**, connect the GitHub repository and branch (`main`).
   Hostinger will pull the repo automatically on each push, or on demand.
3. Set the **install command** to:
   ```
   npm install && npm run build
   ```
4. Set the **start command** to:
   ```
   npm run start
   ```
5. Add environment variables (hPanel → Node.js app → Environment
   variables) — copy every key from `.env.example`:
   `NEXT_PUBLIC_SITE_URL`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`,
   `SMTP_PASS`, `MAIL_FROM`, `MAIL_TO`.
6. Point your domain (hPanel → Domains) at this Node.js application, and
   issue an SSL certificate (hPanel → SSL — free Let's Encrypt).
7. Restart the app from hPanel after the first deploy and after any env
   var changes.

### Option B — Manual upload

If Git-based deploy isn't available on your plan:

1. Locally: `npm install && npm run build`
2. Upload the whole project (including `.next/`, `node_modules/` or run
   `npm install` on the server, `package.json`, `public/`, etc.) via the
   File Manager or SFTP.
3. In hPanel → Node.js, set the start command to `npm run start` and set
   the same environment variables as above.
4. Start/restart the application.

### After first deploy

- Visit `https://<yourdomain>/en` and `https://<yourdomain>/vi` to confirm
  both locales load.
- Submit a test message through `/contact` and `/rfq` and confirm it
  arrives at `MAIL_TO` (check spam folder on first test).
- Verify `/sitemap.xml` and `/robots.txt` resolve, and submit the sitemap
  in Google Search Console / Bing Webmaster Tools.

## Notes

- This is a full Next.js server (not a static export) because the contact
  and RFQ forms need a server-side API route — a plain static hosting plan
  won't run it.
- Credentials (Hostinger login, SMTP password, GitHub tokens) should be
  entered by you directly in hPanel / GitHub — an AI assistant should never
  be given or asked to type your passwords.
