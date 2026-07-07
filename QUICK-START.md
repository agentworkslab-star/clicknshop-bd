# 🚀 Quick Reference

## Daily Development

```bash
cd "E:\Web Dasbord ai\Poject\clicknshop-bd"

# Local dev (SQLite)
npm run dev                 # → http://localhost:3000

# Edit code, then deploy:
./deploy.sh "your message"  # or deploy.bat on Windows
# → Auto-deploys to Vercel!
```

## First-Time Deployment

See [DEPLOY.md](./DEPLOY.md) for complete steps.

**TL;DR:**
1. Create GitHub repo → push code
2. Sign up vercel.com with GitHub
3. Import project
4. Add Vercel Postgres
5. Add env vars (GROQ_API_KEY, NEXTAUTH_SECRET, ENCRYPTION_KEY)
6. Deploy!
7. Run `npx prisma db push` + `npx tsx prisma/seed.ts` via Vercel CLI

## Production URLs

- **Landing**: `/`
- **Dashboard**: `/dashboard`
- **Login** (optional): `/login`

## Admin / Demo Credentials

After seeding:
- Admin phone: `01700000000` / pw: `Admin@12345`
- Demo phone: `01800000000` / pw: `Demo@Bangla2026`

## Bypass Mode

Direct dashboard access without login (set `BYPASS_MODE_ENABLED=true`).

## Useful Commands

```bash
npm run dev               # Start dev server
npm run build             # Build for production
npm run start             # Start production server locally
npm run prisma:generate   # Generate Prisma client
npm run prisma:push       # Push schema to DB
npm run prisma:seed       # Seed initial data
npm run prisma:studio     # Open Prisma Studio
./deploy.sh "msg"         # Git commit + push (auto-deploys)
```