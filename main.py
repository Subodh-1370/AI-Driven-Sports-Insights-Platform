import streamlit as st
import os
import sys

# Add the project root directory to sys.path
# This allows imports from src/ to work correctly
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

# Main page content
st.title("🏏 Sports Data Analytics Platform")
st.write("Welcome to the unified analytics application!")

st.subheader("📌 Choose a Module")
st.write("Use the left sidebar to access all tools.")

st.markdown("""
### 🚀 Available Features
- 📥 **Data Scraper** - Scrape sports data from various sources
- 🧹 **Data Cleaning** - Clean and preprocess the scraped data
- 🔁 **Data Transformation** - Transform data into analysis-ready formats
- 📊 **Exploratory Data Analysis** - Visualize and analyze the data
- 🤖 **ML Model Predictions** - Make predictions using trained models
- 📤 **Data Export** - Export processed data and results
""")

st.info("💡 Use the sidebar on the left to navigate between different modules.")

# Add some spacing
st.markdown("---")
st.write("")

# Add a footer
st.markdown(
    """
    ---
    ### 🚀 Getting Started
    1. Use the sidebar to navigate to the desired module
    2. Follow the instructions on each page
    3. Data flows automatically between modules
    """
)
