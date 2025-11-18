from sqlalchemy.orm import Session
from database.models.supplier import Supplier
from database.schemas.supplier import SupplierCreate, SupplierUpdate
from typing import List
from sqlalchemy import func
from database.models.supplier_item import SupplierItem
import logging
from config import settings
from datetime import datetime, timezone, timedelta

# Singapore timezone (UTC+8)
SGT = timezone(timedelta(hours=8))

# Import Google Sheets client
try:
    from app.utils.google_sheets import get_google_sheets_client
    GOOGLE_SHEETS_AVAILABLE = True
except ImportError:
    GOOGLE_SHEETS_AVAILABLE = False
    logging.warning("Google Sheets integration not available")

logger = logging.getLogger(__name__)

def get_supplier(db: Session, supplier_id: int):
    return db.query(Supplier).filter(Supplier.id == supplier_id).first()

def get_supplier_by_name(db: Session, name: str):
    return db.query(Supplier).filter(Supplier.name == name).first()

def get_all_suppliers(db: Session):
    return db.query(Supplier).all()

def create_supplier(db: Session, supplier: SupplierCreate):
    db_supplier = Supplier(**supplier.model_dump())
    db.add(db_supplier)
    db.commit()
    db.refresh(db_supplier)
    
    # Sync to Google Sheets if enabled
    print(f"[GOOGLE SHEETS] Checking sync settings...")
    print(f"[GOOGLE SHEETS] Available: {GOOGLE_SHEETS_AVAILABLE}")
    print(f"[GOOGLE SHEETS] Enabled: {settings.GOOGLE_SHEETS_ENABLED if hasattr(settings, 'GOOGLE_SHEETS_ENABLED') else 'NOT SET'}")
    
    if GOOGLE_SHEETS_AVAILABLE and settings.GOOGLE_SHEETS_ENABLED:
        try:
            print(f"[GOOGLE SHEETS] Attempting to sync new supplier: {db_supplier.name}")
            sheets_client = get_google_sheets_client(
                settings.GOOGLE_SHEETS_CREDENTIALS_PATH,
                settings.GOOGLE_SHEETS_SPREADSHEET_ID
            )
            supplier_data = {
                'id': db_supplier.id,
                'name': db_supplier.name,
                'description': db_supplier.description or '',
                'email': db_supplier.email,
                'contact_number': db_supplier.contact_number or '',
                'created_at': getattr(db_supplier, 'created_at', datetime.now(SGT)),
                'updated_at': getattr(db_supplier, 'updated_at', datetime.now(SGT))
            }
            success = sheets_client.sync_supplier_create(supplier_data)
            if success:
                print(f"[GOOGLE SHEETS] ✓ Successfully synced supplier '{db_supplier.name}' to Google Sheets")
            else:
                print(f"[GOOGLE SHEETS] ✗ Failed to sync supplier '{db_supplier.name}' to Google Sheets")
        except Exception as e:
            print(f"[GOOGLE SHEETS] ✗ ERROR syncing supplier create: {str(e)}")
            logger.error(f"Failed to sync supplier create to Google Sheets: {e}", exc_info=True)
            # Don't fail the request if Google Sheets sync fails
    else:
        if not GOOGLE_SHEETS_AVAILABLE:
            print(f"[GOOGLE SHEETS] Skipping sync - Google Sheets integration not available")
        elif not settings.GOOGLE_SHEETS_ENABLED:
            print(f"[GOOGLE SHEETS] Skipping sync - Google Sheets integration disabled in settings")
    
    return db_supplier

