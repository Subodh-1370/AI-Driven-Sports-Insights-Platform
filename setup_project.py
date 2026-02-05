#!/usr/bin/env python3
"""
Cricket Analytics Project Setup Script
=====================================
Final Year Project 2026

Author: [Your Name]
Description: This script helps set up the project environment
             I created this to make it easier to run the project
             on different machines during presentations.

Usage: python setup_project.py
"""

import os
import sys
import subprocess
from pathlib import Path

def print_header(text):
    """Print a nice header"""
    print("\n" + "="*60)
    print(f"  {text}")
    print("="*60)

def run_command(command, description):
    """Run a command and show progress"""
    print(f"\n🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ {description} completed successfully")
            return True
        else:
            print(f"❌ {description} failed: {result.stderr}")
            return False
    except Exception as e:
        print(f"❌ {description} failed: {str(e)}")
        return False

def check_python():
    """Check Python version"""
    print_header("CHECKING PYTHON VERSION")
    version = sys.version_info
    print(f"Python version: {version.major}.{version.minor}.{version.micro}")
    
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ Python 3.8+ is required")
        return False
    
    print("✅ Python version is compatible")
    return True

def setup_backend():
    """Setup backend dependencies"""
    print_header("SETTING UP BACKEND")
    
    # Check if requirements.txt exists
    backend_req = Path("backend/requirements.txt")
    if not backend_req.exists():
        print("❌ Backend requirements.txt not found")
        return False
    
    # Install backend dependencies
    success = run_command(
        "pip install -r backend/requirements.txt",
        "Installing backend dependencies"
    )
    
    return success

def setup_frontend():
    """Setup frontend dependencies"""
    print_header("SETTING UP FRONTEND")
    
    # Check if package.json exists
    frontend_pkg = Path("frontend/package.json")
    if not frontend_pkg.exists():
        print("❌ Frontend package.json not found")
        return False
    
    # Check if Node.js is installed
    node_check = run_command("node --version", "Checking Node.js")
    if not node_check:
        print("❌ Node.js is not installed")
        print("Please install Node.js from https://nodejs.org/")
        return False
    
    # Install frontend dependencies
    success = run_command(
        "cd frontend && npm install",
        "Installing frontend dependencies"
    )
    
    return success

def create_directories():
    """Create necessary directories"""
    print_header("CREATING DIRECTORIES")
    
    directories = [
        "data/processed",
        "data/raw",
        "models",
        "logs"
    ]
    
    for directory in directories:
        dir_path = Path(directory)
        dir_path.mkdir(parents=True, exist_ok=True)
        print(f"✅ Created directory: {directory}")
    
    return True

def main():
    """Main setup function"""
    print_header("CRICKET ANALYTICS PROJECT SETUP")
    print("Final Year Project 2026")
    print("Author: [Your Name]")
    
    # Check Python
    if not check_python():
        return False
    
    # Create directories
    if not create_directories():
        return False
    
    # Setup backend
    if not setup_backend():
        print("⚠️ Backend setup failed, but you can continue")
    
    # Setup frontend
    if not setup_frontend():
        print("⚠️ Frontend setup failed, but you can continue")
    
    print_header("SETUP COMPLETE")
    print("🎉 Project setup is complete!")
    print("\nTo run the project:")
    print("1. Backend: cd backend && python app.py")
    print("2. Frontend: cd frontend && npm start")
    print("3. Open: http://localhost:3000")
    print("\nGood luck with your presentation! 🚀")
    
    return True

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nSetup cancelled by user")
    except Exception as e:
        print(f"\n❌ Setup failed: {str(e)}")
        sys.exit(1)
