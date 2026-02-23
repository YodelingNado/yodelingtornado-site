Set-Location "C:\Users\konno\OneDrive\Desktop\Code\yodelingtornado-site"

python .\update-stats.py

git add .\stats.json

git diff --cached --quiet
if ($LASTEXITCODE -ne 0) {
  git commit -m "Update Plex stats"
  git push
} else {
  Write-Host "No changes to commit (stats.json unchanged)."
}