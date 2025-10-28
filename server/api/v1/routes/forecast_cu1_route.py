from fastapi import APIRouter, HTTPException
from pathlib import Path
import numpy as np
import pandas as pd
import xgboost as xgb

from ..models.forecast_model import SKUForecastRequest, SKUForecastResponse

router = APIRouter(prefix="/forecast", tags=["forecast"])

# Hardcoded CU-1 model path
MODEL_PATH = (
    Path(__file__).resolve().parents[3]
    / "forecasting" / "models" / "xgb_sku_solo_CU_1_model.json"
)

# Features used during training, order matters
FEATURES = ["month_num", "year", "sku_id", "lag_1", "lag_2", "lag_3", "month_sin", "month_cos"]

# Load once at import time
if not MODEL_PATH.exists():
    raise FileNotFoundError(f"CU-1 model not found at {MODEL_PATH}")

BOOSTER = xgb.Booster()
BOOSTER.load_model(str(MODEL_PATH))
BEST_ITER = getattr(BOOSTER, "best_iteration", None)

# Forecast for one SKU
@router.post("/cu-1", response_model=SKUForecastResponse)
def forecast_cu1(req: SKUForecastRequest) -> SKUForecastResponse:
    sku = "CU-1"

    try:
        last_month = pd.to_datetime(req.last_month)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid last_month: {e}")

    fut_month = last_month + pd.offsets.MonthEnd(1)
    m = int(fut_month.month)

    row = {
        "month_num": m,
        "year": int(fut_month.year),
        "sku_id": int(req.sku_id),
        "lag_1": float(req.lag_1) if req.lag_1 is not None else np.nan,
        "lag_2": float(req.lag_2) if req.lag_2 is not None else np.nan,
        "lag_3": float(req.lag_3) if req.lag_3 is not None else np.nan,
        "month_sin": float(np.sin(2 * np.pi * m / 12)),
        "month_cos": float(np.cos(2 * np.pi * m / 12)),
    }

    X = np.array([[row.get(f, np.nan) for f in FEATURES]], dtype=float)
    dmat = xgb.DMatrix(X, feature_names=FEATURES)

    if BEST_ITER is None:
        pred = float(BOOSTER.predict(dmat)[0])
    else:
        pred = float(BOOSTER.predict(dmat, iteration_range=(0, BEST_ITER + 1))[0])

    return SKUForecastResponse(
        sku=sku,
        forecast_month=str(fut_month.date()),
        predicted_quantity=pred,
    )

# Forecast for whole inventory