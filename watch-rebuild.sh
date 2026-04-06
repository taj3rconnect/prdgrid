#!/bin/bash
# Auto-rebuild prdgrid + copy to pulse + restart pulse-client on any source change
DIR="/home/admin/claude/prdgrid/src"
DEST="/home/admin/claude/pulse/react-client/node_modules/@jobtalk/datagrid"
LOCKFILE="/tmp/prdgrid-rebuild.lock"
DEBOUNCE=3

echo "[prdgrid-watch] Watching $DIR for changes..."

inotifywait -m -r -e modify,create,delete --format '%w%f' "$DIR" 2>/dev/null | while read FILE; do
    if [ -f "$LOCKFILE" ]; then
        AGE=$(( $(date +%s) - $(stat -c %Y "$LOCKFILE" 2>/dev/null || echo 0) ))
        if [ "$AGE" -lt "$DEBOUNCE" ]; then
            continue
        fi
    fi
    touch "$LOCKFILE"

    echo "[prdgrid-watch] $(date '+%H:%M:%S') Change detected: $FILE"
    echo "[prdgrid-watch] Rebuilding..."

    cd /home/admin/claude/prdgrid
    npm run build 2>&1 | tail -3

    if [ $? -eq 0 ]; then
        echo "[prdgrid-watch] Build OK. Copying dist to pulse node_modules..."
        rm -rf "$DEST"
        mkdir -p "$DEST"
        cp -r dist/* "$DEST/"
        cp package.json "$DEST/"

        echo "[prdgrid-watch] Clearing Vite cache + restarting pulse-client..."
        docker exec pulse-client rm -rf /app/node_modules/.vite 2>/dev/null
        docker restart pulse-client 2>/dev/null
        sleep 8
        HTTP=$(curl -s -o /dev/null -w "%{http_code}" https://pulsedgx.aptask.com/ 2>/dev/null)
        echo "[prdgrid-watch] $(date '+%H:%M:%S') Site status: $HTTP"
    else
        echo "[prdgrid-watch] BUILD FAILED — not restarting"
    fi
done
