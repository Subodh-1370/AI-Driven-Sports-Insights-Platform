# Quick Installation Guide

## ⚡ Fast Setup (3 Steps)

### 1. Activate Virtual Environment

**Windows (PowerShell):**
```bash
.venv\Scripts\Activate.ps1
```

**Windows (CMD):**
```bash
.venv\Scripts\activate.bat
```

**macOS/Linux:**
```bash
source .venv/bin/activate
```

### 2. Install All Dependencies

```bash
pip install -r requirements.txt
```

**If that doesn't work:**
```bash
python -m pip install -r requirements.txt
```

### 3. Verify Installation

```bash
python -c "import pandas, numpy, sklearn, xgboost, streamlit, bs4; print('✓ All packages installed!')"
```

---

## 🔧 Common Installation Issues

### Error: `ModuleNotFoundError: No module named 'bs4'`

**Solution:**
```bash
# Make sure virtual environment is activated first!
pip install beautifulsoup4

# Or install all scraper dependencies at once
pip install beautifulsoup4 requests lxml
```

### Error: `ModuleNotFoundError: No module named 'requests'`

**Solution:**
```bash
pip install requests
```

### Error: `ModuleNotFoundError: No module named 'streamlit'`

**Solution:**
```bash
pip install streamlit
```

### Error: `ModuleNotFoundError: No module named 'xgboost'`

**Solution:**
```bash
pip install xgboost
```

**If xgboost fails on Windows:**
```bash
pip install xgboost --only-binary :all:
```

---

## 📦 Install Individual Packages

If you prefer to install packages individually:

```bash
# Web scraping
pip install beautifulsoup4 requests lxml selenium

# Data processing
pip install pandas numpy

# Machine learning
pip install scikit-learn xgboost joblib

# Visualization
pip install matplotlib seaborn streamlit

# Utilities
pip install python-dotenv
```

---

## ✅ After Installation

1. **Restart Streamlit** if it's already running:
   - Press `Ctrl+C` to stop
   - Run `streamlit run main.py` again

2. **Verify everything works:**
   ```bash
   streamlit run main.py
   ```

---

## 🆘 Still Having Issues?

1. **Check virtual environment is activated:**
   - You should see `(.venv)` in your terminal prompt
   - If not, activate it again

2. **Check Python version:**
   ```bash
   python --version
   # Should be Python 3.9 or higher
   ```

3. **Upgrade pip:**
   ```bash
   python -m pip install --upgrade pip
   ```

4. **Reinstall requirements:**
   ```bash
   pip install --upgrade -r requirements.txt
   ```

