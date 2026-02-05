## Power BI Dashboard – Cricket Performance Insights

This directory is intended for **Power BI reports and documentation** based on the datasets exported by the Python pipeline.

---

### Source Data Location

All datasets consumed by Power BI should be exported into:

- `data/analytics/`

Common tables you may want to create via `export_for_powerbi.py`:

- `dim_players.csv`
- `dim_teams.csv`
- `dim_venues.csv`
- `fact_matches.csv`
- `fact_deliveries.csv`
- `fact_player_innings.csv`
- `fact_predictions.csv` (optional, from ML outputs)

---

### Recommended Data Model

- **Dimensions**
  - `dim_players`: Player-level attributes (name, role, batting/bowling style, team history).
  - `dim_teams`: Team attributes (short name, full name, country, franchise).
  - `dim_venues`: Stadium and location attributes (city, country, ground name).

- **Facts**
  - `fact_matches`: One row per match; toss result, venue, teams, result, margin, etc.
  - `fact_deliveries`: Ball-by-ball data; runs, wickets, bowler, batter, over/ball, extras.
  - `fact_player_innings`: Aggregated stats for each player per innings/match.
  - `fact_predictions`: Model outputs such as win probabilities and predicted scores.

Ensure primary keys and foreign keys are consistent:

- `match_id` links `fact_matches`, `fact_deliveries`, and `fact_player_innings`.
- `player_id` links facts to `dim_players`.
- `team_id` links facts to `dim_teams`.
- `venue_id` links `fact_matches` to `dim_venues`.

---

### Importing Data into Power BI

1. Open **Power BI Desktop**.
2. Go to **Home → Get Data → Text/CSV**.
3. Select each CSV file from the `data/analytics/` folder.
4. Load them into the model (or transform in Power Query if needed).
5. In **Model view**, create relationships:
   - `dim_players[player_id]` → `fact_player_innings[player_id]`
   - `dim_teams[team_id]` → `fact_matches[team1_id]` / `fact_matches[team2_id]`
   - `dim_venues[venue_id]` → `fact_matches[venue_id]`
   - `fact_matches[match_id]` → `fact_deliveries[match_id]` and `fact_player_innings[match_id]`

---

### Suggested Visuals & KPIs

- **Run Distribution**
  - Histogram or box plot of runs by innings, team, venue, or over.

- **Top Scorers & Wicket-Takers**
  - Bar charts or leaderboards by season, tournament, or venue.

- **Toss Impact**
  - Matrix or stacked bar chart comparing win % by toss decision (bat vs bowl) and venue.

- **Venue Stats**
  - Average first-innings and second-innings scores per venue.
  - Win % by chasing vs defending at each ground.

- **Model-Based Insights (Optional)**
  - Cards for predicted innings scores.
  - Line or area charts for win probability over overs.

---

### Version Control & Sharing

- Store `.pbix` files in this `dashboard/` directory.
- Optionally export **Power BI templates** (`.pbit`) for sharing with different data sources.
- Document any custom measures (DAX) and calculated columns in this file or a dedicated `DAX_Notes.md`.


