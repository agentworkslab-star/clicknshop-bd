# ============================================
# ClickNShop.bd - Hostinger Deploy ZIP Creator
# Location: E:\Web Dasbord ai\Poject\BanglaWriter\
# Run: PowerShell-এ Right-click → "Run with PowerShell"
#       OR: powershell -File CREATE-HOSTINGER-ZIP.ps1
# ============================================

$ErrorActionPreference = "Stop"
$projectRoot = "E:\Web Dasbord ai\Poject\BanglaWriter"
$zipOutput = "E:\Web Dasbord ai\ClickNShop-Hostinger-v1.zip"

# Change to project root
Set-Location $projectRoot

# Check if old ZIP exists
if (Test-Path $zipOutput) {
    Remove-Item $zipOutput -Force
    Write-Host "Removed old ZIP" -ForegroundColor Yellow
}

# Files to INCLUDE (relative paths)
$includePaths = @(
    "app",
    "components",
    "lib",
    "prisma",
    "scripts",
    "public",
    "package.json",
    "package-lock.json",
    "tsconfig.json",
    "next.config.js",
    "next-env.d.ts",
    "tailwind.config.ts",
    "postcss.config.js",
    ".env.example"
)

Write-Host "Creating ZIP..." -ForegroundColor Green
Write-Host "Source: $projectRoot"
Write-Host "Output: $zipOutput"
Write-Host ""

# Get all files from included paths
$allFiles = @()
foreach ($path in $includePaths) {
    $fullPath = Join-Path $projectRoot $path
    if (Test-Path $fullPath) {
        if ((Get-Item $fullPath).PSIsContainer) {
            $files = Get-ChildItem -Path $fullPath -Recurse -File -Force
            $allFiles += $files
            Write-Host "  [OK] $path ($($files.Count) files)"
        } else {
            $allFiles += Get-Item -Path $fullPath -Force
            Write-Host "  [OK] $path (1 file)"
        }
    } else {
        Write-Host "  [SKIP] $path (not found)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Total files to include: $($allFiles.Count)" -ForegroundColor Cyan

# Create ZIP using .NET (handles large files)
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipArchive]::Open([System.IO.File]::OpenWrite($zipOutput), [System.IO.Compression.ZipArchiveMode]::Create)

foreach ($file in $allFiles) {
    $relativePath = $file.FullName.Substring($projectRoot.Length + 1)
    # Normalize to forward slashes for cross-platform
    $entry = $zip.CreateEntry($relativePath.Replace('\', '/'))
    $stream = $entry.Open()
    $fileStream = [System.IO.File]::OpenRead($file.FullName)
    $fileStream.CopyTo($stream)
    $fileStream.Close()
    $stream.Close()
}
$zip.Dispose()

$zipSize = (Get-Item $zipOutput).Length
$zipSizeMB = [math]::Round($zipSize / 1MB, 2)
$zipSizeKB = [math]::Round($zipSize / 1KB, 2)

Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host "ZIP created successfully!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host "Location: $zipOutput"
Write-Host "Size:     $zipSizeKB KB ($zipSizeMB MB)"
Write-Host "Files:    $($allFiles.Count)"
Write-Host ""
Write-Host "Next steps:"
Write-Host "  1. Login to Hostinger (hpanel.hostinger.com)"
Write-Host "  2. Go to your website → Deployments → Settings and redeploy"
Write-Host "  3. Upload this ZIP file"
Write-Host "  4. Add Environment Variables (see HOSTINGER_DEPLOY.txt)"
Write-Host "  5. Click Save and Redeploy"
Write-Host "  6. Wait 2-3 minutes for build"
Write-Host "  7. Visit https://navajowhite-snake-854284.hostingersite.com/dashboard"
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")