# Compress all videos in public/videos using ffmpeg
$inputDir = "$PSScriptRoot\..\public\videos"
$outputDir = "$PSScriptRoot\..\public\videos_compressed"

if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
}

$files = Get-ChildItem -Path $inputDir -Filter "*.mp4"
foreach ($file in $files) {
    $inputPath = $file.FullName
    $outputPathMP4 = Join-Path $outputDir $file.Name
    $outputPathWebM = Join-Path $outputDir ($file.BaseName + ".webm")

    Write-Host "Processing $($file.Name)..." -ForegroundColor Yellow

    # 1. Compress to Highly Optimized H.264 MP4 (Universal Fallback)
    Write-Host "  -> Generating compressed MP4..."
    ffmpeg -y -i $inputPath -c:v libx264 -crf 26 -preset slow -an -vf "scale=-2:720" -movflags +faststart $outputPathMP4 2>$null

    # 2. Compress to Ultra-lightweight VP9 WebM (Primary Source)
    Write-Host "  -> Generating compressed WebM..."
    ffmpeg -y -i $inputPath -c:v libvpx-vp9 -crf 35 -b:v 0 -an -vf "scale=-2:720" $outputPathWebM 2>$null

    if ($LASTEXITCODE -eq 0) {
        Write-Host "  Done: $($file.Name)" -ForegroundColor Green
    } else {
        Write-Host "  FAILED: $($file.Name)" -ForegroundColor Red
    }
}

Write-Host "`nAll videos processed. Sizes:" -ForegroundColor Cyan
foreach ($file in $files) {
    $orig = $file.Length
    $compMP4 = (Get-Item (Join-Path $outputDir $file.Name) -ErrorAction SilentlyContinue)
    $compWebM = (Get-Item (Join-Path $outputDir ($file.BaseName + ".webm")) -ErrorAction SilentlyContinue)

    Write-Host "  $($file.Name) (Original): $([math]::Round($orig/1MB, 2))MB"
    if ($compMP4) {
        $ratio = [math]::Round(($compMP4.Length / $orig) * 100, 1)
        Write-Host "    -> MP4: $([math]::Round($compMP4.Length/1MB, 2))MB ($ratio%)" -ForegroundColor Gray
    }
    if ($compWebM) {
        $ratio = [math]::Round(($compWebM.Length / $orig) * 100, 1)
        Write-Host "    -> WebM: $([math]::Round($compWebM.Length/1MB, 2))MB ($ratio%)" -ForegroundColor Gray
    }
}
