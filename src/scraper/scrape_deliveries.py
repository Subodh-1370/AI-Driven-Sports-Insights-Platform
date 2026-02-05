"""
ESPNcricinfo ball-by-ball (deliveries) scraper.

This module focuses on extracting **ball-by-ball** data from an ESPNcricinfo
commentary / ball-by-ball page associated with a match. In many cases, the
URL pattern is similar to:

    https://www.espncricinfo.com/series/.../ball-by-ball-commentary

For convenience, you can also attempt to use some full-scorecard pages if
they contain a ball-by-ball table, but the main target is the dedicated
ball-by-ball commentary.

Extracted fields (per delivery):
- match_id
- innings
- over
- ball_no (ball within over)
- batting_team
- bowling_team
- batsman
- bowler
- runs_off_bat
- extras
- total_runs
- wicket_type
- dismissal_player

Output (appended):
- data/raw/deliveries.csv

Key helpers:
- fetch_html(url)
- parse_ball_by_ball(soup, url)
- scrape_deliveries_for_matches(match_urls, output_dir)
"""

from __future__ import annotations

import csv
import os
import re
import time
from typing import Dict, Iterable, List, Optional

import requests
from bs4 import BeautifulSoup
from requests import Response

BASE_URL = "https://www.espncricinfo.com"
RAW_DIR = "data/raw"
DELIVERIES_CSV = os.path.join(RAW_DIR, "deliveries.csv")


# ---------------------------------------------------------------------------
# HTTP helper with retries
# ---------------------------------------------------------------------------

def fetch_html(url: str, retries: int = 3, backoff: float = 2.0, timeout: int = 15) -> str:
    """
    Fetch raw HTML from a URL with basic retry/backoff.
    """
    last_exc: Optional[Exception] = None
    for attempt in range(1, retries + 1):
        try:
            print(f"[fetch_html] GET {url} (attempt {attempt}/{retries})")
            resp: Response = requests.get(
                url,
                timeout=timeout,
                headers={"User-Agent": "Mozilla/5.0 (compatible; CricketAnalyticsBot/1.0)"},
            )
            resp.raise_for_status()
            return resp.text
        except Exception as exc:  # pragma: no cover
            last_exc = exc
            print(f"[fetch_html] Error on attempt {attempt}: {exc}")
            if attempt < retries:
                wait_s = backoff * attempt
                print(f"[fetch_html] Sleeping {wait_s:.1f}s before retry...")
                time.sleep(wait_s)
    assert last_exc is not None
    raise last_exc


def _ensure_dir(path: str) -> None:
    os.makedirs(path, exist_ok=True)


def _extract_match_id_from_url(url: str) -> str:
    parts = url.rstrip("/").split("/")
    for part in reversed(parts):
        m = re.search(r"(\d+)$", part)
        if m:
            return m.group(1)
    return parts[-1]


# ---------------------------------------------------------------------------
# Parsing helpers
# ---------------------------------------------------------------------------

