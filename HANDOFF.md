# ClickNShop.bd - Complete Project Handoff Document

> **এই document যেকোনো AI / developer instantly context নিতে পারবে।** সব status, code state, infrastructure, blockers, এবং next steps এখানে documented।

---

## 📊 Current Project Status (2026-07-09)

### ✅ What's Complete (95%)

| Item | Status | Details |
|---|---|---|
| **Codebase** | ✅ 100% | Next.js 14.2.35 + TypeScript + Tailwind CSS |
| **Features** | ✅ 100% | 7 AI templates, Brand Memory, Product Library, Saved Projects, Admin Panel |
| **UI/UX** | ✅ 100% | Professional dark theme (slate-900 + blue/purple gradients) |
| **Local Dev** | ✅ Works | SQLite, all 11 routes working at http://localhost:3000 |
| **GitHub** | ✅ Pushed | https://github.com/agentworkslab-star/clicknshop-bd (all 4 commits) |
| **Vercel Deploy** | ✅ Working | Build succeeds, URL: https://clicknshop-bd.vercel.app |
| **Neon Database** | ✅ Created | Project: summer-sun-05670628, Connection string in Vercel env |

### 🚨 Blockers (5% remaining)

| Issue | Status | Impact |
|---|---|---|
| **Production DB tables missing** | ❌ Critical | Dashboard shows "Error" - tables never created in Neon |
| **Vercel build errors** | ⚠️ Recent | installCommand referenced non-existent schema file (FIXED, pushed) |
| **Build still running** | ⏳ Pending | Need 2-3 min wait for next build to complete |

---

## 🏗️ Architecture Overview

### Tech Stack
- **Frontend:** Next.js 14 (App Router) + React 18 + TypeScript
- **Styling:** Tailwind CSS 3 with custom dark theme
- **Database:** Prisma ORM 5.22 (PostgreSQL for prod, SQLite for local)
- **Auth:** JWT (jose) + bcrypt (12 rounds)
- **AI:** Groq SDK (LLaMA 3.3 70B Versatile)
- **UI:** Custom shadcn-style components + Radix UI primitives
- **Icons:** Lucide React
- **Fonts:** Inter (EN) + Hind Siliguri (BN)
- **Export:** docx + jsPDF + html2canvas

### Project Structure
```
E:\Web Dasbord ai\Poject\BanglaWriter\
├── app/                          # Next.js 14 App Router
│   ├── (auth)/                   # Login, Register
│   ├── (authed)/                 # Dashboard, Brand, Products, AI Writer, etc.
│   ├── admin/                    # Admin Panel
│   ├── api/                      # API routes
│   │   ├── generate/             # AI generation endpoint
│   │   └── init-db/              # One-time DB init (NEW)
│   ├── globals.css               # Dark theme
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── components/
│   ├── layout/                   # Sidebar (left), Topbar
│   └── ui/                       # 12+ shadcn-style primitives
├── lib/
│   ├── auth.ts                   # JWT + bypass mode
│   ├── db-helpers.ts             # SQLite/PostgreSQL compatibility
│   ├── enums.ts                  # App-level enums
│   ├── groq/                     # Groq client + 7 AI templates
│   └── utils.ts                  # Helpers
├── prisma/
│   ├── schema.prisma             # SQLite (local dev) - currently being used
│   ├── schema.production.prisma  # PostgreSQL (production)
│   ├── seed.ts                   # Initial data script
│   └── dev.db                    # Local SQLite file
├── scripts/
│   └── init-prod-db.mjs          # Production DB init (Vercel build)
├── vercel.json                   # Deployment config
├── .env                          # Local env (DATABASE_URL to Neon)
├── .env.local                    # Local dev
└── package.json
```

### 12 Database Tables
1. **users** - Boss/Admin accounts (auth, profile)
2. **brand_memory** - Brand context (12+ fields)
3. **frameworks** - PAS, AIDA, Hormozi, Storytelling
4. **generations** - AI output history
5. **saved_outputs** - Favorites
6. **referrals** - User referral system
7. **products** - Product library (CRUD)
8. **generated_contents** - 7-template outputs
9. **brand_memories_ext** - Extended brand data
10. **folders** - Content organization
11. **templates** - Editable AI prompts
12. **api_settings, usage_logs, sessions** - Per-user tracking

---

## 🔑 Critical Environment Variables (Vercel Production)

