
# Cleaning routines for ESPNcricinfo scraper outputs.


from __future__ import annotations

import os
from pathlib import Path
from typing import Dict, Optional, Union

import pandas as pd

def _ensure_dir(path: Union[str, Path]) -> None:
    """Ensure directory exists, create if it doesn't."""
    Path(path).mkdir(parents=True, exist_ok=True)

def normalize_deliveries_columns(df: pd.DataFrame) -> pd.DataFrame:
    """Standardize inconsistent column names without raising errors."""
    df = df.copy()
    rename_map = {}

    # inning → innings
    if "inning" in df.columns and "innings" not in df.columns:
        rename_map["inning"] = "innings"

    # batsman / striker → batter
    if "batsman" in df.columns:
        rename_map["batsman"] = "batter"
    elif "striker" in df.columns:
        rename_map["striker"] = "batter"

    # total run variations → total_runs
    for col in ["total", "runs_off_bat", "runs_scored"]:
        if col in df.columns and "total_runs" not in df.columns:
            rename_map[col] = "total_runs"

    # batsman_runs variations → batsman_runs
    for col in ["runs_off_bat", "runs_scored"]:
        if col in df.columns and "batsman_runs" not in df.columns:
            rename_map[col] = "batsman_runs"

    # Standardize team column names
    if "batting_team" in df.columns and "bat_team" not in df.columns:
        rename_map["batting_team"] = "bat_team"
    if "bowling_team" in df.columns and "bowler_team" not in df.columns:
        rename_map["bowling_team"] = "bowler_team"

    # Apply renames
    if rename_map:
        df = df.rename(columns=rename_map)

    # Ensure required columns exist with defaults
    if "innings" not in df.columns:
        df["innings"] = 1  # fallback

    if "batter" not in df.columns:
        df["batter"] = "Unknown"  # fallback

    if "total_runs" not in df.columns:
        df["total_runs"] = 0

    if "batsman_runs" not in df.columns:
        df["batsman_runs"] = 0

    return df


def _standardize_team_names(df: pd.DataFrame, column: str) -> pd.DataFrame:
    """
    Apply basic team name standardization using a mapping dictionary.
    
    Args:
        df: Input DataFrame
        column: Name of the column containing team names
        
    Returns:
        DataFrame with standardized team names
    """
    if column not in df.columns:
        return df
        
    mapping: Dict[str, str] = {
        "Royal Challengers Bangalore": "RCB",
        "Royal Challengers Bengaluru": "RCB",
        "Delhi Daredevils": "DC",
        "Delhi Capitals": "DC",
        "Kings XI Punjab": "PBKS",
        "Punjab Kings": "PBKS",
        "Rising Pune Supergiants": "RPS",
        "Gujarat Lions": "GL",
        "Pune Warriors India": "PWI",
        "Kochi Tuskers Kerala": "KTK",
        "Rising Pune Supergiant": "RPS",
        "Deccan Chargers": "DC",
        "Sunrisers Hyderabad": "SRH",
        "Mumbai Indians": "MI",
        "Chennai Super Kings": "CSK",
        "Kolkata Knight Riders": "KKR",
        "Rajasthan Royals": "RR"
    }
    
    df[column] = df[column].astype(str).str.strip().replace(mapping)
    return df


def _standardize_player_names(df: pd.DataFrame, column: str) -> pd.DataFrame:
    """
    Strip whitespace and normalize basic formatting of player names.
    """
    if column in df.columns:
        df[column] = df[column].astype(str).str.strip()
    return df


def clean_matches(
    input_path: Union[str, Path], 
    output_dir: Union[str, Path]
) -> pd.DataFrame:
    """
    Clean raw matches data and save cleaned version.
    This function is kept for backward compatibility but most logic is now in clean_all().
    """
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Read the input file
    df = pd.read_csv(input_path, low_memory=False)
    
    # Standardize column names
    df.columns = df.columns.str.lower().str.strip()
    
    # Standardize team names
    for col in ["team1", "team2", "toss_winner", "winner"]:
        if col in df.columns:
            df[col] = _standardize_team_names(df, col)[col]
    
    # Save cleaned data
    output_path = output_dir / "matches_clean.csv"
    df.to_csv(output_path, index=False)
    print(f"✅ Cleaned matches data saved to {output_path} ({len(df)} rows)")
    
    return df


