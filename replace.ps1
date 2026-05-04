$files = Get-ChildItem -Path "c:\Users\ASUS\Desktop\CNPM\frontend\src" -Recurse -File -Include *.jsx,*.css,*.js
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    if ($content -match "(?i)DAU Connect") {
        $newContent = $content -replace "(?i)DAU Connect", "Fivecore"
        Set-Content -Path $file.FullName -Value $newContent -NoNewline
        Write-Host "Updated: $($file.FullName)"
    }
}
