# 🪞 Self-Reflection — ClickNShop.bd 10-Day Journey

> **Created:** 2026-07-20 by Hermes after Other-AI corrections
> **Purpose:** Document EVERY mistake, lesson, and principle so future work on this project doesn't repeat them.
> **Audience:** Future AI agents or developers who touch this codebase.

---

## 🎯 Boss's Core Rule (FOREVER)

> **"Stop making assumptions. I only want evidence-based debugging. Do NOT tell me what 'might' be wrong. Instead provide proof."**

This is the #1 rule. Every other rule flows from this.

---

## 🪞 My Top 10 Mistakes (with evidence)

### Mistake #1 — Fabricated/assumed things I had not seen
**When:** Throughout the 10-day journey
**Evidence:** Boss repeatedly said "I do NOT want assumptions", "show me proof", "paste the complete log"
**Lesson:** If I have not seen a file, a log, a screenshot, an env var — say so explicitly. Never guess. Never quote from memory of a previous turn.

### Mistake #2 — Recursive `build` script (`"npm run build" && "npm run build"`)
**When:** Earlier code
**Evidence:** Boss + other-AI both identified this. Build script was:
```json
"build": "npx prisma generate && npx prisma db push --accept-data-loss && npm run build"
                                                         ^^^^^^^^^^^^^^
                                                         RECURSIVE LOOP
```
**Fix applied:** `"build": "next build"` + `"postinstall": "prisma generate"`
**Lesson:** Never put `npm run build` inside the build script. Move side-effects to `postinstall` or a separate `migrate` script.

### Mistake #3 — Wrong argument order in `buildContextInjection()` call
**When:** My multi-provider AI refactor (commit `2a2192e` → `0f8f2bd`)
**Evidence:** `npx tsc --noEmit` failed:
```
./app/api/generate/route.ts:71:7
Type error: Argument of type 'string' is not assignable to parameter of type 'ProductContext'.
```
The interface signature is `(brand, product, request)` — but I called it with `(brandName, template, {...})` — passing a plain string into the `brand` slot.
**Fix applied:** Call now matches signature: brand object, product object, request object.
**Lesson:** Before modifying a function, ALWAYS read the interface signature verbatim. After modifying, run `npx tsc --noEmit` to confirm. Boss made me show all 3 interfaces in full before I could write the fix.

### Mistake #4 — Diagnosed problems without seeing the actual log
**When:** Asked "why is Hostinger build failing"
**Evidence:** Boss said: "I want the COMPLETE Hostinger build log. No summary. Do not summarize."
**Lesson:** I cannot see Hostinger. I cannot see production. Boss must paste the log. Until then, I cannot answer.

### Mistake #5 — Listened 20+ errors when Boss asked for 1
**When:** After multiple deployment failures
**Evidence:** Boss said: "Tell me the FIRST error only. Do NOT list 20 errors. Only the first blocking error."
**Lesson:** When Boss asks for the first error, list only the first error. Stop. Wait.

### Mistake #6 — Summarized interfaces instead of showing them in full
**When:** Diagnosing `buildContextInjection`
**Evidence:** Boss said: "Show ONLY these interfaces exactly as written. Do not summarize. Include every property name. Include every property type. Include optional markers (?)."
**Lesson:** When Boss asks for a file or interface, show it in full. Never summarize.

### Mistake #7 — Assumed my replacement code matched the interface
**When:** First attempt at fixing `route.ts:71`
**Evidence:** Boss caught me: "If even one property name differs, rewrite the replacement using the exact interface. Do not guess."
**Lesson:** Audit replacement code line-by-line against interface. If even one property differs, rewrite.

### Mistake #8 — Did not verify first fix actually fixed the build
**When:** Each fix cycle
**Evidence:** Boss made me run `npx tsc --noEmit` AND `npm run build` after each change. Until both pass, no claim of "fixed".
**Lesson:** After every code change, run typecheck + build. Only declare success when both pass.

