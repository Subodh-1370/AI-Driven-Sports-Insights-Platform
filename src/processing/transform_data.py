"""
Final Corrected Transformation utilities for cricket analytics pipeline.
Automatically supports both match_id and match_number.
"""

from __future__ import annotations
import os
import sys
from typing import Dict, List, Optional
import pandas as pd

# ----------------------------------------------------
# Set up correct file paths using absolute paths
# ----------------------------------------------------
# Get the root directory (two levels up from this file)
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

# Define data directories
DATA_DIR = os.path.join(ROOT_DIR, "data")
PROCESSED_DIR = os.path.join(DATA_DIR, "processed")

# Ensure processed directory exists
os.makedirs(PROCESSED_DIR, exist_ok=True)

# Input files (cleaned data)
MATCHES_CLEAN_FILE = os.path.join(PROCESSED_DIR, "matches_clean.csv")
DELIVERIES_CLEAN_FILE = os.path.join(PROCESSED_DIR, "deliveries_clean.csv")
PLAYERS_CLEAN_FILE = os.path.join(PROCESSED_DIR, "players_clean.csv")

# Output files (transformed data)
FACT_MATCHES_FILE = os.path.join(PROCESSED_DIR, "fact_matches.csv")
FACT_DELIVERIES_FILE = os.path.join(PROCESSED_DIR, "fact_deliveries.csv")
DIM_PLAYERS_FILE = os.path.join(PROCESSED_DIR, "dim_players.csv")
FINAL_DATASET_FILE = os.path.join(PROCESSED_DIR, "final_dataset.csv")

# Add the src directory to the path for module imports
SRC_DIR = os.path.join(ROOT_DIR, "src")
if SRC_DIR not in sys.path:
    sys.path.append(SRC_DIR)


def _ensure_dirs() -> None:
    os.makedirs(PROCESSED_DIR, exist_ok=True)
    os.makedirs(os.path.join("data", "raw"), exist_ok=True)
    os.makedirs(os.path.join("data", "analytics"), exist_ok=True)


def _load_csv(path: str) -> pd.DataFrame:
    """
    Load a CSV file and return a DataFrame.
    
    Args:
        path: Absolute path to the CSV file
        
    Returns:
        pd.DataFrame: Loaded data with unnamed columns removed
        
    Raises:
        FileNotFoundError: If the file doesn't exist
        pd.errors.EmptyDataError: If the file is empty
    """
    if not os.path.isfile(path):
        raise FileNotFoundError(f"❌ Required file not found: {os.path.abspath(path)}")
        
    try:
        df = pd.read_csv(path)
        if df.empty:
            raise pd.errors.EmptyDataError(f"The file {path} is empty")
        # Remove any unnamed columns that might be created during CSV saving
        return df.loc[:, ~df.columns.str.startswith("Unnamed")]
    except pd.errors.EmptyDataError:
        raise
    except Exception as e:
        raise Exception(f"❌ Error reading {path}: {str(e)}")


def _normalize_match_id(df: pd.DataFrame) -> pd.DataFrame:
    """
    Accept either match_id or match_number.
    Rename match_number → match_id.
    """
    if "match_id" in df.columns:
        return df
    if "match_number" in df.columns:
        df = df.rename(columns={"match_number": "match_id"})
        return df
    raise ValueError("No match identifier found: expected match_id or match_number")


def _coerce_int(df: pd.DataFrame, column: str) -> pd.DataFrame:
    if column not in df.columns:
        raise ValueError(f"Column '{column}' missing in dataframe.")
    df[column] = pd.to_numeric(df[column], errors="coerce")
    df = df.dropna(subset=[column])
    df[column] = df[column].astype(int)
    return df


# ----------------------------------------------------
# FACT TABLE CREATION
# ----------------------------------------------------
def transform_fact_tables() -> Dict[str, str]:
    _ensure_dirs()

    matches = _load_csv(MATCHES_CLEAN_FILE)
    deliveries = _load_csv(DELIVERIES_CLEAN_FILE)

    # Normalize ID columns
    matches = _normalize_match_id(matches)
    deliveries = _normalize_match_id(deliveries)

    # Standardize column names
    if "inning" in deliveries.columns and "innings" not in deliveries.columns:
        deliveries.rename(columns={"inning": "innings"}, inplace=True)

    # Force match_id = int
    matches = _coerce_int(matches, "match_id")
    deliveries = _coerce_int(deliveries, "match_id")

    # Save fact tables
    matches.to_csv(FACT_MATCHES_FILE, index=False)
    deliveries.to_csv(FACT_DELIVERIES_FILE, index=False)

    return {
        "fact_matches": FACT_MATCHES_FILE,
        "fact_deliveries": FACT_DELIVERIES_FILE,
    }


