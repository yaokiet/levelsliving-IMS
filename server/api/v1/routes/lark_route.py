from fastapi import APIRouter
from server.database.services import lark_service

router = APIRouter(prefix="/lark", tags=["Lark"])

@router.get("/token")
def get_token():
    return {"token": lark_service.get_tenant_access_token()}

@router.get("/spreadsheet/meta")
def spreadsheet_meta():
    return lark_service.get_spreadsheet_metadata()

@router.get("/spreadsheet/sheets")
def sheet_list():
    return lark_service.get_sheet_list()

