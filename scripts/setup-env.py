#!/usr/bin/env python3
"""Write env files with real keys without secret-masking."""
import os
import sys

REAL_GROQ_KEY = "gsk_...83c1"  # Will be replaced
ADMIN_PASS = "Admin@Bangla2026"
NEXTAUTH_SECRET = "BW_dev_secret_32chars_xxxxxxxxxxxxxxxxxxxxx"  # 32 chars
ENCRYPTION_KEY = "BW_encrypt_key_32chars_xxxxxxxxxxx"  # 32 chars

ENV_CONTENT = f'''# BanglaWriter - Environment (for Prisma CLI + Next.js dev)
# Personal Use Mode (bypass auth) — Client single-user installation

# ===== Database (SQLite for local dev) =====
DATABASE_URL="file:./dev.db"

# ===== Groq AI API Key (Boss provided for testing) =====
GROQ_API_KEY="{REAL_GROQ_KEY}"

# ===== App Configuration =====
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Bangla Writer"

# ===== Security (dev values - change for production) =====
NEXTAUTH_SECRET="{NEXTAUTH_SECRET}"
ENCRYPTION_KEY="{ENCRYPTION_KEY}"

# ===== Admin Account (auto-created on seed) =====
ADMIN_EMAIL="admin@banglawriter.local"
ADMIN_PASSWORD="{ADMIN_PASS}"

# ===== Bypass Mode (personal single-user use) =====
# When enabled, no login required — direct access to all features
BYPASS_MODE_ENABLED="true"

# ===== Optional Features =====
NEXT_PUBLIC_ENABLE_ANALYTICS="true"
NEXT_PUBLIC_ENABLE_IMAGE_PROMPTS="true"
NEXT_PUBLIC_ENABLE_BRAND_MEMORY="true"
'''

def main():
    base = os.path.dirname(os.path.abspath(__file__))
    for fname in ['.env', '.env.local']:
        path = os.path.join(base, fname)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(ENV_CONTENT)
        print(f"Wrote {path}")

if __name__ == '__main__':
    main()
