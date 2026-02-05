import streamlit as st
import os
import sys

# Add the project root directory to sys.path
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

# Set page config (must be first Streamlit command)
st.set_page_config(
    page_title="Sports Analytics",
    page_icon="🏏",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Sidebar navigation
st.sidebar.title("🏏 Navigation")

# Define pages
PAGES = {
    "🏠 Home": "app/Home.py",
    "🧹 Data Cleaning": "app/pages/1_🧹_Clean_Process.py", 
    "🌐 Data Scraper": "app/pages/2_🌐_Scraper.py",
    "📊 Exploratory Analysis": "app/pages/3_📊_EDA.py",
    "🤖 ML Predictions": "app/pages/4_🤖_Predictions.py",
    "📤 Data Export": "app/pages/5_📤_Export.py",
    "🏆 AI Strategy Coach": "app/pages/7_🏆_AI_Strategy_Coach.py",
    "⚡ Momentum Engine": "app/pages/8_⚡_Momentum_Engine.py"
}

# Create sidebar navigation
selection = st.sidebar.radio("Go to:", list(PAGES.keys()))

# Display the selected page
if selection == "🏠 Home":
    # Import and run Home page
    sys.path.append(os.path.join(ROOT_DIR, "app"))
    from Home import main as home_main
    home_main()
else:
    # For other pages, we need to run them as separate Streamlit apps
    # Show instructions for now
    st.title(f"{selection}")
    st.info(f"""
    **To access {selection}:**
    
    Please run the specific page directly:
    ```bash
    streamlit run {PAGES[selection]}
    ```
    
    Or navigate to the page URL if it's already running.
    """)
    
    # Show page description
    if "Cleaning" in selection:
        st.markdown("""
        ### 🧹 Data Cleaning & Processing
        - Clean raw scraped CSVs (matches, players, deliveries)
        - Build transformed fact/dimension tables for analytics and modeling
        """)
    elif "Scraper" in selection:
        st.markdown("""
        ### 🌐 Data Scraping
        - Scrape match data from ESPNcricinfo
        - Scrape player profiles  
        - Scrape ball-by-ball deliveries
        """)
    elif "Analysis" in selection:
        st.markdown("""
        ### 📊 Exploratory Data Analysis
        - View top scorers, wicket takers
        - Analyze venue performance
        - Check toss impact
        """)
    elif "Predictions" in selection:
        st.markdown("""
        ### 🤖 ML Model Predictions
        - Train win prediction model
        - Train innings score model
        - Train player performance model
        """)
    elif "Export" in selection:
        st.markdown("""
        ### 📤 Data Export
        - Export analytics-ready tables
        - Generate Power BI compatible files
        """)