### Mistake #9 — Suggested "20 problems" when Boss asked for "1"
**When:** Multiple audit requests
**Evidence:** Boss said: "Tell me the FIRST error only. Do NOT list 20 errors."
**Lesson:** Follow instruction exactly. If Boss says "list 1", list 1. If Boss says "list 20", list 20. No creative interpretation.

### Mistake #10 — Did not stop when asked
**When:** After pasting fix
**Evidence:** Boss said: "After that, stop. Wait for my next instruction."
**Lesson:** Stop means stop. Do NOT continue. Do NOT add more suggestions. Do NOT do "one more thing".

---

## 🎯 Principles (Permanent)

### P1. Evidence First
- See it → quote it
- Don't see it → say "I cannot see this, please paste"
- Guess → never

### P2. Show Complete
- Files: paste whole file
- Interfaces: paste all fields with `?` markers
- Errors: paste 30 lines of context minimum
- Logs: paste complete log, never summarize

### P3. First Error Only (When Asked)
- List 1, then stop
- Never cascade into "and also…" or "while we're at it…"

### P4. Stop Means Stop
- When Boss says "stop", stop
- Do not add "one more thing"
- Wait for next instruction

### P5. Verify After Every Change
- `npx tsc --noEmit` must pass
- `npm run build` must pass
- Only then claim "fixed"

### P6. Interface Audit
- Show the interface verbatim
- List every property name my replacement uses
- If even one differs, rewrite

### P7. Boss Uses Other AI to Verify
- When Boss says "other AI did X" → assume my work was wrong
- Audit immediately
- Never argue

### P8. Hostinger Is Not Accessible
- Boss's hpanel is on Boss's side
- I cannot see logs, settings, env vars
- Boss must paste them when asked

---

## 🛠️ Build Pattern (Permanent — Do Not Change)

```json
{
  "scripts": {
    "dev": "next dev -H 0.0.0.0 -p 3000",
    "build": "next build",
    "start": "next start -p 3000 -H 0.0.0.0",
    "postinstall": "prisma generate",
    "migrate": "prisma db push --accept-data-loss && tsx prisma/seed.ts"
  }
}
```

**Rules:**
- ❌ NEVER put `npm run build` inside `build` script
- ❌ NEVER put `prisma db push` inside `build` script (data loss risk)
- ✅ `prisma generate` belongs in `postinstall`
- ✅ `prisma db push` belongs in `migrate` (manual step)

---

## 🌐 Hostinger 7-Settings Checklist (Permanent)

| # | Setting | Required Value | Verify |
|---|---------|---------------|--------|
| 1 | Node.js version | 20.x or 24.x | hpanel Node selector |
| 2 | Root directory | Folder where `package.json` lives | File manager |
| 3 | Build script | `npm run build` | hpanel |
| 4 | Install command | `npm install` (default) | hpanel |
| 5 | Start command | `npm run start` | hpanel |
| 6 | Port | 3000 (default) | hpanel |
| 7 | Output directory | (default, Next.js auto) | hpanel |

---

## 📚 TypeScript Interface Discipline

When fixing any TypeScript error:
1. Show the failing call (3 lines of context)
2. Show the called function's signature verbatim (all params, types, return)
3. Show ALL interface definitions verbatim (every field, every `?`)
4. Audit my replacement code line-by-line against interfaces
5. Run `npx tsc --noEmit` to verify
6. Run `npm run build` to verify
7. Stop. Wait for instruction.

---

## ✅ What I Will Do Better Next Time

1. **Ask before assuming** — when I don't have evidence, say so
2. **Show in full** — never summarize files, interfaces, logs
3. **First error only** — when asked
4. **Stop when told** — no creative continuation
5. **Verify after change** — typecheck + build before claiming fixed
6. **Audit interfaces** — show all, audit all, line-by-line
7. **Accept Other-AI corrections** — Boss has multiple sources, I'm not the only one

---

**Hermes self-reflection complete. 2026-07-20.**