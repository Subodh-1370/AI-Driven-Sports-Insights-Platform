# -------------------------------------------------------
# 🏏 Cricket Analytics Dashboard – Professional UI Edition
# -------------------------------------------------------

from __future__ import annotations
import streamlit as st
import time
import sys, os
from pathlib import Path
import plotly.graph_objects as go
import plotly.express as px
import pandas as pd
import numpy as np

# -------------------------------------------------------
# PATH SETUP
# -------------------------------------------------------
ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"

sys.path.append(str(ROOT))
sys.path.append(str(SRC))

# -------------------------------------------------------
# PAGE CONFIG
# -------------------------------------------------------
st.set_page_config(
    page_title="Cricket Analytics Dashboard",
    page_icon="🏏",
    layout="wide",
    initial_sidebar_state="expanded"
)

# -------------------------------------------------------
# FIX: Sidebar Toggle Visibility + Layout Stability
# -------------------------------------------------------
st.markdown("""
<style>

header {
    visibility: visible !important;
    height: 50px !important;
}

button[kind="icon"] {
    visibility: visible !important;
    opacity: 1 !important;
}

/* PREVENT SIDEBAR FROM HIDING */
[data-testid="stSidebar"] {
    visibility: visible !important;
}

/* Restore main background without breaking sidebar */
[data-testid="stAppViewContainer"] {
    background: linear-gradient(135deg, #0f172a, #1e3a8a);
    padding: 0;
}

html, body {
    background: transparent !important;
}

/* Sidebar Styling */
[data-testid="stSidebar"] {
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    backdrop-filter: blur(12px);
    border-right: 2px solid rgba(59, 130, 246, 0.3);
    box-shadow: 4px 0 20px rgba(0,0,0,0.1);
}
[data-testid="stSidebar"] * { 
    color: #e2e8f0 !important; 
}

/* Sidebar Navigation Buttons */
.nav-button {
    background: linear-gradient(135deg, #3b82f6, #1d4ed8) !important;
    color: white !important;
    border: none !important;
    padding: 12px 16px !important;
    margin: 8px 0 !important;
    border-radius: 12px !important;
    font-weight: 600 !important;
    transition: all 0.3s ease !important;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3) !important;
}
.nav-button:hover {
    transform: translateX(8px) scale(1.02) !important;
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5) !important;
    background: linear-gradient(135deg, #60a5fa, #2563eb) !important;
}

/* Active Navigation */
.nav-active {
    background: linear-gradient(135deg, #10b981, #059669) !important;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4) !important;
}

/* Sidebar Buttons */
.stButton>button {
    text-align: left !important;
    padding: 10px 15px !important;
    margin: 4px 0 !important;
    border-radius: 8px !important;
    border: 1px solid rgba(255,255,255,0.1) !important;
    background: rgba(255,255,255,0.05) !important;
    transition: 0.2s ease;
}
.stButton>button:hover {
    background: rgba(255,255,255,0.15) !important;
    transform: translateX(4px);
}

/* Animated Background */
@keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

.animated-bg {
    background: linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #f5576c);
    background-size: 400% 400%;
    animation: gradient 15s ease infinite;
}

/* Hero Banner */
.hero {
    width: 100%;
    padding: 70px 32px;
    border-radius: 20px;
    background-image: url("https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=2070");
    background-size: cover;
    background-position: center;
    position: relative;
    box-shadow: 0 12px 35px rgba(0,0,0,0.4);
}
.hero::before {
    content:"";
    position:absolute;
    inset:0;
    background: rgba(0,0,0,0.55);
}
.hero-content {
    position: relative;
    z-index: 10;
    text-align: center;
}
.hero-content h1 {
    font-size: 3.4rem;
    font-weight: 900;
    background: linear-gradient(90deg,#fff,#cbd5e1);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
.hero-content p {
    font-size: 1.25rem;
    opacity: 0.9;
}

/* Feature Cards */
.feature-card {
    background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
    padding: 30px;
    border-radius: 20px;
    border: 1px solid rgba(255,255,255,0.2);
    backdrop-filter: blur(15px);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;
    overflow: hidden;
}
.feature-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    transition: left 0.6s;
}
.feature-card:hover::before {
    left: 100%;
}
.feature-card:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0,180,255,0.3);
    border-color: rgba(59, 130, 246, 0.5);
}
.feature-icon {
    font-size: 3.5rem;
    margin-bottom: 15px;
    display: block;
    text-align: center;
    filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
}
.feature-card h3 {
    color: #60a5fa;
    font-weight: 700;
    margin-bottom: 12px;
    text-align: center;
}
.feature-card p {
    color: #cbd5e1;
    text-align: center;
    line-height: 1.6;
}

/* About Section */
.about-box {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1));
    padding: 30px;
    border-radius: 20px;
    border: 1px solid rgba(255,255,255,0.2);
    backdrop-filter: blur(15px);
    position: relative;
    overflow: hidden;
}
.about-box::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
    animation: float 6s ease-in-out infinite;
}
@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
}

/* Stats Cards */
.stats-card {
    background: linear-gradient(135deg, #fbbf24, #f59e0b);
    color: #1f2937;
    padding: 25px;
    border-radius: 16px;
    text-align: center;
    font-weight: 700;
    box-shadow: 0 10px 25px rgba(251, 191, 36, 0.3);
    transition: transform 0.3s ease;
}
.stats-card:hover {
    transform: translateY(-5px);
}
.stats-number {
    font-size: 2.5rem;
    font-weight: 900;
    margin-bottom: 8px;
}
.stats-label {
    font-size: 1rem;
    opacity: 0.9;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
    width: 8px;
}
::-webkit-scrollbar-track {
    background: rgba(0,0,0,0.1);
}
::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #60a5fa, #2563eb);
}

</style>
""", unsafe_allow_html=True)

