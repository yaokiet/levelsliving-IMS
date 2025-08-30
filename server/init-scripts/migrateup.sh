#!/bin/bash
# Usage: ./migrateup.sh
# Loads DATABASE_URL from .env only

set -a
[ -f ../.env ] && source ../.env
set +a

if [ -z "$DATABASE_URL" ]; then
  echo "Error: DATABASE_URL is not set in .env"
  exit 1
fi

psql "$DATABASE_URL" -f "$(dirname "$0")/1_init.sql"
psql "$DATABASE_URL" -f "$(dirname "$0")/2_seed.sql"