#!/usr/bin/env python3
"""
Quick backend starter that handles all the setup
"""

import subprocess
import sys
import os
from pathlib import Path

def main():
    print("🏏 Cricket Analytics Backend - Quick Start")
    print("=" * 50)
    
    # Set up paths
    project_root = Path(__file__).resolve().parent
    venv_python = project_root / ".venv" / "Scripts" / "python.exe"
    backend_dir = project_root / "backend"
    app_file = backend_dir / "app.py"
    
    print(f"📍 Project Root: {project_root}")
    print(f"🐍 Virtual Env Python: {venv_python}")
    print(f"📁 Backend Dir: {backend_dir}")
    print(f"📄 App File: {app_file}")
    
    # Check if virtual environment exists
    if not venv_python.exists():
        print("❌ Virtual environment not found!")
        return
    
    # Check if app.py exists
    if not app_file.exists():
        print("❌ app.py not found!")
        return
    
    print("\n🔄 Starting backend server...")
    print("🌐 Server will run on: http://localhost:8000")
    print("📚 API Docs: http://localhost:8000/api/docs")
    print("🔍 Health Check: http://localhost:8000/api/health")
    print("=" * 50)
    print("Press Ctrl+C to stop the server")
    print("=" * 50)
    
    try:
        # Start the backend
        env = os.environ.copy()
        env["PYTHONPATH"] = f"{project_root};{project_root}/src"
        
        subprocess.run([
            str(venv_python),
            str(app_file)
        ], cwd=str(backend_dir), env=env)
        
    except KeyboardInterrupt:
        print("\n🛑 Backend server stopped by user")
    except Exception as e:
        print(f"❌ Error starting backend: {e}")

if __name__ == "__main__":
    main()
