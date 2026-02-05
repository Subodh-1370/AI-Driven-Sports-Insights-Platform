"""
Streamlit page for Exploratory Data Analysis (EDA).
Provides interactive views for:
- Top scorers
- Wicket takers
- Venue performance
- Toss impact
- Run distributions
"""

from __future__ import annotations
import sys
import os
import pandas as pd
import streamlit as st
import plotly.express as px
import plotly.graph_objects as go

# Add project root directory to sys.path
# This allows imports from src/ to work correctly
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

import streamlit as st

try:
    from src.analysis import eda as eda_utils
    EDA_AVAILABLE = True
except ImportError as e:
    EDA_AVAILABLE = False
    st.error(f"❌ EDA module not available: {e}")
    st.stop()

def _load_data_with_error_handling():
    """Load data with proper error handling."""
    try:
        deliveries_df = pd.read_csv("data/processed/fact_deliveries.csv")
        matches_df = pd.read_csv("data/processed/fact_matches.csv")
        return deliveries_df, matches_df, None
    except FileNotFoundError:
        st.error("❌ Data files not found. Please run data cleaning and transformation first.")
        return None, None, "Data files not found"
    except Exception as e:
        st.error(f"❌ Error loading data: {e}")
        return None, None, f"Error loading data: {e}"

def _create_chart_with_error_handling(fig_func, title, *args, **kwargs):
    """Create chart with error handling."""
    try:
        fig = fig_func(*args, **kwargs)
        return fig, None
    except Exception as e:
        st.error(f"❌ Error creating {title}: {e}")
        return None, f"Error creating {title}: {e}"

