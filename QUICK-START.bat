@echo off
title 🚀 Cricket Analytics - Quick Start
echo 🚀 Cricket Analytics - Quick Start
echo ==================================

cd /d "e:\Data Analytics -Sports data Analytics"

echo 📦 Installing FastAPI...
pip install fastapi uvicorn pydantic python-multipart

echo.
echo 🚀 Starting backend...
cd backend
start "Backend" python app.py

echo.
echo ✅ Frontend already running on http://localhost:3000
echo 🌐 Backend starting on http://localhost:8000
echo 📚 API Docs: http://localhost:8000/api/docs
echo ==================================
echo 🎯 Project starting up...
echo.
echo Backend server is starting in a new window...
echo Close this window when backend is running.
echo ==================================
pause
