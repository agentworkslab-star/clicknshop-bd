#!/bin/bash
# deploy.sh — Auto-deploy script for Git Bash / WSL / Linux / macOS
# Usage: ./deploy.sh "your commit message"

set -e

MSG="${1:-Update: auto-deploy from local}"

echo ""
echo "========================================"
echo "  BanglaWriter Auto-Deploy Script"
echo "========================================"
echo ""

echo "[1/4] Checking git status..."
git status --short

echo ""
echo "[2/4] Adding files..."
git add .

echo ""
echo "[3/4] Committing with message: \"$MSG\""
if git commit -m "$MSG"; then
    echo "Commit successful"
else
    echo "Nothing to commit or commit failed, continuing..."
fi

echo ""
echo "[4/4] Pushing to GitHub (Vercel will auto-deploy)..."
if git push; then
    echo ""
    echo "========================================"
    echo "  SUCCESS! Deployment triggered."
    echo ""
    echo "  Watch build: https://vercel.com/dashboard"
    echo "  Live in 1-2 minutes at your Vercel URL"
    echo "========================================"
else
    echo ""
    echo "Push failed. Check:"
    echo "  1. GitHub remote configured: git remote -v"
    echo "  2. You are logged in to GitHub"
    echo "  3. Network connection"
    exit 1
fi