def clean_players(
    input_path: Union[str, Path], 
    output_dir: Union[str, Path]
) -> pd.DataFrame:
    """
    Clean raw players data and save cleaned version.
    This function is kept for backward compatibility but most logic is now in clean_all().
    """
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Read the input file
    df = pd.read_csv(input_path, low_memory=False)
    
    # Standardize column names
    df.columns = df.columns.str.lower().str.strip()
    
    # Standardize player names
    if "player_name" in df.columns:
        df["player_name"] = _standardize_player_names(df, "player_name")["player_name"]
    
    # Standardize team names if team column exists
    if "team" in df.columns:
        df["team"] = _standardize_team_names(df, "team")["team"]
    
    # Save cleaned data
    output_path = output_dir / "players_clean.csv"
    df.to_csv(output_path, index=False)
    print(f"✅ Cleaned players data saved to {output_path} ({len(df)} rows)")
    
    return df


def clean_deliveries(
    input_path: Union[str, Path], 
    output_dir: Union[str, Path]
) -> pd.DataFrame:
    """
    Clean raw deliveries data and save cleaned version.
    This function is kept for backward compatibility but most logic is now in clean_all().
    """
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    
    try:
        # Read the input file
        df = pd.read_csv(input_path, low_memory=False)
        print(f"Read {len(df)} rows from {input_path}")
        
        # Standardize column names and handle variations
        df = normalize_deliveries_columns(df)
        
        # Standardize team names
        for col in ["bat_team", "bowler_team"]:
            if col in df.columns:
                df[col] = _standardize_team_names(df, col)[col]
        
        # Ensure required columns have proper data types
        numeric_cols = ["total_runs", "batsman_runs", "extra_runs", "non_boundary", "is_wicket"]
        for col in numeric_cols:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0).astype(int)
        
        # Save cleaned data
        output_path = output_dir / "deliveries_clean.csv"
        df.to_csv(output_path, index=False)
        print(f"✅ Cleaned deliveries data saved to {output_path} ({len(df)} rows)")
        
        return df
        
    except Exception as e:
        error_msg = f"Error cleaning deliveries data: {str(e)}"
        print(f"❌ {error_msg}")
        raise ValueError(error_msg)


