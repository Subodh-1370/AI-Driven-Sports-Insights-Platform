

from __future__ import annotations

import csv
import os
from typing import Dict, Iterable, List, Optional

from bs4 import BeautifulSoup

from .scrape_matches import (
    BASE_URL,
    RAW_DIR,
    PLAYERS_CSV,
    fetch_html,
    parse_match_list_page,
    parse_player_stats,
)


def _ensure_dir(path: str) -> None:
    os.makedirs(path, exist_ok=True)


def _write_dicts_to_csv(path: str, records: Iterable[Dict[str, Optional[str]]]) -> str:
    """
    Append dictionaries to a CSV file (create file + header if needed).
    """
    _ensure_dir(os.path.dirname(path))
    records = list(records)
    if not records:
        return path

    fieldnames = sorted({k for rec in records for k in rec.keys()})
    file_exists = os.path.isfile(path)

    with open(path, mode="a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        if not file_exists:
            writer.writeheader()
        for rec in records:
            writer.writerow(rec)
    return path


def scrape_players_from_matches(match_urls: List[str], output_dir: str = RAW_DIR) -> str:
    """
    Scrape player batting + bowling stats from a list of full-scorecard URLs.
    """
    all_players: List[Dict[str, Optional[str]]] = []
    for idx, url in enumerate(match_urls, start=1):
        try:
            print(f"[scrape_players_from_matches] ({idx}/{len(match_urls)}) {url}")
            html = fetch_html(url)
            soup = BeautifulSoup(html, "lxml")
            rows = parse_player_stats(soup, url=url)
            all_players.extend(rows)
        except Exception as exc:  # pragma: no cover
            print(f"[scrape_players_from_matches] ERROR scraping {url}: {exc}")
            continue

    players_path = os.path.join(output_dir, os.path.basename(PLAYERS_CSV))
    _write_dicts_to_csv(players_path, all_players)

    print(
        f"[scrape_players_from_matches] Done. "
        f"{len(all_players)} player rows → {players_path}"
    )
    return players_path


def scrape_players(player_index_url: str, output_dir: str = RAW_DIR) -> str:
    
    print(f"[scrape_players] Entry URL: {player_index_url}")

    if "/full-scorecard" in player_index_url:
        match_urls = [player_index_url]
    else:
        html = fetch_html(player_index_url)
        match_urls = parse_match_list_page(html)

    return scrape_players_from_matches(match_urls, output_dir=output_dir)


def main() -> None:
    """
    Simple CLI test.
    """
    example_season_url = (
        f"{BASE_URL}/cricket-series/ipl-2023-1345038/match-schedule-fixtures-and-results"
    )
    scrape_players(example_season_url, output_dir=RAW_DIR)


if __name__ == "__main__":
    main()




