"""
Export cleaned and transformed data to `data/analytics/` for direct Power BI use.

This module reads processed tables from `data/processed/` and produces
analytics-ready CSVs: fact tables and dimension tables optimized for Power BI.

Exports:
- Dimension tables: dim_players, dim_teams, dim_venues
- Fact tables: fact_matches, fact_deliveries, fact_player_innings
- Optional: fact_predictions (if models have been trained)
"""

from __future__ import annotations

import os
from typing import Dict, Optional

import pandas as pd


PROCESSED_DIR = "data/processed"
ANALYTICS_DIR = "data/analytics"
MODELS_DIR = "models"


def _ensure_dir(path: str) -> None:
    """Create directory if it doesn't exist."""
    os.makedirs(path, exist_ok=True)


def _load_if_exists(filename: str) -> pd.DataFrame:
    """Load CSV from processed directory, raise error if not found."""
    path = os.path.join(PROCESSED_DIR, filename)
    if not os.path.isfile(path):
        raise FileNotFoundError(f"Processed file not found: {path}")
    return pd.read_csv(path)


def _load_optional(filename: str) -> Optional[pd.DataFrame]:
    """Load CSV if it exists, return None otherwise."""
    path = os.path.join(PROCESSED_DIR, filename)
    if os.path.isfile(path):
        return pd.read_csv(path)
    return None


def _create_dim_teams(matches: pd.DataFrame) -> pd.DataFrame:
    """
    Create dimension table for teams from matches data.
    
    Extracts unique teams from team1 and team2 columns.
    """
    teams = set()
    
    if "team1" in matches.columns:
        teams.update(matches["team1"].dropna().unique())
    if "team2" in matches.columns:
        teams.update(matches["team2"].dropna().unique())
    
    dim_teams = pd.DataFrame({
        "team_name": sorted(teams),
    })
    
    # Create team_id as index (1-based)
    dim_teams["team_id"] = range(1, len(dim_teams) + 1)
    
    # Reorder columns
    dim_teams = dim_teams[["team_id", "team_name"]]
    
    return dim_teams


def _create_dim_venues(matches: pd.DataFrame) -> pd.DataFrame:
    """
    Create dimension table for venues from matches data.
    """
    if "venue" not in matches.columns:
        return pd.DataFrame(columns=["venue_id", "venue_name"])
    
    venues = matches["venue"].dropna().unique()
    dim_venues = pd.DataFrame({
        "venue_name": sorted(venues),
    })
    
    # Create venue_id as index (1-based)
    dim_venues["venue_id"] = range(1, len(dim_venues) + 1)
    
    # Reorder columns
    dim_venues = dim_venues[["venue_id", "venue_name"]]
    
    return dim_venues


