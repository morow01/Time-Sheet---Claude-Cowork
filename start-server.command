#!/bin/bash
# Double-click this file to start the Rian local server on port 3000.
# Closing the Terminal window stops the server.

cd "$(dirname "$0")"

# Open the app in the default browser after a short delay
(sleep 1 && open "http://localhost:3000/app.html") &

echo "Starting Rian local server at http://localhost:3000/app.html"
echo "Close this window (or press Ctrl+C) to stop the server."
echo ""

python3 -m http.server 3000
