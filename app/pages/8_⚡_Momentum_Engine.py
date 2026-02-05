"""
Momentum Engine Page

Tracks and visualizes the momentum of the game in real-time.
"""
import streamlit as st
from modules.momentum_engine import momentum_engine_page

# Set page config
st.set_page_config(
    page_title="Momentum Engine",
    page_icon="⚡",
    layout="wide"
)

# Add custom CSS
st.markdown("""
<style>
    .stApp {
        background: #0f172a;
        color: white;
    }
    
    .metric-container {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
    }
    
    .stMetric {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        padding: 1rem;
    }
    
    .stMetricLabel {
        color: #94a3b8;
        font-size: 0.9rem;
    }
    
    .stMetricValue {
        color: white;
        font-size: 1.8rem;
        font-weight: 600;
    }
    
    .stMetricDelta {
        font-size: 0.9rem;
    }
</style>
""", unsafe_allow_html=True)

# Add custom header
st.markdown("""
<div style="text-align: center; margin-bottom: 2rem;">
    <h1 style="font-size: 2.5rem; margin-bottom: 0.5rem;">⚡ Live Momentum Engine</h1>
    <p style="color: #94a3b8; font-size: 1.1rem;">Track the ebb and flow of the game with real-time momentum analysis</p>
</div>
""", unsafe_allow_html=True)

# Render the momentum engine page
momentum_engine_page()
