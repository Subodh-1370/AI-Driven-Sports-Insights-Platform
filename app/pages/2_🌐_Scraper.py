"""
Streamlit page for running web scrapers:
- Match data
- Player data
- Deliveries (ball-by-ball)
Integrates with:
- src/scraper/scrape_matches.py
- src/scraper/scrape_players.py
- src/scraper/scrape_deliveries.py
"""

from __future__ import annotations
import sys
import os
from pathlib import Path
import io
from contextlib import redirect_stdout
import streamlit as st

# Add project root directory to sys.path
# This allows imports from src/ to work correctly
ROOT_DIR = Path(__file__).resolve().parents[2]
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

import io
from contextlib import redirect_stdout

# Import scraper functions
try:
    from src.scraper.scrape_matches import scrape_matches_for_season
    from src.scraper.scrape_players import scrape_players
    from src.scraper.scrape_deliveries import scrape_deliveries_for_matches
    SCRAPER_AVAILABLE = True
except ImportError as e:
    SCRAPER_AVAILABLE = False
    st.error(f"❌ Scraper modules not available: {e}")

def _run_with_log(func, *args, **kwargs) -> str:
    """Utility to run a function and capture its stdout output."""
    buffer = io.StringIO()
    with redirect_stdout(buffer):
        result = func(*args, **kwargs)
    log = buffer.getvalue()
    if result is not None:
        log += f"\nResult: {result}"
    return log

def _show_sample_table(path: Path, label: str) -> None:
    """Display a sample table if file exists, otherwise show a helpful message."""
    if not path.exists():
        st.info(f"📋 **{label}** - *File not found yet*\n\n`{path}`\n\n*Run scraping steps above to generate this file.*")
        return
    
    try:
        import pandas as pd
        df = pd.read_csv(path)
        if len(df) == 0:
            st.warning(f"⚠️ **{label}** - *File exists but is empty*\n\n`{path}`")
            return
        st.markdown(f"✅ **{label}**  *(from {path.name}, {len(df)} rows)*")
        st.dataframe(df.head(10))
    except Exception as exc:
        st.error(f"❌ Failed to read {label} from {path}: {exc}")

def _check_raw_data_exists() -> bool:
    """Check if any raw data files exist."""
    try:
        import os
        RAW_DIR = Path("data/raw")
        if not RAW_DIR.exists():
            return False
        
        raw_files = list(RAW_DIR.glob("*.csv"))
        return any(
            f.name.startswith(prefix) 
            for f in raw_files 
            for prefix in ["matches", "players", "deliveries"]
        )
    except Exception:
        return False