# -------------------------------------------------------
# ENHANCED SIDEBAR NAVIGATION
# -------------------------------------------------------
st.sidebar.markdown("""
## 🏏 Cricket Analytics
### Navigate to Modules
""", unsafe_allow_html=True)

# Navigation buttons with enhanced styling
nav_items = [
    ("📊 Dashboard", "Home", True),
    ("🌐 Data Scraper", "pages/2_🌐_Scraper.py", False),
    ("🧹 Data Cleaning", "pages/1_🧹_Clean_Process.py", False),
    ("📈 Exploratory Analysis", "pages/3_📊_EDA.py", False),
    ("🤖 ML Predictions", "pages/4_🤖_Predictions.py", False),
    ("📤 Data Export", "pages/5_📤_Export.py", False),
]

st.sidebar.markdown("---")
for icon_label, target, is_active in nav_items:
    button_class = "nav-active" if is_active else "nav-button"
    st.sidebar.markdown(f"""
    <button class="{button_class}" onclick="window.open('{target}', '_self')">
        {icon_label}
    </button>
    """, unsafe_allow_html=True)

st.sidebar.markdown("---")
st.sidebar.markdown("""
### 🚀 AI Tools
""", unsafe_allow_html=True)

ai_tools = [
    ("🏆 AI Strategy Coach", "pages/7_🏆_AI_Strategy_Coach.py"),
    ("⚡ Momentum Engine", "pages/8_⚡_Momentum_Engine.py"),
]

for tool_label, tool_target in ai_tools:
    st.sidebar.markdown(f"""
    <button class="nav-button" onclick="window.open('{tool_target}', '_self')">
        {tool_label}
    </button>
    """, unsafe_allow_html=True)

st.sidebar.markdown("---")
st.sidebar.markdown("""
### 📈 Quick Stats
<div style="background: rgba(59, 130, 246, 0.1); padding: 15px; border-radius: 10px; border: 1px solid rgba(59, 130, 246, 0.3);">
    <div style="font-size: 1.2rem; font-weight: 700; margin-bottom: 8px;">📊 System Status</div>
    <div style="color: #10b981;">✅ All Models Loaded</div>
    <div style="color: #10b981;">✅ Data Pipeline Ready</div>
    <div style="color: #fbbf24;">⚡ Real-time Processing</div>
</div>
""", unsafe_allow_html=True)

