

from __future__ import annotations
from pathlib import Path
from typing import Dict

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

PROCESSED_DIR = Path("data/processed")
MODELS_DIR = Path("models")
FACT_MATCHES = PROCESSED_DIR / "fact_matches.csv"
FACT_DELIVERIES = PROCESSED_DIR / "fact_deliveries.csv"


def _ensure_dirs() -> None:
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    MODELS_DIR.mkdir(parents=True, exist_ok=True)

def _load_csv(path: Path) -> pd.DataFrame:
    if not path.exists():
        raise FileNotFoundError(f"Required file not found: {path}")

    df = pd.read_csv(path)

    df.columns = df.columns.str.strip()

    if "Unnamed: 0" in df.columns:
        df = df.drop(columns=["Unnamed: 0"])

    if "inning" in df.columns and "innings" not in df.columns:
        df = df.rename(columns={"inning": "innings"})

    return df

def _normalize_match_id(df: pd.DataFrame) -> pd.DataFrame:
    if "match_id" in df.columns:
        return df
    if "match_number" in df.columns:
        return df.rename(columns={"match_number": "match_id"})
    raise ValueError("Dataset missing match_id or match_number column")

def train_win_prediction_model(matches: pd.DataFrame) -> Dict[str, str]:
    """Train a model to predict match winners"""
    
    matches = _normalize_match_id(matches)

    required = {"match_id", "team1", "winner"}
    missing = required - set(matches.columns)
    if missing:
        raise ValueError(f"Missing columns in fact_matches.csv: {missing}")

    matches = matches.dropna(subset=["match_id", "team1", "winner"]).copy()
    matches["match_id"] = pd.to_numeric(matches["match_id"], errors="coerce")
    matches = matches.dropna(subset=["match_id"])

    matches["team1_win"] = (
        matches["winner"].str.lower() == matches["team1"].str.lower()
    ).astype(int)

    X = matches[["match_id"]]
    y = matches["team1_win"]

    if y.nunique() < 2:
        raise ValueError("Need both win/loss classes to train win prediction model.")

    X_train, _, y_train, _ = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    model = LogisticRegression(max_iter=2000)
    model.fit(X_train, y_train)

    path = MODELS_DIR / "win_prediction_logreg.joblib"
    joblib.dump({"model": model, "features": ["match_id"]}, path)
    return {"model_path": str(path)}

def train_innings_score_model(deliveries: pd.DataFrame) -> Dict[str, str]:

    deliveries = _normalize_match_id(deliveries)

    required_cols = {"match_id", "innings", "bat_team", "venue"}
    missing = required_cols - set(deliveries.columns)

    if missing:
        raise ValueError(f"fact_deliveries.csv missing required columns: {missing}")

    runs_col = None
    possible_run_cols = [
        "total_runs",
        "runs_total",
        "runs_scored",
        "runs",
        "batsman_runs",
        "runs_off_bat"
    ]

    runs_col = next((col for col in possible_run_cols if col in deliveries.columns), None)

    if runs_col is None:
        raise ValueError("Deliveries dataset must contain a runs column like total_runs.")

    deliveries["ball_total_runs"] = deliveries["batsman_runs"] + deliveries["extras"]
    
    inning_totals = (
        deliveries.groupby(["match_id", "innings", "bat_team", "venue"])["ball_total_runs"]
        .sum()
        .reset_index()
        .rename(columns={"ball_total_runs": "innings_total"})
    )

    if inning_totals.empty:
        raise ValueError("No innings totals could be computed from your dataset.")

    inning_totals["team_encoded"] = inning_totals["bat_team"].astype('category').cat.codes
    inning_totals["venue_encoded"] = inning_totals["venue"].astype('category').cat.codes
    
    X = inning_totals[["innings", "team_encoded", "venue_encoded"]]
    y = inning_totals["innings_total"]

    model = RandomForestRegressor(n_estimators=350, random_state=42)
    model.fit(X, y)

    team_encoder = {team: idx for idx, team in enumerate(inning_totals["bat_team"].astype('category').cat.categories)}
    venue_encoder = {venue: idx for idx, venue in enumerate(inning_totals["venue"].astype('category').cat.categories)}

    path = MODELS_DIR / "innings_score_xgb.joblib"
    joblib.dump({
        "model": model, 
        "features": ["innings", "team_encoded", "venue_encoded"],
        "team_encoder": team_encoder,
        "venue_encoder": venue_encoder
    }, path)
    return {"model_path": str(path)}

def train_player_performance_model(deliveries: pd.DataFrame) -> Dict[str, str]:

    deliveries = _normalize_match_id(deliveries)

    batter_col = next(
        (col for col in ["batter", "batsman", "striker", "player_name"] if col in deliveries.columns),
        None,
    )
    if batter_col is None:
        raise ValueError("No batter column found in deliveries dataset.")

    runs_col = next(
        (col for col in ["batsman_runs", "runs_off_bat", "runs_scored", "total_runs"] if col in deliveries.columns),
        None,
    )
    if runs_col is None:
        raise ValueError("No valid runs column found in deliveries dataset.")

    player_totals = (
        deliveries.groupby(batter_col)[runs_col]
        .sum()
        .reset_index()
        .rename(columns={batter_col: "player_name", runs_col: "total_runs"})
    )

    X = player_totals[["total_runs"]]
    y = player_totals["total_runs"]

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    model = RandomForestRegressor(n_estimators=250, random_state=42)
    model.fit(X_scaled, y)

    path = MODELS_DIR / "player_performance_rf.joblib"
    joblib.dump({"model": model, "scaler": scaler, "features": ["total_runs"]}, path)
    return {"model_path": str(path)}

def train_all_models() -> Dict[str, Dict[str, str]]:
    _ensure_dirs()

    matches = _load_csv(FACT_MATCHES)
    deliveries = _load_csv(FACT_DELIVERIES)

    results = {}

    for name, fn in {
        "win_prediction": lambda: train_win_prediction_model(matches),
        "innings_score": lambda: train_innings_score_model(deliveries),
        "player_performance": lambda: train_player_performance_model(deliveries),
    }.items():
        try:
            results[name] = fn()
        except Exception as exc:
            results[name] = {"error": str(exc)}

    return results

if __name__ == "__main__":
    print(train_all_models())

