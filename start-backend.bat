@echo off
echo 🏏 Cricket Analytics Backend - Starting Server
echo ============================================================

cd /d "e:\Data Analytics -Sports data Analytics"

echo 🔄 Activating virtual environment...
call .venv\Scripts\activate.bat

echo 📦 Checking dependencies...
python -c "import fastapi" 2>nul
if errorlevel 1 (
    echo 📦 Installing FastAPI and dependencies...
    pip install fastapi uvicorn pydantic python-multipart pandas numpy scikit-learn joblib
)

echo 🚀 Starting backend server...
cd backend

echo 🌐 Server will run on: http://localhost:8000
echo 📚 API Docs: http://localhost:8000/api/docs
echo ============================================================
echo Press Ctrl+C to stop the server
echo ============================================================

python app.py
