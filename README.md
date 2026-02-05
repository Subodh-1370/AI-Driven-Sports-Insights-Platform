## Sports Data Analytics – Cricket Performance Insights Using Python, Web Scraping & Power BI

This project provides an end-to-end workflow for building a **cricket performance analytics** pipeline using:

- **Python** for web scraping, data cleaning, transformation, analysis, and modeling
- **Requests / BeautifulSoup / Selenium** for scraping ball-by-ball and match data (e.g. ESPNcricinfo-style pages)
- **Pandas / NumPy / Scikit-learn / XGBoost** for data processing and machine learning
- **Power BI** for interactive dashboards and business-ready visuals

The codebase is structured so you can plug in real-world data sources and extend the analysis for different leagues, formats, or custom KPIs.

---

## 🚀 Quick Start Guide

### Prerequisites

- **Python 3.9 or higher** ([Download Python](https://www.python.org/downloads/))
- **Power BI Desktop** (optional, for dashboard creation)
- **Git** (optional, for cloning the repository)

> 💡 **Quick Install Help?** See [INSTALL.md](INSTALL.md) for detailed installation instructions and troubleshooting.

### Step 1: Clone/Download the Project

If using Git:
```bash
git clone <repository-url>
cd "Data Analytics -Sports data Analytics"
```

Or download and extract the project folder to your desired location.

### Step 2: Set Up Virtual Environment

**Windows (PowerShell):**
```bash
# Create virtual environment
python -m venv .venv

# Activate virtual environment
.venv\Scripts\Activate.ps1
```

**Windows (Command Prompt):**
```bash
python -m venv .venv
.venv\Scripts\activate.bat
```

**macOS/Linux:**
```bash
python3 -m venv .venv
source .venv/bin/activate
```

You should see `(.venv)` in your terminal prompt when activated.

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

This will install all required packages:
- `pandas`, `numpy` for data processing
- `beautifulsoup4`, `requests` for web scraping
- `scikit-learn`, `xgboost` for machine learning
- `streamlit` for the web interface
- And more...

### Step 4: Verify Installation

Check that all packages are installed:
```bash
python -c "import pandas, numpy, sklearn, xgboost, streamlit; print('All packages installed successfully!')"
```

### Step 5: Run the Streamlit App (Recommended)

The easiest way to use the project is through the **Streamlit web interface**:

```bash
streamlit run main.py
```

Or run the Home page directly:
```bash
streamlit run app/Home.py
```

This will:
- Start a local web server (usually at `http://localhost:8501`)
- Open your default browser automatically
- Display the multi-page dashboard

**Navigate through the pages:**
- Use the **sidebar menu (☰)** in the top-left corner to switch between pages
- Or run individual pages directly:
  - `streamlit run app/Scraper.py` - Data scraping
  - `streamlit run app/Clean_Process.py` - Data cleaning
  - `streamlit run app/EDA.py` - Exploratory analysis
  - `streamlit run app/Predictions.py` - ML predictions
  - `streamlit run app/Export.py` - Power BI export

**Available pages:**
1. **Home** → Project overview and navigation
2. **Scraper** → Scrape match, player, and delivery data
3. **Clean_Process** → Clean and transform raw data
4. **EDA** → Explore data with interactive charts
5. **Predictions** → Train ML models and make predictions
6. **Export** → Export data for Power BI

---

## 📋 Complete Workflow (Step-by-Step)

### Option A: Using Streamlit UI (Easiest)

1. **Start the Streamlit app:**
   ```bash
   streamlit run main.py
   ```

2. **Scrape Data:**
   - Go to **Scraper** page
   - Enter ESPNcricinfo URLs (e.g., season/tournament page)
   - Click "Scrape Match Data", "Scrape Player Data", or "Scrape Deliveries Data"
   - Wait for completion (logs will show progress)

3. **Clean & Process:**
   - Go to **Clean_Process** page
   - Click "Clean Raw Data" → cleans matches, players, deliveries
   - Click "Transform Data for Analytics" → creates fact/dimension tables
   - View sample cleaned tables

4. **Explore Data:**
   - Go to **EDA** page
   - Select analysis type (Top Scorers, Wicket Takers, Venue Stats, etc.)
   - View interactive charts and tables

5. **Train Models:**
   - Go to **Predictions** page
   - Click "Train / Retrain All Models" in sidebar
   - Wait for training to complete (models saved to `models/` folder)
   - Use prediction forms to test models

6. **Export to Power BI:**
   - Go to **Export** page
   - Click "Export Cleaned Data"
   - Files saved to `data/analytics/`
   - Follow instructions to import into Power BI

### Option B: Using Command Line

If you prefer command-line workflow:

1. **Scrape Data:**
   ```bash
   # Scrape matches (update URL in script first)
   python src/scraper/scrape_matches.py
   
   # Scrape players
   python src/scraper/scrape_players.py
   
   # Scrape deliveries (update URLs in script first)
   python src/scraper/scrape_deliveries.py
   ```

2. **Clean Data:**
   ```bash
   python src/processing/clean_data.py
   ```

3. **Transform Data:**
   ```bash
   python src/processing/transform_data.py
   ```

4. **Train Models:**
   ```bash
   python src/analysis/model_training.py
   ```

5. **Export for Power BI:**
   ```bash
   python src/visualization/export_for_powerbi.py
   ```

---

## 📁 Project Structure Overview

```
.
├── app/                    # Streamlit web interface
│   ├── Home.py            # Home dashboard
│   ├── Scraper.py         # Data scraping page
│   ├── Clean_Process.py   # Data cleaning page
│   ├── EDA.py             # Exploratory analysis page
│   ├── Predictions.py     # ML models & predictions page
│   └── Export.py          # Power BI export page
│
├── src/                    # Core Python modules
│   ├── scraper/           # Web scraping scripts
│   ├── processing/        # Data cleaning & transformation
│   ├── analysis/          # EDA & ML models
│   └── visualization/     # Power BI export
│
├── data/                   # Data storage
│   ├── raw/               # Raw scraped CSV files
│   ├── processed/         # Cleaned & transformed CSVs
│   └── analytics/         # Power BI-ready exports
│
├── models/                 # Trained ML models (created after training)
├── notebooks/              # Jupyter notebooks for exploration
├── dashboard/              # Power BI documentation
├── requirements.txt        # Python dependencies
└── README.md              # This file
```

---

### Overview

The pipeline covers:

- **Data Collection**: Scrape match, player, and ball-by-ball data.
- **Data Cleaning & Processing**: Standardize team/player names, handle missing values, and build clean tables.
- **Exploratory Data Analysis (EDA)**: Generate summary statistics and cricket-specific insights (run distributions, top scorers, venue stats, toss impact, etc.).
- **Machine Learning**:
  - Logistic Regression for **match win prediction**
  - RandomForest for **player performance prediction**
  - XGBoost for **innings score prediction**
- **Power BI Integration**: Export curated datasets for direct consumption by Power BI.

---

### Project Structure

```text
.
├─ src/
│  ├─ scraper/
│  │  ├─ scrape_matches.py
│  │  ├─ scrape_players.py
│  │  └─ scrape_deliveries.py
│  ├─ processing/
│  │  ├─ clean_data.py
│  │  └─ transform_data.py
│  ├─ analysis/
│  │  ├─ eda.py
│  │  ├─ model_training.py
│  │  └─ predictions.py
│  └─ visualization/
│     └─ export_for_powerbi.py
├─ data/
│  ├─ raw/
│  ├─ processed/
│  └─ analytics/
├─ notebooks/
│  ├─ EDA.ipynb
│  └─ Model_Development.ipynb
├─ dashboard/
│  └─ README_for_PowerBI.md
├─ requirements.txt
└─ README.md
```

---

### Features

- **Configurable Web Scraping**
  - Modular scrapers for matches, players, and ball-by-ball deliveries.
  - Built with `requests` + `BeautifulSoup` by default and easily extendable to `Selenium` for dynamic pages.
  - Automatic export of raw scraped data as CSV into `data/raw/`.

- **Robust Data Cleaning & Processing**
  - Null handling and type conversions.
  - Standardization of team and player names via mapping utilities.
  - Merge logic for combining matches, players, and deliveries into analytics-ready tables.

- **Exploratory Data Analysis**
  - Run distributions by team, innings, and overs.
  - Top run-scorers and wicket-takers.
  - Toss impact on match outcomes.
  - Venue-wise performance and conditions insights.

- **Machine Learning Models**
  - Logistic Regression for **win/loss prediction**.
  - RandomForest-based **player performance score** prediction.
  - XGBoost-based **innings score regression**.
  - Utility functions for model training, evaluation, saving, and loading.

- **Power BI Integration**
  - Clean, denormalized tables exported into `data/analytics/`.
  - Dataset schemas suitable for direct import into Power BI.

---

### Tech Stack

- **Language**: Python 3.9+
- **Scraping**: `requests`, `beautifulsoup4`, `lxml`, `selenium` (optional)
- **Data Processing**: `pandas`, `numpy`
- **Visualization / EDA**: `matplotlib`, `seaborn`
- **Machine Learning**: `scikit-learn`, `xgboost`
- **Serialization**: `joblib`
- **BI Tool**: Power BI Desktop / Power BI Service

---

### Detailed Setup Instructions

#### 1. Verify Python Installation

Check your Python version:
```bash
python --version
# Should be Python 3.9 or higher
```

If Python is not installed, download from [python.org](https://www.python.org/downloads/).

#### 2. Create Virtual Environment

**Why use a virtual environment?**
- Isolates project dependencies
- Prevents conflicts with other Python projects
- Makes the project portable

**Create and activate:**
```bash
# Create virtual environment
python -m venv .venv

# Activate (Windows PowerShell)
.venv\Scripts\Activate.ps1

# Activate (Windows CMD)
.venv\Scripts\activate.bat

# Activate (macOS/Linux)
source .venv/bin/activate
```

#### 3. Install Dependencies

**IMPORTANT**: Make sure your virtual environment is activated before installing!

```bash
# Upgrade pip first
pip install --upgrade pip

# Install all dependencies from requirements.txt
pip install -r requirements.txt
```

**If the above doesn't work, try:**
```bash
python -m pip install -r requirements.txt
```

**Or install key packages individually:**
```bash
# Essential scraping packages
pip install beautifulsoup4 requests lxml

# Data processing
pip install pandas numpy

# Machine learning
pip install scikit-learn xgboost joblib

# Visualization
pip install matplotlib seaborn streamlit
```

**If you encounter errors:**
- **Windows**: You may need to install Microsoft Visual C++ Build Tools for some packages
- **macOS**: Install Xcode Command Line Tools: `xcode-select --install`
- **Linux**: Install build essentials: `sudo apt-get install build-essential`

#### 4. Verify Installation

Test that key packages are installed:
```bash
python -c "import pandas, numpy, sklearn, xgboost, streamlit, bs4; print('✓ All packages installed!')"
```

#### 5. Create Required Directories

The directories are created automatically, but you can verify:
```bash
# Windows PowerShell
New-Item -ItemType Directory -Force -Path data\raw, data\processed, data\analytics, models

# macOS/Linux
mkdir -p data/raw data/processed data/analytics models
```

Or they will be created automatically when you run the scripts.

---

### Running the Streamlit App

This project includes a **Streamlit multi-page web interface** under the `app/` directory.

1. Make sure your virtual environment is activated and dependencies are installed.

2. From the project root, run:

```bash
streamlit run main.py
```

Or:
```bash
streamlit run app/Home.py
```

3. Navigate through the sidebar or home page links to access:

- **Home** – Overview and workflow
- **Scraper** – Run web scrapers and view logs
- **Clean_Process** – Clean raw data and transform for analytics
- **EDA** – Interactive exploratory analysis
- **Predictions** – Train models and generate predictions
- **Export** – Export data for Power BI

The app uses functions from the `src/` modules, and all heavy lifting (scraping, processing, modeling, exporting) is executed from within this UI.

---

### How to Run the Scraper

All scraping scripts are located in `src/scraper/`.

- **Scrape match metadata** (fixtures, results, basic stats):

```bash
python src/scraper/scrape_matches.py
```

- **Scrape player information** (profiles, batting/bowling style, etc.):

```bash
python src/scraper/scrape_players.py
```

- **Scrape ball-by-ball deliveries**:

```bash
python src/scraper/scrape_deliveries.py
```

Each script:

- Uses configurable URLs and parameters (league, season, team, etc.).
- Writes raw CSV files into `data/raw/` with timestamped filenames.

Update the configuration or URL patterns inside the scripts to match your target data source (e.g. ESPNcricinfo-style pages).

---

### How to Clean Data

Use the scripts in `src/processing/`:

1. **Clean raw data**:

```bash
python src/processing/clean_data.py
```

This script is responsible for:

- Loading CSVs from `data/raw/`
- Handling missing values and inconsistent formats
- Standardizing team and player names
- Saving cleaned tables into `data/processed/`

2. **Transform and model data for analytics**:

```bash
python src/processing/transform_data.py
```

This step:

- Joins matches, players, and deliveries
- Engineers features for modeling (e.g. recent form, venue aggregates)
- Produces model-ready datasets in `data/processed/`

---

### How to Perform Analysis

Scripts for EDA and modeling live in `src/analysis/`, with companion notebooks in `notebooks/`.

- **Run EDA as a script**:

```bash
python src/analysis/eda.py
```

This generates summary tables and (optionally) plots, and can write intermediate outputs to `data/analytics/` or `data/processed/`.

- **Train models**:

```bash
python src/analysis/model_training.py
```

This script:

- Loads transformed datasets
- Trains:
  - Logistic Regression for match win prediction
  - RandomForest for player performance prediction
  - XGBoost for innings score prediction
- Saves trained models (e.g. into `models/` or `data/analytics/`) using `joblib`.

- **Generate predictions**:

```bash
python src/analysis/predictions.py
```

This script:

- Loads saved models
- Accepts new input data (e.g. upcoming fixtures, squads, conditions)
- Outputs prediction CSVs into `data/analytics/`

For more interactive exploration and visualization, open the notebooks in the `notebooks/` directory.

---

### How to Export and Import into Power BI

Use the Power BI export script:

```bash
python src/visualization/export_for_powerbi.py
```

This script:

- Reads from `data/processed/` and/or model outputs.
- Produces **denormalized, analytics-ready tables** (e.g. `fact_deliveries`, `fact_matches`, `dim_players`, `dim_venues`) as CSV into `data/analytics/`.

Then, in **Power BI Desktop**:

1. Open Power BI Desktop.
2. Select **Get Data → Text/CSV**.
3. Point to the CSV files inside the `data/analytics/` folder.
4. Load them into Power BI and set up relationships (match id, player id, venue id, etc.).
5. Build visuals for:
   - Run distributions (by team, over, venue, format)
   - Top scorers and wicket-takers
   - Toss decision vs match result
   - Venue performance heatmaps
   - Model-based win probabilities and predicted scores

More details and design tips are in `dashboard/README_for_PowerBI.md`.

---

## 🔧 Troubleshooting

### Common Issues

#### 1. **ModuleNotFoundError: No module named 'bs4' (or other modules)**
```bash
# Error: ModuleNotFoundError: No module named 'bs4'
# Solution: Install BeautifulSoup4 and other dependencies

# Make sure virtual environment is activated first!
.venv\Scripts\Activate.ps1  # Windows
source .venv/bin/activate   # macOS/Linux

# Then install dependencies
pip install -r requirements.txt

# Or install individually if needed
pip install beautifulsoup4 requests lxml
```

**After installing, restart Streamlit:**
```bash
# Close the current Streamlit app (Ctrl+C)
# Then run again
streamlit run main.py
```

#### 2. **Streamlit won't start**
```bash
# Error: 'streamlit' is not recognized
# Solution: Make sure virtual environment is activated
.venv\Scripts\Activate.ps1  # Windows
pip install streamlit
```

#### 3. **Import errors when running scripts**
```bash
# Error: ModuleNotFoundError
# Solution: Ensure you're in the project root directory
cd "Data Analytics -Sports data Analytics"
# And virtual environment is activated
```

#### 4. **XGBoost installation fails**
```bash
# Windows: Install Visual C++ Build Tools
# Or use pre-built wheel:
pip install xgboost --only-binary :all:

# macOS/Linux: May need gcc
sudo apt-get install gcc  # Linux
xcode-select --install    # macOS
```

#### 5. **Scraper returns empty data**
- Check that the ESPNcricinfo URLs are correct and accessible
- Verify the website structure hasn't changed (selectors may need updating)
- Check your internet connection
- Review scraper logs for errors

#### 6. **No data files found errors**
- Run scrapers first to create `data/raw/` files
- Then run cleaning: `python src/processing/clean_data.py`
- Then run transformation: `python src/processing/transform_data.py`

#### 7. **Model training fails**
- Ensure you have cleaned and transformed data first
- Check that `data/processed/fact_matches.csv` and `fact_deliveries.csv` exist
- Verify you have enough data (at least 10-20 matches recommended)

#### 8. **Power BI import issues**
- Ensure CSV files are in `data/analytics/` folder
- Check that files are not open in Excel or another program
- Verify file encoding is UTF-8 (should be automatic)

### Getting Help

1. **Check the logs**: All scripts print detailed error messages
2. **Verify data files**: Ensure previous steps completed successfully
3. **Check file paths**: Make sure you're running commands from project root
4. **Review error messages**: They usually indicate what's missing

---

## 📊 Example Workflow

Here's a complete example of running the project end-to-end:

```bash
# 1. Activate virtual environment
.venv\Scripts\Activate.ps1

# 2. Start Streamlit (in one terminal)
streamlit run app/Home.py

# 3. In the Streamlit UI:
#    - Go to Scraper page
#    - Enter: https://www.espncricinfo.com/series/ipl-2023-1345038/match-schedule-fixtures-and-results
#    - Click "Scrape Match Data"
#    - Wait for completion

# 4. Go to Clean_Process page
#    - Click "Clean Raw Data"
#    - Click "Transform Data for Analytics"

# 5. Go to EDA page
#    - Select "Top Scorers" from dropdown
#    - View charts

# 6. Go to Predictions page
#    - Click "Train / Retrain All Models" in sidebar
#    - Wait for training (may take a few minutes)
#    - Test predictions using the forms

# 7. Go to Export page
#    - Click "Export Cleaned Data"
#    - Files saved to data/analytics/

# 8. Open Power BI Desktop
#    - Get Data → Text/CSV
#    - Import files from data/analytics/
#    - Build your dashboard!
```

---

### Next Steps / Customization

- Connect to specific tournaments (e.g. IPL, BBL, international series).
- Add advanced features: player form windows, pitch and weather data, rest days, etc.
- Improve models with hyperparameter tuning and cross-validation.
- Deploy as an API or web application for real-time cricket insights.

---

## 📝 Quick Reference

### Essential Commands

```bash
# Activate virtual environment
.venv\Scripts\Activate.ps1          # Windows PowerShell
.venv\Scripts\activate.bat          # Windows CMD
source .venv/bin/activate           # macOS/Linux

# Start Streamlit app
streamlit run app/Home.py

# Run individual scripts
python src/scraper/scrape_matches.py
python src/processing/clean_data.py
python src/processing/transform_data.py
python src/analysis/model_training.py
python src/visualization/export_for_powerbi.py
```

### File Locations

- **Raw Data**: `data/raw/matches.csv`, `players.csv`, `deliveries.csv`
- **Processed Data**: `data/processed/fact_matches.csv`, `fact_deliveries.csv`, etc.
- **Analytics Export**: `data/analytics/*.csv` (for Power BI)
- **Trained Models**: `models/*.joblib`

### Key URLs to Update

Before scraping, update these in the scraper scripts:
- **Matches**: Season/tournament page URL (e.g., IPL 2023 fixtures page)
- **Players**: Player index or squad page URL
- **Deliveries**: Ball-by-ball commentary page URLs

### Streamlit Pages

- `app/Home.py` - Main dashboard
- `app/Scraper.py` - Data collection
- `app/Clean_Process.py` - Data cleaning
- `app/EDA.py` - Exploratory analysis
- `app/Predictions.py` - ML models
- `app/Export.py` - Power BI export

---

## 🎯 Project Status

✅ **Completed Features:**
- Web scraping infrastructure (ESPNcricinfo-style)
- Data cleaning and transformation pipeline
- EDA utilities and visualizations
- ML models (Win prediction, Score prediction, Player performance)
- Power BI export with star schema
- Streamlit web interface

🚧 **Future Enhancements:**
- Real-time data updates
- Advanced feature engineering
- Model deployment API
- Automated report generation
- Multi-tournament support

---

**Happy Analyzing! 🏏📊**


