# Cricket Analytics Backend

## Overview
This is the backend API for my Final Year Project - Cricket Analytics Platform.
Built with FastAPI for high performance and easy integration with the React frontend.

## Features
- Instant data scraping (optimized for demo)
- ML model predictions
- Data processing pipeline
- Export functionality

## Setup
1. Install dependencies: `pip install -r requirements.txt`
2. Run server: `python app.py`
3. API will be available at: http://localhost:8000

## API Endpoints
- POST /api/scraper/start - Data collection
- POST /api/cleaning/start - Data cleaning
- POST /api/transformation/start - Feature engineering
- POST /api/eda/analyze - Exploratory analysis
- POST /api/predict/win - Win prediction
- POST /api/evaluation/run - Model evaluation
- POST /api/export - Export results

## Notes
- Using mock data for instant demo performance
- Real scraping logic in src/scraper/ folder
- ML models in src/analysis/ folder

Author: Final Year Project 2026
