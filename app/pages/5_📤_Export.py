"""
Streamlit page for exporting data to Power BI.

Integrates with:
- src/visualization/export_for_powerbi.py
"""

from __future__ import annotations

import sys
import os

# Add the project root directory to sys.path
# This allows imports from src/ to work correctly
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

import streamlit as st

from src.visualization.export_for_powerbi import export_for_powerbi


def main() -> None:
    st.set_page_config(page_title="Export to Power BI", page_icon="📈", layout="wide")
    st.title("📈 Export to Power BI")
    st.write(
        """
        Export curated analytics tables (facts and dimensions) as CSVs under
        `data/analytics/` for direct consumption by Power BI.
        
        This will create a star schema with:
        - **Dimension tables**: dim_players, dim_teams, dim_venues
        - **Fact tables**: fact_matches, fact_deliveries, fact_player_innings
        """
    )

    col1, col2 = st.columns([2, 1])
    
    with col1:
        include_predictions = st.checkbox(
            "Include predictions (if models are trained)",
            value=False,
            help="Export ML model predictions (requires trained models)"
        )
    
    with col2:
        if st.button("🚀 Export Cleaned Data", type="primary", width='stretch'):
            try:
                with st.spinner("Exporting data for Power BI..."):
                    outputs = export_for_powerbi(include_predictions=include_predictions)
                
                st.success(f"✅ Export completed! {len(outputs)} tables exported.")
                
                st.markdown("#### 📊 Exported Files")
                
                # Group by type
                dim_tables = [k for k in outputs.keys() if k.startswith("dim_")]
                fact_tables = [k for k in outputs.keys() if k.startswith("fact_")]
                
                if dim_tables:
                    st.markdown("**Dimension Tables:**")
                    for name in sorted(dim_tables):
                        path = outputs[name]
                        file_size = os.path.getsize(path) / 1024  # KB
                        st.write(f"- `{name}` → `{path}` ({file_size:.1f} KB)")
                
                if fact_tables:
                    st.markdown("**Fact Tables:**")
                    for name in sorted(fact_tables):
                        path = outputs[name]
                        file_size = os.path.getsize(path) / 1024  # KB
                        st.write(f"- `{name}` → `{path}` ({file_size:.1f} KB)")
                
                # Show export location
                st.info(f"📁 All files exported to: `data/analytics/`")
                
            except Exception as exc:
                st.error(f"❌ Failed to export data: {exc}")
                st.exception(exc)

    st.divider()
    
    st.markdown("### 📖 Importing into Power BI")
    
    with st.expander("Step-by-Step Instructions", expanded=True):
        st.markdown(
            """
            #### 1. Open Power BI Desktop
            - Launch Power BI Desktop application
            
            #### 2. Get Data
            - Click **Home → Get Data → Text/CSV**
            - Navigate to the `data/analytics/` folder in your project
            - Select all CSV files (or import them one by one)
            - Click **Load** or **Transform Data** if you need to clean further
            
            #### 3. Configure Data Model
            - Switch to **Model** view (left sidebar)
            - Create relationships:
              - `dim_players[player_name]` → `fact_player_innings[player_name]`
              - `dim_teams[team_name]` → `fact_matches[team1]` and `fact_matches[team2]`
              - `dim_venues[venue_name]` → `fact_matches[venue]`
              - `fact_matches[match_id]` → `fact_deliveries[match_id]`
              - `fact_matches[match_id]` → `fact_player_innings[match_id]`
            
            #### 4. Build Visualizations
            - Use **Report** view to create visuals
            - Suggested visuals:
              - Run distribution charts
              - Top scorers/wicket-takers leaderboards
              - Venue performance comparisons
              - Toss impact analysis
              - Team win rates
            
            #### 5. Publish & Share
            - Click **Publish** to save to Power BI Service
            - Share with your team or create dashboards
            """
        )
    
    st.markdown("### 📚 Data Model Schema")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("**Dimension Tables:**")
        st.code(
            """
            dim_players
            ├── player_name (PK)
            ├── player_id
            ├── team
            ├── role
            └── batting_style, bowling_style
            
            dim_teams
            ├── team_id (PK)
            └── team_name
            
            dim_venues
            ├── venue_id (PK)
            └── venue_name
            """,
            language="text"
        )
    
    with col2:
        st.markdown("**Fact Tables:**")
        st.code(
            """
            fact_matches
            ├── match_id (PK)
            ├── team1, team2 → dim_teams
            ├── venue → dim_venues
            ├── date, toss_winner, result
            └── ...
            
            fact_deliveries
            ├── match_id → fact_matches
            ├── innings, over, ball_no
            ├── striker, bowler → dim_players
            └── runs, wickets, extras
            
            fact_player_innings
            ├── match_id → fact_matches
            ├── player_name → dim_players
            ├── runs_scored, wickets, economy
            └── strike_rate, ...
            """,
            language="text"
        )
    
    st.markdown("### 💡 Tips")
    st.info(
        """
        - **Refresh Data**: Re-run the export when you have new scraped data
        - **Data Types**: Power BI will auto-detect types, but verify date columns
        - **Relationships**: Ensure match_id and player_name are consistent across tables
        - **Performance**: For large datasets, consider using DirectQuery or aggregating in Power Query
        """
    )


if __name__ == "__main__":
    main()


