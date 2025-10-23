"""
Google Sheets Integration Utility
Handles syncing data between the IMS database and Google Sheets
"""

import logging
from typing import Optional, List, Dict, Any
from pathlib import Path

import gspread
from google.oauth2.service_account import Credentials
from gspread.exceptions import SpreadsheetNotFound, APIError

logger = logging.getLogger(__name__)

class GoogleSheetsClient:
    """Client for managing Google Sheets operations"""
    
    def __init__(self, credentials_path: str, sheet_id: str):
        """
        Initialize Google Sheets client
        
        Args:
            credentials_path: Path to Google service account JSON credentials
            sheet_id: The ID of the Google Spreadsheet
        """
        self.credentials_path = credentials_path
        self.sheet_id = sheet_id
        self._client = None
        self._spreadsheet = None
        
    def _get_client(self) -> gspread.Client:
        """Get or create authenticated gspread client"""
        if self._client is None:
            try:
                scopes = [
                    'https://www.googleapis.com/auth/spreadsheets',
                    'https://www.googleapis.com/auth/drive.file'
                ]
                creds = Credentials.from_service_account_file(
                    self.credentials_path,
                    scopes=scopes
                )
                self._client = gspread.authorize(creds)
                logger.info("Google Sheets client authenticated successfully")
            except Exception as e:
                logger.error(f"Failed to authenticate Google Sheets client: {e}")
                raise
        return self._client
    
    def _get_spreadsheet(self) -> gspread.Spreadsheet:
        """Get the spreadsheet instance"""
        if self._spreadsheet is None:
            try:
                client = self._get_client()
                self._spreadsheet = client.open_by_key(self.sheet_id)
                logger.info(f"Opened spreadsheet: {self._spreadsheet.title}")
            except SpreadsheetNotFound:
                logger.error(f"Spreadsheet with ID {self.sheet_id} not found")
                raise
            except Exception as e:
                logger.error(f"Failed to open spreadsheet: {e}")
                raise
        return self._spreadsheet
    
    def get_or_create_worksheet(self, worksheet_name: str, headers: List[str]) -> gspread.Worksheet:
        """
        Get existing worksheet or create a new one with headers
        
        Args:
            worksheet_name: Name of the worksheet (e.g., "Suppliers")
            headers: List of column headers
            
        Returns:
            gspread.Worksheet instance
        """
        try:
            spreadsheet = self._get_spreadsheet()
            
            # Try to get existing worksheet
            try:
                worksheet = spreadsheet.worksheet(worksheet_name)
                logger.info(f"Found existing worksheet: {worksheet_name}")
                
                # Check if headers exist, if not add them
                existing_headers = worksheet.row_values(1)
                if not existing_headers or existing_headers != headers:
                    worksheet.insert_row(headers, index=1)
                    logger.info(f"Updated headers for worksheet: {worksheet_name}")
                    
            except gspread.WorksheetNotFound:
                # Create new worksheet with headers
                worksheet = spreadsheet.add_worksheet(
                    title=worksheet_name,
                    rows=1000,
                    cols=len(headers)
                )
                worksheet.append_row(headers)
                logger.info(f"Created new worksheet: {worksheet_name}")
                
            return worksheet
            
        except Exception as e:
            logger.error(f"Failed to get/create worksheet {worksheet_name}: {e}")
            raise
    
    def create_supplier_sheet(self, supplier_data: Dict[str, Any]) -> Optional[str]:
        """
        Create a new Google Sheet file for a supplier
        
        Args:
            supplier_data: Dictionary containing supplier information
            
        Returns:
            URL of the created sheet, or None if failed
        """
        try:
            client = self._get_client()
            
            # Create a new spreadsheet
            supplier_name = supplier_data.get('name', 'Unnamed Supplier')
            sheet_title = f"Supplier - {supplier_name} (ID: {supplier_data.get('id', '')})"
            
            spreadsheet = client.create(sheet_title)
            
            # Get the first worksheet
            worksheet = spreadsheet.sheet1
            worksheet.update_title('Supplier Details')
            
            # Add supplier information in a structured format
            data = [
                ['Supplier Information', ''],
                ['', ''],
                ['Field', 'Value'],
                ['ID', str(supplier_data.get('id', ''))],
                ['Name', supplier_data.get('name', '')],
                ['Description', supplier_data.get('description', '')],
                ['Email', supplier_data.get('email', '')],
                ['Contact Number', supplier_data.get('contact_number', '')],
                ['Created At', str(supplier_data.get('created_at', ''))],
                ['Updated At', str(supplier_data.get('updated_at', ''))],
            ]
            
            # Write data to sheet
            worksheet.update('A1:B10', data)
            
            # Format the sheet
            worksheet.format('A1:B1', {
                'textFormat': {'bold': True, 'fontSize': 14},
                'horizontalAlignment': 'CENTER'
            })
            worksheet.format('A3:B3', {
                'textFormat': {'bold': True},
                'backgroundColor': {'red': 0.9, 'green': 0.9, 'blue': 0.9}
            })
            
            # Share with the original spreadsheet's folder (optional)
            sheet_url = spreadsheet.url
            logger.info(f"Created new Google Sheet for supplier: {supplier_name} at {sheet_url}")
            
            return sheet_url
            
        except Exception as e:
            logger.error(f"Failed to create supplier sheet: {e}")
            return None
    
    def sync_supplier_create(self, supplier_data: Dict[str, Any]) -> bool:
        """
        Sync a newly created supplier to Google Sheets
        Adds supplier to master list only (to save storage space)
        
        Args:
            supplier_data: Dictionary containing supplier information
            
        Returns:
            True if successful, False otherwise
        """
        try:
            # Only add to master suppliers list (no individual sheet to save storage)
            headers = ['ID', 'Name', 'Description', 'Email', 'Contact Number', 'Created At', 'Updated At']
            worksheet = self.get_or_create_worksheet('Suppliers', headers)
            
            # Prepare row data
            row = [
                supplier_data.get('id', ''),
                supplier_data.get('name', ''),
                supplier_data.get('description', ''),
                supplier_data.get('email', ''),
                supplier_data.get('contact_number', ''),
                str(supplier_data.get('created_at', '')),
                str(supplier_data.get('updated_at', ''))
            ]
            
            # Append new row
            worksheet.append_row(row)
            logger.info(f"Synced new supplier to Google Sheets: {supplier_data.get('name')}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to sync supplier create: {e}")
            return False
    
    def update_supplier_sheet(self, supplier_data: Dict[str, Any], sheet_url: str) -> bool:
        """
        Update an existing supplier's Google Sheet
        
        Args:
            supplier_data: Dictionary containing updated supplier information
            sheet_url: URL of the supplier's sheet
            
        Returns:
            True if successful, False otherwise
        """
        try:
            client = self._get_client()
            
            # Extract sheet ID from URL
            if '/d/' in sheet_url:
                sheet_id = sheet_url.split('/d/')[1].split('/')[0]
                spreadsheet = client.open_by_key(sheet_id)
                worksheet = spreadsheet.sheet1
                
                # Update the data
                data = [
                    ['Supplier Information', ''],
                    ['', ''],
                    ['Field', 'Value'],
                    ['ID', str(supplier_data.get('id', ''))],
                    ['Name', supplier_data.get('name', '')],
                    ['Description', supplier_data.get('description', '')],
                    ['Email', supplier_data.get('email', '')],
                    ['Contact Number', supplier_data.get('contact_number', '')],
                    ['Created At', str(supplier_data.get('created_at', ''))],
                    ['Updated At', str(supplier_data.get('updated_at', ''))],
                ]
                
                worksheet.update('A1:B10', data)
                logger.info(f"Updated supplier sheet: {supplier_data.get('name')}")
                return True
            else:
                logger.warning(f"Invalid sheet URL format: {sheet_url}")
                return False
                
        except Exception as e:
            logger.error(f"Failed to update supplier sheet: {e}")
            return False
    
    def sync_supplier_update(self, supplier_data: Dict[str, Any]) -> bool:
        """
        Update an existing supplier in Google Sheets
        Updates the master list only
        
        Args:
            supplier_data: Dictionary containing updated supplier information
            
        Returns:
            True if successful, False otherwise
        """
        try:
            headers = ['ID', 'Name', 'Description', 'Email', 'Contact Number', 'Created At', 'Updated At']
            worksheet = self.get_or_create_worksheet('Suppliers', headers)
            
            # Find the row with matching ID
            supplier_id = str(supplier_data.get('id', ''))
            cell = worksheet.find(supplier_id, in_column=1)
            
            if cell:
                # Update the master list row
                row_number = cell.row
                row = [
                    supplier_data.get('id', ''),
                    supplier_data.get('name', ''),
                    supplier_data.get('description', ''),
                    supplier_data.get('email', ''),
                    supplier_data.get('contact_number', ''),
                    str(supplier_data.get('created_at', '')),
                    str(supplier_data.get('updated_at', ''))
                ]
                
                worksheet.update(f'A{row_number}:G{row_number}', [row])
                logger.info(f"Updated supplier in Google Sheets: {supplier_data.get('name')}")
                return True
            else:
                # If not found, create new row
                logger.warning(f"Supplier ID {supplier_id} not found in sheet, creating new row")
                return self.sync_supplier_create(supplier_data)
                
        except Exception as e:
            logger.error(f"Failed to sync supplier update: {e}")
            return False
    
    def delete_supplier_sheet(self, sheet_url: str) -> bool:
        """
        Delete a supplier's individual Google Sheet
        
        Args:
            sheet_url: URL of the supplier's sheet to delete
            
        Returns:
            True if successful, False otherwise
        """
        try:
            if not sheet_url or sheet_url == 'N/A':
                return True
                
            client = self._get_client()
            
            # Extract sheet ID from URL
            if '/d/' in sheet_url:
                sheet_id = sheet_url.split('/d/')[1].split('/')[0]
                
                # Delete the spreadsheet
                try:
                    spreadsheet = client.open_by_key(sheet_id)
                    client.del_spreadsheet(sheet_id)
                    logger.info(f"Deleted supplier sheet: {sheet_id}")
                    return True
                except Exception as e:
                    logger.warning(f"Could not delete sheet {sheet_id}: {e}")
                    return False
            else:
                logger.warning(f"Invalid sheet URL format: {sheet_url}")
                return False
                
        except Exception as e:
            logger.error(f"Failed to delete supplier sheet: {e}")
            return False
    
    def sync_supplier_delete(self, supplier_id: int) -> bool:
        """
        Delete a supplier from Google Sheets
        Deletes the row from master list only
        
        Args:
            supplier_id: ID of the supplier to delete
            
        Returns:
            True if successful, False otherwise
        """
        try:
            headers = ['ID', 'Name', 'Description', 'Email', 'Contact Number', 'Created At', 'Updated At']
            worksheet = self.get_or_create_worksheet('Suppliers', headers)
            
            # Find and delete the row
            cell = worksheet.find(str(supplier_id), in_column=1)
            
            if cell:
                row_number = cell.row
                worksheet.delete_rows(row_number)
                logger.info(f"Deleted supplier from Google Sheets: ID {supplier_id}")
                return True
            else:
                logger.warning(f"Supplier ID {supplier_id} not found in sheet")
                return False
                
        except Exception as e:
            logger.error(f"Failed to sync supplier delete: {e}")
            return False
    
    def get_all_suppliers_from_sheet(self) -> List[Dict[str, Any]]:
        """
        Retrieve all suppliers from Google Sheets
        
        Returns:
            List of supplier dictionaries
        """
        try:
            headers = ['ID', 'Name', 'Description', 'Email', 'Contact Number', 'Created At', 'Updated At']
            worksheet = self.get_or_create_worksheet('Suppliers', headers)
            
            # Get all records as list of dictionaries
            records = worksheet.get_all_records()
            logger.info(f"Retrieved {len(records)} suppliers from Google Sheets")
            return records
            
        except Exception as e:
            logger.error(f"Failed to get suppliers from sheet: {e}")
            return []


# Singleton instance
_google_sheets_client: Optional[GoogleSheetsClient] = None


def get_google_sheets_client(credentials_path: str, sheet_id: str) -> GoogleSheetsClient:
    """
    Get or create GoogleSheetsClient singleton
    
    Args:
        credentials_path: Path to Google service account JSON credentials
        sheet_id: The ID of the Google Spreadsheet
        
    Returns:
        GoogleSheetsClient instance
    """
    global _google_sheets_client
    
    if _google_sheets_client is None:
        _google_sheets_client = GoogleSheetsClient(credentials_path, sheet_id)
    
    return _google_sheets_client
