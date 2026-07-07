# deploy.bat — Quick deploy script for Windows
# Usage: Open Git Bash or PowerShell, run: ./deploy.bat "your commit message"

@echo off
setlocal

if "%~1"=="" (
    set MSG=Update: auto-deploy from local
) else (
    set MSG=%~1
)

echo.
echo ========================================
echo   BanglaWriter Auto-Deploy Script
echo ========================================
echo.

echo [1/4] Checking git status...
git status --short

echo.
echo [2/4] Adding files...
git add .

echo.
echo [3/4] Committing with message: "%MSG%"
git commit -m "%MSG%"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [!] Nothing to commit or commit failed
    echo [!] Continuing to push anyway...
)

echo.
echo [4/4] Pushing to GitHub (Vercel will auto-deploy)...
git push

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [!] Push failed. Check:
    echo     1. GitHub remote configured: git remote -v
    echo     2. You are logged in to GitHub
    echo     3. Network connection
    pause
    exit /b 1
)

echo.
echo ========================================
echo   SUCCESS! Deployment triggered.
echo.
echo   Watch build: https://vercel.com/dashboard
echo   Live in 1-2 minutes at your Vercel URL
echo ========================================
echo.
pause