# ----------------------------------------------------
# DIMENSION TABLES
# ----------------------------------------------------
def _pick_column(df: pd.DataFrame, candidates: List[str], required: bool = True) -> Optional[str]:
    for col in candidates:
        if col in df.columns:
            return col
    if required:
        raise ValueError(f"None of the columns {candidates} exist in dataframe.")
    return None


def _build_dim_players(deliveries: pd.DataFrame) -> str:
    try:
        players = _load_csv(PLAYERS_CLEAN_FILE)
        name_col = _pick_column(players, ["player_name", "player", "full_name"], required=False)
        if name_col and name_col != "player_name":
            players = players.rename(columns={name_col: "player_name"})
    except FileNotFoundError:
        players = pd.DataFrame(columns=["player_name"])

    if players.empty or players["player_name"].isna().all():
        batter_col = _pick_column(deliveries, ["batter", "batsman", "striker"], required=False)
        if batter_col:
            players = (
                deliveries[[batter_col]]
                .dropna()
                .drop_duplicates()
                .rename(columns={batter_col: "player_name"})
            )

    players.to_csv(DIM_PLAYERS_FILE, index=False)
    return DIM_PLAYERS_FILE


# ----------------------------------------------------
# FINAL DATASET (for ML)
# ----------------------------------------------------
def _build_final_dataset(matches: pd.DataFrame, deliveries: pd.DataFrame) -> str:
    batter_col = _pick_column(deliveries, ["batter", "batsman", "striker"], required=False)
    bowler_col = _pick_column(deliveries, ["bowler"], required=False)
    runs_col = _pick_column(deliveries, ["batsman_runs", "runs_off_bat", "runs_scored"], required=False)
    total_runs_col = _pick_column(deliveries, ["total_runs", "total"], required=False)

    frames = []

    # Batting summary
    if batter_col and runs_col:
        batting = (
            deliveries.groupby(["match_id", "innings", batter_col])[runs_col]
            .agg(runs_scored="sum", balls_faced="count")
            .reset_index()
            .rename(columns={batter_col: "player_name"})
        )
        batting["strike_rate"] = batting["runs_scored"] * 100 / batting["balls_faced"].replace(0, 1)
        frames.append(batting)

    # Bowling summary
    if bowler_col and total_runs_col:
        bowling = (
            deliveries.groupby(["match_id", "innings", bowler_col])[total_runs_col]
            .agg(runs_conceded="sum", balls_bowled="count")
            .reset_index()
            .rename(columns={bowler_col: "player_name"})
        )
        bowling["overs_bowled"] = bowling["balls_bowled"] / 6.0
        bowling["economy"] = bowling["runs_conceded"] / bowling["overs_bowled"].replace(0, 1)
        frames.append(bowling)

    # Merge batting + bowling
    if frames:
        final_players = frames[0]
        for frame in frames[1:]:
            final_players = pd.merge(
                final_players,
                frame,
                on=["match_id", "innings", "player_name"],
                how="outer",
            )
    else:
        final_players = pd.DataFrame(columns=["match_id", "innings", "player_name"])

    # Join with matches
    final_df = final_players.merge(matches, on="match_id", how="left")
    final_df.to_csv(FINAL_DATASET_FILE, index=False)

    return FINAL_DATASET_FILE


# ----------------------------------------------------
# MAIN TRANSFORM ENTRYPOINT
# ----------------------------------------------------
def transform_all() -> Dict[str, str]:
    outputs = transform_fact_tables()

    matches = _load_csv(outputs["fact_matches"])
    deliveries = _load_csv(outputs["fact_deliveries"])

    dim_players = _build_dim_players(deliveries)
    final_dataset = _build_final_dataset(matches, deliveries)

    outputs.update(
        {
            "dim_players": dim_players,
            "final_dataset": final_dataset,
        }
    )
    return outputs


def main() -> None:
    out = transform_all()
    for k, v in out.items():
        print(f"[transform_data] {k} → {v}")


if __name__ == "__main__":
    main()
