@echo off
echo 🏏 Starting Cricket Analytics Full-Stack Application
echo.

echo 📦 Installing Backend Dependencies...
cd backend
pip install fastapi uvicorn pydantic python-multipart pandas numpy scikit-learn joblib python-dotenv

echo 🚀 Starting Backend Server...
start "Backend Server" cmd /k "python app.py"

echo ⏳ Waiting for backend to start...
timeout /t 5 /nobreak

echo 📦 Installing Frontend Dependencies...
cd ../frontend
call npm install

echo 🎨 Starting Frontend Development Server...
start "Frontend Server" cmd /k "npm start"

echo.
echo ✅ Full-Stack Application Started!
echo 📊 Backend: http://localhost:8000
echo 🎨 Frontend: http://localhost:3000
echo 📚 API Docs: http://localhost:8000/api/docs
echo.
echo Press Ctrl+C to stop all servers
pause
