GEA — Environmental Exposure Manager

General Description
GEA is an integrated system that combines an environmental monitoring network with artificial intelligence models and a web application to predict, visualize, and reduce human exposure to air pollution.

System Components
    - Backend: data processing, integration with NASA APIs, and predictive air quality modeling.
    - Frontend: interactive web application that allows users to visualize data, receive alerts, and submit community reports.


Purpose
GEA transforms scientific data into practical tools for citizen prevention and informed decision-making.
Its main goal is to reduce the impact of atmospheric pollution on public health, especially among vulnerable populations.

GEA/backend/                                 # Backend notebooks and data processing modules
GEA/backend/Example/                         # Example of NASA POWER + FIRMS data integration
GEA/backend/AirQuality_SEMAPA_Cochabamba.ipynb    # Air quality analysis and modeling for Cochabamba
GEA/backend/AirQuality_Dataset_Pipeline.ipynb     # Data cleaning and feature extraction pipeline
GEA/backend/Meteorological_Features_IT.ipynb      # Weather data modeling and variable correlation
GEA/backend/README_Datasets.txt                   # Documentation and notes for dataset usage

GEA/frontend/                               # Web application (Next.js)
GEA/frontend/app/                           # Source code and main pages for the web interface
GEA/frontend/public/                        # Static files, assets, and icons
GEA/frontend/services/                      # Local API handlers and helper functions
GEA/frontend/README.txt                     # Frontend module documentation

GEA/README.md                               # Main project documentation (global overview)

__________________

Installation Guide
Clone the repository
git clone https://github.com/marqueezpaola/GEA.git


Backend dependencies
The backend consists mainly of Jupyter Notebooks.
You can execute them directly in Google Colab or in your local Jupyter environment.

Frontend setup
cd frontend
npm install


Run the development environment
npm run dev

Open in browser
http://localhost:3000

To preview in mobile mode
Press CTRL + SHIFT + I
Select “Mobile view” in your browser’s developer tools.

Resources and Demonstrations
Demo Video:
https://youtu.be/Nv2gTpoO7To?si=m9YrU4B753CH9hiP





