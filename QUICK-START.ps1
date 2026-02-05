# Quick Start PowerShell Script
Write-Host "🚀 Cricket Analytics - Quick Start"
Write-Host "=================================="

# Install FastAPI if not available
try {
    Import-Module FastAPI -ErrorAction Stop
    Write-Host "✅ FastAPI already available"
} catch {
    Write-Host "📦 Installing FastAPI..."
    pip install fastapi uvicorn pydantic python-multipart
}

# Start backend
Write-Host "🚀 Starting backend..."
Set-Location "e:\Data Analytics -Sports data Analytics\backend"
Start-Process -FilePath "python" -ArgumentList "app.py" -WindowStyle Normal

# Frontend is already running
Write-Host "✅ Frontend already running on http://localhost:3000"
Write-Host "🌐 Backend starting on http://localhost:8000"
Write-Host "📚 API Docs: http://localhost:8000/api/docs"
Write-Host "=================================="
Write-Host "🎯 Project starting up..."
