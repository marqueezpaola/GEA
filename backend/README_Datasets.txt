# GEA — Datasets & Notebooks (Training / Validation)

This folder contains the Jupyter notebooks used to prepare, clean, explore and model
datasets for GEA’s predictive workflow. Notebooks are written in Spanish, but each
one is documented below with purpose, inputs and outputs.

───────────────────────────────────────────────────────────────────────────────
1) Calidad_de_Aire_Semapa_Cochabamba.ipynb
   Purpose:
     • Load local air-quality data from Cochabamba (e.g., PM2.5/PM10), explore it,
       detect time columns (daily/hourly) or year-columns, and train a baseline
       model (RandomForest for daily/hourly; LinearRegression for annual series).
   Typical inputs:
     • CSV/XLSX from local sources (SEMAPA or similar).
   What it does:
     • Robust reader for CSV/Excel (auto-encoding & separators).
     • Detects date vs. year-style datasets.
     • Coerces numeric columns (handles “object” with commas, symbols).
     • Splits train/test by time; fits model; prints MAE/RMSE/R².
     • Plots Observed vs Predicted and produces a short multi-day forecast.
   Outputs:
     • Console metrics (MAE, RMSE, R²) and matplotlib plots.

───────────────────────────────────────────────────────────────────────────────
2) Concentracion_de_Aire_en_Salta.ipynb
   Purpose:
     • Exploration and visualization of an air-quality dataset from Salta
       (regional dataset). Focus on descriptive statistics and PM2.5 evolution.
   Typical inputs:
     • A CSV/XLSX with yearly or hourly concentrations (PM2.5 and others).
   What it does:
     • Data preview, descriptive stats, trend plot (PM2.5 over time),
       basic cleaning (drop empty columns/rows, numeric coercion).
   Outputs:
     • Descriptive tables and a trend figure (PM2.5 by year).

───────────────────────────────────────────────────────────────────────────────
3) Conjunto_de_Datos_Calidad_del_Aire.ipynb
   Purpose:
     • End-to-end pipeline for a combined air-quality dataset (local + external).
     • Preprocess, clean, transform types, and run ML baselines.
   Typical inputs:
     • “AirQuality.csv” (or similar), loaded via Colab’s upload.
   What it does:
     • Robust CSV loading (various delimiters/engines), drop all-null columns,
       type coercion, quick EDA (describe/info/head).
     • Train/test split; ColumnTransformer + Pipeline; Linear Regression baseline.
     • Prints MAE/MSE/RMSE/R²; shows head() of cleaned frame.
   Outputs:
     • Cleaned in-memory DataFrame and printed metrics/plots.

───────────────────────────────────────────────────────────────────────────────
4) Datos_Climatologicos_IT.ipynb
   Purpose:
     • Meteorological feature engineering (TEMP, HUM, pressure, wind, etc.)
       to model/predict a target variable (e.g., PM2.5) with ML (RF/LR).
   Typical inputs:
     • XLSX with hourly weather observations.
   What it does:
     • Format-specific parsing (header detection, unit handling),
       cleaning & type casting, quick EDA (nulls, dtypes, head).
     • Train/test split; compare RandomForest vs Linear Regression.
     • Scatter (y_real vs y_pred) and residual histogram.
     • Exports predictions + metrics to CSV.
   Outputs:
     • `predicciones_resultados.csv` (timestamp, y_real, y_pred, MAE/RMSE/R²),
       plus plots (scatter & residuals).

───────────────────────────────────────────────────────────────────────────────
5) Fire_Archivos.ipynb
   Purpose:
     • Generic pipeline to work with fire-related datasets (e.g., NASA FIRMS),
       standardize columns, parse dates, clean missing values, and fit ML models
       to predict a numeric target (FRP, PM2.5, brightness, etc.).
   Typical inputs:
     • CSV/XLSX (e.g., `fire_archive_M6_156000.csv`) – update FILEPATH as needed.
   What it does:
     • Standardize column names, parse date-like columns,
       remove high-missing/constant columns, numeric coercion.
     • Feature selection (up to top 30 by correlation), build LR & RandomForest
       models with pipelines, choose best by R², and evaluate.
     • Plots: histogram, time-series (if timestamp exists), y_real vs y_pred,
       residuals, and feature importance (for RF).
     • Exports original cleaned dataset and predictions.
   Outputs:
     • `dataset_limpio.csv`
     • `predicciones.csv`
     • Console summary of metrics per model.

───────────────────────────────────────────────────────────────────────────────
Reproducibility & Environment
• Notebooks can run in Google Colab (recommended for quick testing).
• Suggested Python packages: pandas, numpy, matplotlib, scikit-learn.
• Some notebooks expect a manual file upload in Colab (see first cell).
• All timestamps are handled as provided by the source; please check time zones.

Relation to NASA data
• These notebooks complement the NASA integration example under:
  `backend/Example/GEA_NASA_Integration_Tarija.ipynb`
  (POWER hourly meteorology + FIRMS active fires).
• Together, they provide features/targets for the predictive layer of GEA.

File naming (Spanish kept; English aliases if needed)
• Keeping the original Spanish filenames is OK and won’t break modeling.
• If an English alias is required for presentation, you may create copies:
  - AirQuality_SEMAPA_Cochabamba.ipynb        (alias of Calidad_de_Aire_Semapa_Cochabamba.ipynb)
  - AirConcentration_Salta.ipynb               (alias of Concentracion_de_Aire_en_Salta.ipynb)
  - AirQuality_Dataset_Pipeline.ipynb          (alias of Conjunto_de_Datos_Calidad_del_Aire.ipynb)
  - Meteorological_Features_IT.ipynb           (alias of Datos_Climatologicos_IT.ipynb)
  - Fire_Datasets_Pipeline.ipynb               (alias of Fire_Archivos.ipynb)