def main() -> None:
    """Main function for EDA page."""
    st.set_page_config(page_title="📊 Exploratory Analysis", page_icon="📊", layout="wide")
    
    # Enhanced CSS for professional look
    st.markdown("""
    <style>
    .stApp {
        background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #312e81 100%);
    }
    .stButton > button {
        background: linear-gradient(135deg, #8b5cf6, #1e40af);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 12px;
        font-weight: 600;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        margin: 8px 0;
    }
    .stButton > button:hover {
        background: linear-gradient(135deg, #60a5fa, #3b82f6);
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(139, 92, 246, 0.5);
    }
    .chart-container {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        padding: 1.5rem;
        margin: 1rem 0;
        border: 1px solid rgba(139, 92, 246, 0.2);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }
    .metric-card {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 1.5rem;
        margin: 1rem 0;
        border-left: 4px solid #8b5cf6;
    }
    .metric-value {
        font-size: 2rem;
        font-weight: 700;
        color: #1e40af;
        margin-bottom: 0.5rem;
    }
    .metric-label {
        color: #94a3b8;
        font-size: 0.9rem;
        margin-bottom: 0.25rem;
    }
    </style>
    """, unsafe_allow_html=True)
    
    st.title("📊 Exploratory Data Analysis")
    st.write("""
        Explore key cricket performance insights:
        - Run distributions
        - Top scorers and wicket takers
        - Venue performance
        - Toss impact
        - Interactive visualizations
    """)
    
    # Check if required data files exist
    required_files = ["data/processed/fact_deliveries.csv", "data/processed/fact_matches.csv"]
    missing_files = [f for f in required_files if not os.path.isfile(f)]
    
    if missing_files:
        st.warning(
            f"""
            ⚠️ **Required data files not found!**
            
            Missing files:
            {chr(10).join(f'- `{f}`' for f in missing_files)}
            
            **To fix this:**
            1. Go to **🌐 Scraper** page and scrape match/delivery data
            2. Go to **🧹 Data Cleaning** page and click "Clean Raw Data"
            3. Then click "Transform Data for Analytics"
            4. Return here to explore data
            """
        )
        st.stop()
    
    # Load data with error handling
    deliveries_df, matches_df, load_error = _load_data_with_error_handling()
    if load_error:
        st.error("❌ Failed to load data. Please check error messages above.")
        st.stop()
    
    # Analysis type selection
    st.markdown("---")
    analysis_type = st.selectbox(
        "Select analysis type",
        options=[
            "Top scorers",
            "Wicket takers", 
            "Venue performance",
            "Toss impact",
            "Run distributions"
        ],
        )
    
    st.markdown("---")
    
    # Analysis type: Top scorers
    if analysis_type == "Top scorers":
        n = st.slider("Number of players", min_value=5, max_value=50, value=10, step=5)
        
        try:
            with st.spinner("Analyzing top scorers..."):
                df = eda_utils.get_top_scorers(n=n)
                if df.empty:
                    st.info("No data available. Make sure deliveries data has been scraped and processed.")
                else:
                    st.subheader("Top Scorers")
                    st.dataframe(df)
                    
                    if len(df) > 0:
                        fig, _ = _create_chart_with_error_handling(
                            eda_utils.plot_distribution,
                            df, x="player_name", y="total_runs", 
                            title="Top Scorers"
                        )
                        st.pyplot(fig)
        except FileNotFoundError as exc:
            st.error(f"Data file not found: {exc}\n\nPlease run data cleaning and transformation first.")
        except Exception as exc:
            st.error(f"Failed to compute top scorers: {exc}")
    
    # Analysis type: Wicket takers
    elif analysis_type == "Wicket takers":
        n = st.slider("Number of bowlers", min_value=5, max_value=50, value=10, step=5)
        
        try:
            with st.spinner("Analyzing top wicket takers..."):
                df = eda_utils.get_wicket_takers(n=n)
                if df.empty:
                    st.info("No wicket data available. Make sure deliveries data has been scraped and processed.")
                else:
                    st.subheader("Top Wicket Takers")
                    st.dataframe(df)
                    
                    if len(df) > 0:
                        fig, _ = _create_chart_with_error_handling(
                            eda_utils.plot_distribution,
                            df, x="player_name", y="wickets", 
                            title="Top Wicket Takers"
                        )
                        st.pyplot(fig)
        except FileNotFoundError as exc:
            st.error(f"Data file not found: {exc}\n\nPlease run data cleaning and transformation first.")
        except Exception as exc:
            st.error(f"Failed to compute wicket takers: {exc}")
    
    # Analysis type: Venue performance
    elif analysis_type == "Venue performance":
        try:
            with st.spinner("Analyzing venue performance..."):
                df = eda_utils.get_venue_performance()
                if df.empty or "venue" not in df.columns:
                    st.info("No venue data available. Make sure matches and deliveries data has been scraped and processed.")
                else:
                    st.subheader("Venue Performance – Average Innings Score")
                    st.dataframe(df)
                    
                    if len(df) > 0 and "avg_innings_score" in df.columns:
                        fig, _ = _create_chart_with_error_handling(
                            eda_utils.plot_distribution,
                            df, x="venue", y="avg_innings_score", 
                            title="Venue Performance"
                        )
                        st.pyplot(fig)
        except FileNotFoundError as exc:
            st.error(f"Data file not found: {exc}\n\nPlease run data cleaning and transformation first.")
        except Exception as exc:
            st.error(f"Failed to compute venue performance: {exc}")
    
    # Analysis type: Toss impact
    elif analysis_type == "Toss impact":
        try:
            with st.spinner("Analyzing toss impact..."):
                df = eda_utils.get_toss_impact()
                if df.empty or "toss_decision" not in df.columns:
                    st.info("No toss data available. Make sure matches data has been scraped and processed.")
                else:
                    st.subheader("Toss Decision Impact on Win Rate")
                    st.dataframe(df)
                    
                    if len(df) > 0 and "win_rate_when_toss_won" in df.columns:
                        fig, _ = _create_chart_with_error_handling(
                            eda_utils.plot_distribution,
                            df,
                            x="toss_decision", 
                            y="win_rate_when_toss_won", 
                            title="Toss Impact on Win Rate"
                        )
                        st.pyplot(fig)
        except FileNotFoundError as exc:
            st.error(f"Data file not found: {exc}\n\nPlease run data cleaning and transformation first.")
        except Exception as exc:
            st.error(f"Failed to compute toss impact: {exc}")
    
    # Analysis type: Run distributions
    elif analysis_type == "Run distributions":
        try:
            with st.spinner("Analyzing run distributions..."):
                df = eda_utils.get_run_distributions()
                if df.empty:
                    st.info("No data available for run distribution analysis.")
                else:
                    st.subheader("Run Score Distributions")
                    
                    # Create tabs for different views
                    tab1, tab2, tab3 = st.tabs(["Score Histogram", "Partnership Analysis", "Over Time"])
                    
                    with tab1:
                        st.subheader("Score Histogram")
                        fig, _ = _create_chart_with_error_handling(
                            px.histogram, 
                            df, x="total_runs", 
                            nbins=20, 
                            title="Distribution of Innings Scores"
                        )
                        st.pyplot(fig)
                    
                    with tab2:
                        st.subheader("Partnership Analysis")
                        # Create partnership analysis
                        partnerships = deliveries_df.groupby(['match_id', 'innings', 'batter', 'non_striker'])['total_runs'].sum().reset_index()
                        
                        # Get top partnerships
                        top_partnerships = partnerships.head(10)
                        
                        st.dataframe(top_partnerships)
                        
                        # Create partnership chart
                        partnership_fig = go.Figure()
                        
                        # Add edges for top partnerships
                        for _, row in top_partnerships.iterrows():
                            partnership_fig.add_trace(
                                go.Scatter(
                                    x=[row['batter']], 
                                    y=[row['non_striker']], 
                                    mode='markers+lines',
                                    text=f"{row['batter']} & {row['non_striker']}: {row['total_runs']}",
                                    line=dict(width=2, color='#60a5fa'),
                                    marker=dict(size=8, color='#60a5fa')
                                )
                            )
                        
                        partnership_fig.update_layout(
                            title="Top Partnerships",
                            xaxis_title="Runs",
                            yaxis_title="Partnership",
                            hovermode='closest'
                        )
                        
                        st.plotly_chart(partnership_fig)
                    
                    with tab3:
                        st.subheader("Performance Over Time")
                        # Create time series analysis
                        df['match_date'] = pd.to_datetime(df['match_date'])
                        monthly_performance = df.groupby(df['match_date'].dt.to_period('M')).agg({
                            'total_runs': 'sum',
                            'matches_played': 'count'
                        }).reset_index()
                        
                        fig = _create_chart_with_error_handling(
                            px.line,
                            monthly_performance, 
                            x='match_date', 
                            y='total_runs',
                            title='Monthly Runs Scored',
                            markers=True
                        )
                        st.pyplot(fig)
        except FileNotFoundError as exc:
            st.error(f"Data file not found: {exc}\n\nPlease run data cleaning and transformation first.")
        except Exception as exc:
            st.error(f"Failed to analyze run distributions: {exc}")
    
    # Footer with navigation hints
    st.markdown("---")
    st.markdown("""
    <div style="background: rgba(16, 185, 129, 0.1); padding: 1.5rem; border-radius: 12px; border-left: 4px solid #10b981;">
        <h4 style="color: #10b981; margin-bottom: 1rem;">📊 Analysis Pipeline</h4>
        <ol style="color: #e2e8f0; line-height: 1.8;">
            <li><strong>📊 Explore Data</strong> - Current section for visualizations</li>
            <li><strong>🤖 Make Predictions</strong> - Use ML models for insights</li>
            <li><strong>📤 Export Data</strong> - Export for Power BI analysis</li>
            <li><strong>🏆 AI Strategy Coach</strong> - Get AI-powered strategy recommendations</li>
            <li><strong>⚡ Momentum Engine</strong> - Track real-time game momentum</li>
        </ol>
    </div>
    """, unsafe_allow_html=True)

if __name__ == "__main__":
    main()
