"""
🏏 Cricket Analytics Backend - FastAPI Server
Modern RESTful API for Cricket Analytics Platform
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import uvicorn
import sys
import os
from pathlib import Path
import logging

# Add project root to path
ROOT_DIR = Path(__file__).resolve().parents[1]
sys.path.append(str(ROOT_DIR))

# Import analytics modules
try:
    from src.analysis.predictions import (
        predict_win_probability, 
        predict_innings_score, 
        predict_player_performance
    )
    from src.analysis.model_training import train_all_models
    ANALYSIS_AVAILABLE = True
except ImportError as e:
    logging.warning(f"Analysis modules not available: {e}")
    ANALYSIS_AVAILABLE = False

# Initialize FastAPI
app = FastAPI(
    title="🏏 Cricket Analytics API",
    description="Advanced Cricket Analytics with ML Predictions",
    version="2.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Pydantic Models
class WinPredictionRequest(BaseModel):
    team1: str = Field(..., description="First team name")
    team2: str = Field(..., description="Second team name")
    venue: str = Field(..., description="Match venue")
    toss_decision: str = Field(..., description="Toss decision (bat/bowl)")

class InningsScoreRequest(BaseModel):
    team: str = Field(..., description="Batting team name")
    venue: str = Field(..., description="Match venue")
    overs: int = Field(default=20, ge=5, le=50, description="Number of overs")

class PlayerPerformanceRequest(BaseModel):
    player_name: str = Field(..., description="Player name")
    team: Optional[str] = Field(None, description="Team name (optional)")

class PredictionResponse(BaseModel):
    success: bool
    data: Optional[Dict[str, Any]] = None
    message: str
    timestamp: str

class SystemStatus(BaseModel):
    status: str
    models_loaded: bool
    analysis_available: bool
    api_version: str
    endpoints: List[str]

# Utility Functions
def create_response(success: bool, data: Any = None, message: str = "") -> PredictionResponse:
    """Create standardized API response"""
    from datetime import datetime
    return PredictionResponse(
        success=success,
        data=data,
        message=message,
        timestamp=datetime.now().isoformat()
    )

def check_analysis_available():
    """Check if analysis modules are available"""
    if not ANALYSIS_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="Analysis modules not available. Please check backend configuration."
        )

# API Endpoints
@app.get("/", response_model=Dict[str, str])
async def root():
    """Root endpoint"""
    return {
        "message": "🏏 Cricket Analytics API",
        "version": "2.0.0",
        "docs": "/api/docs"
    }

@app.get("/api/health", response_model=SystemStatus)
async def health_check():
    """Health check endpoint"""
    # Check if models exist
    models_dir = ROOT_DIR / "models"
    models_exist = {
        "win_prediction": (models_dir / "win_prediction_logreg.joblib").exists(),
        "innings_score": (models_dir / "innings_score_xgb.joblib").exists(),
        "player_performance": (models_dir / "player_performance_rf.joblib").exists()
    }
    
    return SystemStatus(
        status="healthy" if all(models_exist.values()) else "degraded",
        models_loaded=all(models_exist.values()),
        analysis_available=ANALYSIS_AVAILABLE,
        api_version="2.0.0",
        endpoints=[
            "/api/predict/win",
            "/api/predict/innings-score",
            "/api/predict/player-performance",
            "/api/models/train",
            "/api/stats/overview"
        ]
    )

@app.post("/api/predict/win", response_model=PredictionResponse)
async def predict_win(request: WinPredictionRequest):
    """Predict match win probability"""
    try:
        check_analysis_available()
        
        probability = predict_win_probability(
            team1=request.team1,
            team2=request.team2,
            venue=request.venue,
            toss_decision=request.toss_decision
        )
        
        return create_response(
            success=True,
            data={
                "team1": request.team1,
                "team2": request.team2,
                "venue": request.venue,
                "toss_decision": request.toss_decision,
                "win_probability": probability,
                "percentage": f"{probability:.1%}"
            },
            message="Win probability calculated successfully"
        )
        
    except Exception as e:
        logger.error(f"Win prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.post("/api/predict/innings-score", response_model=PredictionResponse)
async def predict_innings(request: InningsScoreRequest):
    """Predict innings total score"""
    try:
        check_analysis_available()
        
        score = predict_innings_score(
            team=request.team,
            venue=request.venue,
            overs=request.overs
        )
        
        return create_response(
            success=True,
            data={
                "team": request.team,
                "venue": request.venue,
                "overs": request.overs,
                "predicted_score": score,
                "formatted_score": f"{score:.1f} runs"
            },
            message="Innings score predicted successfully"
        )
        
    except Exception as e:
        logger.error(f"Innings prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.post("/api/predict/player-performance", response_model=PredictionResponse)
async def predict_player(request: PlayerPerformanceRequest):
    """Predict player performance"""
    try:
        check_analysis_available()
        
        performance = predict_player_performance(
            player_name=request.player_name,
            team=request.team
        )
        
        return create_response(
            success=True,
            data={
                "player_name": request.player_name,
                "team": request.team,
                "predicted_runs": performance["predicted_runs"],
                "historical_total_runs": performance["historical_total_runs"],
                "formatted_predicted": f"{performance['predicted_runs']:.1f} runs",
                "formatted_historical": f"{performance['historical_total_runs']:.1f} runs"
            },
            message="Player performance predicted successfully"
        )
        
    except Exception as e:
        logger.error(f"Player prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.post("/api/models/train", response_model=PredictionResponse)
async def train_models(background_tasks: BackgroundTasks):
    """Train all ML models (background task)"""
    try:
        if not ANALYSIS_AVAILABLE:
            raise HTTPException(
                status_code=503,
                detail="Analysis modules not available"
            )
        
        # Run training in background
        def train_task():
            try:
                results = train_all_models()
                logger.info(f"Model training completed: {results}")
            except Exception as e:
                logger.error(f"Model training failed: {str(e)}")
        
        background_tasks.add_task(train_task)
        
        return create_response(
            success=True,
            data={"status": "training_started"},
            message="Model training started in background"
        )
        
    except Exception as e:
        logger.error(f"Training initiation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Training failed: {str(e)}")

@app.get("/api/stats/overview", response_model=PredictionResponse)
async def get_stats_overview():
    """Get platform statistics overview"""
    try:
        # Load data for statistics
        data_dir = ROOT_DIR / "data" / "processed"
        matches_file = data_dir / "fact_matches.csv"
        deliveries_file = data_dir / "fact_deliveries.csv"
        
        stats = {
            "total_matches": 0,
            "total_deliveries": 0,
            "teams": [],
            "venues": [],
            "seasons": []
        }
        
        if matches_file.exists():
            import pandas as pd
            matches_df = pd.read_csv(matches_file)
            stats["total_matches"] = len(matches_df)
            if "team1" in matches_df.columns:
                teams = set(matches_df["team1"].unique()) | set(matches_df["team2"].unique())
                stats["teams"] = sorted(list(teams))
            if "venue" in matches_df.columns:
                stats["venues"] = sorted(matches_df["venue"].unique().tolist())
            if "season" in matches_df.columns:
                stats["seasons"] = sorted(matches_df["season"].unique().tolist())
        
        if deliveries_file.exists():
            import pandas as pd
            deliveries_df = pd.read_csv(deliveries_file)
            stats["total_deliveries"] = len(deliveries_df)
        
        return create_response(
            success=True,
            data=stats,
            message="Statistics retrieved successfully"
        )
        
    except Exception as e:
        logger.error(f"Stats error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get statistics: {str(e)}")

# Exception Handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content=create_response(
            success=False,
            message=exc.detail
        ).dict()
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content=create_response(
            success=False,
            message="Internal server error"
        ).dict()
    )

# Run server
if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
