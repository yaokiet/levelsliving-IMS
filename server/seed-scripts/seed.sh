#!/bin/sh
set -e

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

echo "============================================================"
echo "STARTING DATABASE SEEDING PROCESS"
echo "============================================================"

# ------------------ USER SEEDING ------------------
log "[USER] Starting seed script: seed-scripts/fetch_user.py"
python seed-scripts/fetch_user.py
log "[USER] Seed completed successfully."

# ------------------ SUPPLIERS SEEDING ------------------
log "[SUPPLIER] Starting seed script: seed-scripts/fetch_supplier.py"
python seed-scripts/fetch_supplier.py
log "[SUPPLIER] Seed completed successfully."

# ------------------ ITEM SEEDING ------------------
log "[ITEM] Starting seed script: seed-scripts/fetch_item.py"
python seed-scripts/fetch_item.py
log "[ITEM] Seed completed successfully."

# ------------------ ITEM COMPONENT SEEDING ------------------
log "[ITEM COMPONENT] Starting seed script: seed-scripts/fetch_item_component.py"
python seed-scripts/fetch_item_component.py
log "[ITEM COMPONENT] Seed completed successfully."

# ------------------ SUPPLIER ITEM SEEDING ------------------
log "[SUPPLIER ITEM] Starting seed script: seed-scripts/fetch_supplier_item.py"
python seed-scripts/fetch_supplier_item.py
log "[SUPPLIER ITEM] Seed completed successfully."

# ------------------ PURCHASE ORDER SEEDING ------------------
log "[PO] Starting seed script: seed-scripts/fetch_purchase_order.py"
python seed-scripts/fetch_purchase_order.py
log "[PO] Seed completed successfully."

# ------------------ PURCHASE ORDER ITEM SEEDING ------------------
log "[PO ITEM] Starting seed script: seed-scripts/fetch_purchase_order_item.py"
python seed-scripts/fetch_purchase_order_item.py
log "[PO ITEM] Seed completed successfully."

# ------------------ ORDER SEEDING ------------------
log "[ORDER] Starting seed script: seed-scripts/fetch_order.py"
python seed-scripts/fetch_order.py
log "[ORDER] Seed completed successfully."

# ------------------ ORDER ITEM SEEDING ------------------
log "[ORDER ITEM] Starting seed script: seed-scripts/fetch_order_item.py"
python seed-scripts/fetch_order_item.py
log "[ORDER ITEM] Seed completed successfully."

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
