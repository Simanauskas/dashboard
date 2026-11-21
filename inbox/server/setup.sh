#!/usr/bin/env bash
# One-time setup for the Inbox server. Safe to re-run: it only creates what's
# missing and re-applies the settings it owns.
#
#   cp .env.example .env   # fill it in
#   ./setup.sh
#
# Needs only Docker (with the compose plugin). Works on Linux and macOS.
set -euo pipefail
cd "$(dirname "$0")"

say() { printf '\n\033[1m==> %s\033[0m\n' "$*"; }
die() { printf '\033[31mError: %s\033[0m\n' "$*" >&2; exit 1; }

command -v docker >/dev/null || die "Docker isn't installed."
docker compose version >/dev/null 2>&1 || die "The Docker compose plugin isn't installed."
[ -f .env ] || { cp .env.example .env; die "Created .env. Fill it in, then run ./setup.sh again."; }

set -a; . ./.env; set +a
: "${SERVER_NAME:?set SERVER_NAME in .env}" "${MATRIX_HOST:?set MATRIX_HOST in .env}" "${ADMIN_USER:?set ADMIN_USER in .env}"
BRIDGES=${BRIDGES-whatsapp telegram facebook instagram}
SYNAPSE_IMAGE=${SYNAPSE_IMAGE:-matrixdotorg/synapse:latest}

rand() { openssl rand -hex 24 2>/dev/null || LC_ALL=C tr -dc 'a-f0-9' </dev/urandom | head -c 48; }
setenv() {  # write KEY=VALUE into .env (replacing any existing line)
  if grep -q "^$1=" .env; then sed -i.bak "s|^$1=.*|$1=$2|" .env && rm -f .env.bak; else echo "$1=$2" >>.env; fi
}

if [ -z "${POSTGRES_PASSWORD:-}" ]; then POSTGRES_PASSWORD=$(rand); setenv POSTGRES_PASSWORD "$POSTGRES_PASSWORD"; fi
if [[ " $BRIDGES " == *" telegram "* ]] && [ -z "${TELEGRAM_API_ID:-}" ]; then
  echo "TELEGRAM_API_ID is empty, so Telegram is skipped for now (get keys at https://my.telegram.org/apps)."
  BRIDGES=$(echo " $BRIDGES " | sed 's/ telegram / /' | xargs)
fi
profiles=$BRIDGES
[ -n "${CLOUDFLARE_TUNNEL_TOKEN:-}" ] && profiles="$profiles tunnel"
COMPOSE_PROFILES=$(echo $profiles | tr ' ' ',')
setenv COMPOSE_PROFILES "$COMPOSE_PROFILES"
export COMPOSE_PROFILES POSTGRES_PASSWORD

DATA="$PWD/data"
mkdir -p "$DATA"/{synapse,postgres}
# Helpers that run inside containers, so file ownership never gets in the way.
yq() { docker run --rm -i --user root -v "$DATA:/data" -e SERVER_NAME -e MATRIX_HOST -e ADMIN_USER -e POSTGRES_PASSWORD -e DP_TOKEN -e TELEGRAM_API_ID -e TELEGRAM_API_HASH mikefarah/yq:4 "$@"; }
inside() { docker run --rm -i -v "$DATA:/data" alpine:3 sh -c "$1"; }

# --- Synapse ---------------------------------------------------------------
if [ ! -f "$DATA/synapse/homeserver.yaml" ]; then
  say "Generating the Matrix server config for $SERVER_NAME"
  docker run --rm -v "$DATA/synapse:/data" -e SYNAPSE_SERVER_NAME="$SERVER_NAME" -e SYNAPSE_REPORT_STATS=no "$SYNAPSE_IMAGE" generate
fi

# Double puppeting: lets each bridge show messages you send from your phone as
# coming from you (instead of from a "ghost" of you).
if [ ! -f "$DATA/synapse/doublepuppet.yaml" ]; then
  cat <<EOF | inside 'cat > /data/synapse/doublepuppet.yaml && chmod 644 /data/synapse/doublepuppet.yaml'
id: doublepuppet
url: null
as_token: "$(rand)"
hs_token: "$(rand)"
sender_localpart: "$(rand)"
rate_limited: false
namespaces:
  users:
    - regex: '@.*:$(printf '%s' "$SERVER_NAME" | sed 's/\./\\./g')'
      exclusive: false
EOF
fi
DP_TOKEN=$(yq '.as_token' /data/synapse/doublepuppet.yaml)
export DP_TOKEN

# --- Bridges ---------------------------------------------------------------
regs='"/data/doublepuppet.yaml"'
port_of() { case $1 in whatsapp) echo 29318 ;; telegram) echo 29317 ;; facebook) echo 29319 ;; instagram) echo 29330 ;; esac; }
image_of() {
  case $1 in
    whatsapp) echo "${WHATSAPP_IMAGE:-dock.mau.dev/mautrix/whatsapp:latest}" ;;
    telegram) echo "${TELEGRAM_IMAGE:-dock.mau.dev/mautrix/telegram:latest}" ;;
    facebook) echo "${META_IMAGE:-dock.mau.dev/mautrix/meta:latest}" ;;
    instagram) echo "${INSTAGRAM_IMAGE:-dock.mau.dev/mautrix/meta:ig-latest}" ;;
  esac
}
extra_of() {
  case $1 in
    # ask the phone for a year of history instead of three months
    whatsapp) echo '| .network.history_sync.request_full_sync = true' ;;
    telegram) echo '| .network.api_id = env(TELEGRAM_API_ID) | .network.api_hash = strenv(TELEGRAM_API_HASH)' ;;
    *) echo '' ;;
  esac
}