def main() -> None:
    """Main function for Scraper page."""
    st.set_page_config(
        page_title="🌐 Data Scraper",
        page_icon="🕸️",
        layout="wide"
    )
    
    # Enhanced CSS for professional look
    st.markdown("""<style>
    .stApp {
        background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #312e81 100%);
    }
    .stButton > button {
        background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 12px;
        font-weight: 600;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        margin: 8px 0;
    }
    .stButton > button:hover {
        background: linear-gradient(135deg, #60a5fa, #2563eb);
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
    }
    .stTextArea {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
    }
    .stTextInput > div > div > input {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
    }
    </style>""", unsafe_allow_html=True)
    
    st.title("🌐 Data Scraper")
    st.write("""
        Use this page to trigger web scrapers that collect:
        - Match metadata
        - Player profiles  
        - Ball-by-ball deliveries
        Results are written as raw CSVs under `data/raw/`.
    """)
    
    if not SCRAPER_AVAILABLE:
        st.error("⚠️ Scraper modules are not available. Please check the src/scraper directory.")
        st.stop()
    
    st.sidebar.header("🔧 Scraper Configuration")
    
    with st.sidebar.expander("🎯 Scraping Controls", expanded=False):
        season_url = st.text_input(
            "Season / Tournament URL (matches list)",
            value="https://www.espncricinfo.com/cricket-series/ipl-matches",
            help="URL containing list of matches to scrape. Adjust to your target series.",
        )
        player_index_url = st.text_input(
            "Player Index URL",
            value="https://www.espncricinfo.com/cricketers",
            help="URL listing players (e.g., squad or all players for a league).",
        )
        match_urls_raw = st.text_area(
            "Match URLs for Deliveries (one per line)",
            value="https://www.espncricinfo.com/series/example-match-1\nhttps://www.espncricinfo.com/series/example-match-2",
            help="Paste specific match scorecard URLs for ball-by-ball scraping.",
            height=120
        )
    
    # Status indicator
    st.sidebar.markdown("---")
    st.sidebar.markdown("### 📊 Status")
    
    # Check if raw data exists
    has_raw_data = _check_raw_data_exists()
    if has_raw_data:
        st.sidebar.success("✅ Raw data files found")
    else:
        st.sidebar.warning("⚠️ No raw data found")
    
    st.sidebar.markdown("---")
    st.sidebar.markdown("### 📋 Quick Actions")
    
    if st.sidebar.button("📁 Check Data Directory"):
        try:
            import os
            data_dir = Path("data")
            if data_dir.exists():
                raw_files = list((data_dir / "raw").glob("*.csv"))
                processed_files = list((data_dir / "processed").glob("*.csv"))
                
                st.markdown("**📁 Data Directory Structure:**")
                st.markdown(f"📂 Raw files: {len(raw_files)}")
                st.markdown(f"📊 Processed files: {len(processed_files)}")
                
                if raw_files:
                    st.markdown("**Raw files found:**")
                    for file in raw_files[:5]:  # Show first 5 files
                        size = file.stat().st_size / 1024  # KB
                        st.markdown(f"• `{file.name}` ({size:.1f} KB)")
                else:
                    st.markdown("No raw files found")
            else:
                st.error("❌ Data directory not found")
        except Exception as e:
            st.error(f"Error checking data directory: {e}")
    
    # Main content area
    logs_placeholder = st.empty()
    
    st.markdown("---")
    st.markdown("### 🚀 Scraping Operations")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        if st.button("🏏 Scrape Match Data", type="primary", use_container_width=True):
            try:
                with st.spinner("Scraping match data..."):
                    log = _run_with_log(
                        scrape_matches_for_season, season_url, output_dir="data/raw"
                    )
                st.success("✅ Match scraping completed.")
                logs_placeholder.code(log, language="text")
            except Exception as exc:
                st.error(f"❌ Error while scraping matches: {exc}")
    
    with col2:
        if st.button("👥 Scrape Player Data", use_container_width=True):
            try:
                with st.spinner("Scraping player data..."):
                    log = _run_with_log(
                        scrape_players, player_index_url, output_dir="data/raw"
                    )
                st.success("✅ Player scraping completed.")
                logs_placeholder.code(log, language="text")
            except Exception as exc:
                st.error(f"❌ Error while scraping players: {exc}")
    
    with col3:
        if st.button("⚾️ Scrape Deliveries Data", use_container_width=True):
            try:
                match_urls = [
                    line.strip()
                    for line in match_urls_raw.splitlines()
                    if line.strip()
                ]
                if not match_urls:
                    st.warning("⚠️ Please enter match URLs for deliveries scraping")
                    return
                    
                with st.spinner("Scraping deliveries data..."):
                    log = _run_with_log(
                        scrape_deliveries_for_matches,
                        match_urls,
                        output_dir="data/raw"
                    )
                st.success("✅ Deliveries scraping completed.")
                logs_placeholder.code(log, language="text")
            except Exception as exc:
                st.error(f"❌ Error while scraping deliveries: {exc}")
    
    st.markdown("---")
    st.markdown("### 📋 Sample Data Files")
    
    # Display sample tables
    col1, col2, col3 = st.columns(3)
    
    with col1:
        _show_sample_table(Path("data/raw/matches.csv"), "Raw Matches")
    
    with col2:
        _show_sample_table(Path("data/raw/players.csv"), "Raw Players")
    
    with col3:
        _show_sample_table(Path("data/raw/deliveries.csv"), "Raw Deliveries")
    
    st.markdown("---")
    st.markdown("### 📋 Next Steps")
    
    st.markdown("""<div style="background: rgba(59, 130, 246, 0.1); padding: 1.5rem; border-radius: 12px; border-left: 4px solid #3b82f6;">
        <h4 style="color: #60a5fa; margin-bottom: 1rem;">🔄 Data Processing Pipeline</h4>
        <ol style="color: #e2e8f0; line-height: 1.8;">
            <li><strong>Go to 🧹 Data Cleaning</strong> - Clean raw scraped CSVs</li>
            <li><strong>Transform Data</strong> - Build transformed fact/dimension tables</li>
            <li><strong>📊 Explore Data</strong> - Visualize and analyze the data</li>
            <li><strong>🤖 Make Predictions</strong> - Use ML models for insights</li>
            <li><strong>📤 Export Data</strong> - Export for Power BI analysis</li>
        </ol>
    </div>""", unsafe_allow_html=True)

if __name__ == "__main__":
    main()
