@echo off
title 🏏 Cricket Analytics - Full Project Start
echo ============================================================
echo 🏏 Cricket Analytics Platform - Full Project Start
echo ============================================================
echo.

echo 📦 Step 1: Installing Backend Dependencies...
cd /d "e:\Data Analytics -Sports data Analytics"

call .venv\Scripts\activate.bat
pip install fastapi uvicorn pydantic python-multipart pandas numpy scikit-learn joblib

echo.
echo 🚀 Step 2: Starting Backend Server...
start "Backend Server" cmd /k "cd /d e:\Data Analytics -Sports data Analytics\backend && ..\.venv\Scripts\activate.bat && python app.py"

echo.
echo 🎨 Step 3: Starting Frontend Server...
cd frontend
start "Frontend Server" cmd /k "npm start"

echo.
echo ============================================================
echo 🎯 PROJECT STARTING UP...
echo.
echo 🌐 Backend API: http://localhost:8000
echo 📚 API Docs: http://localhost:8000/api/docs
echo 🎨 Frontend App: http://localhost:3000
echo.
echo Both servers are starting in separate windows...
echo Close this window when servers are running.
echo ============================================================
pause
