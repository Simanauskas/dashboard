#!/bin/sh
# Runs once, when the Postgres data directory is first created:
# one database per bridge, all owned by the same user as Synapse's.
set -e
for db in whatsapp telegram facebook instagram imessage; do
  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname postgres -c "CREATE DATABASE $db OWNER $POSTGRES_USER;"
done