for b in $BRIDGES; do
  port=$(port_of "$b") || true
  [ -n "$port" ] || die "Unknown bridge '$b' in BRIDGES."
  image=$(image_of "$b")
  mkdir -p "$DATA/$b"
  if [ ! -f "$DATA/$b/config.yaml" ]; then
    say "Generating the $b bridge config"
    docker run --rm -v "$DATA/$b:/data" "$image" || true
    [ -f "$DATA/$b/config.yaml" ] || die "The $b bridge didn't create a config file."
  fi
  say "Configuring the $b bridge"
  yq -i "
    .homeserver.address = \"http://synapse:8008\" |
    .homeserver.domain = strenv(SERVER_NAME) |
    .appservice.address = \"http://$b:$port\" |
    .appservice.hostname = \"0.0.0.0\" |
    .appservice.port = $port |
    .appservice.id = \"$b\" |
    .appservice.bot.username = \"${b}bot\" |
    .appservice.username_template = \"${b}_{{.}}\" |
    .database.type = \"postgres\" |
    .database.uri = \"postgres://synapse:\" + strenv(POSTGRES_PASSWORD) + \"@postgres/$b?sslmode=disable\" |
    .bridge.permissions = {} |
    .bridge.permissions[strenv(SERVER_NAME)] = \"user\" |
    .bridge.permissions[\"@\" + strenv(ADMIN_USER) + \":\" + strenv(SERVER_NAME)] = \"admin\" |
    .bridge.personal_filtering_spaces = false |
    .double_puppet.servers = {} |
    .double_puppet.secrets = {} |
    .double_puppet.secrets[strenv(SERVER_NAME)] = \"as_token:\" + strenv(DP_TOKEN) |
    .encryption.allow = false |
    .backfill.enabled = true |
    .backfill.max_initial_messages = 1000
    $(extra_of "$b")
  " "/data/$b/config.yaml"
  if [ ! -f "$DATA/$b/registration.yaml" ]; then
    docker run --rm -v "$DATA/$b:/data" "$image" || true
    [ -f "$DATA/$b/registration.yaml" ] || die "The $b bridge didn't create a registration file."
  fi
  inside "cp /data/$b/registration.yaml /data/synapse/$b-registration.yaml && chmod 644 /data/synapse/$b-registration.yaml"
  regs="$regs, \"/data/$b-registration.yaml\""
done

say "Configuring Synapse"
yq -i "
  .database = {\"name\": \"psycopg2\", \"args\": {\"user\": \"synapse\", \"password\": strenv(POSTGRES_PASSWORD), \"database\": \"synapse\", \"host\": \"postgres\", \"cp_min\": 5, \"cp_max\": 10}} |
  .listeners = [{\"port\": 8008, \"tls\": false, \"type\": \"http\", \"x_forwarded\": true, \"bind_addresses\": [\"0.0.0.0\"], \"resources\": [{\"names\": [\"client\"], \"compress\": false}]}] |
  .public_baseurl = \"https://\" + strenv(MATRIX_HOST) + \"/\" |
  .federation_domain_whitelist = [] |
  .trusted_key_servers = [] |
  .suppress_key_server_warning = true |
  .presence.enabled = false |
  .enable_registration = false |
  .enable_authenticated_media = true |
  .max_upload_size = \"100M\" |
  .url_preview_enabled = false |
  .app_service_config_files = [$regs]
" /data/synapse/homeserver.yaml

# --- Start -----------------------------------------------------------------
say "Starting the database and Matrix server"
docker compose up -d --wait postgres synapse

if [ ! -f "$DATA/.admin-created" ]; then
  say "Creating your account @$ADMIN_USER:$SERVER_NAME"
  if [ -n "${ADMIN_PASSWORD:-}" ]; then
    docker compose exec -T synapse register_new_matrix_user -c /data/homeserver.yaml -u "$ADMIN_USER" -p "$ADMIN_PASSWORD" -a http://localhost:8008
  else
    docker compose exec synapse register_new_matrix_user -c /data/homeserver.yaml -u "$ADMIN_USER" -a http://localhost:8008
  fi
  touch "$DATA/.admin-created"
fi

say "Starting everything ($COMPOSE_PROFILES)"
docker compose up -d

cat <<EOF

Done. Your Matrix server is running.

  Sign in to the Inbox app with:
    Server:   https://$MATRIX_HOST
    Username: $ADMIN_USER

  Then open Settings → Connected apps to log in to each chat app.
  Logs: docker compose logs -f <service>   (synapse, ${BRIDGES// /, })
EOF
