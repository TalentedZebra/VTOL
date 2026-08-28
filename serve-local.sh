#!/usr/bin/env bash
# Serve this repo locally so relative paths behave exactly like GitHub Pages,
# and open it in the default browser.
set -e

cd "$(dirname "${BASH_SOURCE[0]}")"

PORT="${1:-8000}"
URL="http://localhost:${PORT}/"

open_browser() {
  sleep 1
  if command -v start >/dev/null 2>&1; then
    start "" "$URL"                       # Windows (Git Bash)
  elif command -v open >/dev/null 2>&1; then
    open "$URL"                           # macOS
  elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$URL"                       # Linux
  else
    echo "Open $URL in your browser."
  fi
}

open_browser &

echo "Serving $(pwd) at $URL (Ctrl+C to stop)"

if command -v python3 >/dev/null 2>&1; then
  python3 -m http.server "$PORT"
elif command -v python >/dev/null 2>&1; then
  python -m http.server "$PORT"
else
  npx --yes serve -l "$PORT" .
fi
