from pathlib import Path
from typing import Optional, Dict

import joblib
import numpy as np
import pandas as pd
import streamlit as st

MODELS_DIR = Path("models")
PROCESSED_DIR = Path("data/processed")

# --- Helper functions ---
def _load_model(name: str) -> Dict:
    path = MODELS_DIR / name
    if not path.exists():
        raise FileNotFoundError(f"Model file '{path}' not found.")
    return joblib.load(path)

def _load_csv(name: str) -> pd.DataFrame:
    path = PROCESSED_DIR / name
    if not path.exists():
        raise FileNotFoundError(f"Processed file '{path}' not found.")
    df = pd.read_csv(path)
    if "Unnamed: 0" in df.columns:
        df = df.drop(columns=["Unnamed: 0"])
    return df

# --- WIN PROBABILITY ---
def predict_match_outcome(team1: str, team2: str, venue: str, toss_decision: str, match_id: Optional[int] = None) -> float:
    """Alias for predict_win_probability for backward compatibility"""
    return predict_win_probability(team1, team2, venue, toss_decision, match_id)

def predict_win_probability(team1: str, team2: str, venue: str, toss_decision: str, match_id: Optional[int] = None) -> float:
    bundle = _load_model("win_prediction_logreg.joblib")
    model = bundle["model"]

    matches = _load_csv("fact_matches.csv")
    if "match_id" not in matches.columns:
        raise ValueError("Column 'match_id' missing in fact_matches.csv")

    if match_id is None:
        # default to first match or median
        match_id = int(matches["match_id"].median())

    X = pd.DataFrame({"match_id": [match_id]})
    return float(model.predict_proba(X)[0][1])

# --- INNINGS SCORE ---
def predict_innings_score(team: str, venue: str, overs: int = 20) -> float:
    bundle = _load_model("innings_score_xgb.joblib")
    model = bundle["model"]
    team_encoder = bundle.get("team_encoder", {})
    venue_encoder = bundle.get("venue_encoder", {})
    
    # Handle unknown teams/venues by using default values
    team_encoded = team_encoder.get(team, 0)  # Default to first team if not found
    venue_encoded = venue_encoder.get(venue, 0)  # Default to first venue if not found
    
    innings_value = 1 if overs <= 20 else 2
    # Use proper feature names to avoid sklearn warning
    X = pd.DataFrame([[innings_value, team_encoded, venue_encoded]], 
                     columns=["innings", "team_encoded", "venue_encoded"])
    return float(max(0.0, model.predict(X)[0]))

# --- PLAYER PERFORMANCE ---
def predict_player_performance(player_name: str, team: Optional[str] = None, venue: Optional[str] = None) -> Dict[str, float]:
    bundle = _load_model("player_performance_rf.joblib")
    model = bundle["model"]
    scaler = bundle.get("scaler")

    deliveries = _load_csv("fact_deliveries.csv")
    batter_col = next((c for c in ["batter", "batsman", "striker", "player_name"] if c in deliveries.columns), None)
    if batter_col is None:
        raise ValueError("Deliveries file does not contain a batter column.")

    runs_col = next((c for c in ["batsman_runs", "runs_off_bat", "runs_scored", "total_runs"] if c in deliveries.columns), None)
    if runs_col is None:
        raise ValueError("Deliveries file does not contain a batsman runs column.")

    player_totals = (
        deliveries.groupby(batter_col)[runs_col]
        .sum()
        .reset_index()
        .rename(columns={batter_col: "player_name", runs_col: "total_runs"})
    )

    row = player_totals[player_totals["player_name"].str.lower() == player_name.lower()]
    total_runs = float(row["total_runs"].iloc[0]) if not row.empty else float(player_totals["total_runs"].mean() if len(player_totals) else 25.0)

    X = pd.DataFrame([[total_runs]], columns=["total_runs"])
    if scaler is not None:
        X = scaler.transform(X)

    predicted_runs = model.predict(X)[0]
    return {
        "predicted_runs": float(max(0.0, predicted_runs)),
        "historical_total_runs": total_runs,
    }

# --- STREAMLIT PAGE ---
def main():
    st.title("🏏 Cricket Predictions")

    matches = _load_csv("fact_matches.csv")
    team_list = sorted(pd.unique(matches[["team1", "team2"]].values.ravel()))
    venues = sorted(pd.unique(matches["venue"]))

    st.subheader("Match Win Probability")
    team1 = st.selectbox("Team 1", team_list)
    team2 = st.selectbox("Team 2", team_list)
    venue = st.selectbox("Venue", venues)
    toss = st.radio("Toss decision", ["bat", "field"])
    match_id_input = st.number_input("Match ID", min_value=int(matches["match_id"].min()), max_value=int(matches["match_id"].max()), value=int(matches["match_id"].min()))

    try:
        win_prob = predict_win_probability(team1, team2, venue, toss, match_id_input)
        st.success(f"Win Probability for {team1}: {win_prob*100:.2f}%")
    except Exception as e:
        st.error(f"Win prediction failed: {e}")

    st.subheader("Innings Score Prediction")
    score = predict_innings_score(team1, venue, overs=20)
    st.info(f"Predicted innings score for {team1}: {score:.2f}")

    st.subheader("Player Performance Prediction")
    player_name = st.text_input("Player Name", "Sample Player")
    perf = predict_player_performance(player_name)
    st.info(f"{player_name} predicted runs: {perf['predicted_runs']:.2f} (historical total: {perf['historical_total_runs']:.2f})")

if __name__ == "__main__":
    main()
