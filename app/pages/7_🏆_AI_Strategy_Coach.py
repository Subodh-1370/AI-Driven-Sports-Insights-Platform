"""
AI Strategy Coach Page

Provides AI-powered recommendations for match strategy, player positions, and game plans.
"""
import streamlit as st
from modules.ai.strategy_coach import strategy_coach_page

# Set page config
st.set_page_config(
    page_title="AI Strategy Coach",
    page_icon="🏆",
    layout="wide"
)

# Add custom CSS
st.markdown("""
<style>
    .stApp {
        background: #0f172a;
        color: white;
    }
    
    .stButton>button {
        background: linear-gradient(90deg, #1e40af, #1e3a8a);
        color: white;
        border: none;
        border-radius: 8px;
        padding: 0.5rem 1rem;
        font-weight: 500;
    }
    
    .stButton>button:hover {
        background: linear-gradient(90deg, #1e3a8a, #1e40af);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
</style>
""", unsafe_allow_html=True)

# Render the strategy coach page
strategy_coach_page()
