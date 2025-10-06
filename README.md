GEA — Environmental Exposure Manager

General Description
GEA is an integrated system that combines an environmental monitoring network with artificial intelligence models and a web application to predict, visualize, and reduce human exposure to air pollution.

System Components
    - Backend: data processing, integration with NASA APIs, and predictive air quality modeling.
    - Frontend: interactive web application that allows users to visualize data, receive alerts, and submit community reports.

Purpose

GEA transforms scientific data into practical tools for citizen prevention and informed decision-making.
Its main goal is to reduce the impact of atmospheric pollution on public health, especially among vulnerable populations.

GEA/
 ├─ backend/
 │   ├─ Example/                # Integration with NASA POWER + FIRMS
 │   ├─ AirQuality_SEMAPA_Cochabamba.ipynb
 │   ├─ AirQuality_Dataset_Pipeline.ipynb
 │   ├─ Meteorological_Features_IT.ipynb
 │   └─ README_Datasets.txt
 │
 ├─ frontend/
 │   ├─ app/                    # Frontend source code (Next.js)
 │   ├─ public/                 # Static assets
 │   ├─ services/               # Local API routes and utilities
 │   └─ README.txt              # Frontend-specific documentation
 │
 └─ README.md                   # This file (global documentation)


Installation Guide

Clone the repository
git clone https://github.com/marqueezzpaola/GEA.git


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





