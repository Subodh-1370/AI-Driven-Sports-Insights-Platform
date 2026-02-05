"""
Streamlit page for Data Cleaning & Processing
Provides tools to:
- Clean raw scraped CSVs (matches, players, deliveries)
- Build transformed fact/dimension tables for analytics and modeling
"""

from __future__ import annotations
import sys
import os
from pathlib import Path
import pandas as pd
import streamlit as st
from contextlib import redirect_stdout
import time
import io

# Set up paths
ROOT_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = ROOT_DIR / "data"
RAW_DIR = DATA_DIR / "raw"
PROCESSED_DIR = DATA_DIR / "processed"

# Add to path
sys.path.append(str(ROOT_DIR))
sys.path.append(str(ROOT_DIR / "src"))

try:
    from src.processing.clean_data import clean_all
    from src.processing.transform_data import transform_all
    PROCESSING_AVAILABLE = True
except ImportError as e:
    PROCESSING_AVAILABLE = False
    st.error(f"❌ Processing modules not available: {e}")

def _run_with_log(func, *args, **kwargs) -> str:
    """Run a function and capture its stdout output with progress tracking."""
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
        st.info(f"📋 **{label}** - *File not found yet*\n\n`{path}`\n\n*Run cleaning/transformation steps above to generate this file.*")
        return
    
    try:
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
        raw_files = list(RAW_DIR.glob("*.csv"))
        return any(
            f.name.startswith(prefix) 
            for f in raw_files 
            for prefix in ["matches", "players", "deliveries"]
        )
    except Exception:
        return False

def _check_processed_data_exists() -> bool:
    """Check if any processed data files exist."""
    try:
        processed_files = list(PROCESSED_DIR.glob("*.csv"))
        return len(processed_files) > 0
    except Exception:
        return False

