# Move all .md files to docs folder
$mdFiles = Get-ChildItem -Path "." -Filter "*.md" -File | Where-Object { 
    $_.FullName -notlike "*node_modules*" -and 
    $_.FullName -notlike "*\server\*" -and
    $_.FullName -notlike "*move-md-files.ps1*"
}

if (-not (Test-Path "docs")) {
    New-Item -ItemType Directory -Path "docs" | Out-Null
}

foreach ($file in $mdFiles) {
    Move-Item -Path $file.FullName -Destination "docs\$($file.Name)" -Force
    Write-Host "Moved: $($file.Name)"
}

# Move server .md files
if (Test-Path "server") {
    $serverMdFiles = Get-ChildItem -Path "server" -Filter "*.md" -File
    foreach ($file in $serverMdFiles) {
        Move-Item -Path $file.FullName -Destination "docs\$($file.Name)" -Force
        Write-Host "Moved from server: $($file.Name)"
    }
}

Write-Host "All .md files moved to docs folder!"

