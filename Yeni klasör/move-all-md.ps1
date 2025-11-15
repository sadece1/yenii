# Move all .md files to docs folder
$files = Get-ChildItem -Path "." -Filter "*.md" -File | Where-Object { 
    $_.FullName -notlike "*node_modules*" -and 
    $_.FullName -notlike "*\server\*" -and
    $_.FullName -notlike "*\docs\*" -and
    $_.Name -ne "move-md-files.ps1" -and
    $_.Name -ne "move-all-md.ps1"
}

foreach ($file in $files) {
    $dest = Join-Path "docs" $file.Name
    if (-not (Test-Path $dest)) {
        Move-Item $file.FullName $dest -Force
        Write-Host "Moved: $($file.Name)"
    }
}

# Move server .md files
if (Test-Path "server") {
    $serverFiles = Get-ChildItem -Path "server" -Filter "*.md" -File
    foreach ($file in $serverFiles) {
        $dest = Join-Path "docs" $file.Name
        if (-not (Test-Path $dest)) {
            Move-Item $file.FullName $dest -Force
            Write-Host "Moved from server: $($file.Name)"
        }
    }
}

Write-Host "`nAll .md files moved to docs folder!"

