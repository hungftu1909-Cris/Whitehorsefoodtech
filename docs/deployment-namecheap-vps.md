# Deployment: Namecheap VPS (Pulsar / Quasar / Magnetar)

This covers a KVM VPS from Namecheap (Ubuntu/AlmaLinux, root SSH access — no
cPanel required). Steps 1–9 are run **by you**, in your own terminal, SSH'd
into the VPS — an AI assistant should never be given your VPS root password.
Paste any error output back and I can help debug the next step.

## 0. Prerequisites

- VPS IP address and root password/SSH key (from your Namecheap dashboard
  after the VPS is provisioned)
- This repo pushed to GitHub: `https://github.com/hungftu1909-Cris/Whitehorsefoodtech.git`
- Your domain's DNS managed somewhere you can edit an A record (Namecheap
  DNS, or wherever the domain's nameservers point)

## 1. Connect and update the system

```bash
ssh root@YOUR_VPS_IP
apt update && apt upgrade -y        # Ubuntu/Debian
# or: dnf update -y                 # AlmaLinux/CentOS
```

## 2. Create a non-root deploy user (recommended)

Running the app as root is unnecessary risk.

```bash
adduser deploy
usermod -aG sudo deploy             # Ubuntu/Debian
# or: usermod -aG wheel deploy      # AlmaLinux/CentOS
su - deploy
```

Run everything below as `deploy` unless noted.

## 3. Install Node.js 20 LTS

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs          # Ubuntu/Debian
node -v && npm -v
```

(AlmaLinux/CentOS: use the equivalent `nodesource` RPM setup script, or
`dnf module install nodejs:20`.)

## 4. Install PM2 (keeps the app running, restarts on crash/reboot)

```bash
sudo npm install -g pm2
```

## 5. Clone the repo and configure environment

```bash
git clone https://github.com/hungftu1909-Cris/Whitehorsefoodtech.git
cd Whitehorsefoodtech
cp .env.example .env.local
nano .env.local   # fill in real values — see below
```

Set in `.env.local`:
- `NEXT_PUBLIC_SITE_URL=https://yourdomain.com`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`, `MAIL_TO`
  (contact/RFQ form email delivery — see main README "Before you launch")

If the GitHub repo is **private**, `git clone` over HTTPS will prompt for a
username/GitHub personal access token instead of a password — generate one
at github.com/settings/tokens (scope: `repo`) and use it in place of a
password when prompted, or set up a deploy key instead.

## 6. Install dependencies, build, start with PM2

```bash
npm install
npm run build
pm2 start npm --name whitehorse-web -- start
pm2 save
pm2 startup    # then run the one-line command it prints (as root/sudo)
```

Verify it's running:

```bash
curl -I http://localhost:3000/en
pm2 status
pm2 logs whitehorse-web
```

## 7. Install and configure Nginx as a reverse proxy

```bash
sudo apt install -y nginx
sudo nano /etc/nginx/sites-available/whitehorse-web
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/whitehorse-web /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo ufw allow 'Nginx Full'   # if ufw firewall is active
```

## 8. Point your domain at the VPS

In whichever DNS panel manages your domain (Namecheap → Domain List → Manage
→ Advanced DNS, if the domain uses Namecheap's own nameservers):

- **A record**, host `@`, value = your VPS IP
- **A record**, host `www`, value = your VPS IP

DNS propagation can take up to ~30 minutes (sometimes a few hours).

## 9. HTTPS with a free Let's Encrypt certificate

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Certbot edits the Nginx config to add SSL and sets up auto-renewal.

## 10. Deploying updates later

```bash
cd ~/Whitehorsefoodtech
git pull
npm install
npm run build
pm2 restart whitehorse-web
```

Consider wrapping this in a small `deploy.sh` script, or setting up a GitHub
Actions workflow that SSHes in and runs it automatically on every push to
`main` — ask if you'd like that set up.

## After deploy — sanity checks

- `https://yourdomain.com/en` and `/vi` both load
- Submit a test message via `/contact` and `/rfq`, confirm it arrives at
  `MAIL_TO`
- `/sitemap.xml` and `/robots.txt` resolve
- `pm2 status` shows the app as `online`; `pm2 logs` has no repeating errors

## Notes

- This is a full Node.js server (not a static export) — the contact/RFQ
  forms need the server-side API routes, so this can't be hosted as static
  files alone.
- Never share your VPS root password or SSH private key with an AI
  assistant — run the commands above yourself and paste back any error
  output if something fails.
