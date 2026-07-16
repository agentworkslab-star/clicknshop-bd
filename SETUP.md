# ClickNShop.bd - Setup Guide (Updated 2026-07-16)

## 🎯 KEY INSIGHT (Boss's discovery):

**Local dev and Production BOTH use the same Neon PostgreSQL database.**

No more SQLite vs PostgreSQL confusion! Just one database, one schema.

---

## ⚡ Quick Start (3 commands):

```bash
# 1. Install deps
npm install

# 2. Setup database (Neon PostgreSQL)
npx prisma generate
npx prisma db push --accept-data-loss

# 3. Start dev server
npm run dev
```

Then visit: **http://localhost:3000/dashboard**

---

## 📋 Why this approach works:

### Before (FAILED approach):
- ❌ Local: SQLite (`file:./prisma/dev.db`)
- ❌ Production: PostgreSQL (Neon)
- ❌ Two different schemas → sync issues
- ❌ Two different DATABASE_URLs → confusion
- ❌ Boss had to choose which one to use for testing

### Now (WORKING approach):
- ✅ Local: PostgreSQL (Neon)
- ✅ Production: PostgreSQL (Neon)
- ✅ Same schema, same database
- ✅ Same DATABASE_URL (Boss uses Neon for both)
- ✅ Test locally = test production behavior

---

## 🔧 Environment Setup (CRITICAL):

### File: `.env` (LOCAL DEV — gitignored)

Create this file in project root:

```bash
# Database (Neon PostgreSQL — pooled connection)
DATABASE_URL="postgresql://neondb_owner:***@ep-rapid-star-atd0slal-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# AI (Groq)
GROQ_API_KEY="gsk_your_actual_key_here"

# Auth
NEXTAUTH_SECRET="your_secret"
ENCRYPTION_KEY="your_32_char_hex_key"

# App
BYPASS_MODE_ENABLED="true"
NEXT_PUBLIC_APP_NAME="ClickNShop.bd"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Hostinger (PRODUCTION — set in dashboard):

Same env vars + `NODE_ENV=production` + `NEXTAUTH_URL=https://yourdomain.com`

---

## 📦 Database Tables:

Boss's `.env` already has Neon URL. The `npx prisma db push` command will:
- Create 12 tables in Neon
- Match `schema.prisma` definition
- Sync perfectly between local and production

---

## 🔄 Development Workflow (Now SIMPLE):

1. Edit code in `E:\Web Dasbord ai\Poject\BanglaWriter\`
2. Run `npm run dev` locally
3. Test at `http://localhost:3000/dashboard`
4. When satisfied, commit + push:
   ```bash
   git add -A
   git commit -m "your message"
   git push origin main
   ```
5. Hostinger auto-deploys from GitHub
6. Same database, same code = same behavior

---

## 🆘 Troubleshooting:

### Error: "URL must start with postgresql://"
- Boss-এর insight: Check `.env` DATABASE_URL doesn't have `file:./...` (SQLite format)
- Should have `postgresql://...` (Neon format)

### Error: "Can't reach database server"
- Boss's local network may block Neon (different port)
- Use Neon pooler URL (with `-pooler` in hostname)
- Or test from Hostinger deploy instead

### Error: "Tables don't exist"
- Run: `npx prisma db push --accept-data-loss`
- Should create 12 tables in Neon

---

## 📁 Project Structure:

```
E:\Web Dasbord ai\Poject\BanglaWriter\
├── app/              # Next.js pages (16 routes)
├── components/       # UI components (18 shadcn-style + layout)
├── lib/              # Auth, Prisma, Groq, utilities
├── prisma/           # Database schema + seed
├── scripts/          # Helper scripts
├── public/           # Static assets (if any)
├── .env              # Local secrets (NEVER commit!)
├── .env.example      # Template (commit-safe)
├── .gitignore        # Excludes .env, node_modules
├── package.json      # Dependencies + scripts
└── README.md         # Project overview
```

---

**🎯 Final answer: Boss-এর insight PERMANENTLY fixed project!**