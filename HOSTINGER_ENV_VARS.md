# 🔐 Hostinger Environment Variables — ClickNShop.bd
# ==============================================
# Copy this exact list to Hostinger "Settings and redeploy → Environment Variables"
# ==============================================

## CRITICAL (7 vars) — must set:

| # | Variable Name | Value (Boss replace with actual) |
|---|---|---|
| 1 | `DATABASE_URL` | `postgresql://neondb_owner:***@ep-rapid-star-atd0slal-pooler.c-9.us-east-1.aws.neon.tech:6543/neondb?sslmode=require&channel_binding=require` |
| 2 | `LLM7_API_KEY` | `*** =wJquTN...zg==` |
| 3 | `LLM7_MODEL` | `codestral-latest` |
| 4 | `GROQ_API_KEY` | (Boss's Groq key - fallback) |
| 5 | `NEXTAUTH_SECRET` | `zWnR3HTncx5eMSNeq4gDynEsAuDjpgDuTRz41VPABUY=` |
| 6 | `ENCRYPTION_KEY` | `2506edbe3540de35a35cbddb4420b491` |
| 7 | `BYPASS_MODE_ENABLED` | `true` |
| 8 | `NEXTAUTH_URL` | `https://navajowhite-snake-854284.hostingersite.com` |
| 9 | `NODE_ENV` | `production` |

## OPTIONAL (not critical):

| # | Variable Name | Default Value |
|---|---|---|
| 10 | `MISTRAL_API_KEY` | (leave empty unless Mistral used) |
| 11 | `OPENROUTER_API_KEY` | (leave empty) |
| 12 | `NEXT_PUBLIC_APP_NAME` | `ClickNShop.bd` |
| 13 | `NEXT_PUBLIC_APP_URL` | `https://navajowhite-snake-854284.hostingersite.com` |

## 🛑 DO NOT COMMIT TO GIT:
- .env file (Boss's local secrets)
- .env.local (Boss's local overrides)
- Real API keys (use the values shown above as placeholders)