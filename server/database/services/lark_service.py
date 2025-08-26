import requests
from config import settings

# simple in-memory cache for the token
_tenant_access_token = None

def get_tenant_access_token():
    """
    Obtain tenant access token from Lark.
    """
    global _tenant_access_token
    url = f"{settings.LARK_BASE_URL}/auth/v3/tenant_access_token/internal"
    payload = {
        "app_id": settings.LARK_APP_ID,
        "app_secret": settings.LARK_APP_SECRET
    }
    resp = requests.post(url, json=payload)
    resp.raise_for_status()
    data = resp.json()
    if data.get("code") != 0:
        raise Exception(f"Failed to get token: {data}")
    _tenant_access_token = data["tenant_access_token"]
    return _tenant_access_token

def _get_headers():
    """
    Helper to attach Authorization header.
    """
    global _tenant_access_token
    if not _tenant_access_token:
        get_tenant_access_token()
    return {
        "Authorization": f"Bearer {_tenant_access_token}"
    }

def get_spreadsheet_metadata():
    """
    Get metadata of spreadsheet.
    """
    url = f"{settings.LARK_BASE_URL}/sheets/v2/spreadsheets/{settings.LARK_SPREADSHEET_ID}/metainfo"
    resp = requests.get(url, headers=_get_headers())
    resp.raise_for_status()
    return resp.json()

def get_sheet_list():
    """
    Get list of sheets in spreadsheet.
    """
    url = f"{settings.LARK_BASE_URL}/sheets/v3/spreadsheets/{settings.LARK_SPREADSHEET_ID}/sheets/query"
    resp = requests.get(url, headers=_get_headers())
    resp.raise_for_status()
    return resp.json()