# -------------------------------------------------------
# LIVE TICKER (non-intrusive)
# -------------------------------------------------------
def live_score_ticker():
    ticker = st.empty()
    frame = "🏏 Live Update: Analytics Engine Ready • Models Loaded Successfully"
    ticker.markdown(
        f"""
        <div style="
            background: linear-gradient(90deg,#0ea5e9,#1e3a8a);
            padding: 12px;
            border-radius: 10px;
            text-align:center;
            font-size: 18px;
            font-weight: 600;
            color: white;
            margin-bottom: 10px;
        ">{frame}</div>
        """,
        unsafe_allow_html=True,
    )

live_score_ticker()

# -------------------------------------------------------
# ENHANCED HERO SECTION WITH STATS
# -------------------------------------------------------
st.markdown("""
<div class="hero">
    <div class="hero-content">
        <h1>🏏 Cricket Analytics Platform</h1>
        <p>Advanced AI-Powered Insights • Real-time Predictions • Strategic Analysis</p>
    </div>
</div>
""", unsafe_allow_html=True)

# -------------------------------------------------------
# DASHBOARD STATISTICS
# -------------------------------------------------------
st.markdown("## 📊 Platform Statistics")

col1, col2, col3, col4 = st.columns(4)

with col1:
    st.markdown("""
    <div class="stats-card">
        <div class="stats-number">10+</div>
        <div class="stats-label">Teams Analyzed</div>
    </div>
    """, unsafe_allow_html=True)

with col2:
    st.markdown("""
    <div class="stats-card">
        <div class="stats-number">15+</div>
        <div class="stats-label">Venues Tracked</div>
    </div>
    """, unsafe_allow_html=True)

with col3:
    st.markdown("""
    <div class="stats-card">
        <div class="stats-number">26K</div>
        <div class="stats-label">Ball-by-Ball Data</div>
    </div>
    """, unsafe_allow_html=True)

with col4:
    st.markdown("""
    <div class="stats-card">
        <div class="stats-number">3</div>
        <div class="stats-label">ML Models Active</div>
    </div>
    """, unsafe_allow_html=True)

# -------------------------------------------------------
# INTERACTIVE FEATURE SHOWCASE
# -------------------------------------------------------
st.markdown("---")
st.markdown("## 🚀 Core Features")

col1, col2 = st.columns(2)

with col1:
    st.markdown("""
    <div class="feature-card">
        <div class="feature-icon">🤖</div>
        <h3>ML Predictions Engine</h3>
        <p>Advanced machine learning models for win probability, innings scores, and player performance predictions with real-time accuracy.</p>
        <div style="text-align: center; margin-top: 15px;">
            <span style="background: rgba(16, 185, 129, 0.2); color: #10b981; padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 600;">✓ Active</span>
        </div>
    </div>
    """, unsafe_allow_html=True)

    st.markdown("""
    <div class="feature-card" style="margin-top:20px;">
        <div class="feature-icon">📈</div>
        <h3>Exploratory Data Analysis</h3>
        <p>Comprehensive analytics dashboards with interactive visualizations for team performance, venue statistics, and match insights.</p>
        <div style="text-align: center; margin-top: 15px;">
            <span style="background: rgba(59, 130, 246, 0.2); color: #3b82f6; padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 600;">Interactive</span>
        </div>
    </div>
    """, unsafe_allow_html=True)

with col2:
    st.markdown("""
    <div class="feature-card">
        <div class="feature-icon">🌐</div>
        <h3>Automated Data Pipeline</h3>
        <p>End-to-end data scraping from ESPNcricinfo with automated cleaning, transformation, and processing for analysis-ready datasets.</p>
        <div style="text-align: center; margin-top: 15px;">
            <span style="background: rgba(251, 191, 36, 0.2); color: #f59e0b; padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 600;">Automated</span>
        </div>
    </div>
    """, unsafe_allow_html=True)

    st.markdown("""
    <div class="feature-card" style="margin-top:20px;">
        <div class="feature-icon">📤</div>
        <h3>Smart Data Export</h3>
        <p>Export processed data and insights in multiple formats including Power BI compatible files for further analysis and reporting.</p>
        <div style="text-align: center; margin-top: 15px;">
            <span style="background: rgba(168, 85, 247, 0.2); color: #a855f7; padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 600;">Multi-format</span>
        </div>
    </div>
    """, unsafe_allow_html=True)

