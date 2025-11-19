from fastapi import APIRouter, HTTPException
from pathlib import Path
import numpy as np
import pandas as pd
import xgboost as xgb
from typing import Dict, Tuple, Optional  # add this import
import re
from ..models.forecast_model import ForecastRequest, SKUForecastResponse, InventoryForecastResponse

router = APIRouter(prefix="/forecast", tags=["forecast"])

# loading models and features
BASE_DIR = Path(__file__).resolve().parents[3]
MODELS_DIR = BASE_DIR / "forecasting" / "models"
TIER_CSV = BASE_DIR / "forecasting" / "models" / "sku_tier_map.csv"

FEATURES = ["month_num", "year", "lag_1", "lag_2", "lag_3", "month_sin", "month_cos"]

sku_map_df = pd.read_csv(TIER_CSV)
SKU_TIER_MAP = dict(zip(sku_map_df["SKU"], sku_map_df["tier"]))

_MODEL_CACHE: Dict[str, Tuple[xgb.Booster, Optional[int], str]] = {}

def _get_model_for_tier(tier: str) -> Tuple[xgb.Booster, Optional[int], str]:
    if tier not in _MODEL_CACHE:
        path, model_name = _tier_to_model_path(tier)
        if not path.exists():
            raise HTTPException(status_code=500, detail=f"Model not found for tier '{tier}': {path.name}")
        booster = xgb.Booster()
        booster.load_model(str(path))
        best_iter = getattr(booster, "best_iteration", None)
        _MODEL_CACHE[tier] = (booster, best_iter, model_name)

    return _MODEL_CACHE[tier]

def _tier_to_model_path(tier: str) -> Path:
    if tier.startswith("solo::"):
        solo_sku = tier.split("::", 1)[1]
        safe = re.sub(r"[^A-Za-z0-9]+", "_", solo_sku)
        name = f"xgb_sku_solo_{safe}_model.ubj"
    elif tier in {"highest", "medium", "rest"}:
        name = f"xgb_sku_{tier}_model.ubj"
    elif tier == "inventory":
        name = "xgb_inventory_model.ubj"
    else:
        raise HTTPException(status_code=400, detail=f"Unknown tier: {tier}")
    return MODELS_DIR / name , name

# Forecast for one SKU
@router.post("/{sku_id}", response_model=SKUForecastResponse)
def forecast_sku(sku_id: str, req: ForecastRequest) -> SKUForecastResponse:    
    try:
        last_month = pd.to_datetime(req.last_month)
        next_month_start = (
            last_month.to_period("M") + 1              # Move to next month period
        ).to_timestamp(how="start")                  # Convert to first day of month
        next_month_start = next_month_start.tz_localize("UTC")  # Attach UTC timezone
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid last_month: {e}")
    
    try:    
        # load model based on sku_id
        tier = SKU_TIER_MAP.get(sku_id)
        if not tier:
            tier = "rest"
        BOOSTER, BEST_ITER, MODEL_NAME = _get_model_for_tier(tier)
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Error loading model: {e}")

    forecast_m = int(next_month_start.month)
    forecast_year = int(next_month_start.year) 

    row = {
        "month_num": forecast_m,
        "year": forecast_year,
        "lag_1": float(req.lag_1) if req.lag_1 is not None else np.nan,
        "lag_2": float(req.lag_2) if req.lag_2 is not None else np.nan,
        "lag_3": float(req.lag_3) if req.lag_3 is not None else np.nan,
        "month_sin": float(np.sin(2 * np.pi * forecast_m / 12)),
        "month_cos": float(np.cos(2 * np.pi * forecast_m / 12)),
    }

    X = np.array([[row.get(f, np.nan) for f in FEATURES]], dtype=float)
    dmat = xgb.DMatrix(X, feature_names=FEATURES)

    try:
        if BEST_ITER is None:
            pred_log = float(BOOSTER.predict(dmat)[0])
        else:
            pred_log = float(BOOSTER.predict(dmat, iteration_range=(0, BEST_ITER + 1))[0])
        pred = float(np.expm1(pred_log))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error forecasting: {e}")

    return SKUForecastResponse(
        sku=sku_id,
        model = MODEL_NAME,
        forecast_month=str(next_month_start.date()),
        predicted_quantity=pred,
    )

# Forecast for whole inventory
@router.post("", response_model=InventoryForecastResponse)
def forecast_inventory(req: ForecastRequest) -> InventoryForecastResponse:    
    try:
        last_month = pd.to_datetime(req.last_month)
        next_month_start = (
            last_month.to_period("M") + 1              # Move to next month period
        ).to_timestamp(how="start")                  # Convert to first day of month
        next_month_start = next_month_start.tz_localize("UTC")  # Attach UTC timezone
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid last_month: {e}")
    
    try:
        tier = "inventory"
        BOOSTER, BEST_ITER, MODEL_NAME = _get_model_for_tier(tier)
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Error loading model: {e}")

    forecast_m = int(next_month_start.month)
    forecast_year = int(next_month_start.year) 

    row = {
        "month_num": forecast_m,
        "year": forecast_year,
        "lag_1": float(req.lag_1) if req.lag_1 is not None else np.nan,
        "lag_2": float(req.lag_2) if req.lag_2 is not None else np.nan,
        "lag_3": float(req.lag_3) if req.lag_3 is not None else np.nan,
        "month_sin": float(np.sin(2 * np.pi * forecast_m / 12)),
        "month_cos": float(np.cos(2 * np.pi * forecast_m / 12)),
    }

    X = np.array([[row.get(f, np.nan) for f in FEATURES]], dtype=float)
    dmat = xgb.DMatrix(X, feature_names=FEATURES)

    try:
        if BEST_ITER is None:
            pred_log = float(BOOSTER.predict(dmat)[0])
        else:
            pred_log = float(BOOSTER.predict(dmat, iteration_range=(0, BEST_ITER + 1))[0])
        
        pred = float(np.expm1(pred_log))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error forecasting: {e}")
    print(f"Inventory forecast: {row['month_num'], pred}")

    return InventoryForecastResponse(
        model = MODEL_NAME,
        forecast_month=str(next_month_start.date()),
        predicted_quantity=pred,
    )

# update xgb models, metadata files
@router.post("/model_update")
def update_forecast_models():
    # get all orders from google drive
    pass