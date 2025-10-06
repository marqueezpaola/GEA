GEA — Air Quality and Alert Platform (Frontend)

Technical Overview

Frontend developed with Next.js (React 18, no TypeScript).

To install and run locally, access the gea/frontend/ directory and execute:


cd frontend

npm install

This will automatically create the .next and node_modules folders if missing.

To start the development environment:

npm run dev

Then open the browser at http://localhost:3000

For mobile view: press Ctrl + Shift + I and select “Mobile mode”.

Description
GEA (Environmental Exposure Manager) is a web and mobile-first platform designed to visualize air quality, receive personalized alerts, and report environmental incidents in real time.
It integrates NASA and local datasets to transform environmental data into actionable health information.

Objective
To provide citizens with an accessible, educational interface that converts complex environmental data into practical guidance for prevention and public health.
GEA empowers people to make informed decisions in both outdoor and indoor environments.


User Stories
1. María — Street Vendor and Mother
María sells plants on the streets with her two children.
One of them has asthma. She cannot stop working, but she also cannot avoid exposing them to polluted air.
With GEA:

She creates a profile and registers her son’s condition.
Receives alerts when PM2.5 levels are unsafe near her route.
Gets daily recommendations such as “Avoid Plaza 14 de Abril — high particulate matter detected.”
Uses the Help section to access local emergency numbers that automatically update when she travels between countries (e.g., Bolivia → Argentina).
Reports smoke or pollution incidents by uploading a photo with GPS coordinates.

2. Daniel — Office Worker in New York
Daniel works on the 25th floor of an office building.
He believes indoor air keeps him safe, but outdoor pollution still affects his breathing and concentration.
With GEA:

- Monitors real-time AQI levels and receives “indoor risk” notifications when external air quality worsens.
- Learns that ventilation from polluted outdoor air decreases indoor safety.
- Adjusts habits (closing windows, using filters) based on GEA alerts.
- Shares air quality data with colleagues to promote health-conscious workplaces.

Main Components

1. Interactive Map
- Built with Google Maps API and dynamic heatmaps.
- Displays PM2.5, PM10, wind direction, and active fires from NASA FIRMS and POWER.
- Includes a search bar and camera icon to open the reporting module.
- Allows users to capture or upload a photo, auto-detect location, select incident type, set severity, and describe the situation.

2. Filters and Visualization Options
- Filter by event type (pollution, fire, wind), severity, or time range.
- Customize units (°C/°F) and layers (air quality, temperature, fires).

3. Help Section
- Auto-detects the user’s country and updates local emergency contacts instantly.
- Displays verified emergency numbers (police, ambulance, fire department, environmental agency).
- Allows live location sharing during emergencies.
- Provides prevention and health advice for smoke, dust, or prolonged exposure events.

4. Personalized Alerts
- Based on health information provided at registration (asthma, allergies, etc.).
- Sends personalized notifications such as:
“Unsafe air levels detected nearby.”
“Fire detected within 2 km — stay indoors.”
“High ozone forecast — limit outdoor activity.”

If the user has registered dependents, alerts are sent to their guardian account.

5. User Profile
Displays and edits personal and health data.
Allows management of dependents and notification preferences.
Supports offline mode: users can download daily forecasts for areas with limited internet access.
Offers configuration of measurement units, language, and accessibility settings.

6. Privacy and Usage Model
Operates under a freemium model with minimal, non-intrusive ads.
No personal information is sold or shared.
All data usage is limited to environmental monitoring and public health purposes.

Functional Flow
User registration with optional medical and dependent data.
Notification preferences and delivery method setup.
Interactive map for viewing air quality and submitting reports.
Real-time alerts and recommendations.
Contextual help and local emergency access.
Offline data download and profile customization.

Data Sources
NASA POWER API: meteorological data (temperature, humidity, wind, precipitation).
NASA FIRMS: active fire detection and smoke monitoring.
User-generated incident reports, verified with AI-assisted validation.

Disclaimer
GEA is an informational and educational tool, not a medical device.
It provides preventive guidance only and should not replace professional medical advice.
Developed for the NASA Space Apps Challenge as a citizen science project promoting environmental awareness and air quality monitoring.

“We cannot choose the air we breathe, but we can choose to protect it. Because when the air falls ill, it is not only human life that fades — the hope of our Earth fades with it.” — GEA