def parse_ball_by_ball(soup: BeautifulSoup, url: str) -> List[Dict[str, Optional[str]]]:
    """
    Parse ball-by-ball commentary into a list of delivery dictionaries.

    ESPNcricinfo's commentary pages are React-based and can change structure;
    this implementation uses conservative selectors and may need adjustment
    for specific tournaments, but it demonstrates the full extraction
    pipeline and returns structured rows.
    """
    match_id = _extract_match_id_from_url(url)
    deliveries: List[Dict[str, Optional[str]]] = []

    # ESPNcricinfo often groups commentary by overs/innings in blocks.
    # A relatively stable selector pattern for ball rows:
    #   div[data-testid='commentary-entry']
    entry_divs = soup.select("div[data-testid='commentary-entry']")

    innings_number = 1
    for entry in entry_divs:
        # Over + ball string, e.g., "7.3"
        over_ball_el = entry.select_one("span.ds-text-tight-xs")
        if not over_ball_el:
            continue
        over_ball_text = over_ball_el.get_text(strip=True)
        if not re.match(r"^\d+\.\d+$", over_ball_text):
            # Could be "End of over" or other commentary; skip
            continue

        try:
            over_str, ball_str = over_ball_text.split(".")
            over = int(over_str)
            ball_no = int(ball_str)
        except ValueError:
            continue

        # Description text often contains batsman, bowler, result.
        desc_el = entry.select_one("p")
        desc_text = desc_el.get_text(" ", strip=True) if desc_el else ""

        # Batsman / bowler heuristics (very approximate).
        batsman = None
        bowler = None

        player_spans = entry.select("a[data-hover='player']")
        if player_spans:
            # First player is usually batsman, second is bowler (this is heuristic)
            batsman = player_spans[0].get_text(strip=True)
            if len(player_spans) > 1:
                bowler = player_spans[1].get_text(strip=True)

        # Runs & extras: basic pattern search
        runs_off_bat = 0
        extras = 0
        wicket_type = None
        dismissal_player = None

        # Wicket detection
        if "OUT" in desc_text.upper() or "out" in desc_text.lower():
            wicket_type = "dismissal"
            dismissal_player = batsman

        # Run detection (very rough examples)
        if "FOUR" in desc_text.upper():
            runs_off_bat = 4
        elif "SIX" in desc_text.upper():
            runs_off_bat = 6
        elif "no run" in desc_text.lower():
            runs_off_bat = 0
        else:
            m_runs = re.search(r"(\d+) run", desc_text)
            if m_runs:
                runs_off_bat = int(m_runs.group(1))

        # Extras heuristic
        if any(x in desc_text.lower() for x in ["wide", "no ball", "bye", "leg bye"]):
            extras = max(0, 1)

        total_runs = runs_off_bat + extras

        deliveries.append(
            {
                "match_id": match_id,
                "innings": str(innings_number),
                "over": str(over),
                "ball_no": str(ball_no),
                "batting_team": None,  # can be derived later from context
                "bowling_team": None,
                "batsman": batsman,
                "bowler": bowler,
                "runs_off_bat": str(runs_off_bat),
                "extras": str(extras),
                "total_runs": str(total_runs),
                "wicket_type": wicket_type,
                "dismissal_player": dismissal_player,
                "description": desc_text,
            }
        )

    print(f"[parse_ball_by_ball] Parsed {len(deliveries)} deliveries for match {match_id}")
    return deliveries


# ---------------------------------------------------------------------------
# CSV writer
# ---------------------------------------------------------------------------

def _write_dicts_to_csv(path: str, records: Iterable[Dict[str, Optional[str]]]) -> str:
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


# ---------------------------------------------------------------------------
# Public orchestrator
# ---------------------------------------------------------------------------

def scrape_deliveries_for_matches(match_urls: List[str], output_dir: str = RAW_DIR) -> str:
    """
    Scrape ball-by-ball data for a list of commentary/ball-by-ball URLs.

    NOTE:
        - For full-scorecard URLs, you typically need to replace the last segment
          with `/ball-by-ball-commentary` to get full delivery-level data.
    """
    all_deliveries: List[Dict[str, Optional[str]]] = []

    for idx, url in enumerate(match_urls, start=1):
        try:
            print(f"[scrape_deliveries_for_matches] ({idx}/{len(match_urls)}) {url}")
            html = fetch_html(url)
            soup = BeautifulSoup(html, "lxml")
            rows = parse_ball_by_ball(soup, url=url)
            all_deliveries.extend(rows)
        except Exception as exc:  # pragma: no cover
            print(f"[scrape_deliveries_for_matches] ERROR scraping {url}: {exc}")
            continue

    deliveries_path = os.path.join(output_dir, os.path.basename(DELIVERIES_CSV))
    _write_dicts_to_csv(deliveries_path, all_deliveries)

    print(
        f"[scrape_deliveries_for_matches] Done. "
        f"{len(all_deliveries)} deliveries → {deliveries_path}"
    )
    return deliveries_path


def main() -> None:
    """
    Simple manual test stub.
    """
    example_urls: List[str] = [
        # Replace with real ball-by-ball commentary URLs
        f"{BASE_URL}/series/example-series-12345/match-1-ball-by-ball-commentary",
    ]
    scrape_deliveries_for_matches(example_urls, output_dir=RAW_DIR)


if __name__ == "__main__":
    main()




