

from __future__ import annotations

import os
from typing import Literal, Tuple

import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns


PROCESSED_DIR = "data/processed"


def _load_csv(name: str) -> pd.DataFrame:
    path = os.path.join(PROCESSED_DIR, name)
    if not os.path.isfile(path):
        raise FileNotFoundError(f"Processed file not found: {path}")
    return pd.read_csv(path)


def get_top_scorers(n: int = 10) -> pd.DataFrame:
    """
    Return a table of top run scorers.

    This example assumes `fact_deliveries.csv` has `batter` and `batsman_runs`.
    """
    df = _load_csv("fact_deliveries.csv")
    if "batter" not in df.columns or "batsman_runs" not in df.columns:
        raise ValueError("Required columns missing in fact_deliveries.csv")

    agg = (
        df.groupby("batter")["batsman_runs"]
        .sum()
        .reset_index()
        .rename(columns={"batter": "player_name", "batsman_runs": "total_runs"})
    )
    agg = agg.sort_values("total_runs", ascending=False).head(n)
    return agg


def get_wicket_takers(n: int = 10) -> pd.DataFrame:
    """
    Return top wicket takers by count of dismissals.
    """
    df = _load_csv("fact_deliveries.csv")
    if "bowler" not in df.columns or "player_dismissed" not in df.columns:
        raise ValueError("Required columns missing in fact_deliveries.csv")

    wickets = df[df["player_dismissed"].notna()]
    agg = (
        wickets.groupby("bowler")["player_dismissed"]
        .count()
        .reset_index()
        .rename(columns={"bowler": "player_name", "player_dismissed": "wickets"})
    )
    agg = agg.sort_values("wickets", ascending=False).head(n)
    return agg


def get_venue_performance() -> pd.DataFrame:
    """
    Aggregate average scores per venue.
    """
    deliveries = _load_csv("fact_deliveries.csv")
    matches = _load_csv("fact_matches.csv")

    if "match_id" not in deliveries.columns or "match_id" not in matches.columns:
        raise ValueError("match_id missing in input tables")

    innings_totals = (
        deliveries.groupby(["match_id", "innings"])["total_runs"].sum().reset_index()
    )
    merged = innings_totals.merge(
        matches[["match_id", "venue"]],
        on="match_id",
        how="left",
    )

    venue_stats = (
        merged.groupby("venue")["total_runs"].mean().reset_index()
        if "venue" in merged.columns
        else merged
    )
    venue_stats = venue_stats.rename(columns={"total_runs": "avg_innings_score"})
    return venue_stats


def get_toss_impact() -> pd.DataFrame:
    """
    Analyze toss impact by decision and result.
    """
    matches = _load_csv("fact_matches.csv")
    required = {"toss_winner", "toss_decision", "result"}
    if not required.issubset(matches.columns):
        raise ValueError(f"Required columns missing: {required}")

    # Example: interpret result text to derive winner field
    matches = matches.copy()
    matches["toss_won_and_match_won"] = matches.apply(
        lambda row: 1
        if isinstance(row.get("result"), str)
        and isinstance(row.get("toss_winner"), str)
        and row["toss_winner"].lower() in row["result"].lower()
        else 0,
        axis=1,
    )

    agg = (
        matches.groupby("toss_decision")["toss_won_and_match_won"]
        .mean()
        .reset_index()
        .rename(
            columns={
                "toss_won_and_match_won": "win_rate_when_toss_won",
            }
        )
    )
    return agg


def get_run_distributions(by: Literal["innings", "over", "team"] = "innings") -> pd.DataFrame:
    """
    Return run distribution grouped by innings / over / team.
    """
    deliveries = _load_csv("fact_deliveries.csv")

    if by == "innings":
        group_cols = ["match_id", "innings"]
    elif by == "over":
        group_cols = ["match_id", "innings", "over"]
    elif by == "team":
        group_cols = ["match_id", "batting_team"]
    else:
        raise ValueError(f"Unsupported grouping: {by}")

    missing = [c for c in group_cols if c not in deliveries.columns]
    if missing:
        raise ValueError(f"Required columns missing in fact_deliveries.csv: {missing}")

    dist = (
        deliveries.groupby(group_cols)["total_runs"]
        .sum()
        .reset_index()
        .rename(columns={"total_runs": "runs"})
    )
    return dist


def plot_distribution(
    df: pd.DataFrame, x: str, y: str, title: str
) -> Tuple[plt.Figure, plt.Axes]:
    """
    Generic helper to plot a bar/line distribution using seaborn.

    Returns a Matplotlib Figure and Axes, which Streamlit can render.
    """
    fig, ax = plt.subplots(figsize=(10, 6))
    sns.barplot(data=df, x=x, y=y, ax=ax)
    ax.set_title(title)
    ax.set_xlabel(x)
    ax.set_ylabel(y)
    fig.tight_layout()
    return fig, ax


def main() -> None:
    """
    Example CLI usage for manual inspection.
    """
    top_scorers = get_top_scorers()
    print(top_scorers.head())


if __name__ == "__main__":
    main()


