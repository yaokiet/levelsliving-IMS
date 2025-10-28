from pydantic import BaseModel, Field
from typing import Optional

class ForecastRequest(BaseModel):
    last_month: str = Field(..., description="ISO date of last observed month end")
    lag_1: float
    lag_2: Optional[float] = None
    lag_3: Optional[float] = None

class SKUForecastResponse(BaseModel):
    sku: str
    model: str
    forecast_month: str
    predicted_quantity: float

class InventoryForecastResponse(BaseModel):
    model: str
    forecast_month: str
    predicted_quantity: float