def update_supplier(db: Session, supplier_id: int, supplier: SupplierUpdate):
    db_supplier = db.query(Supplier).filter(Supplier.id == supplier_id).first()
    if db_supplier:
        update_data = supplier.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_supplier, key, value)
        db.commit()
        db.refresh(db_supplier)
        
        # Sync to Google Sheets if enabled
        print(f"[GOOGLE SHEETS] Attempting to update supplier in Google Sheets...")
        if GOOGLE_SHEETS_AVAILABLE and settings.GOOGLE_SHEETS_ENABLED:
            try:
                print(f"[GOOGLE SHEETS] Syncing update for supplier: {db_supplier.name}")
                sheets_client = get_google_sheets_client(
                    settings.GOOGLE_SHEETS_CREDENTIALS_PATH,
                    settings.GOOGLE_SHEETS_SPREADSHEET_ID
                )
                supplier_data = {
                    'id': db_supplier.id,
                    'name': db_supplier.name,
                    'description': db_supplier.description or '',
                    'email': db_supplier.email,
                    'contact_number': db_supplier.contact_number or '',
                    'created_at': getattr(db_supplier, 'created_at', datetime.now(SGT)),
                    'updated_at': getattr(db_supplier, 'updated_at', datetime.now(SGT))
                }
                success = sheets_client.sync_supplier_update(supplier_data)
                if success:
                    print(f"[GOOGLE SHEETS] ✓ Successfully updated supplier '{db_supplier.name}' in Google Sheets")
                else:
                    print(f"[GOOGLE SHEETS] ✗ Failed to update supplier '{db_supplier.name}' in Google Sheets")
            except Exception as e:
                print(f"[GOOGLE SHEETS] ✗ ERROR syncing supplier update: {str(e)}")
                logger.error(f"Failed to sync supplier update to Google Sheets: {e}", exc_info=True)
                # Don't fail the request if Google Sheets sync fails
        else:
            print(f"[GOOGLE SHEETS] Skipping update sync - integration not enabled")
    
    return db_supplier

def delete_supplier(db: Session, supplier_id: int):
    db_supplier = db.query(Supplier).filter(Supplier.id == supplier_id).first()
    if db_supplier:
        # Sync delete to Google Sheets before deleting from DB
        print(f"[GOOGLE SHEETS] Attempting to delete supplier from Google Sheets...")
        if GOOGLE_SHEETS_AVAILABLE and settings.GOOGLE_SHEETS_ENABLED:
            try:
                print(f"[GOOGLE SHEETS] Syncing delete for supplier ID: {supplier_id}")
                sheets_client = get_google_sheets_client(
                    settings.GOOGLE_SHEETS_CREDENTIALS_PATH,
                    settings.GOOGLE_SHEETS_SPREADSHEET_ID
                )
                success = sheets_client.sync_supplier_delete(supplier_id)
                if success:
                    print(f"[GOOGLE SHEETS] ✓ Successfully deleted supplier ID {supplier_id} from Google Sheets")
                else:
                    print(f"[GOOGLE SHEETS] ✗ Failed to delete supplier ID {supplier_id} from Google Sheets")
            except Exception as e:
                print(f"[GOOGLE SHEETS] ✗ ERROR syncing supplier delete: {str(e)}")
                logger.error(f"Failed to sync supplier delete to Google Sheets: {e}", exc_info=True)
                # Don't fail the request if Google Sheets sync fails
        else:
            print(f"[GOOGLE SHEETS] Skipping delete sync - integration not enabled")
        
        db.delete(db_supplier)
        db.commit()
    return db_supplier

# new endpoint to get suppliers by item IDs
def get_suppliers_by_items(db: Session, item_ids: List[int]) -> List[Supplier]:
    """
    Finds all suppliers who stock EVERY item from the provided list of item IDs.

    Returns an empty list if no suppliers match or if the item_ids list is empty.
    """
    # Ensure the list is not empty and contains unique IDs
    unique_item_ids = sorted(list(set(item_ids)))
    num_items = len(unique_item_ids)

    if not num_items:
        return []

    # This subquery finds the IDs of suppliers who have a count of matching items
    # equal to the total number of unique items required.
    matching_supplier_ids = (
        db.query(SupplierItem.supplier_id)
          .filter(SupplierItem.item_id.in_(unique_item_ids))
          .group_by(SupplierItem.supplier_id)
          .having(func.count(SupplierItem.item_id) == num_items)
    ).subquery()

    # Fetch the full Supplier objects for the matching IDs
    return (
        db.query(Supplier)
          .filter(Supplier.id.in_(matching_supplier_ids))
          .all()
    )
