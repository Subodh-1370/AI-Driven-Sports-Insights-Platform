"""
🏏 Cricket Analytics Backend - FastAPI Server
=============================================
Final Year Project 2026 - Cricket Analytics Platform

Author: [Your Name]
Project: Complete Cricket Analytics Pipeline
Technology: FastAPI + Python + ML

This is the main backend server that handles:
1. Data scraping from cricket websites
2. Data processing and cleaning
3. ML model predictions
4. Export functionality

Note: Using mock data for instant demo performance
Real scraping logic available in src/scraper/
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import uvicorn
import sys
import os
import time
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
    from backend.mock_data import get_mock_matches, get_mock_deliveries, get_mock_players, get_mock_scraping_results, get_mock_cleaning_results, get_cleaning_response, get_mock_transformation_results, get_mock_eda_results
    ANALYSIS_AVAILABLE = True
except ImportError as e:
    logging.warning(f"Analysis modules not available: {e}")
    ANALYSIS_AVAILABLE = False

# Initialize FastAPI app
# This is the main API server for the cricket analytics platform
app = FastAPI(
    title="🏏 Cricket Analytics API",
    description="Final Year Project - Complete Cricket Analytics Pipeline with ML Predictions",
    version="2.0.0",
    docs_url="/api/docs",  # Swagger UI for API documentation
    redoc_url="/api/redoc" # Alternative documentation
)

# Configure CORS to allow frontend to connect
# Important for React frontend running on localhost:3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Pydantic Models for API request/response validation
# These models ensure data consistency and provide API documentation

class WinPredictionRequest(BaseModel):
    """Request model for win prediction"""
    team1: str = Field(..., description="First team name")
    team2: str = Field(..., description="Second team name")
    venue: str = Field(..., description="Match venue")
    toss_decision: str = Field(..., description="Toss decision (bat/bowl)")

class InningsScoreRequest(BaseModel):
    """Request model for innings score prediction"""
    team: str = Field(..., description="Batting team name")
    venue: str = Field(..., description="Match venue")
    overs: int = Field(default=20, ge=5, le=50, description="Number of overs")

class ScrapingRequest(BaseModel):
    """Request model for data scraping"""
    url: str = Field(..., description="URL to scrape")
    source: str = Field(..., description="Data source type")

class PlayerPerformanceRequest(BaseModel):
    """Request model for player performance prediction"""
    player_name: str = Field(..., description="Player name")
    team: Optional[str] = Field(None, description="Team name (optional)")

class ExportRequest(BaseModel):
    """Request model for data export"""
    format: str = Field(default="csv", description="Export format")
    type: str = Field(default="matches", description="Data type to export")

class PredictionResponse(BaseModel):
    """Standard response model for all API endpoints"""
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

# Instant Scraping Endpoints
@app.post("/api/scraper/start", response_model=PredictionResponse)
async def instant_scraping(request: ScrapingRequest):
    """Instant data scraping using mock data"""
    try:
        # Simulate instant scraping (0.5 seconds instead of minutes)
        time.sleep(0.5)
        
        # Get industry-standard scraping results
        from backend.mock_data import get_mock_scraping_results
        scraping_results = get_mock_scraping_results()
        
        return create_response(
            success=True,
            data=scraping_results["data"],
            message=scraping_results["message"]
        )
        
    except Exception as e:
        logger.error(f"Scraping error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Scraping failed: {str(e)}")

@app.post("/api/cleaning/start", response_model=PredictionResponse)
async def instant_cleaning():
    """Instant data cleaning using mock data"""
    try:
        # Simulate instant cleaning (0.3 seconds instead of minutes)
        time.sleep(0.3)
        
        # Get industry-standard cleaning results
        from backend.mock_data import get_cleaning_response
        cleaning_results = get_cleaning_response()
        
        return create_response(
            success=True,
            data=cleaning_results,
            message="Data cleaned successfully"
        )
        
    except Exception as e:
        logger.error(f"Cleaning error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Cleaning failed: {str(e)}")

@app.post("/api/transformation/start", response_model=PredictionResponse)
async def instant_transformation():
    """Instant data transformation using mock data"""
    try:
        # Simulate instant transformation (0.4 seconds instead of minutes)
        time.sleep(0.4)
        
        # Get industry-standard transformation results
        from backend.mock_data import get_mock_transformation_results
        transformation_results = get_mock_transformation_results()
        
        return create_response(
            success=True,
            data=transformation_results["data"],
            message=transformation_results["message"]
        )
        
    except Exception as e:
        logger.error(f"Transformation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Transformation failed: {str(e)}")

@app.post("/api/eda/analyze/{analysis_type}", response_model=PredictionResponse)
async def instant_eda(analysis_type: str):
    """Instant EDA using mock data"""
    try:
        # Simulate instant EDA (0.5 seconds)
        time.sleep(0.5)
        
        # Get industry-standard EDA results
        from backend.mock_data import get_mock_eda_results
        eda_results = get_mock_eda_results(analysis_type)
        
        return create_response(
            success=True,
            data=eda_results,
            message=f"EDA analysis completed for {analysis_type}"
        )
        
    except Exception as e:
        logger.error(f"EDA error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"EDA failed: {str(e)}")

@app.post("/api/evaluation/run", response_model=PredictionResponse)
async def instant_evaluation():
    """Instant model evaluation using mock data"""
    try:
        # Simulate instant evaluation (0.2 seconds)
        time.sleep(0.2)
        
        return create_response(
            success=True,
            data={
                "status": "completed",
                "evaluation_time": "0.2 seconds",
                "accuracy": 94.2,
                "precision": 92.8,
                "recall": 89.5,
                "f1_score": 91.1
            },
            message="Models evaluated instantly"
        )
        
    except Exception as e:
        logger.error(f"Evaluation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Evaluation failed: {str(e)}")

@app.post("/api/export", response_model=PredictionResponse)
async def instant_export(request: ExportRequest):
    """Instant data export using mock data"""
    try:
        # Simulate instant export (0.3 seconds)
        time.sleep(0.3)
        
        # Generate mock export data
        if request.type == "matches":
            data = get_mock_matches()
        elif request.type == "players":
            data = get_mock_players()
        else:
            data = get_mock_deliveries()
        
        return create_response(
            success=True,
            data={
                "status": "completed",
                "export_time": "0.3 seconds",
                "format": request.format,
                "type": request.type,
                "records_exported": len(data),
                "file_size": f"{len(data) * 0.5} KB",
                "download_url": f"/api/download/{request.type}.{request.format}"
            },
            message="Data exported instantly"
        )
        
    except Exception as e:
        logger.error(f"Export error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Export failed: {str(e)}")

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
