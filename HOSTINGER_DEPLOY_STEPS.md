# 🚀 ClickNShop.bd — Hostinger Deployment Guide (Step-by-Step)

## 📋 Pre-requisites Checklist
- [ ] Boss-এর local PostgreSQL চলছে (locally tested)
- [ ] Boss-এর LLM7.io key verified working
- [ ] Boss-এর code on GitHub (commit `2a2192e` or later)
- [ ] Hostinger account active
- [ ] Domain `navajowhite-snake-854284.hostingersite.com` configured

---

## 🎯 STEP 1: Generate the ZIP

### Option A: Use my PowerShell script (RECOMMENDED)

1. Open PowerShell as **Administrator**
   - Windows key + X → "Windows PowerShell (Admin)" or "Terminal (Admin)"

2. Navigate to project folder:
   ```powershell
   cd "E:\Web Dasbord ai\Poject\BanglaWriter"
   ```

3. Run script:
   ```powershell
   powershell -ExecutionPolicy Bypass -File "CREATE-HOSTINGER-ZIP.ps1"
   ```

4. Wait 30-60 seconds
5. Script creates: `E:\Web Dasbord ai\ClickNShop-Hostinger-v1.zip`

### Option B: Manual ZIP (File Explorer)

1. Open File Explorer → `E:\Web Dasbord ai\Poject\BanglaWriter\`
2. **Select these files/folders only** (Ctrl+Click to multi-select):
   - `app/`
   - `components/`
   - `lib/`
   - `prisma/`
   - `scripts/`
   - `public/` (if exists)
   - `package.json`
   - `package-lock.json`
   - `tsconfig.json`
   - `next.config.js`
   - `next-env.d.ts`
   - `tailwind.config.ts`
   - `postcss.config.js`
   - `.env.example`

3. **DO NOT INCLUDE**:
   - ❌ `node_modules/`
   - ❌ `.next/`
   - ❌ `.git/`
   - ❌ `.env` or `.env.local` (your secrets!)
   - ❌ Any `.env.production*` files
   - ❌ `deploy.bat`, `deploy.sh` (Vercel-specific)
   - ❌ `DEPLOY.md`, `HANDOFF.md`, `QUICK-START.md`
   - ❌ `.vercel/`

4. Right-click selected files → "Compress to ZIP file"
5. Name: `ClickNShop-v1.zip`

---

## 🎯 STEP 2: Hostinger Setup (5 min)

### 2.1: Login

1. Browser: **https://hpanel.hostinger.com**
2. Login with Boss's credentials
3. Click **"Websites"** in left sidebar
4. Click Boss's website (`navajowhite-snake-854284`)

### 2.2: Add Environment Variables

1. Click **"Settings and redeploy"** tab
2. Scroll to **"Environment Variables"** section
3. Click **"Add Variable"** button
4. Add each of the 9 variables from `HOSTINGER_ENV_VARS.md`:

```
DATABASE_URL     = postgresql://neondb_owner:***@ep-rapid-star-atd0slal-pooler.c-9.us-east-1.aws.neon.tech:6543/neondb?sslmode=require&channel_binding=require
LLM7_API_KEY     = *** =wJquTNICjlZp07bDQVHibvw/pk4MzrrRMLMkujIvpAGuqvlWTJpPIHPKC+jTJT1reXWJI+BgB0pxj84POiYU57nrt9qc0QPcHASQU44/I2UzljNvPtB9DknvuRw81lV0tmRp6knpj3bz1y+aSO0Yzg==
LLM7_MODEL       = codestral-latest
GROQ_API_KEY     = (Boss's Groq key as fallback)
NEXTAUTH_SECRET  = zWnR3HTncx5eMSNeq4gDynEsAuDjpgDuTRz41VPABUY=
ENCRYPTION_KEY   = 2506edbe3540de35a35cbddb4420b491
BYPASS_MODE_ENABLED = true
NEXTAUTH_URL      = https://navajowhite-snake-854284.hostingersite.com
NODE_ENV          = production
```

5. Click **Save** after each

### 2.3: Upload Source Files

1. Still in "Settings and redeploy" section
2. Find **"Source files"** subsection
3. Click **"Upload new files"**
4. Select `E:\Web Dasbord ai\ClickNShop-Hostinger-v1.zip`
5. Wait for upload (1-2 minutes)
6. **If Hostinger asks "Replace existing files?"** → Click **Yes**

### 2.4: Trigger Deploy

1. Click **"Save and redeploy"** button (big button at top or bottom)
2. ⏳ Wait 2-3 minutes for build

---

## 🎯 STEP 3: Monitor Build (2-3 min)

### What to watch for:

✅ **Good signs in build log:**
```
✔ Generated Prisma Client
Datasource "db": PostgreSQL database "neondb"
🚀 Your database is now in sync
✓ Compiled successfully
Route (app) — 19 routes
Deployment completed
```

❌ **Bad signs:**
- "Can't reach database server" → DATABASE_URL wrong
- "Module not found" → ZIP missing files
- "Invalid API Key" → LLM7_API_KEY wrong

---

## 🎯 STEP 4: Verify Live URL

### 4.1: Open Dashboard

Browser: **`https://navajowhite-snake-854284.hostingersite.com/dashboard`**

Expected:
- ✅ "স্বাগতম, FashionBD!" banner
- ✅ 4 stat cards
- ✅ Sidebar with all menu items
- ✅ No "Error" messages

### 4.2: Test AI Generation

1. Click "AI Writer" in sidebar
2. Select template: "Facebook Post"
3. Select product: "প্রিমিয়াম সিল্ক শাড়ি"
4. Set language: Bangla
5. Click **"Generate"**
6. Wait 3-5 seconds
7. Expected: Correct Bangla content appears (no spaces between chars)
8. Click "Save" or "Add to Project"

### 4.3: Test Other Pages

- ✅ `/products` — 3 demo products visible
- ✅ `/brand` — brand memory editable
- ✅ `/projects` — generated content history
- ✅ `/image-prompt` — image prompt generator
- ✅ `/admin` — admin panel (with admin login)

---

## 🆘 Troubleshooting

### Build Failed: "DATABASE_URL must start with postgresql://"
- ❌ Wrong DATABASE_URL value
- ✅ Use the exact value from HOSTINGER_ENV_VARS.md

### Build Failed: "Module not found '@/components/ui/button'"
- ❌ ZIP missing UI components
- ✅ Re-create ZIP with my PowerShell script (more reliable)

### Dashboard Works but AI Generation Fails
- ❌ LLM7_API_KEY invalid or missing
- ✅ Check Hostinger env var matches Boss's key exactly

### Login Fails
- ❌ NEXTAUTH_SECRET not set
- ✅ Set NEXTAUTH_SECRET in Hostinger env vars

### Tables Don't Exist
- ❌ DATABASE_URL wrong or Neon paused
- ✅ Verify Neon project is active, then check DATABASE_URL

---

## ✅ Success Checklist

After successful deployment:
- [ ] Dashboard loads at `https://navajowhite-snake-854284.hostingersite.com/dashboard`
- [ ] "স্বাগতম, FashionBD!" appears
- [ ] AI Writer generates Bangla content
- [ ] Products page shows 3 demo products
- [ ] Brand page allows editing
- [ ] Projects page shows generation history

---

## 📞 Need Help?

If any step fails:
1. Check build log carefully
2. Compare with my checklist above
3. Verify env vars match exactly
4. Boss can paste error log here for help

---

**🎉 Once everything works, Boss-এর client-কে live URL share করুন!**
