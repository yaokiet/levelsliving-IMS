import os
import time
from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError

# Load DB URL
DATABASE_URL = os.getenv("DATABASE_URL")

# Wait for the DB to be ready (up to 10 tries, every 2s)
for i in range(10):
    try:
        engine = create_engine(DATABASE_URL)
        conn = engine.connect()
        conn.close()
        print("✅ Database connection successful.")
        break
    except OperationalError as e:
        print(f"[{i+1}/10] 🔄 Waiting for database... ({e})")
        time.sleep(2)
else:
    raise Exception("❌ Database connection failed after 10 attempts.")

# Only import once engine is ready
from database.database import Base, engine, SessionLocal
from database.models.user import User
from database.models.item import Item

# Create all tables
Base.metadata.create_all(bind=engine)

# Open DB session
db = SessionLocal()

# Seed admin user if not present
if not db.query(User).filter_by(email="admin@admin.com").first():
    admin_user = User(
        name="admintest",
        role="admin",
        email="admin@admin.com",
        password_hash="$2b$12$ZJBiZryNQ9vjT6D3JjjIyORvbTubY7/J4Dk.2BhjLb6NcxRwmYwSO"
    )
    db.add(admin_user)
    print("✅ Admin user seeded.")
else:
    print("ℹ️ Admin user already exists.")

# Seed items if not already in the table
if db.query(Item).count() == 0:
    sample_items = [
        Item(id=1, sku='CHAIR-001', type='Furniture', item_name='Office Chair', variant='Black', qty=15, threshold_qty=10),
        Item(id=2, sku='DESK-001', type='Furniture', item_name='Standing Desk', variant='Oak', qty=8, threshold_qty=5),
        Item(id=3, sku='MONITOR-001', type='Electronics', item_name='27-inch Monitor', variant='Silver', qty=3, threshold_qty=5),
        Item(id=4, sku='KEYBOARD-001', type='Electronics', item_name='Mechanical Keyboard', variant=None, qty=12, threshold_qty=8),
        Item(id=5, sku='MOUSE-001', type='Electronics', item_name='Wireless Mouse', variant='Black', qty=7, threshold_qty=10),
        Item(id=6, sku='LAMP-001', type='Lighting', item_name='Desk Lamp', variant='White', qty=20, threshold_qty=15),
    ]
    db.add_all(sample_items)
    print("✅ Items seeded.")
else:
    print("ℹ️ Items already exist.")

db.commit()
db.close()
