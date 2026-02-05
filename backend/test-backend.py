#!/usr/bin/env python3
"""
Simple test script to run backend without complex dependencies
"""

import sys
import os
from pathlib import Path

# Add project root to sys.path
ROOT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT_DIR))

def main():
    print("🏏 Cricket Analytics Backend - Simple Test")
    print("=" * 50)
    
    # Test basic imports
    try:
        import streamlit as st
        print("✅ Streamlit imported successfully")
    except ImportError as e:
        print(f"❌ Streamlit import failed: {e}")
        return
    
    # Test if we can import our modules
    try:
        sys.path.append(str(ROOT_DIR / "src"))
        from src.analysis.predictions import predict_win_probability
        print("✅ Analysis modules imported successfully")
    except ImportError as e:
        print(f"❌ Analysis modules import failed: {e}")
        return
    
    # Test basic functionality
    print("\n📊 Testing Basic Functionality...")
    
    # Test data directory structure
    data_dir = ROOT_DIR / "data"
    if data_dir.exists():
        print("✅ Data directory exists")
        raw_dir = data_dir / "raw"
        processed_dir = data_dir / "processed"
        if raw_dir.exists():
            print("✅ Raw data directory exists")
        if processed_dir.exists():
            print("✅ Processed data directory exists")
    else:
        print("❌ Data directory not found")
    
    # Test models directory
    models_dir = ROOT_DIR / "models"
    if models_dir.exists():
        model_files = list(models_dir.glob("*.joblib"))
        print(f"✅ Models directory exists ({len(model_files)} models)")
        for model in model_files[:3]:
            print(f"    ✅ {model.name}")
    else:
        print("❌ Models directory not found")
    
    print("\n" + "=" * 50)
    print("🎯 Backend Test Complete!")
    print("🚀 Ready to run main application!")
    print("=" * 50)

if __name__ == "__main__":
    main()
