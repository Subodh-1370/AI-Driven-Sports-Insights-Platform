"""
Streamlit Predictions page (fixed paths + robust checks).

Place this file at: app/pages/5_🤖_Predictions.py
Run app from project root:
    streamlit run app/Home.py
"""

from __future__ import annotations
import os
import sys
from pathlib import Path
from typing import Dict

import streamlit as st

# ----------------------------
# Resolve project root & src
# ----------------------------
# file is at: project-root/app/pages/5_🤖_Predictions.py
THIS_FILE = Path(__file__).resolve()
PROJECT_ROOT = THIS_FILE.parents[2]  # project-root/
SRC_DIR = PROJECT_ROOT / "src"

# Ensure imports from src/ work
if str(SRC_DIR) not in sys.path:
    sys.path.insert(0, str(SRC_DIR))
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

# Now import your analysis modules (they live in src/analysis/)
try:
    from analysis import model_training as model_training_module
    from analysis import predictions as pred_utils
except Exception as e:
    # We'll still show page with helpful messages; imports may fail if src broken
    model_training_module = None
    pred_utils = None
    import_error = e
else:
    import_error = None

# ----------------------------
# Paths used by the page
# ----------------------------
DATA_PROCESSED_DIR = PROJECT_ROOT / "data" / "processed"
MODELS_DIR = PROJECT_ROOT / "models"

REQUIRED_MODEL_FILES: Dict[str, str] = {
    "Win prediction": "win_prediction_logreg.joblib",
    "Innings score": "innings_score_xgb.joblib",
    "Player performance": "player_performance_rf.joblib",
}

REQUIRED_DATA_FILES = [
    "fact_matches.csv",
    "fact_deliveries.csv",
]

# ----------------------------
# Helpers
# ----------------------------
def _model_path(name: str) -> Path:
    return MODELS_DIR / name

def _data_path(filename: str) -> Path:
    return DATA_PROCESSED_DIR / filename

def _ensure_dirs() -> None:
    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    DATA_PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

def _model_exists(filename: str) -> bool:
    return _model_path(filename).is_file()

def _data_files_exist() -> bool:
    return all(_data_path(f).is_file() for f in REQUIRED_DATA_FILES)

def _render_model_status() -> None:
    st.markdown("#### Model Status")
    cols = st.columns(len(REQUIRED_MODEL_FILES))
    for idx, (label, filename) in enumerate(REQUIRED_MODEL_FILES.items()):
        with cols[idx]:
            if _model_exists(filename):
                st.success(f"{label}\n`models/{filename}`")
            else:
                st.warning(
                    f"{label}\n`models/{filename}` not found.\n"
                    "Train the models using the button above after cleaning & transforming data."
                )

def _render_data_status() -> None:
    missing = [f for f in REQUIRED_DATA_FILES if not _data_path(f).is_file()]
    if missing:
        st.warning(
            "⚠️ **Processed data files missing!**\n\n"
            + "\n".join(f"- `data/processed/{f}`" for f in missing)
            + "\n\nPlease run the data pipeline first:\n"
            "1. Scrape data (Scraper page)\n"
            "2. Clean data (Clean_Process page → Clean Raw Data)\n"
            "3. Transform data (Clean_Process page → Transform Data for Analytics)\n"
            "4. Then return here to train models."
        )

def _handle_prediction_exception(exc: Exception, context: str) -> None:
    if isinstance(exc, FileNotFoundError):
        st.error(
            f"{context} failed: {exc}\n\n"
            "Make sure required models/data exist and that you've run the data cleaning & "
            "transformation steps first."
        )
    else:
        st.error(f"{context} failed: {exc}")

