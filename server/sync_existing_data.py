"""
Script to sync existing database data to Google Sheets.
Run this after Docker startup to sync all existing suppliers and items.
"""

import logging
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session

from database.database import SessionLocal
from database.models.supplier import Supplier
from database.models.item import Item
from config import settings

# Singapore timezone (UTC+8)
SGT = timezone(timedelta(hours=8))

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Import Google Sheets client
try:
    from app.utils.google_sheets import get_google_sheets_client
    GOOGLE_SHEETS_AVAILABLE = True
except ImportError:
    GOOGLE_SHEETS_AVAILABLE = False
    logger.warning("Google Sheets integration not available")


def sync_all_suppliers(db: Session):
    """Sync all existing suppliers to Google Sheets"""
    if not GOOGLE_SHEETS_AVAILABLE:
        logger.warning("Skipping supplier sync - Google Sheets not available")
        return
    
    if not settings.GOOGLE_SHEETS_ENABLED:
        logger.warning("Skipping supplier sync - Google Sheets integration disabled")
        return
    
    try:
        logger.info("Starting supplier sync to Google Sheets...")
        
        # Get Google Sheets client
        sheets_client = get_google_sheets_client(
            settings.GOOGLE_SHEETS_CREDENTIALS_PATH,
            settings.GOOGLE_SHEETS_SPREADSHEET_ID
        )
        
        # Fetch all suppliers from database
        suppliers = db.query(Supplier).all()
        logger.info(f"Found {len(suppliers)} suppliers to sync")
        
        synced_count = 0
        failed_count = 0
        
        for supplier in suppliers:
            try:
                # Prepare supplier data
                supplier_data = {
                    'id': supplier.id,
                    'name': supplier.name,
                    'description': supplier.description or '',
                    'email': supplier.email,
                    'contact_number': supplier.contact_number or '',
                    'created_at': getattr(supplier, 'created_at', datetime.now(SGT)),
                    'updated_at': getattr(supplier, 'updated_at', datetime.now(SGT))
                }
                
                # Sync to Google Sheets
                success = sheets_client.sync_supplier_create(supplier_data)
                
                if success:
                    synced_count += 1
                    logger.info(f"✓ Synced supplier: {supplier.name} (ID: {supplier.id})")
                else:
                    failed_count += 1
                    logger.warning(f"✗ Failed to sync supplier: {supplier.name} (ID: {supplier.id})")
                    
            except Exception as e:
                failed_count += 1
                logger.error(f"✗ Error syncing supplier {supplier.name} (ID: {supplier.id}): {str(e)}")
        
        logger.info(f"Supplier sync complete: {synced_count} succeeded, {failed_count} failed")
        
    except Exception as e:
        logger.error(f"Error during supplier sync: {str(e)}", exc_info=True)


def sync_all_items(db: Session):
    """Sync all existing items to Google Sheets"""
    if not GOOGLE_SHEETS_AVAILABLE:
        logger.warning("Skipping item sync - Google Sheets not available")
        return
    
    if not settings.GOOGLE_SHEETS_ENABLED:
        logger.warning("Skipping item sync - Google Sheets integration disabled")
        return
    
    try:
        logger.info("Starting item sync to Google Sheets...")
        
        # Get Google Sheets client
        sheets_client = get_google_sheets_client(
            settings.GOOGLE_SHEETS_CREDENTIALS_PATH,
            settings.GOOGLE_SHEETS_SPREADSHEET_ID
        )
        
        # Fetch all items from database
        items = db.query(Item).all()
        logger.info(f"Found {len(items)} items to sync")
        
        synced_count = 0
        failed_count = 0
        
        for item in items:
            try:
                # Prepare item data
                item_data = {
                    'id': item.id,
                    'sku': item.sku,
                    'type': item.type,
                    'item_name': item.item_name,
                    'variant': item.variant or '',
                    'qty': item.qty,
                    'threshold_qty': item.threshold_qty,
                    'created_at': getattr(item, 'created_at', datetime.now(SGT)),
                    'updated_at': getattr(item, 'updated_at', datetime.now(SGT))
                }
                
                # Sync to Google Sheets
                success = sheets_client.sync_item_create(item_data)
                
                if success:
                    synced_count += 1
                    logger.info(f"✓ Synced item: {item.item_name} (SKU: {item.sku})")
                else:
                    failed_count += 1
                    logger.warning(f"✗ Failed to sync item: {item.item_name} (SKU: {item.sku})")
                    
            except Exception as e:
                failed_count += 1
                logger.error(f"✗ Error syncing item {item.item_name} (SKU: {item.sku}): {str(e)}")
        
        logger.info(f"Item sync complete: {synced_count} succeeded, {failed_count} failed")
        
    except Exception as e:
        logger.error(f"Error during item sync: {str(e)}", exc_info=True)


def main():
    """Main function to sync all existing data"""
    logger.info("=" * 80)
    logger.info("STARTING DATABASE TO GOOGLE SHEETS SYNC")
    logger.info("=" * 80)
    
    # Check if Google Sheets is enabled
    if not GOOGLE_SHEETS_AVAILABLE:
        logger.error("Google Sheets integration not available. Please install required packages.")
        return
    
    if not settings.GOOGLE_SHEETS_ENABLED:
        logger.warning("Google Sheets integration is disabled in settings. Exiting.")
        return
    
    # Create database session
    db: Session = SessionLocal()
    
    try:
        # Sync suppliers
        sync_all_suppliers(db)
        
        # Sync items
        sync_all_items(db)
        
        logger.info("=" * 80)
        logger.info("SYNC COMPLETE!")
        logger.info("=" * 80)
        
    except Exception as e:
        logger.error(f"Fatal error during sync: {str(e)}", exc_info=True)
    finally:
        db.close()


if __name__ == "__main__":
    main()
