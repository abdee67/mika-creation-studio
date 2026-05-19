# Compress all videos in public/videos using ffmpeg
$inputDir = "$PSScriptRoot\..\public\videos"
$outputDir = "$PSScriptRoot\..\public\videos_compressed"

if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
}

$files = Get-ChildItem -Path $inputDir -Filter "*.mp4"
foreach ($file in $files) {
    $inputPath = $file.FullName
    $outputPath = Join-Path $outputDir $file.Name
    Write-Host "Compressing $($file.Name)..."
    ffmpeg -y -i $inputPath -c:v libx264 -crf 28 -preset fast -an -vf "scale=-2:720" -movflags +faststart $outputPath
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  Done: $($file.Name)" -ForegroundColor Green
    } else {
        Write-Host "  FAILED: $($file.Name)" -ForegroundColor Red
    }
}

Write-Host "`nAll videos processed. Sizes:" -ForegroundColor Cyan
foreach ($file in $files) {
    $orig = $file.Length
    $compressed = (Get-Item (Join-Path $outputDir $file.Name) -ErrorAction SilentlyContinue)
    if ($compressed) {
        $ratio = [math]::Round(($compressed.Length / $orig) * 100, 1)
        Write-Host "  $($file.Name): $([math]::Round($orig/1MB, 2))MB -> $([math]::Round($compressed.Length/1MB, 2))MB ($ratio%)"
    }
}
