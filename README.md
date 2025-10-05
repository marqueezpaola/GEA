GEA — Plataforma de alertas y calidad de aire (Frontend)

Visualización y reporte ciudadano de incidentes ambientales (viento, AQI, incendios) con Next.js 15.
Incluye mapa con heatmap, “flechas” de viento, pestañas móviles y un drawer de reporte con foto/ubicación.

Video demo: https://youtu.be/Nv2gTpoO7To?si=m9YrU4B753CH9hiP

Datasets incluidos
-  Calidad de Aire SEMAPA (Cochabamba)
Medición de contaminantes (PM, NO₂, O₃) y variables ambientales (temperatura, humedad, presión) en zona SEMAPA.

-   Concentración de Aire en Salta (AR)
Registros de CO, NO₂, O₃ y material particulado + meteorología. Útil para analizar variaciones temporales y efectos en salud.

- Conjunto de Calidad de Aire (multi-urbano)
Serie con gases contaminantes, partículas y variables meteorológicas para estudiar tendencias y evolución temporal.

- Datos Climatológicos IT
Estación del Instituto Tecnológico: temperatura, humedad, viento, radiación, precipitación. Soporta modelado ambiental.

- Fire (NASA)
Variables que influyen en incendios (temperatura, humedad, viento, precipitación) y detección satelital. Para análisis y predicción.

Funcionalidades principales
- Mapa (Google Maps)
- Heatmap configurable.
- Marcadores de viento y AQI (íconos SVG).
- “Cascadas” de flechas para dirección del viento.
- Barra de pestañas (Mapa, Ayuda, Alertas, Perfil) con badge.
- Bottom sheet informativo (deslizable).
- ReportDrawer para reportar incidentes (foto, tipo, severidad, GPS, texto).

API local (Route Handlers de Next)
    /api/appdata (GET)
    /api/appdata/alerts-count (GET)
    /api/profile (GET/PATCH) — persiste en data/app.json.

Requisitos
- Node.js 18+
- Cuenta y API Key de Google Maps con Facturación habilitada


