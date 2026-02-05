#!/usr/bin/env python3
"""
Simple backend runner that works with Python 3.13
"""

import sys
import os
from pathlib import Path

def main():
    print("🏏 Cricket Analytics Backend - Starting Server...")
    print("=" * 50)
    
    # Set up paths
    ROOT_DIR = Path(__file__).resolve().parent
    os.chdir(ROOT_DIR)
    
    # Add to path
    sys.path.insert(0, str(ROOT_DIR))
    sys.path.insert(0, str(ROOT_DIR / "src"))
    
    try:
        # Try to import and run the app
        print("📦 Importing FastAPI...")
        from fastapi import FastAPI
        print("✅ FastAPI imported successfully")
        
        print("📦 Importing other modules...")
        # Try basic imports without complex dependencies
        import uvicorn
        
        print("🚀 Starting server...")
        print(f"📍 Directory: {ROOT_DIR}")
        print(f"🌐 Server will run on: http://localhost:8000")
        print(f"📚 API Docs: http://localhost:8000/api/docs")
        print("=" * 50)
        
        # Run the server
        uvicorn.run(
            "app:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info"
        )
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        print("💡 Solution: Install missing dependencies:")
        print("   pip install fastapi uvicorn pydantic")
        return
    except Exception as e:
        print(f"❌ Error: {e}")
        return

if __name__ == "__main__":
    main()
