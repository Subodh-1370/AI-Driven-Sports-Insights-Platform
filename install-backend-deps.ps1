# PowerShell script to install backend dependencies in virtual environment
Write-Host "🏏 Cricket Analytics Backend - Installing Dependencies"
Write-Host "=" * 60

# Navigate to project root
Set-Location "e:\Data Analytics -Sports data Analytics"

# Activate virtual environment
Write-Host "🔄 Activating virtual environment..."
& .\.venv\Scripts\Activate.ps1

# Install dependencies
Write-Host "📦 Installing FastAPI and dependencies..."
pip install fastapi uvicorn pydantic python-multipart

# Install additional dependencies
Write-Host "📦 Installing additional dependencies..."
pip install pandas numpy scikit-learn joblib

Write-Host "✅ Installation complete!"
Write-Host "🚀 You can now run: cd backend && python app.py"
Write-Host "=" * 60