def _create_fact_player_innings(deliveries: pd.DataFrame, matches: pd.DataFrame) -> pd.DataFrame:
    """
    Create aggregated fact table for player innings performance.
    
    Aggregates batting and bowling stats per player per match innings.
    """
    fact_player_innings = []
    
    # Batting stats aggregation
    if "striker" in deliveries.columns and "runs_off_bat" in deliveries.columns:
        batting_stats = (
            deliveries.groupby(["match_id", "innings", "striker"])
            .agg({
                "runs_off_bat": "sum",
                "match_id": "count"  # balls faced (approximate)
            })
            .reset_index()
            .rename(columns={
                "striker": "player_name",
                "runs_off_bat": "runs_scored",
                "match_id": "balls_faced"
            })
        )
        
        # Calculate strike rate
        batting_stats["strike_rate"] = (
            (batting_stats["runs_scored"] / batting_stats["balls_faced"] * 100)
            .fillna(0)
            .round(2)
        )
        
        # Count boundaries
        if "fours" in deliveries.columns:
            fours = (
                deliveries.groupby(["match_id", "innings", "striker"])["fours"]
                .sum()
                .reset_index()
                .rename(columns={"striker": "player_name"})
            )
            batting_stats = batting_stats.merge(fours, on=["match_id", "innings", "player_name"], how="left")
            batting_stats["fours"] = batting_stats["fours"].fillna(0).astype(int)
        else:
            batting_stats["fours"] = 0
        
        if "sixes" in deliveries.columns:
            sixes = (
                deliveries.groupby(["match_id", "innings", "striker"])["sixes"]
                .sum()
                .reset_index()
                .rename(columns={"striker": "player_name"})
            )
            batting_stats = batting_stats.merge(sixes, on=["match_id", "innings", "player_name"], how="left")
            batting_stats["sixes"] = batting_stats["sixes"].fillna(0).astype(int)
        else:
            batting_stats["sixes"] = 0
        
        batting_stats["record_type"] = "batting"
        fact_player_innings.append(batting_stats)
    
    # Bowling stats aggregation
    if "bowler" in deliveries.columns:
        bowling_stats = (
            deliveries.groupby(["match_id", "innings", "bowler"])
            .agg({
                "total_runs": "sum",  # runs conceded
                "wicket_type": lambda x: x.notna().sum(),  # wickets taken
                "match_id": "count"  # balls bowled
            })
            .reset_index()
            .rename(columns={
                "bowler": "player_name",
                "total_runs": "runs_conceded",
                "wicket_type": "wickets",
                "match_id": "balls_bowled"
            })
        )
        
        # Calculate overs bowled (balls / 6)
        bowling_stats["overs_bowled"] = (bowling_stats["balls_bowled"] / 6.0).round(2)
        
        # Calculate economy rate
        bowling_stats["economy"] = (
            (bowling_stats["runs_conceded"] / bowling_stats["overs_bowled"])
            .replace([float('inf'), float('-inf')], 0)
            .fillna(0)
            .round(2)
        )
        
        bowling_stats["record_type"] = "bowling"
        fact_player_innings.append(bowling_stats)
    
    # Combine batting and bowling stats
    if fact_player_innings:
        combined = pd.concat(fact_player_innings, ignore_index=True)
        
        # Merge with match context to get teams and venue
        if "match_id" in matches.columns:
            match_cols = ["match_id", "venue", "team1", "team2"]
            available_cols = [col for col in match_cols if col in matches.columns]
            combined = combined.merge(
                matches[available_cols],
                on="match_id",
                how="left"
            )
        
        # Identify batting team
        if "batting_team" in deliveries.columns:
            batting_team_map = (
                deliveries[["match_id", "innings", "batting_team"]]
                .drop_duplicates()
                .set_index(["match_id", "innings"])["batting_team"]
                .to_dict()
            )
            combined["batting_team"] = combined.apply(
                lambda row: batting_team_map.get((row["match_id"], row["innings"]), None),
                axis=1
            )
        elif "team1" in combined.columns and "team2" in combined.columns:
            combined["batting_team"] = combined.apply(
                lambda row: row["team1"] if row["innings"] == 1 else row["team2"],
                axis=1
            )
        
        return combined
    
    return pd.DataFrame()


def _prepare_for_powerbi(df: pd.DataFrame) -> pd.DataFrame:
    """
    Prepare DataFrame for Power BI by ensuring proper data types and formatting.
    """
    df = df.copy()
    
    # Convert date columns
    date_cols = [col for col in df.columns if "date" in col.lower()]
    for col in date_cols:
        df[col] = pd.to_datetime(df[col], errors="coerce")
    
    # Ensure numeric columns are properly typed
    numeric_cols = [
        "runs_scored", "balls_faced", "strike_rate", "fours", "sixes",
        "runs_conceded", "wickets", "balls_bowled", "overs_bowled", "economy",
        "total_runs", "runs_off_bat", "extras", "over", "ball_no", "over_number", "ball_number",
        "innings", "match_id"
    ]
    for col in numeric_cols:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")
    
    # Replace NaN with None for better Power BI handling
    df = df.where(pd.notnull(df), None)
    
    return df


