#!/usr/bin/env bash
# Wipe and reseed the local dev server: Synapse on :8008, user simas / test1234.
set -euo pipefail
cd "$(dirname "$0")"
if [ ! -f data/homeserver.yaml ]; then ./init.sh; fi
docker rm -f inbox-dev-synapse >/dev/null 2>&1 || true
rm -rf data/homeserver.db* data/media_store data/mock-state.json
docker run -d --name inbox-dev-synapse -p 8008:8008 -v "$PWD/data:/data" matrixdotorg/synapse:latest >/dev/null
for i in $(seq 1 60); do curl -sf localhost:8008/health >/dev/null && break; sleep 1; done
docker exec inbox-dev-synapse register_new_matrix_user -c /data/homeserver.yaml -u simas -p test1234 -a http://localhost:8008 >/dev/null
python3 mockbridge.py seed >/dev/null
echo "dev server ready: http://localhost:8008  (simas / test1234)"