# ----------------------------
# Streamlit UI
# ----------------------------
def main() -> None:
    st.set_page_config(page_title="ML Predictions", page_icon="🤖", layout="wide")
    _ensure_dirs()

    # Enhanced CSS for predictions page
    st.markdown("""
    <style>
    /* Prediction Form Styling */
    .prediction-form {
        background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
        padding: 30px;
        border-radius: 20px;
        border: 1px solid rgba(255,255,255,0.2);
        backdrop-filter: blur(15px);
        margin: 20px 0;
    }
    
    /* Result Cards */
    .result-card {
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 25px;
        border-radius: 16px;
        text-align: center;
        font-size: 1.2rem;
        font-weight: 700;
        box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
        margin: 20px 0;
        animation: slideIn 0.5s ease-out;
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    /* Input Fields */
    .stTextInput > div > div > input {
        background: rgba(255,255,255,0.1) !important;
        border: 1px solid rgba(255,255,255,0.2) !important;
        color: white !important;
        border-radius: 8px !important;
    }
    
    .stSelectbox > div > div > select {
        background: rgba(255,255,255,0.1) !important;
        border: 1px solid rgba(255,255,255,0.2) !important;
        color: white !important;
        border-radius: 8px !important;
    }
    
    /* Sliders */
    .stSlider > div > div > div {
        background: linear-gradient(90deg, #3b82f6, #1d4ed8) !important;
    }
    </style>
    """, unsafe_allow_html=True)

    st.title("🤖 Machine Learning Predictions")
    st.markdown("""
    <div style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(168, 85, 247, 0.1)); 
                padding: 20px; border-radius: 15px; margin-bottom: 30px;">
        <h3 style="color: #60a5fa; margin-bottom: 10px;">🧠 AI-Powered Cricket Analytics</h3>
        <p style="color: #cbd5e1;">
            Get accurate predictions for match outcomes, innings scores, and player performance 
            using advanced machine learning models trained on historical cricket data.
        </p>
    </div>
    """, unsafe_allow_html=True)

    # If src import failed, show informative message
    if import_error:
        st.error("Failed to import analysis modules from src/. See details below.")
        st.exception(import_error)
        st.stop()

    _render_data_status()
    _render_model_status()

    st.sidebar.header("Model Utilities")
    if st.sidebar.button("Train / Retrain All Models"):
        if not _data_files_exist():
            st.sidebar.error(
                "Processed data files are missing. Run the data cleaning & transformation "
                "steps before training models."
            )
        else:
            try:
                with st.spinner("Training all models..."):
                    # call the train_all_models function inside src.analysis.model_training
                    results = model_training_module.train_all_models()
                for model_name, info in results.items():
                    if isinstance(info, dict) and "error" in info:
                        st.sidebar.error(f"{model_name}: {info['error']}")
                    else:
                        st.sidebar.success(f"{model_name} trained ✅")
                _render_model_status()
            except Exception as exc:
                st.sidebar.error(
                    f"Failed to train models: {exc}\n\n"
                    "Ensure you have cleaned & transformed data first."
                )

    st.divider()
    st.markdown("### Match Win Probability")

    with st.form("win_prediction_form"):
        col1, col2 = st.columns(2)
        with col1:
            team1 = st.text_input("Team 1", value="Team A")
        with col2:
            team2 = st.text_input("Team 2", value="Team B")
        venue = st.text_input("Venue", value="Neutral Venue")
        toss_decision = st.selectbox(
            "Toss decision",
            options=["bat", "bowl"],
            index=0,
        )
        submitted = st.form_submit_button("Predict Win Probability", type="primary")

    if submitted:
        model_file = REQUIRED_MODEL_FILES["Win prediction"]
        if not _model_exists(model_file):
            st.error(
                f"Win prediction model (`models/{model_file}`) not found. "
                "Train the models first using the sidebar button."
            )
        else:
            try:
                proba = pred_utils.predict_win_probability(
                    team1=team1,
                    team2=team2,
                    venue=venue,
                    toss_decision=toss_decision,
                )
                st.markdown(f"""
                <div class="result-card">
                    <div style="font-size: 1.1rem; margin-bottom: 10px;">🏆 Match Win Probability</div>
                    <div style="font-size: 2rem; font-weight: 900;">
                        {proba:.1%}
                    </div>
                    <div style="font-size: 0.9rem; opacity: 0.9; margin-top: 10px;">
                        Probability that **{team1}** wins the match
                    </div>
                </div>
                """, unsafe_allow_html=True)
            except Exception as exc:
                _handle_prediction_exception(exc, "Win probability prediction")

    st.divider()
    st.markdown("### Innings Score Prediction")

    with st.form("innings_score_form"):
        team = st.text_input("Batting team", value="Team A")
        venue2 = st.text_input("Venue", value="Neutral Venue", key="venue2")
        overs = st.slider("Number of overs", min_value=5, max_value=50, value=20, step=1)
        submitted_score = st.form_submit_button("Predict Innings Score", type="secondary")

    if submitted_score:
        model_file = REQUIRED_MODEL_FILES["Innings score"]
        if not _model_exists(model_file):
            st.error(
                f"Innings score model (`models/{model_file}`) not found. "
                "Train the models first using the sidebar button."
            )
        else:
            try:
                score = pred_utils.predict_innings_score(
                    team=team,
                    venue=venue2,
                    overs=overs,
                )
                st.markdown(f"""
                <div class="result-card" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
                    <div style="font-size: 1.1rem; margin-bottom: 10px;">🏏 Innings Score Prediction</div>
                    <div style="font-size: 2rem; font-weight: 900;">
                        {score:.1f} runs
                    </div>
                    <div style="font-size: 0.9rem; opacity: 0.9; margin-top: 10px;">
                        Expected total for **{team}** at {venue2}
                    </div>
                </div>
                """, unsafe_allow_html=True)
            except Exception as exc:
                _handle_prediction_exception(exc, "Innings score prediction")

    st.divider()
    st.markdown("### Player Performance Prediction")

    with st.form("player_perf_form"):
        player_name = st.text_input("Player name", value="Sample Player")
        team3 = st.text_input("Team (optional)", value="", key="team3")
        submitted_player = st.form_submit_button("Predict Player Performance", type="secondary")

    if submitted_player:
        model_file = REQUIRED_MODEL_FILES["Player performance"]
        if not _model_exists(model_file):
            st.error(
                f"Player performance model (`models/{model_file}`) not found. "
                "Train the models first using the sidebar button."
            )
        else:
            try:
                perf = pred_utils.predict_player_performance(
                    player_name=player_name,
                    team=team3 or None,
                )
                st.markdown(f"""
                <div class="result-card" style="background: linear-gradient(135deg, #8b5cf6, #7c3aed);">
                    <div style="font-size: 1.1rem; margin-bottom: 10px;">👤 Player Performance</div>
                    <div style="font-size: 2rem; font-weight: 900;">
                        {perf['predicted_runs']:.1f} runs
                    </div>
                    <div style="font-size: 0.9rem; opacity: 0.9; margin-top: 10px;">
                        Predicted performance for **{player_name}**
                        <br>Historical average: {perf['historical_total_runs']:.1f} runs
                    </div>
                </div>
                """, unsafe_allow_html=True)
            except Exception as exc:
                _handle_prediction_exception(exc, "Player performance prediction")

if __name__ == "__main__":
    main()
