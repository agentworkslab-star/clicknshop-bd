# 🚀 ClickNShop.bd — Deployment Guide

> **Setup once, deploy forever.** `git push` → auto-deploys to Vercel in 1-2 minutes!

---

## 📁 Two Schemas (Auto-switched)

This project supports **both SQLite (local dev)** and **PostgreSQL (production)**:

- **`prisma/schema.prisma`** = SQLite (default — for local development)
- **`prisma/schema.production.prisma`** = PostgreSQL (used on Vercel via `vercel.json` build command)

Vercel automatically uses the production schema. Locally, you use SQLite. Same code, two DBs!

---

## 🎯 Step-by-Step Deployment

### Step 1: GitHub-এ Repo Create (2 min)

**Option A: GitHub Website (Easiest)**
1. Go to https://github.com/new
2. Repository name: `clicknshop-bd`
3. **Private** (recommended)
4. Don't initialize with README
5. Click **Create repository**

**Option B: GitHub CLI (Faster)**
```bash
gh auth login
gh repo create clicknshop-bd --private --source=. --remote=origin --push
```

---

### Step 2: Push Your Code (1 min)

```bash
cd "E:\Web Dasbord ai\Poject\ClickNShop.bd"

git remote add origin https://github.com/YOUR_USERNAME/clicknshop-bd.git
git branch -M main
git push -u origin main
```

*(If you get authentication errors, use a Personal Access Token instead of password)*

---

### Step 3: Vercel Sign Up + Import (3 min)

1. Go to https://vercel.com/signup
2. Click **"Continue with GitHub"**
3. Authorize Vercel
4. Click **"Add New..."** → **"Project"**
5. Find **`clicknshop-bd`** repo → Click **"Import"**

**If `vercel link` CLI didn't complete (UI prompt issue):**
- Skip it! Use Vercel Dashboard directly (Step 3 above).

---

### Step 4: Create Vercel Postgres Database (3 min)

1. In your Vercel project → Click **"Storage"** tab
2. Click **"Create Database"** → Select **"Postgres"**
3. Database name: `clicknshop-bd-db`
4. Region: **Singapore (`sin1`)** — closest to Bangladesh
5. Click **"Create"**
6. Click **"Connect to Project"** → Select your project

This auto-adds `POSTGRES_URL`, `POSTGRES_PRISMA_URL` etc. to env vars.

---

### Step 5: Add Environment Variables (3 min)

Vercel Dashboard → Your Project → **Settings** → **Environment Variables**

Add these for **Production** scope:

| Name | Value |
|---|---|
| `DATABASE_URL` | (copy from Vercel Postgres — usually auto-filled) |
| `GROQ_API_KEY` | `gsk_...` |
| `NEXTAUTH_SECRET` | Generate with PowerShell below |
| `ENCRYPTION_KEY` | Generate with PowerShell below |
| `BYPASS_MODE_ENABLED` | `true` |
| `NEXT_PUBLIC_APP_URL` | `https://clicknshop-bd.vercel.app` (your URL) |
| `NEXT_PUBLIC_APP_NAME` | `ClickNShop.bd` |

**Generate secrets (PowerShell):**
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

---

### Step 6: First Deploy! (2 min)

1. Vercel Project page → **Deployments** tab
2. Click **"Deploy"** button
3. Watch build logs (1-3 minutes)
4. ✅ Green checkmark = SUCCESS

**Your live URL:** `https://clicknshop-bd-YOUR_USERNAME.vercel.app`

---

### Step 7: Initialize Database (2 min)

The app is live but DB is empty. Run schema push + seed:

```bash
# Install Vercel CLI (if not done)
npm install -g vercel

# Login
vercel login

# Link project
vercel link
# Choose: Your existing project "clicknshop-bd"

# Pull production env vars
vercel env pull .env.production

# Push schema to Postgres
npx prisma db push

# Seed initial data
npx tsx prisma/seed.ts
```

You should see:
```
🌱 Seeding ClickNShop.bd database...
✓ Admin: admin@clicknshop-bd.local / phone: 01700000000 / pw: Admin@12345
✓ Demo:  phone: 01800000000 / pw: Demo@Bangla2026
✓ Demo brand memory
✓ 3 demo products
✓ 4 preset frameworks
✓ 7 AI templates
✅ Seed complete!
```

