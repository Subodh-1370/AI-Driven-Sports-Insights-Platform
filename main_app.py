import streamlit as st
import os
import sys
from pathlib import Path

# Add the project root directory to sys.path
ROOT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT_DIR))

# Set page config (must be first Streamlit command)
st.set_page_config(
    page_title="Cricket Analytics Platform",
    page_icon="🏏",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Enhanced CSS for professional look
st.markdown("""
<style>
/* Main App Container */
[data-testid="stAppViewContainer"] {
    background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #312e81 100%);
    min-height: 100vh;
}

/* Sidebar Styling */
[data-testid="stSidebar"] {
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    border-right: 2px solid rgba(59, 130, 246, 0.3);
    box-shadow: 4px 0 20px rgba(0,0,0,0.2);
}

/* Sidebar Content */
[data-testid="stSidebar"] * {
    color: #e2e8f0 !important;
}

/* Navigation Headers */
[data-testid="stSidebar"] .css-1d391kg {
    color: #60a5fa !important;
    font-weight: 700 !important;
    font-size: 1.1rem !important;
}

/* Enhanced Buttons */
.stButton > button {
    background: linear-gradient(135deg, #3b82f6, #1d4ed8) !important;
    color: white !important;
    border: none !important;
    padding: 12px 20px !important;
    border-radius: 12px !important;
    font-weight: 600 !important;
    transition: all 0.3s ease !important;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3) !important;
    margin: 8px 0 !important;
}

.stButton > button:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5) !important;
    background: linear-gradient(135deg, #60a5fa, #2563eb) !important;
}

/* Headers */
.stMarkdown h1 {
    color: #60a5fa !important;
    font-weight: 700 !important;
    text-shadow: 0 2px 4px rgba(0,0,0,0.3) !important;
}

.stMarkdown h2 {
    color: #93c5fd !important;
    font-weight: 600 !important;
}

/* Info Boxes */
.stInfo {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.1)) !important;
    border-left: 4px solid #3b82f6 !important;
    border-radius: 8px !important;
}

/* Success Boxes */
.stSuccess {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1)) !important;
    border-left: 4px solid #10b981 !important;
    border-radius: 8px !important;
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
</style>
""", unsafe_allow_html=True)

# Sidebar navigation
st.sidebar.title("🏏 Cricket Analytics Platform")

# Main navigation
st.sidebar.markdown("---")
st.sidebar.markdown("### 📊 Data Pipeline")
page = st.sidebar.radio(
    "Select Module:",
    [
        "🏠 Dashboard Home",
        "🌐 Data Scraper", 
        "🧹 Data Cleaning",
        "📊 Exploratory Analysis",
        "🤖 ML Predictions",
        "📤 Data Export"
    ]
)

st.sidebar.markdown("---")
st.sidebar.markdown("### 🚀 Advanced Features")
advanced_page = st.sidebar.radio(
    "AI Tools:",
    [
        "🏆 AI Strategy Coach",
        "⚡ Momentum Engine"
    ]
)

# Helper function to safely import and run pages
def run_page_script(script_path):
    """Safely execute a page script"""
    try:
        with open(script_path, 'r', encoding='utf-8') as f:
            script_content = f.read()
        
        # Create a local namespace for execution
        namespace = {
            '__name__': '__main__',
            'st': st,
            'os': os,
            'sys': sys,
            'Path': Path
        }
        
        exec(script_content, namespace)
        
    except Exception as e:
        st.error(f"Error loading page: {str(e)}")
        st.info("Please make sure all required dependencies are installed.")

# Main content based on selection
if page == "🏠 Dashboard Home":
    # Import and run Home page
    try:
        home_path = ROOT_DIR / "app" / "Home.py"
        if home_path.exists():
            # Execute Home.py directly
            with open(home_path, 'r', encoding='utf-8') as f:
                home_content = f.read()
            exec(home_content, {'__name__': '__main__'})
        else:
            st.title("🏏 Sports Analytics Platform")
            st.write("Welcome to the unified analytics application!")
    except Exception as e:
        st.error(f"Error loading home page: {e}")
        st.title("🏏 Sports Analytics Platform")
        st.write("Welcome to the unified analytics application!")
        
        st.markdown("""
        ### 📌 Choose a Module
        Use the left sidebar to access all tools.
        
        ### 🚀 Available Features
        - 📥 **Data Scraper** - Scrape sports data from various sources
        - 🧹 **Data Cleaning** - Clean and preprocess the scraped data
        - 🔁 **Data Transformation** - Transform data into analysis-ready formats
        - 📊 **Exploratory Data Analysis** - Visualize and analyze the data
        - 🤖 **ML Model Predictions** - Make predictions using trained models
        - 📤 **Data Export** - Export processed data and results
        """)

elif page == "🌐 Data Scraper":
    st.title("🌐 Data Scraper")
    st.info("📥 **Data Scraping Module**")
    run_page_script(ROOT_DIR / "app" / "pages" / "scraper.py")

elif page == "🧹 Data Cleaning":
    st.title("🧹 Data Cleaning & Processing")
    st.info("🧹 **Data Cleaning Module**")
    run_page_script(ROOT_DIR / "app" / "pages" / "1_🧹_Clean_Process.py")

elif page == "📊 Exploratory Analysis":
    st.title("📊 Exploratory Data Analysis")
    st.info("📊 **EDA Module**")
    run_page_script(ROOT_DIR / "app" / "pages" / "3_📊_EDA.py")

elif page == "🤖 ML Predictions":
    st.title("🤖 ML Model Predictions")
    st.info("🤖 **Predictions Module**")
    run_page_script(ROOT_DIR / "app" / "pages" / "4_🤖_Predictions.py")

elif page == "📤 Data Export":
    st.title("📤 Data Export")
    st.info("📤 **Export Module**")
    run_page_script(ROOT_DIR / "app" / "pages" / "5_📤_Export.py")

# Advanced features
if advanced_page == "🏆 AI Strategy Coach":
    if page == "🏠 Dashboard Home":  # Only show if not already showing another page
        st.title("🏆 AI Strategy Coach")
        st.info("🏆 **AI Strategy Module**")
        run_page_script(ROOT_DIR / "app" / "pages" / "7_🏆_AI_Strategy_Coach.py")

elif advanced_page == "⚡ Momentum Engine":
    if page == "🏠 Dashboard Home":  # Only show if not already showing another page
        st.title("⚡ Momentum Engine")
        st.info("⚡ **Momentum Module**")
        run_page_script(ROOT_DIR / "app" / "pages" / "8_⚡_Momentum_Engine.py")

# Sidebar info
st.sidebar.markdown("---")
st.sidebar.markdown("### 📋 Quick Info")
st.sidebar.info("""
**Getting Started:**
1. Select module from sidebar
2. Follow page instructions  
3. Data flows automatically

**Status:** ✅ All systems operational
""")
