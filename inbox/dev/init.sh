#!/usr/bin/env bash
# One-time: generate the dev Synapse config and the mock bridge registration.
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p data
docker run --rm -v "$PWD/data:/data" -e SYNAPSE_SERVER_NAME=inbox.test -e SYNAPSE_REPORT_STATS=no matrixdotorg/synapse:latest generate >/dev/null
python3 - <<'PY'
import secrets
p = 'data/homeserver.yaml'
s = open(p).read()
s = s.replace("  - port: 8008\n", "  - port: 8008\n    bind_addresses: ['0.0.0.0']\n", 1)
s += """
# --- dev additions ---
app_service_config_files:
  - /data/mockbridge.yaml
rc_message: {per_second: 1000, burst_count: 1000}
rc_login: {address: {per_second: 1000, burst_count: 1000}, account: {per_second: 1000, burst_count: 1000}, failed_attempts: {per_second: 1000, burst_count: 1000}}
rc_joins: {local: {per_second: 1000, burst_count: 1000}}
rc_invites: {per_room: {per_second: 1000, burst_count: 1000}, per_user: {per_second: 1000, burst_count: 1000}}
enable_authenticated_media: true
"""
open(p, 'w').write(s)
open('data/mockbridge.yaml', 'w').write(f'''id: mockbridge
url: null
as_token: "{secrets.token_hex(24)}"
hs_token: "{secrets.token_hex(24)}"
sender_localpart: mockbridgebot
rate_limited: false
namespaces:
  users:
    - exclusive: true
      regex: "@(whatsapp|telegram|instagram|facebook|imessage)(bot|_.*):inbox\\\\.test"
    - exclusive: false
      regex: "@simas:inbox\\\\.test"
  aliases: []
  rooms: []
''')
PY
