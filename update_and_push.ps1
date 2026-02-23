# Run Plex stats updater
py .\update_stats.py

# Commit + push if stats.json changed
git add stats.json

# If nothing changed, don't commit
$diff = git diff --cached --name-only
if (-not $diff) {
  Write-Host "No changes to commit."
  exit 0
}

git commit -m "Update Plex stats"
git push