# SAVVORA Promotional Video Render Script
# Usage: Execute this script in PowerShell to render out/savvora_promo.mp4

Write-Host "🎬 Rendering SAVVORA 20-Second Promotional Video..." -ForegroundColor Cyan

if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

if (-not (Test-Path "out")) {
    New-Item -ItemType Directory -Path "out" | Out-Null
}

npx remotion render src/index.ts SavvoraPromo out/savvora_promo.mp4 --overwrite

if (Test-Path "out/savvora_promo.mp4") {
    Write-Host "✅ Render complete! Output saved to: out/savvora_promo.mp4" -ForegroundColor Green
} else {
    Write-Host "❌ Render failed. Check logs above." -ForegroundColor Red
}
