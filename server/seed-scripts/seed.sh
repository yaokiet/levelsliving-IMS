#!/bin/sh
set -e

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

echo "============================================================"
echo "STARTING DATABASE SEEDING PROCESS"
echo "============================================================"

# ------------------ ORDER SEEDING ------------------
log "[ORDER] Starting seed script: seed-scripts/fetch_data_order.py"
python seed-scripts/fetch_data_order.py
log "[ORDER] Seed completed successfully."

# ------------------ SUPPLIER SEEDING ------------------
log "[SUPPLIER] Starting seed script: seed-scripts/fetch_data_supplier.py"
python seed-scripts/fetch_data_supplier.py
log "[SUPPLIER] Seed completed successfully."

# ------------------ CLEANUP ------------------
if [ -d "seed-scripts/tmp" ]; then
    log "[CLEANUP] Removing temporary files in seed-scripts/tmp"
    rm -rf seed-scripts/tmp/*
    log "[CLEANUP] Temporary files removed."
else
    log "[CLEANUP] No tmp directory found, skipping."
fi

echo "============================================================"
echo "============================================================"
