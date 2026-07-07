# ClickNShop.bd — AI-Powered Bangla Marketing Workspace

**বাংলা মার্কেটিং কন্টেন্ট জেনারেটর** — Groq LLaMA দিয়ে বাংলা ও Bangla-English mixed marketing scripts, hooks, captions তৈরি করে।

---

## ✨ Features (100% Complete)

- 🤖 **৭টি AI Template**: Facebook Post, Product Description, SEO, Offer, Banner, Reel Script, Image Prompt
- 🇧🇩 **Bangla + English** native support
- 🏢 **Brand Memory**: 12+ fields + live preview
- 📦 **Product Library**: 3 demo products seeded, full CRUD
- 🎨 **Modern UI**: Light/White design with dark green `#0b3d0b` brand color
- 📤 **Export**: DOCX / PDF / TXT
- 🏷️ **Folders + Tags + Favorites**
- 👨‍💼 **Admin Panel**: users, templates, logs, analytics
- 🔐 **Bypass Mode**: Direct dashboard access (no login required for personal use)
- 🤖 **Groq Streaming**: Real-time typewriter effect
- 📱 **Fully Responsive**: Mobile bottom nav, tablet, desktop

---

## 🚀 Quick Start

```bash
cd "E:\Web Dasbord ai\Poject\clicknshop-bd"
npm install
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```

Then open: **http://localhost:3000**

---

## 🔐 Login (Bypass Mode Active)

| User | Phone | Password | Access |
|---|---|---|---|
| **Admin** | 01700000000 | Admin@12345 | All + admin panel |
| **Demo** | 01800000000 | Demo@Bangla2026 | All features |

**Bypass Mode:** When `BYPASS_MODE_ENABLED=true` in `.env`, the root path (`/`) goes directly to `/dashboard` without login. The system auto-resolves to the demo user.

---

## 📂 Tech Stack

- **Framework:** Next.js 14.2.35 (App Router) + TypeScript
- **Styling:** Tailwind CSS 3 (custom dark green `#0b3d0b` primary theme)
- **Database:** Prisma + SQLite (file:./dev.db)
- **Auth:** JWT (jose) + bcrypt + cookies
- **AI:** Groq API (set `GROQ_API_KEY` in `.env.local` — get from https://console.groq.com/keys)
- **Export:** docx + jsPDF + html2canvas
- **Forms:** react-hook-form + zod
- **State:** Zustand + @tanstack/react-query
- **UI:** Custom shadcn-style + Radix UI
- **Icons:** Lucide React
- **Fonts:** Inter (EN) + Hind Siliguri (BN)

---

## 🗄️ Database Schema (12 Tables)

1. **users** — WhatsApp-based auth + brand info
2. **brand_memory** — 12+ fields of brand context
3. **frameworks** — PAS, AIDA, Hormozi, Storytelling + custom
4. **generations** — AI output history
5. **saved_outputs** — Favorites
6. **referrals** — Referral tracking
7. **products** — Product library
8. **generated_contents** — 7 template outputs
9. **brand_memories_ext** — Extended brand memory
10. **folders** — Content organization
11. **templates** — Editable AI prompts
12. **api_settings, usage_logs, sessions** — Per-user settings

---

## 📁 Folder Structure

```
E:\Web Dasbord ai\Poject\clicknshop-bd\
├── app/
│   ├── page.tsx (ClickNShop.bd landing per Document 1)
│   ├── layout.tsx
│   ├── globals.css (Dark green theme)
│   ├── (auth)/, (authed)/, admin/, api/
├── lib/ (auth, prisma, enums, db-helpers, groq, supabase, utils, export)
├── components/ (layout + 12 UI primitives)
├── prisma/
│   ├── schema.prisma (12 tables)
│   ├── dev.db (SQLite)
│   └── seed.ts (admin + demo + 3 products + 4 frameworks + 7 templates)
├── .env, .env.local (with real Groq key)
├── tailwind.config.ts (dark green #0b3d0b)
└── package.json
```

---

## ✅ Verification Status

- [x] Build: `npx next build` SUCCESS (18 routes)
- [x] Seed: Admin + Demo + 3 products + 4 frameworks + 7 templates
- [x] Dev server: Running on http://localhost:3000
- [x] Public routes: /, /login, /register → HTTP 200
- [x] Protected routes: /dashboard, /brand, /products, /ai-writer, /image-prompt, /projects, /settings, /admin → HTTP 200 (bypass mode)
- [x] AI generation: Streaming Bangla content working with real Groq key

---

## 📚 Spec Source

This project is built from 3 detailed specification documents:
- `01_Website_Overview_and_Features.txt` — Full feature spec
- `02_Design_System_and_UI_UX.txt` — Color palette, typography, components
- `03_Technical_Stack_and_Clone_Guide.txt` — DB schema, AI prompts, API design

All copy in the landing page (`/`) is taken directly from Document 1.
All design tokens are from Document 2 (Tailwind config + globals.css).
All schema fields are from Document 3 (Prisma schema).

---

© 2026 ClickNShop.bd · Built for Sazol Boss
