from pydantic import BaseModel, Field
from typing import Optional

class SKUForecastRequest(BaseModel):
    # Last observed month end for CU-1, for example "2025-09-30"
    last_month: str = Field(..., description="ISO date of last observed month end")
    # Last three observed quantities for CU-1 (most recent first)
    lag_1: float
    lag_2: Optional[float] = None
    lag_3: Optional[float] = None
    # Must match the encoding used at training time
    sku_id: int = 1

class SKUForecastResponse(BaseModel):
    sku: str
    forecast_month: str
    predicted_quantity: float

class InventoryForecastRequest(BaseModel):
    last_month: str = Field(..., description="ISO date of last observed month end")
    lag_1: float
    lag_2: Optional[float] = None
    lag_3: Optional[float] = None

class SKUForecastResponse(BaseModel):
    forecast_month: str
    predicted_quantity: float