---

## 🎉 আপনার App Live!

Visit your Vercel URL → Auto-redirects to `/dashboard` (Bypass Mode).

Test AI generation:
- Go to `/ai-writer`
- Select template
- Click Generate → Real Bangla streaming output!

---

## 🔄 Daily Development Workflow

### Local Development (SQLite)

```bash
cd "E:\Web Dasbord ai\Poject\ClickNShop.bd"
npm run dev
# Open http://localhost:3000
```

### Make Changes → Deploy to Production

```bash
# 1. Edit your code locally
# 2. Test locally (npm run dev)

# 3. When ready to deploy:
./deploy.sh "your change description"     # Git Bash
# OR
deploy.bat "your change description"     # PowerShell/CMD

# This runs: git add → commit → push
# Vercel auto-detects push → builds → deploys
```

**Live in 1-2 minutes!** 🚀

---

## 🛠️ Common Tasks

### Add New Feature
```bash
# Edit code
git add .
git commit -m "Add: new AI template"
git push   # auto-deploys
```

### Fix Bug
```bash
git add .
git commit -m "Fix: dashboard stat counter"
git push
```

### Update Database Schema
```bash
# 1. Edit prisma/schema.prisma (local SQLite)
# 2. Test locally: npx prisma db push

# 3. ALSO update prisma/schema.production.prisma (keep them in sync!)

# 4. Commit and push
git add .
git commit -m "Update DB schema"
git push

# 5. Production migration (one-time, after deploy):
vercel env pull .env.production
npx prisma db push
```

### Change Env Variable
- Vercel Dashboard → Settings → Environment Variables
- Edit value → Save
- Auto-redeploys

---

## 🔐 Custom Domain (Optional)

1. Buy domain (Namecheap/GoDaddy — ~$10/year)
2. Vercel Dashboard → Project → Settings → Domains
3. Add domain + follow DNS instructions
4. Free SSL auto-configured

---

## 📊 Vercel Free Tier

| Resource | Free Limit |
|---|---|
| Bandwidth | 100 GB/month |
| Build time | 100 hours/month |
| Serverless | 100 GB-hours |
| Postgres storage | 256 MB |
| Postgres compute | 60 hours/month |

**Personal client use-এর জন্য যথেষ্ট!** 🎉

---

## 🐛 Troubleshooting

### "vercel link" prompts disabled
- **Fix:** Skip CLI linking. Use Vercel Dashboard → Add New → Project → Import GitHub repo instead.

### Build fails on Vercel: "Cannot find module '@prisma/client'"
- **Fix:** `vercel.json` should have buildCommand: `cp prisma/schema.production.prisma prisma/schema.prisma && prisma generate && next build`
- Verify in Vercel Dashboard → Project → Settings → Build & Development Settings

### Database Connection Error
- **Fix:** Storage tab → Confirm Postgres is "Connected" to your project
- Check `DATABASE_URL` env var exists

### AI Generation: "401 Unauthorized"
- **Fix:** Settings → Environment Variables → Verify `GROQ_API_KEY` value matches Boss's key
- Redeploy

### Schema Mismatch on Production
- **Fix:** Run `vercel env pull .env.production` then `npx prisma db push` to sync

---

## ✅ Final Checklist

- [ ] GitHub repo created and code pushed
- [ ] Vercel account created (with GitHub)
- [ ] Project imported to Vercel
- [ ] Vercel Postgres created + connected to project
- [ ] Environment variables set (DATABASE_URL, GROQ_API_KEY, NEXTAUTH_SECRET, ENCRYPTION_KEY, BYPASS_MODE_ENABLED)
- [ ] First deployment succeeded (green check)
- [ ] `vercel link` + `vercel env pull` done
- [ ] `npx prisma db push` run on production
- [ ] `npx tsx prisma/seed.ts` run on production
- [ ] Live URL works: `/dashboard`, `/ai-writer`
- [ ] AI generation tested end-to-end with real Bangla output
- [ ] (Optional) Custom domain added

**🎉 You're live!**

Share your Vercel URL with clients. Every `git push` updates production automatically. No server management needed.

---

## 📞 Support

- Vercel Docs: https://vercel.com/docs
- Prisma + Vercel: https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel
- Next.js Deployment: https://nextjs.org/docs/app/building-your-application/deploying