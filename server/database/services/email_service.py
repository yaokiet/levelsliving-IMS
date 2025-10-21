# services/email_service.py

from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from sqlalchemy.orm import Session, selectinload
from typing import Optional
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


from config import settings, BASE_DIR
from database.database import SessionLocal # For creating a new DB session
from database.models.purchase_order import PurchaseOrder
from database.models.supplier import Supplier

# Configuration for fastapi-mail
# This block remains the same as it correctly loads from your config.
conf = ConnectionConfig(
    MAIL_USERNAME=settings.mail_username,
    MAIL_PASSWORD=settings.mail_password.get_secret_value(),
    MAIL_FROM=settings.mail_from,
    MAIL_PORT=settings.mail_port,
    MAIL_SERVER=settings.mail_server,
    MAIL_FROM_NAME=settings.mail_from_name,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
    TEMPLATE_FOLDER=BASE_DIR / 'templates',
)

async def send_purchase_order_email(
    po_id: int,
    pdf_attachment: Optional[bytes] = None,
    pdf_filename: Optional[str] = None
):
    """
    Sends a purchase order email with an optional PDF attachment.

    This function is designed to be run as a background task. It creates its
    own database session to fetch the necessary PO and Supplier details.

    Args:
        po_id: The ID of the purchase order to send.
        pdf_attachment: The PDF file content as bytes.
        pdf_filename: The desired filename for the PDF attachment.
    """
    logger.info(f"Background task started for PO ID: {po_id}") # Checkpoint 1: Task starts
    db: Session = SessionLocal()
    try:
        # 1. Fetch the Purchase Order and its related items and supplier
        po = (
            db.query(PurchaseOrder)
            .options(selectinload(PurchaseOrder.po_items)) # Eagerly load items
            .filter(PurchaseOrder.id == po_id)
            .first()
        )

        if not po:
            logger.error(f"PO ID {po_id} not found in database. Task ending.") # Error case
            return
            
        if not po.supplier_id:
            logger.error(f"PO {po_id} has no supplier linked. Task ending.") # Error case
            return
        
        logger.info(f"Successfully fetched PO {po_id}. Checking for supplier...") # Checkpoint 2: PO fetched


        # 2. Fetch the Supplier using the ID from the Purchase Order
        supplier = db.query(Supplier).filter(Supplier.id == po.supplier_id).first()
        
        if not supplier:
            logger.error(f"Supplier for PO {po_id} not found or has no email. Task ending.") # Error case
            return
            
        if not supplier.email:
            logger.error(f"Supplier for PO {po_id} not found or has no email. Task ending.") # Error case
            return

        logger.info(f"Successfully fetched Supplier {po_id}. Creating email...") 

        # 3. Prepare the email content and attachments
        template_context = {
            "po": po,
            "supplier": supplier,
            "settings": settings,
        }
        
        logger.info(f"Successfully created template") 

        # attachments = []
        # if pdf_attachment and pdf_filename:
        #     attachments.append({
        #         "file": pdf_attachment,
        #         "headers": {
        #             "Content-Disposition": f"attachment; filename=\"{pdf_filename}\""
        #         },
        #         "mime_type": "application",
        #         "mime_subtype": "pdf"
        #     })
        

        message = MessageSchema(
            subject=f"New Purchase Order from {settings.mail_from_name} - #{po.id}",
            recipients=[supplier.email],
            template_body=template_context,
            subtype="html",
        )
        
        logger.info(f"Successfully created message. Sending Email...") 


        # 4. Send the email
        fm = FastMail(conf)
        logger.info(f"fm is {fm}") 

        try:
            await fm.send_message(message, template_name="purchase_order_email.html")
            logger.info(f"SUCCESS: Email for PO #{po.id} sent to {supplier.email}")
        except Exception as e:
            # This will now catch any error from the send_message call
            logger.error(f"ERROR: Email for PO #{po.id} not sent to {supplier.email}")

    except Exception as e:
        logger.exception(f"An unexpected error occurred for PO #{po_id}: {e}")
    finally:
        # 5. Always close the database session
        db.close()
        logger.info(f"BACKGROUND TASK FINISHED for PO ID: {po_id}")

        
        