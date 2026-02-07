

from __future__ import annotations

import csv
import os
import re
import time
from typing import Dict, Iterable, List, Optional, Tuple

import requests
from bs4 import BeautifulSoup
from requests import Response

BASE_URL = "https://www.espncricinfo.com"
RAW_DIR = "data/raw"
MATCHES_CSV = os.path.join(RAW_DIR, "matches.csv")
PLAYERS_CSV = os.path.join(RAW_DIR, "players.csv")


# ---------------------------------------------------------------------------
# HTTP helper with retries
# ---------------------------------------------------------------------------

def fetch_html(url: str, retries: int = 3, backoff: float = 2.0, timeout: int = 15) -> str:
    """
    Fetch raw HTML from a URL with retry + backoff.

    Raises the last exception if all retries fail.
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
        except Exception as exc:  # pragma: no cover - network dependent
            last_exc = exc
            print(f"[fetch_html] Error on attempt {attempt}: {exc}")
            if attempt < retries:
                sleep_for = backoff * attempt
                print(f"[fetch_html] Sleeping {sleep_for:.1f}s before retry...")
                time.sleep(sleep_for)
    assert last_exc is not None
    raise last_exc


def _ensure_dir(path: str) -> None:
    os.makedirs(path, exist_ok=True)


# ---------------------------------------------------------------------------
# Parsing helpers
# ---------------------------------------------------------------------------

def _extract_match_id_from_url(url: str) -> str:
    """
    Extract a stable numeric match_id from an ESPNcricinfo scorecard URL.
    """
    parts = url.rstrip("/").split("/")
    for part in reversed(parts):
        m = re.search(r"(\d+)$", part)
        if m:
            return m.group(1)
    return parts[-1]


def parse_match_info(soup: BeautifulSoup, url: str) -> Dict[str, Optional[str]]:
    """
    Parse match metadata from a full-scorecard page.

    Returns:
        {
          "match_id", "date", "venue", "team1", "team2",
          "toss_winner", "toss_decision", "result"
        }
    """
    match_id = _extract_match_id_from_url(url)

    # --- Teams ---
    team_names: List[str] = []
    for team_el in soup.select("div.ds-flex.ds-items-center span.ds-text-tight-l"):
        name = team_el.get_text(strip=True)
        if name and name not in team_names:
            team_names.append(name)
    team1 = team_names[0] if len(team_names) >= 1 else None
    team2 = team_names[1] if len(team_names) >= 2 else None

    # --- Date & Venue ---
    date: Optional[str] = None
    venue: Optional[str] = None
    info_block = soup.select_one("div.ds-text-tight-xs.ds-font-regular.ds-text-typo-mid3")
    if info_block:
        text = info_block.get_text(" ", strip=True)
        parts = [p.strip() for p in text.split("•") if p.strip()]
        if parts:
            date = parts[0]
        if len(parts) >= 2:
            venue = parts[1]

    # --- Toss & Result ---
    toss_winner: Optional[str] = None
    toss_decision: Optional[str] = None
    result: Optional[str] = None

    result_el = soup.select_one("p.ds-text-tight-m.ds-font-regular.ds-truncate")
    if result_el:
        result = result_el.get_text(" ", strip=True)

    toss_nodes = soup.find_all(
        string=lambda t: isinstance(t, str) and "won the toss and elected to" in t.lower()
    )
    if toss_nodes:
        toss_text = toss_nodes[0].strip()
        m = re.search(r"(.+?) won the toss and elected to ([a-zA-Z ]+)", toss_text)
        if m:
            toss_winner = m.group(1).strip()
            toss_decision = m.group(2).strip()

    return {
        "match_id": match_id,
        "date": date,
        "venue": venue,
        "team1": team1,
        "team2": team2,
        "toss_winner": toss_winner,
        "toss_decision": toss_decision,
        "result": result,
    }


def _find_innings_team_name(table) -> Optional[str]:
    """
    Try to infer the team name associated with a batting/bowling table.
    """
    heading = table.find_previous("div", class_=re.compile("ds-text-title-xs"))
    if heading:
        text = heading.get_text(" ", strip=True)
        text = text.replace("INNINGS", "").strip()
        if text:
            return text
    return None


def parse_player_stats(soup: BeautifulSoup, url: str) -> List[Dict[str, Optional[str]]]:
    """
    Parse batting and bowling stats for all players in the match.

    Output rows (dicts):
        match_id, innings, team, player_name, record_type,
        runs, balls, fours, sixes, strike_rate,
        overs, runs_conceded, wickets, economy, dismissal
    """
    match_id = _extract_match_id_from_url(url)
    records: List[Dict[str, Optional[str]]] = []

    scorecard_tables = soup.select(
        "table.ds-w-full.ds-table.ds-table-xs.ds-table-fixed.ci-scorecard-table"
    )

    innings_counter = 0
    for table in scorecard_tables:
        header_cells = [th.get_text(strip=True) for th in table.select("thead tr th")]
        if not header_cells:
            continue

        is_batting = "Batter" in header_cells[0] or "Batters" in header_cells[0]
        is_bowling = "Bowler" in header_cells[0]
        if not (is_batting or is_bowling):
            continue

        innings_counter += 1
        team_name = _find_innings_team_name(table)
        header_index = {name: idx for idx, name in enumerate(header_cells)}

        for row in table.select("tbody tr"):
            cells = row.find_all("td")
            if not cells:
                continue

            label = cells[0].get_text(strip=True)
            # Skip non-player batting rows
            if is_batting and (
                not label
                or label.lower() in {"extras", "total", "did not bat"}
                or "yet to bat" in label.lower()
            ):
                continue

            player_name = label if (is_batting or is_bowling) else None
            dismissal = None

            batting_stats = {
                "runs": "0",
                "balls": "0",
                "fours": "0",
                "sixes": "0",
                "strike_rate": None,
            }
            bowling_stats = {
                "overs": None,
                "runs_conceded": None,
                "wickets": None,
                "economy": None,
            }

            if is_batting:
                if len(cells) > 1:
                    dismissal = cells[1].get_text(" ", strip=True)

                def _get(col_name: str) -> Optional[str]:
                    idx = header_index.get(col_name)
                    if idx is None or idx >= len(cells):
                        return None
                    return cells[idx].get_text(strip=True) or None

                batting_stats["runs"] = _get("R") or "0"
                batting_stats["balls"] = _get("B") or "0"
                batting_stats["fours"] = _get("4s") or "0"
                batting_stats["sixes"] = _get("6s") or "0"
                batting_stats["strike_rate"] = _get("SR")

                rec = {
                    "match_id": match_id,
                    "innings": str(innings_counter),
                    "team": team_name,
                    "player_name": player_name,
                    "record_type": "batting",
                    "dismissal": dismissal,
                    **batting_stats,
                    **bowling_stats,
                }
                records.append(rec)

            elif is_bowling:

                def _get(col_name: str) -> Optional[str]:
                    idx = header_index.get(col_name)
                    if idx is None or idx >= len(cells):
                        return None
                    return cells[idx].get_text(strip=True) or None

                bowling_stats["overs"] = _get("O")
                bowling_stats["runs_conceded"] = _get("R")
                bowling_stats["wickets"] = _get("W")
                bowling_stats["economy"] = _get("Econ")

                rec = {
                    "match_id": match_id,
                    "innings": str(innings_counter),
                    "team": team_name,
                    "player_name": player_name,
                    "record_type": "bowling",
                    "dismissal": dismissal,
                    **batting_stats,
                    **bowling_stats,
                }
                records.append(rec)

    print(f"[parse_player_stats] Parsed {len(records)} player rows for match {match_id}")
    return records


def parse_match_list_page(html: str) -> List[str]:
    """
    Parse a series/season page and return full-scorecard URLs.
    """
    soup = BeautifulSoup(html, "lxml")
    urls: List[str] = []
    for a in soup.select("a[href*='/full-scorecard']"):
        href = a.get("href")
        if not href:
            continue
        if not href.startswith("http"):
            href = BASE_URL.rstrip("/") + "/" + href.lstrip("/")
        if href not in urls:
            urls.append(href)
    print(f"[parse_match_list_page] Found {len(urls)} full-scorecard URLs")
    return urls


# ---------------------------------------------------------------------------
# CSV writing helpers
# ---------------------------------------------------------------------------

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


# ---------------------------------------------------------------------------
# Public high-level APIs
# ---------------------------------------------------------------------------

def scrape_match(url: str) -> Tuple[Dict[str, Optional[str]], List[Dict[str, Optional[str]]]]:
    """
    Scrape a single full-scorecard page.
    """
    print(f"[scrape_match] Scraping {url}")
    html = fetch_html(url)
    soup = BeautifulSoup(html, "lxml")
    match_info = parse_match_info(soup, url=url)
    player_rows = parse_player_stats(soup, url=url)
    return match_info, player_rows


def scrape_matches_for_season(season_url: str, output_dir: str = RAW_DIR) -> str:
    """
    Scrape all full-scorecard links found on a season/series page.

    Returns the path of the matches CSV file.
    """
    print(f"[scrape_matches_for_season] Season URL: {season_url}")
    season_html = fetch_html(season_url)
    match_urls = parse_match_list_page(season_html)

    all_matches: List[Dict[str, Optional[str]]] = []
    all_players: List[Dict[str, Optional[str]]] = []

    for idx, url in enumerate(match_urls, start=1):
        try:
            print(f"[scrape_matches_for_season] ({idx}/{len(match_urls)}) {url}")
            match_info, players = scrape_match(url)
            all_matches.append(match_info)
            all_players.extend(players)
        except Exception as exc:  # pragma: no cover - robust for scraping
            print(f"[scrape_matches_for_season] ERROR scraping {url}: {exc}")
            continue

    matches_path = os.path.join(output_dir, os.path.basename(MATCHES_CSV))
    players_path = os.path.join(output_dir, os.path.basename(PLAYERS_CSV))

    _write_dicts_to_csv(matches_path, all_matches)
    _write_dicts_to_csv(players_path, all_players)

    print(
        f"[scrape_matches_for_season] Done. "
        f"{len(all_matches)} matches → {matches_path}, "
        f"{len(all_players)} player rows → {players_path}"
    )
    return matches_path


def main() -> None:
    """
    Simple manual test entrypoint.
    """
    example_season_url = (
        f"{BASE_URL}/cricket-series/ipl-2023-1345038/match-schedule-fixtures-and-results"
    )
    scrape_matches_for_season(example_season_url, output_dir=RAW_DIR)


if __name__ == "__main__":
    main()