def export_for_powerbi(include_predictions: bool = False) -> Dict[str, str]:
    """
    Export curated datasets to ANALYTICS_DIR for Power BI consumption.

    Args:
        include_predictions: If True, attempt to export prediction results (requires trained models)

    Returns:
        dict of table_name → CSV path
    """
    _ensure_dir(ANALYTICS_DIR)
    print("[export_for_powerbi] Starting export to Power BI...")
    
    outputs: Dict[str, str] = {}
    
    # Load base tables
    try:
        matches = _load_if_exists("fact_matches.csv")
        print(f"[export_for_powerbi] Loaded {len(matches)} matches")
    except FileNotFoundError as e:
        print(f"[export_for_powerbi] Error: {e}")
        raise
    
    try:
        deliveries = _load_if_exists("fact_deliveries.csv")
        print(f"[export_for_powerbi] Loaded {len(deliveries)} deliveries")
    except FileNotFoundError as e:
        print(f"[export_for_powerbi] Error: {e}")
        deliveries = pd.DataFrame()
    
    # Export fact_matches
    matches_clean = _prepare_for_powerbi(matches)
    out_path = os.path.join(ANALYTICS_DIR, "fact_matches.csv")
    matches_clean.to_csv(out_path, index=False)
    outputs["fact_matches"] = out_path
    print(f"[export_for_powerbi] ✓ Exported fact_matches ({len(matches_clean)} rows)")
    
    # Export fact_deliveries
    if not deliveries.empty:
        deliveries_clean = _prepare_for_powerbi(deliveries)
        out_path = os.path.join(ANALYTICS_DIR, "fact_deliveries.csv")
        deliveries_clean.to_csv(out_path, index=False)
        outputs["fact_deliveries"] = out_path
        print(f"[export_for_powerbi] ✓ Exported fact_deliveries ({len(deliveries_clean)} rows)")
    
    # Export dim_players
    try:
        players = _load_if_exists("dim_players.csv")
        players_clean = _prepare_for_powerbi(players)
        out_path = os.path.join(ANALYTICS_DIR, "dim_players.csv")
        players_clean.to_csv(out_path, index=False)
        outputs["dim_players"] = out_path
        print(f"[export_for_powerbi] ✓ Exported dim_players ({len(players_clean)} rows)")
    except FileNotFoundError:
        print("[export_for_powerbi] ⚠ dim_players.csv not found, skipping...")
    
    # Create and export dim_teams
    try:
        dim_teams = _create_dim_teams(matches)
        out_path = os.path.join(ANALYTICS_DIR, "dim_teams.csv")
        dim_teams.to_csv(out_path, index=False)
        outputs["dim_teams"] = out_path
        print(f"[export_for_powerbi] ✓ Exported dim_teams ({len(dim_teams)} rows)")
    except Exception as e:
        print(f"[export_for_powerbi] ⚠ Error creating dim_teams: {e}")
    
    # Create and export dim_venues
    try:
        dim_venues = _create_dim_venues(matches)
        if not dim_venues.empty:
            out_path = os.path.join(ANALYTICS_DIR, "dim_venues.csv")
            dim_venues.to_csv(out_path, index=False)
            outputs["dim_venues"] = out_path
            print(f"[export_for_powerbi] ✓ Exported dim_venues ({len(dim_venues)} rows)")
    except Exception as e:
        print(f"[export_for_powerbi] ⚠ Error creating dim_venues: {e}")
    
    # Create and export fact_player_innings
    if not deliveries.empty:
        try:
            fact_player_innings = _create_fact_player_innings(deliveries, matches)
            if not fact_player_innings.empty:
                fact_player_innings_clean = _prepare_for_powerbi(fact_player_innings)
                out_path = os.path.join(ANALYTICS_DIR, "fact_player_innings.csv")
                fact_player_innings_clean.to_csv(out_path, index=False)
                outputs["fact_player_innings"] = out_path
                print(f"[export_for_powerbi] ✓ Exported fact_player_innings ({len(fact_player_innings_clean)} rows)")
        except Exception as e:
            print(f"[export_for_powerbi] ⚠ Error creating fact_player_innings: {e}")
    
    # Optional: Export predictions if requested and available
    if include_predictions:
        try:
            # This would require running predictions on historical data
            # For now, we'll just note that this feature can be extended
            print("[export_for_powerbi] ℹ Prediction export not yet implemented (requires batch prediction)")
        except Exception as e:
            print(f"[export_for_powerbi] ⚠ Error exporting predictions: {e}")
    
    print(f"[export_for_powerbi] ✓ Export complete! {len(outputs)} tables exported to {ANALYTICS_DIR}")
    return outputs


def main() -> None:
    """CLI entrypoint for Power BI export."""
    outputs = export_for_powerbi(include_predictions=False)
    print("\n[export_for_powerbi] Exported files:")
    for name, path in outputs.items():
        print(f"  - {name}: {path}")


if __name__ == "__main__":
    main()