def clean_all(raw_dir: Union[str, Path], processed_dir: Union[str, Path]) -> str:
    
    print("🚀 Starting data cleaning process...")
    
    # Convert to Path objects
    raw_dir = Path(raw_dir)
    processed_dir = Path(processed_dir)
    processed_dir.mkdir(parents=True, exist_ok=True)
    
    try:
        # ------------------- LOAD RAW FILES --------------------
        matches_path = raw_dir / "matches.csv"
        deliveries_path = raw_dir / "deliveries.csv"
        players_path = raw_dir / "players.csv"

        if not matches_path.exists() and not deliveries_path.exists():
            raise FileNotFoundError("No input CSV files found. Need at least matches.csv or deliveries.csv in the raw directory.")

        # ------------------- PROCESS MATCHES --------------------
        if matches_path.exists():
            print("🔍 Processing matches data...")
            dfm = pd.read_csv(matches_path, low_memory=False)
            print(f"   Found {len(dfm)} matches")
            
            # Standardize column names
            dfm.columns = dfm.columns.str.lower().str.strip()
            
            # Standardize team names
            for col in ["team1", "team2", "toss_winner", "winner"]:
                if col in dfm.columns:
                    dfm[col] = _standardize_team_names(dfm, col)[col]
            
            # Convert date column to datetime if it exists
            if "date" in dfm.columns:
                dfm["date"] = pd.to_datetime(dfm["date"], errors="coerce")
            
            # Ensure match_id is present or create one
            if "match_id" not in dfm.columns and "match_number" in dfm.columns:
                dfm = dfm.rename(columns={"match_number": "match_id"})
            
            # Save cleaned matches
            matches_output = processed_dir / "matches_clean.csv"
            dfm.to_csv(matches_output, index=False)
            print(f"✅ Cleaned matches saved to {matches_output}")
        else:
            print("ℹ️ No matches.csv found, skipping matches processing")
            dfm = None

        # ------------------- PROCESS DELIVERIES --------------------
        if deliveries_path.exists():
            print("🔍 Processing deliveries data...")
            dfd = pd.read_csv(deliveries_path, low_memory=False)
            print(f"   Found {len(dfd)} deliveries")
            
            # Apply column normalization
            dfd = normalize_deliveries_columns(dfd)
            
            # Standardize team names in deliveries
            for col in ["bat_team", "bowler_team"]:
                if col in dfd.columns:
                    dfd[col] = _standardize_team_names(dfd, col)[col]
            
            # Ensure numeric columns have correct types
            numeric_cols = ["total_runs", "batsman_runs", "extra_runs", "non_boundary", "is_wicket"]
            for col in numeric_cols:
                if col in dfd.columns:
                    dfd[col] = pd.to_numeric(dfd[col], errors='coerce').fillna(0).astype(int)
            
            # Save cleaned deliveries
            deliveries_output = processed_dir / "deliveries_clean.csv"
            dfd.to_csv(deliveries_output, index=False)
            print(f"✅ Cleaned deliveries saved to {deliveries_output}")
        else:
            print("ℹ️ No deliveries.csv found, skipping deliveries processing")
            dfd = None

        # ------------------- PROCESS PLAYERS --------------------
        if players_path.exists():
            print("🔍 Processing players data...")
            try:
                dfp = pd.read_csv(players_path, low_memory=False)
                print(f"   Found {len(dfp)} players")
                
                # Standardize player names
                name_cols = ["player_name", "player", "name", "full_name"]
                name_col = next((col for col in name_cols if col in dfp.columns), None)
                
                if name_col:
                    if name_col != "player_name":
                        dfp = dfp.rename(columns={name_col: "player_name"})
                    
                    # Clean player names
                    dfp["player_name"] = dfp["player_name"].astype(str).str.strip()
                    
                    # Standardize team names if team column exists
                    if "team" in dfp.columns:
                        dfp["team"] = _standardize_team_names(dfp, "team")["team"]
                    
                    # Save cleaned players
                    players_output = processed_dir / "players_clean.csv"
                    dfp.to_csv(players_output, index=False)
                    print(f"✅ Cleaned players saved to {players_output}")
                else:
                    print("⚠️ Could not find player name column in players data")
                    
            except Exception as e:
                print(f"⚠️ Error processing players data: {str(e)}")
        else:
            print("ℹ️ No players.csv found, skipping players processing")

        # ------------------- FINAL VALIDATION --------------------
        print("\n🔍 Validating cleaned data...")
        if dfm is not None and dfd is not None:
            # Check if there are common match_ids between matches and deliveries
            common_matches = set(dfm["match_id"].unique()) & set(dfd["match_id"].unique())
            print(f"   Found {len(common_matches)} common match IDs between matches and deliveries")
            
            if not common_matches:
                print("⚠️ WARNING: No common match IDs found between matches and deliveries data")
        
        print("\n✨ Data cleaning completed successfully!")
        return "Cleaning complete ✅"
        
    except Exception as e:
        error_msg = f"❌ Error during cleaning: {str(e)}"
        print(error_msg)
        raise ValueError(error_msg)


def main():
    """CLI entry point for running cleaning directly."""
    import argparse
    
    parser = argparse.ArgumentParser(description='Clean raw cricket data')
    parser.add_argument('--raw-dir', type=str, default='data/raw',
                       help='Directory containing raw CSV files')
    parser.add_argument('--processed-dir', type=str, default='data/processed',
                       help='Directory to save cleaned CSV files')
    
    args = parser.parse_args()
    clean_all(args.raw_dir, args.processed_dir)


if __name__ == "__main__":
    main()




