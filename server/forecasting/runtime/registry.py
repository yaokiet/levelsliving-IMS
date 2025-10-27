from __future__ import annotations
from pathlib import Path
import json
import pandas as pd
import xgboost as xgb
from typing import Dict, List, Tuple, Optional

ARTIFACTS_DIR = Path(__file__).resolve().parents[1] / "artifacts"

class ModelRegistry:
    def __init__(self, artifacts_dir: Path = ARTIFACTS_DIR):
        self.artifacts_dir = artifacts_dir
        self.meta = self._load_meta()
        self.boosters: Dict[str, xgb.Booster] = {}
        self.features: Dict[str, List[str]] = {}
        self.sku_tier: Dict[str, str] = self._load_sku_tier()
        self._load_models()

    def _load_meta(self) -> Dict[str, dict]:
        with open(self.artifacts_dir / "models_meta.json") as f:
            return json.load(f)

    def _load_models(self) -> None:
        for tier, m in self.meta.items():
            booster = xgb.Booster()
            booster.load_model(str(self.artifacts_dir / m["model_path"]))
            self.boosters[tier] = booster
            self.features[tier] = list(m["features"])

    def _load_sku_tier(self) -> Dict[str, str]:
        df = pd.read_csv(self.artifacts_dir / "sku_tier_map.csv")  # columns: SKU,tier
        return dict(zip(df["SKU"], df["tier"]))

    def pick_model_for_sku(self, sku: str) -> Tuple[str, xgb.Booster, List[str], bool]:
        """Returns (tier_label, booster, feature_list, fallback_used)."""
        tier = self.sku_tier.get(sku)
        if tier and tier in self.boosters:
            return tier, self.boosters[tier], self.features[tier], False

        # Basket fallbacks in order of preference
        for candidate in [tier, "highest", "medium", "rest"]:
            if candidate and candidate in self.boosters:
                return candidate, self.boosters[candidate], self.features[candidate], True

        # Last resort: any available model
        for candidate in self.boosters:
            return candidate, self.boosters[candidate], self.features[candidate], True

        raise FileNotFoundError("No trained forecasting models available.")
