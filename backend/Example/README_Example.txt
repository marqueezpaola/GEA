# GEA – NASA Data Integration Example

This folder contains an example notebook that demonstrates the integration of NASA Earth observation data used by the GEA project.

File: GEA_NASA_Integration_Tarija.ipynb  
• Purpose: Demonstrates how GEA connects to NASA POWER (meteorological data) and NASA FIRMS (active fire data).  
• Location tested: Tarija, Bolivia  
• Output: 
   - nasa_power_hourly.png → Temperature and wind data (last 48h)
   - firms_map.png → Active fires (VIIRS & MODIS, 24h view)
   - datasource_caption.txt → Caption with attribution and data source details.

This example can be executed directly in Google Colab to reproduce the figures.
It proves the real integration of NASA datasets used by GEA's predictive system.