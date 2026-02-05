#!/usr/bin/env python3
"""
Simple dependency installer
"""

import subprocess
import sys
from pathlib import Path

def main():
    print("📦 Installing Backend Dependencies...")
    print("=" * 40)
    
    project_root = Path(__file__).resolve().parent
    venv_pip = project_root / ".venv" / "Scripts" / "pip.exe"
    
    if not venv_pip.exists():
        print("❌ Virtual environment not found!")
        return
    
    dependencies = [
        "fastapi",
        "uvicorn", 
        "pydantic",
        "python-multipart",
        "pandas",
        "numpy",
        "scikit-learn",
        "joblib"
    ]
    
    for dep in dependencies:
        print(f"📦 Installing {dep}...")
        try:
            result = subprocess.run([
                str(venv_pip), "install", dep
            ], capture_output=True, text=True)
            
            if result.returncode == 0:
                print(f"✅ {dep} installed successfully")
            else:
                print(f"❌ Failed to install {dep}: {result.stderr}")
        except Exception as e:
            print(f"❌ Error installing {dep}: {e}")
    
    print("\n🎉 Installation complete!")
    print("🚀 Now you can run: python quick-start-backend.py")

if __name__ == "__main__":
    main()