# -------------------------------------------------------
# FUTURE ENHANCEMENTS (Replaces Key Features)
# -------------------------------------------------------
st.markdown("## 🚀 Future Enhancements")

col1, col2 = st.columns(2)

with col1:
    st.markdown("""
    <div class="feature-card">
        <div class="feature-icon">🧠</div>
        <h3>Neural Net Win Predictor</h3>
        <p>Deep-learning model to estimate win probability ball-by-ball.</p>
    </div>
    """, unsafe_allow_html=True)

    st.markdown("""
    <div class="feature-card" style="margin-top:20px;">
        <div class="feature-icon">🎯</div>
        <h3>Impact Player Analyzer</h3>
        <p>Identifies which player will shift match momentum in upcoming overs.</p>
    </div>
    """, unsafe_allow_html=True)

with col2:
    st.markdown("""
    <div class="feature-card">
        <div class="feature-icon">🌍</div>
        <h3>Venue Bias Model</h3>
        <p>AI system that predicts pitch behavior and batting difficulty live.</p>
    </div>
    """, unsafe_allow_html=True)

    st.markdown("""
    <div class="feature-card" style="margin-top:20px;">
        <div class="feature-icon">📡</div>
        <h3>Real-Time Strategy Assistant</h3>
        <p>Suggests bowling changes, field sets, and batting strategy instantly.</p>
    </div>
    """, unsafe_allow_html=True)

# -------------------------------------------------------
# ABOUT SECTION
# -------------------------------------------------------
st.markdown("## 🏏 About This Project")
st.markdown("""
<div class="about-box">
This platform is an end-to-end Cricket Analytics System that performs:
<ul>
<li>✔ Automated data scraping</li>
<li>✔ Cleaning & transformation pipeline</li>
<li>✔ ML model training</li>
<li>✔ Win, score & performance predictions</li>
<li>✔ Interactive dashboards & insights</li>
</ul>
</div>
""", unsafe_allow_html=True)

# -------------------------------------------------------
# PROFESSIONAL FOOTER
# -------------------------------------------------------
st.markdown("---")
st.markdown("""
<div style="text-align: center; padding: 40px 20px; background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(168, 85, 247, 0.1)); border-radius: 20px; margin-top: 40px;">
    <h3 style="color: #60a5fa; margin-bottom: 15px;">🏏 Cricket Analytics Platform</h3>
    <p style="color: #cbd5e1; margin-bottom: 20px;">
        Advanced analytics powered by machine learning • Real-time insights • Strategic decision support
    </p>
    <div style="display: flex; justify-content: center; gap: 20px; margin-bottom: 20px;">
        <span style="background: rgba(16, 185, 129, 0.2); color: #10b981; padding: 6px 16px; border-radius: 20px; font-size: 0.9rem; font-weight: 600;">
            ✅ Production Ready
        </span>
        <span style="background: rgba(59, 130, 246, 0.2); color: #3b82f6; padding: 6px 16px; border-radius: 20px; font-size: 0.9rem; font-weight: 600;">
            🚀 High Performance
        </span>
        <span style="background: rgba(251, 191, 36, 0.2); color: #f59e0b; padding: 6px 16px; border-radius: 20px; font-size: 0.9rem; font-weight: 600;">
            📊 Data Driven
        </span>
    </div>
    <p style="color: #94a3b8; font-size: 0.9rem;">
        Built with ❤️ using Streamlit • Python • Machine Learning
    </p>
</div>
""", unsafe_allow_html=True)

# Define main function for imports
def main():
    pass  # Home page content is already rendered above

if __name__ == "__main__":
    main()