def main() -> None:
    """Main function for Clean & Process page."""
    st.set_page_config(
        page_title="🧹 Data Cleaning & Processing",
        page_icon="🧹",
        layout="wide"
    )
    
    # Enhanced CSS for professional look
    st.markdown("""
    <style>
    .stApp {
        background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #312e81 100%);
    }
    .stButton > button {
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 12px;
        font-weight: 600;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        margin: 8px 0;
    }
    .stButton > button:hover {
        background: linear-gradient(135deg, #059669, #047857);
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(16, 185, 129, 0.5);
    }
    .progress-container {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 1rem;
        margin: 1rem 0;
        border-left: 4px solid #10b981;
    }
    .progress-bar {
        background: #10b981;
        height: 8px;
        border-radius: 4px;
        transition: width 0.3s ease;
    }
    .status-indicator {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
        margin: 0 0.5rem;
    }
    .status-success { background: #10b981; color: white; }
    .status-warning { background: #f59e0b; color: white; }
    .status-error { background: #ef4444; color: white; }
    </style>
    """, unsafe_allow_html=True)
    
    st.title("🧹 Data Cleaning & Processing")
    st.write("""
        Use this page to:
        - Clean raw scraped CSVs (matches, players, deliveries)
        - Build transformed fact/dimension tables for analytics and modeling
    """)
    
    if not PROCESSING_AVAILABLE:
        st.error("⚠️ Processing modules are not available. Please check the src/processing directory.")
        st.stop()
    
    # Status Dashboard
    st.markdown("---")
    st.markdown("### 📊 System Status")
    
    # Check data availability
    has_raw_data = _check_raw_data_exists()
    has_processed_data = _check_processed_data_exists()
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.markdown("**Raw Data Status**")
        if has_raw_data:
            st.markdown('<div class="status-indicator status-success">✅</div> Raw files found')
            st.markdown("Raw CSV files are ready for processing")
        else:
            st.markdown('<div class="status-indicator status-error">❌</div> No raw data')
            st.markdown("Please run the scraper first to generate raw data")
    
    with col2:
        st.markdown("**Processed Data Status**")
        if has_processed_data:
            st.markdown('<div class="status-indicator status-success">✅</div> Processed files found')
            st.markdown("Processed CSV files are ready for analysis")
        else:
            st.markdown('<div class="status-indicator status-warning">⚠️</div> No processed data')
            st.markdown("Processed files will be created after cleaning")
    
    with col3:
        st.markdown("**Processing Modules**")
        if PROCESSING_AVAILABLE:
            st.markdown('<div class="status-indicator status-success">✅</div> Available')
        else:
            st.markdown('<div class="status-indicator status-error">❌</div> Not available')
    
    st.markdown("---")
    
    # Progress tracking
    st.markdown("### 🔄 Processing Pipeline")
    
    # Create progress tracking
    progress_data = {
        "raw_data": has_raw_data,
        "cleaning": False,
        "transforming": False,
        "completed": has_processed_data
    }
    
    # Progress bars
    def _create_progress_bar(label, progress, color="success"):
        return f"""
        <div style="margin-bottom: 1rem;">
            <div style="display: flex; align-items: center; margin-bottom: 0.5rem;">
                <span style="font-weight: 600; width: 120px;">{label}:</span>
                <div class="progress-container">
                    <div class="progress-bar" style="width: {progress}%"></div>
                </div>
                <span style="margin-left: 1rem; font-weight: 600;">{progress}%</span>
            </div>
        </div>
        """
    
    st.markdown(_create_progress_bar("Raw Data", "100%" if progress_data["raw_data"] else "0%", "success" if progress_data["raw_data"] else "warning"))
    st.markdown(_create_progress_bar("Data Cleaning", "100%" if progress_data["cleaning"] else "0%", "success" if progress_data["cleaning"] else "warning"))
    st.markdown(_create_progress_bar("Data Transformation", "100%" if progress_data["transforming"] else "0%", "success" if progress_data["transforming"] else "warning"))
    st.markdown(_create_progress_bar("Processing Complete", "100%" if progress_data["completed"] else "0%", "success" if progress_data["completed"] else "warning"))
    
    st.markdown("---")
    st.markdown("### 🧹 Data Processing")
    
    logs_placeholder = st.empty()
    
    col1, col2 = st.columns(2)
    
    with col1:
        if st.button("🧹 Clean Raw Data", type="primary", use_container_width=True, disabled=not has_raw_data):
            try:
                # Update progress
                progress_data["cleaning"] = True
                
                with st.spinner("Cleaning raw data..."):
                    log = _run_with_log(clean_all, RAW_DIR, PROCESSED_DIR)
                
                # Update progress
                progress_data["cleaning"] = False
                progress_data["transforming"] = False
                progress_data["completed"] = True
                
                st.success("✅ Raw data successfully cleaned.")
                logs_placeholder.code(log, language="text")
                
                # Show completion message
                st.balloons("🎉 Processing Complete!", "All raw data has been cleaned and is ready for transformation!")
                
            except Exception as exc:
                st.error(f"❌ Error while cleaning data: {exc}")
                logs_placeholder.error(str(exc))
    
    with col2:
        if st.button("🔄 Transform Data for Analytics", type="primary", use_container_width=True, disabled=not progress_data["completed"]):
            try:
                # Update progress
                progress_data["transforming"] = True
                
                with st.spinner("Transforming data..."):
                    log = _run_with_log(transform_all)
                
                # Update progress
                progress_data["transforming"] = False
                progress_data["completed"] = True
                
                st.success("✅ Data transformation complete.")
                logs_placeholder.code(log, language="text")
                
                # Show completion message
                st.balloons("🎯 Analytics Ready!", "Data has been transformed and is ready for analysis!")
                
            except Exception as exc:
                st.error(f"❌ Error while transforming data: {exc}")
                logs_placeholder.error(str(exc))
    
    st.markdown("---")
    st.markdown("### 📋 Sample Cleaned / Transformed Tables")
    st.caption("These files are created after clicking 'Clean Raw Data' and/or 'Transform Data for Analytics' above.")
    
    # Display sample tables
    col1, col2, col3 = st.columns(3)
    
    with col1:
        _show_sample_table(PROCESSED_DIR / "matches_clean.csv", "Cleaned Matches")
    
    with col2:
        _show_sample_table(PROCESSED_DIR / "players_clean.csv", "Cleaned Players")
    
    with col3:
        _show_sample_table(PROCESSED_DIR / "deliveries_clean.csv", "Cleaned Deliveries")
    
    st.markdown("---")
    st.markdown("### 📊 Sample Analytics Tables")
    st.caption("These files are created after clicking 'Transform Data for Analytics' above.")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        _show_sample_table(PROCESSED_DIR / "fact_matches.csv", "Fact Matches")
    
    with col2:
        _show_sample_table(PROCESSED_DIR / "fact_players.csv", "Fact Players")
    
    with col3:
        _show_sample_table(PROCESSED_DIR / "fact_deliveries.csv", "Fact Deliveries")
    with col8:
        _show_sample_table(PROCESSED_DIR / "dim_players.csv", "Dim Players")
    
    # Show workflow instructions
    st.divider()
    with st.expander("📖 Workflow Instructions", expanded=False):
        st.markdown(
            """
            ### Complete Data Pipeline Workflow
            
            1. **Scrape Data** (Go to Scraper page)
               - Scrape match data from ESPNcricinfo
               - Scrape player data
               - Scrape ball-by-ball deliveries
               - Files saved to `data/raw/`
            
            2. **Clean Data** (This page - click "Clean Raw Data")
               - Removes duplicates
               - Standardizes team/player names
               - Handles missing values
               - Files saved to `data/processed/` as `*_clean.csv`
            
            3. **Transform Data** (This page - click "Transform Data for Analytics")
               - Creates fact tables (fact_matches, fact_deliveries)
               - Creates dimension tables (dim_players)
               - Builds final_dataset.csv for ML
               - Files saved to `data/processed/`
            
            4. **Explore Data** (Go to EDA page)
               - View top scorers, wicket takers
               - Analyze venue performance
               - Check toss impact
            
            5. **Train Models** (Go to Predictions page)
               - Train win prediction model
               - Train innings score model
               - Train player performance model
            
            6. **Export to Power BI** (Go to Export page)
               - Export analytics-ready tables
               - Files saved to `data/analytics/`
            """
        )

if __name__ == "__main__":
    main()