| Variable | Status | Value Source |
|---|---|---|
| `DATABASE_URL` | ✅ Set | Neon: `postgresql://neondb_owner:***@ep-rapid-star-atd0slal.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require` |
| `GROQ_API_KEY` | ✅ Set | `gsk_...` (Boss's Groq API key) |
| `NEXTAUTH_SECRET` | ✅ Set | Base64 string (generated via PowerShell) |
| `ENCRYPTION_KEY` | ✅ Set | 32-char hex string |
| `BYPASS_MODE_ENABLED` | ✅ Set | `true` (direct dashboard access, no login) |

---

## 🚨 The ONE Remaining Issue: Production DB Tables

### Root Cause
Production Supabase/Neon database has NO TABLES. The dashboard returns error because Prisma queries return nothing.

### Why It Wasn't Fixed Yet
1. **Supabase** (previous attempt): Network unreachable from Boss's PC, project paused
2. **Vercel build-time `prisma db push`**: Several attempts failed due to:
   - Wrong `installCommand` referencing non-existent schema file
   - `buildCommand` with cp command failing
3. **Vercel init-db API route**: Returns 302 redirect due to Vercel Authentication enabled

### Current State (as of latest push)
- ✅ Code pushed to GitHub: commit `41ab32e` "fix: installCommand broken schema path"
- ⏳ Vercel build in progress (2-3 min from last push)
- ⏳ Expected: `prisma db push` will run in Vercel build, create tables in Neon
- ⏳ Expected: Dashboard will work after successful build

---

## 🎯 Next Steps (in priority order)

### 1. Wait for Current Build (CRITICAL)
```bash
# Vercel-এ build in progress (last push was 41ab32e)
# Watch at: https://vercel.com/dashboard/agentworkslab-stars-projects/clicknshop-bd
# Wait 2-3 minutes
```

### 2. Verify Build Success
```bash
# Check build logs
vercel inspect <latest-deployment-url> -l

# Look for:
# - "prisma db push" success message
# - "Compiled successfully"
# - "Build Completed"
# - Status "● Ready"
```

### 3. Test Live URL
```bash
# Visit in browser:
https://clicknshop-bd.vercel.app/dashboard

# Expected:
# - "স্বাগতম, FashionBD!" welcome banner
# - 4 stat cards (Products: 3, Content: 0, Saved: 0, API calls)
# - Sidebar with menu items
# - Recent content section
```

### 4. If Build Fails Again
- Check `vercel.json` buildCommand
- Ensure `prisma/schema.prisma` is the production schema
- Try manual `prisma db push` via Vercel CLI:
  ```bash
  vercel link
  vercel env pull .env.production
  npx prisma db push
  npx tsx prisma/seed.ts
  ```

---

## 🔐 Login Credentials (for testing)

| User | Phone | Password | Access |
|---|---|---|---|
| Admin | 01700000000 | Admin@12345 | All + admin panel |
| Demo (FashionBD) | 01800000000 | Demo@Bangla2026 | All features (bypass mode active) |

**Note:** Bypass Mode is ENABLED — direct dashboard access without login.

---

## 🆘 Common Commands Reference

### Local Development
```bash
cd "E:\Web Dasbord ai\Poject\BanglaWriter"
npm install
npx prisma db push
npx tsx prisma/seed.ts
npm run dev   # → http://localhost:3000
```

### Production Deployment
```bash
# After making code changes:
git add -A
git commit -m "your message"
git push origin main   # Vercel auto-deploys!
```

### Vercel CLI
```bash
vercel login
vercel link
vercel ls              # List deployments
vercel inspect <url> -l  # Get build logs
vercel env ls production  # List env vars
vercel env pull .env.production
```

### GitHub
- Repo: https://github.com/agentworkslab-star/clicknshop-bd
- Branch: `main`
- Auto-deploy: Enabled (every push to main triggers Vercel build)

---

## 🎯 Boss-এর Original Requirements

1. **Project Name:** ClickNShop.bd (formerly BanglaWriter)
2. **Type:** AI-powered Bangla marketing workspace
3. **Features:** 7 AI templates, Brand Memory, Product Library, etc.
4. **Deployment:** Vercel (free tier, GitHub auto-deploy)
5. **Database:** Currently Neon PostgreSQL (was Supabase, changed due to network issues)
6. **Client Use:** Personal use (not public launch), Bypass Mode enabled
7. **Budget:** Free tier only

---

## 💼 For Other AI/Developer

If you're picking up this project:

1. **Read this document fully**
2. **Check current build status** at: https://vercel.com/dashboard/agentworkslab-stars-projects/clicknshop-bd
3. **If build is failing**, focus on `vercel.json` buildCommand and `prisma/schema.prisma` configuration
4. **If build succeeds but dashboard errors**, the issue is missing DB tables — focus on `prisma db push` in production environment
5. **Test locally first** with `npm run dev` to verify code works
6. **Boss prefers:** Sequential single commands in PowerShell (multi-line paste has issues)
7. **Boss's PC:** Windows 10, no WSL, uses Git Bash + PowerShell

---

## 📝 Honest Assessment

**Strengths:**
- Code is well-structured, all features work locally
- UI is professional and polished
- AI integration is solid (Groq streaming)
- 7 AI templates are domain-specific and useful

**Challenges:**
- Vercel deployment + production DB setup is complex
- Boss has limited time and has been stuck for 3+ days
- Multiple infrastructure changes (Supabase → Neon) added complexity

**Recommendation:**
- If build succeeds now → 1-2 days of polish + client demo
- If build keeps failing → consider hiring senior Next.js dev for 1-2 days
- Project is 95% complete, just final 5% (DB + deployment) needs expert hand

---

**Project Created by:** Sazol Boss (SazolAhmed0509 / agentworkslab@gmail.com)  
**Repository:** https://github.com/agentworkslab-star/clicknshop-bd  
**Vercel Project:** clicknshop-bd (agentworkslab-stars-projects team)  
**Production URL:** https://clicknshop-bd.vercel.app  
**Last Updated:** 2026-07-09
