# ============================================
# ClickNShop.bd - ZIP Creator (Boss Manual)
# ============================================
# Run this in PowerShell to create proper ZIP for Hostinger deploy.
# This script ENSURES:
#   - ZIP file is at correct location
#   - Subfolder NOT included (files at ZIP root)
#   - All source files included
#   - node_modules EXCLUDED
# ============================================

# CONFIGURATION (Boss EDIT if different)
$ProjectRoot = "E:\Web Dasbord ai\Poject\BanglaWriter"
$ZipOutput = "E:\Web Dasbord ai\ClickNShop-v1.zip"

# ============================================
# STEP 1: Verify project exists
# ============================================
Write-Host ""
Write-Host "[1/4] Verifying project location..."
if (-not (Test-Path $ProjectRoot)) {
    Write-Host "ERROR: Project not found at $ProjectRoot"
    Write-Host "Boss, check the path is correct."
    exit 1
}

# ============================================
# STEP 2: Verify critical files exist
# ============================================
Write-Host ""
Write-Host "[2/4] Verifying critical files..."

$criticalFiles = @(
    "package.json",
    "next.config.js",
    "tailwind.config.ts",
    "tsconfig.json",
    "app\api\init-db\route.ts",
    "components\ui\button.tsx",
    "components\ui\input.tsx",
    "components\ui\label.tsx",
    "components\ui\card.tsx",
    "lib\auth.ts",
    "lib\prisma.ts",
    "prisma\schema.prisma",
    "prisma\seed.ts"
)

$missing = @()
foreach ($file in $criticalFiles) {
    $fullPath = Join-Path $ProjectRoot $file
    if (Test-Path $fullPath) {
        Write-Host "  [OK] $file"
    } else {
        Write-Host "  [MISSING] $file" -ForegroundColor Red
        $missing += $file
    }
}

if ($missing.Count -gt 0) {
    Write-Host ""
    Write-Host "ERROR: $($missing.Count) critical files missing!"
    Write-Host "Boss, fix missing files before creating ZIP."
    exit 1
}

# ============================================
# STEP 3: Create ZIP (correct structure)
# ============================================
Write-Host ""
Write-Host "[3/4] Creating ZIP file..."

# Remove old ZIP if exists
if (Test-Path $ZipOutput) {
    Remove-Item $ZipOutput -Force
    Write-Host "  Removed old ZIP"
}

# Get all files and folders inside project (NOT the project folder itself)
$files = Get-ChildItem -Path $ProjectRoot -Force | Where-Object {
    $_.Name -ne "node_modules" -and
    $_.Name -ne ".next" -and
    $_.Name -ne ".git" -and
    $_.Name -ne ".vercel" -and
    $_.Name -ne "*.log"
}

$count = 0
try {
    Compress-Archive -Path "$ProjectRoot\*" -DestinationPath $ZipOutput -Force
    $count = (Get-ChildItem $ProjectRoot -Recurse -File | Where-Object {
        $_.FullName -notmatch "node_modules" -and
        $_.FullName -notmatch "\.next\\" -and
        $_.FullName -notmatch "\.git\\"
    }).Count
} catch {
    Write-Host "ERROR: $($_.Exception.Message)"
    exit 1
}

# ============================================
# STEP 4: Verify ZIP
# ============================================
Write-Host ""
Write-Host "[4/4] Verifying ZIP..."
if (Test-Path $ZipOutput) {
    $size = (Get-Item $ZipOutput).Length
    $sizeKB = [math]::Round($size / 1KB, 2)
    $sizeMB = [math]::Round($size / 1MB, 2)

    Write-Host ""
    Write-Host "========================================="
    Write-Host "  ZIP CREATED SUCCESSFULLY!"
    Write-Host "========================================="
    Write-Host ""
    Write-Host "Location: $ZipOutput"
    Write-Host "Size:     $sizeKB KB ($sizeMB MB)"
    Write-Host "Files:    $count source files"
    Write-Host ""
    Write-Host "NEXT STEPS:"
    Write-Host "  1. Upload this ZIP to Hostinger Deployments"
    Write-Host "  2. Set 7 env vars (DATABASE_URL etc.)"
    Write-Host "  3. Click Save and redeploy"
    Write-Host "  4. Wait 2-3 minutes for build"
    Write-Host "  5. Visit dashboard to verify"
    Write-Host ""
} else {
    Write-Host "ERROR: ZIP not created!"
    exit 1
}
