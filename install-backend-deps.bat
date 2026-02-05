@echo off
echo 🏏 Cricket Analytics Backend - Installing Dependencies
echo ============================================================

cd /d "e:\Data Analytics -Sports data Analytics"

echo 🔄 Activating virtual environment...
call .venv\Scripts\activate.bat

echo 📦 Installing FastAPI and dependencies...
pip install fastapi uvicorn pydantic python-multipart

echo 📦 Installing additional dependencies...
pip install pandas numpy scikit-learn joblib

echo ✅ Installation complete!
echo 🚀 You can now run: cd backend && python app.py
echo ============================================================
pause
