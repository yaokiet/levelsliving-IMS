#!/bin/bash
# Usage: ./migratedown.sh
# Loads DATABASE_URL from .env only

set -a
[ -f ../.env ] && source ../.env
set +a

if [ -z "$DATABASE_URL" ]; then
  echo "Error: DATABASE_URL is not set in .env"
  exit 1
fi

psql "$DATABASE_URL" <<'EOSQL'
DROP TABLE IF EXISTS cart_item CASCADE;
DROP TABLE IF EXISTS cart CASCADE;
DROP TABLE IF EXISTS user_session CASCADE;
DROP TABLE IF EXISTS order_item CASCADE;
DROP TABLE IF EXISTS "order" CASCADE;
DROP TABLE IF EXISTS purchase_order_item CASCADE;
DROP TABLE IF EXISTS purchase_order CASCADE;
DROP TABLE IF EXISTS item_component CASCADE;
DROP TABLE IF EXISTS supplier_item CASCADE;
DROP TABLE IF EXISTS item CASCADE;
DROP TABLE IF EXISTS supplier CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;