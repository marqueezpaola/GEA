// src/components/maps/MapView.js
"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import {
  GoogleMap,
  MarkerF,
  OverlayViewF,
  useJsApiLoader,
  Autocomplete,
} from "@react-google-maps/api";
import ReportDrawer from "../report/ReportDrawer";

/* ====== Constantes ESTABLES para evitar recargas del loader ====== */
const MAPS_ID = "gea-map";
const LIBRARIES = ["places", "visualization"];

const containerStyle = { width: "100%", height: "100%" };
const DEFAULT_CENTER = { lat: -21.5355, lng: -64.7296 };

/* ❌ NO USAR hooks fuera del componente (los dejo comentados para no borrar tu código)
const { isLoaded, loadError } = useJsApiLoader({
  id: "gea-map",
  googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  libraries: LIBRARIES,
});
*/

/* Icono de cámara (en la barra) */
const CameraIcon = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
    <rect x="3" y="7" width="18" height="12" rx="2" />
    <path d="M9 7l1.7-2h3.6L16 7" />
    <circle cx="12" cy="13" r="3.2" />
    <circle cx="18" cy="10" r="0.8" />
  </svg>
);

/** ---------- Íconos (viento & AQI) provistos ---------- **/
const windSVG = `<?xml version="1.0" encoding="utf-8"?><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 122.88 74.78" style="enable-background:new 0 0 122.88 74.78" xml:space="preserve"><g><path d="M28.69,53.38c-1.61,0-2.91-1.3-2.91-2.91c0-1.61,1.3-2.91,2.91-2.91h51.37c0.21,0,0.42,0.02,0.62,0.07 c1.84,0.28,3.56,0.8,5.1,1.63c1.7,0.92,3.15,2.19,4.27,3.89c3.85,5.83,3.28,11.24,0.56,15.24c-1.77,2.61-4.47,4.55-7.45,5.57 c-3,1.03-6.32,1.13-9.32,0.03c-4.54-1.66-8.22-5.89-8.76-13.55c-0.11-1.6,1.1-2.98,2.7-3.09c1.6-0.11,2.98,1.1,3.09,2.7 c0.35,4.94,2.41,7.56,4.94,8.48c1.71,0.62,3.67,0.54,5.48-0.08c1.84-0.63,3.48-1.79,4.52-3.32c1.49-2.19,1.71-5.28-0.61-8.79 c-0.57-0.86-1.31-1.51-2.18-1.98c-0.91-0.49-1.97-0.81-3.13-0.99H28.69L28.69,53.38z M15.41,27.21c-1.61,0-2.91-1.3-2.91-2.91 c0-1.61,1.3-2.91,2.91-2.91h51.21c1.17-0.18,2.23-0.5,3.14-0.99c0.87-0.47,1.61-1.12,2.18-1.98c2.32-3.51,2.09-6.6,0.61-8.79 c-1.04-1.53-2.68-2.69-4.52-3.32c-1.81-0.62-3.78-0.7-5.48-0.08c-2.52,0.92-4.59,3.54-4.94,8.48c-0.11,1.6-1.49,2.81-3.09,2.7 c-1.6-0.11-2.81-1.49-2.7-3.09c0.54-7.66,4.22-11.89,8.76-13.55 c3-1.09,6.32-0.99,9.32,0.03c2.98,1.02,5.68,2.97,7.45,5.57 c2.72,4,3.29,9.41-0.56,15.24c-1.12,1.7-2.57,2.97-4.27,3.89 c-1.54,0.83-3.26,1.35-5.1,1.63c-0.2,0.04-0.41,0.07-0.62,0.07H15.41 L15.41,27.21z M2.91,40.3C1.3,40.3,0,38.99,0,37.39c0-1.61,1.3-2.91,2.91-2.91h107.07c1.17-0.18,2.23-0.5,3.13-0.99 c0.87-0.47,1.61-1.12,2.18-1.98c2.32-3.51,2.09-6.6,0.61-8.79c-1.04-1.53-2.68-2.69-4.52-3.32c-1.81-0.62-3.78-0.7-5.48-0.08 c-2.52,0.92-4.59,3.54-4.94,8.48c-0.11,1.6-1.49,2.81-3.09,2.7 c-1.6-0.11-2.81-1.49-2.7-3.09c0.54-7.66,4.22-11.89,8.76-13.55 c3-1.09,6.32-0.99,9.32,0.03c2.98,1.02,5.68,2.97,7.45,5.57 c2.72,4,3.29,9.41-0.56,15.24c-1.12,1.7-2.57,2.97-4.27,3.89 c-1.54,0.83-3.26,1.35-5.1,1.63c-0.2,0.04-0.41,0.07-0.62,0.07H2.91L2.91,40.3z"/></g></svg>`;
const aqiSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="100px" width="100px"><path d="m490.033 200.217-.082-.081L308.988 21.922C294.828 7.785 276.013 0 256 0s-38.828 7.785-52.988 21.922L22.049 200.136l-.082.081C7.801 214.383 0 233.217 0 253.25c0 20.016 7.789 38.836 21.932 52.998l180.956 183.705.08.08C217.133 504.199 235.967 512 256 512s38.867-7.801 53.033-21.967l.08-.08 180.956-183.705C504.211 292.086 512 273.266 512 253.25c0-20.033-7.801-38.867-21.967-53.033zM468.82 285.07l-.08.08-180.957 183.707C279.288 477.333 268.002 482 256 482s-23.288-4.667-31.783-13.143L43.26 285.15l-.08-.08c-17.533-17.532-17.545-46.052-.039-63.601L224.099 43.261l.082-.081C232.68 34.681 243.98 30 256 30s23.32 4.681 31.82 13.18l.082.081 180.957 178.208c17.506 17.549 17.494 46.068-.039 63.601z"/><path d="M256 91c-24.813 0-45 20.187-45 45v120c0 24.813 20.187 45 45 45s45-20.187 45-45V136c0-24.813-20.187-45-45-45zm15 165c0 8.271-6.729 15-15 15s-15-6.729-15-15V136c0-8.271 6.729-15 15-15s15 6.729 15 15v120zM256 331c-24.813 0-45 20.187-45 45s20.187 45 45 45 45-20.187 45-45-20.187-45-45-45zm0 60c-8.271 0-15-6.729-15-15s6.729-15 15-15 15 6.729 15 15-6.729 15-15 15z"/></svg>`;

const aqiText = (v) => (v >= 151 ? "Muy mala" : v >= 101 ? "Mala" : v >= 51 ? "Moderada" : "Buena");

const HEATMAP_GRADIENT = [
  "rgba(0,180,0,0.70)",
  "rgba(124,252,0,0.75)",
  "rgba(255,255,0,0.80)",
  "rgba(255,165,0,0.85)",
  "rgba(255,0,0,0.90)",
];

/* util: desplazar metros desde lat/lng */
function metersToLatLng(lat, lng, dx, dy) {
  const dLat = dy / 111_320;
  const dLng = dx / (111_320 * Math.cos((lat * Math.PI) / 180));
  return { lat: lat + dLat, lng: lng + dLng };
}

export default function MapView({ initialCenter = DEFAULT_CENTER, initialZoom = 13 }) {
  // ✅ AQUÍ sí se puede usar el hook
  const { isLoaded, loadError } = useJsApiLoader({
    id: MAPS_ID,
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: LIBRARIES,
  });

  const [center, setCenter] = useState(initialCenter);
  const [marker, setMarker] = useState(initialCenter);
  const [pins, setPins] = useState([]);
  const [icons, setIcons] = useState({ wind: null, aqi: null });
  const [activePinId, setActivePinId] = useState(null);
  const [openReport, setOpenReport] = useState(false);

  // capas
  const [showHeat, setShowHeat] = useState(false);
  const heatmapRef = useRef(null);
  const [showWindDir, setShowWindDir] = useState(false);

  const mapRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    if (!isLoaded || !window.google) return;
    const g = window.google;
    const makeIcon = (svg) => ({
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
      scaledSize: new g.maps.Size(48, 48),
      anchor: new g.maps.Point(24, 24),
    });
    setIcons({ wind: makeIcon(windSVG), aqi: makeIcon(aqiSVG) });
  }, [isLoaded]);

  // 3 viento + 3 AQI
  useEffect(() => {
    if (!center) return;
    const jitter = () => (Math.random() - 0.5) * 0.02;
    const rnd = (min, max) => Math.round(min + Math.random() * (max - min));
    const next = [];
    for (let i = 0; i < 3; i++) {
      next.push({
        id: `wind-${i}-${Date.now()}`,
        kind: "wind",
        position: { lat: center.lat + jitter(), lng: center.lng + jitter() },
        windKmh: rnd(10, 30),
        aqi: rnd(40, 90),
      });
    }
    for (let i = 0; i < 3; i++) {
      const aqiVal = rnd(101, 200);
      next.push({
        id: `aqi-${i}-${Date.now()}`,
        kind: "aqi",
        position: { lat: center.lat + jitter(), lng: center.lng + jitter() },
        windKmh: rnd(5, 22),
        aqi: aqiVal,
      });
    }
    setPins(next);
  }, [center]);

  // Heatmap data
  const heatData = useMemo(() => {
    if (!isLoaded || !window.google) return [];
    const g = window.google;
    const pts = [];

    const halfSpan = 0.06;
    const step = 0.006;
    for (let lat = center.lat - halfSpan; lat <= center.lat + halfSpan; lat += step) {
      for (let lng = center.lng - halfSpan; lng <= center.lng + halfSpan; lng += step) {
        pts.push({ location: new g.maps.LatLng(lat, lng), weight: 0.2 });
      }
    }

    const aqiPins = pins.filter((p) => p.kind === "aqi");
    aqiPins.forEach((p) => {
      const isVeryBad = p.aqi >= 151;
      if (isVeryBad) {
        pts.push({ location: new g.maps.LatLng(p.position.lat, p.position.lng), weight: 1.0 });
        const spread = 0.016;
        for (let i = 0; i < 18; i++) {
          const r = (Math.random() ** 0.7) * spread;
          const t = Math.random() * Math.PI * 2;
          const lat = p.position.lat + r * Math.cos(t);
          const lng = p.position.lng + r * Math.sin(t);
          const w = Math.max(0.55, 1.0 - r * 20);
          pts.push({ location: new g.maps.LatLng(lat, lng), weight: Math.min(1, w) });
        }
      } else {
        pts.push({ location: new g.maps.LatLng(p.position.lat, p.position.lng), weight: 0.6 });
        const spread = 0.014;
        for (let i = 0; i < 14; i++) {
          const r = (Math.random() ** 0.75) * spread;
          const t = Math.random() * Math.PI * 2;
          const lat = p.position.lat + r * Math.cos(t);
          const lng = p.position.lng + r * Math.sin(t);
          const w = Math.max(0.35, 0.6 - r * 18);
          pts.push({ location: new g.maps.LatLng(lat, lng), weight: Math.max(0.3, w) });
        }
      }
    });

    return pts;
  }, [pins, center, isLoaded]);

  // geoloc
  useEffect(() => {
    if (navigator?.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const c = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setCenter(c);
          setMarker(c);
          mapRef.current?.panTo(c);
          mapRef.current?.setZoom(14);
        },
        () => {},
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 30000 }
      );
    }
  }, []);

  const onMapLoad = (map) => {
    mapRef.current = map;
    map.setTilt(67.5);
    map.setHeading(0);
  };
  const onMapUnmount = () => {
    if (heatmapRef.current) {
      heatmapRef.current.setMap(null);
      heatmapRef.current = null;
    }
    mapRef.current = null;
  };

  const onAutoLoad = (ac) => (autocompleteRef.current = ac);
  const onPlaceChanged = () => {
    const ac = autocompleteRef.current;
    if (!ac) return;
    const place = ac.getPlace();
    if (!place?.geometry?.location) return;
    const loc = place.geometry.location;
    const next = { lat: loc.lat(), lng: loc.lng() };
    setCenter(next);
    setMarker(next);
    mapRef.current?.panTo(next);
    mapRef.current?.setZoom(15);
  };

  // toggle heatmap (una sola instancia, sin apilar)
  useEffect(() => {
    if (!isLoaded || !window.google || !mapRef.current) return;
    const g = window.google;
    if (showHeat) {
      if (!heatmapRef.current) {
        heatmapRef.current = new g.maps.visualization.HeatmapLayer({
          data: heatData,
          dissipating: true,
          radius: 76,
          opacity: 0.45,
          gradient: HEATMAP_GRADIENT,
          map: mapRef.current,
        });
      } else {
        heatmapRef.current.setData(heatData);
        heatmapRef.current.set("radius", 76);
        heatmapRef.current.set("opacity", 0.45);
        heatmapRef.current.set("gradient", HEATMAP_GRADIENT);
        heatmapRef.current.setMap(mapRef.current);
      }
    } else {
      if (heatmapRef.current) heatmapRef.current.setMap(null);
    }
  }, [showHeat, heatData, isLoaded]);

  useEffect(() => {
    if (heatmapRef.current && showHeat) heatmapRef.current.setData(heatData);
  }, [heatData, showHeat]);

  // Flechas de viento
  const windArrows = useMemo(() => {
    const arrows = [];
    const windPins = pins.filter((p) => p.kind === "wind");
    if (!windPins.length) return arrows;

    windPins.forEach((p, idx) => {
      const baseDeg = (idx * 97 + 30) % 360;
      const streams = 3;
      const steps = 6;
      const startOffset = 32;
      const spacing = 140;

      for (let s = 0; s < streams; s++) {
        const angle = baseDeg + (s - 1) * 12 + (Math.random() - 0.5) * 4;
        const rad = (angle * Math.PI) / 180;

        const side = (s - 1) * 18;
        const sideRad = ((angle + 90) * Math.PI) / 180;
        const origin = metersToLatLng(
          p.position.lat,
          p.position.lng,
          Math.cos(rad) * startOffset + Math.cos(sideRad) * side,
          Math.sin(rad) * startOffset + Math.sin(sideRad) * side
        );

        for (let k = 0; k < steps; k++) {
          const dist = k * spacing + Math.random() * 15;
          const curAngle = angle + (k * (Math.random() > 0.5 ? 1 : -1)) * 2;
          const curRad = (curAngle * Math.PI) / 180;

          const pos = metersToLatLng(
            origin.lat,
            origin.lng,
            Math.cos(curRad) * dist,
            Math.sin(curRad) * dist
          );

          const scale = 1 - k * 0.08;
          const opacity = 0.9 - k * 0.12;

          arrows.push({
            id: `${p.id}-flow-${s}-${k}`,
            lat: pos.lat,
            lng: pos.lng,
            angle: curAngle,
            scale,
            opacity: Math.max(0.25, opacity),
          });
        }
      }
    });

    return arrows;
  }, [pins]);

  if (loadError) {
    return (
      <div className="p-3 text-sm text-black/80">
        {String(loadError.message || loadError)}
        <br />
        {String(loadError).includes("BillingNotEnabledMapError") && (
          <span className="block mt-1">
            Debes <b>habilitar la facturación</b> en Google Cloud para la clave usada.
          </span>
        )}
      </div>
    );
  }
  if (!isLoaded) return <div className="p-3 text-sm text-black/60">Cargando mapa…</div>;

  const activePin = pins.find((p) => p.id === activePinId);

  return (
    <div className="relative w-full h-full">
      {/* Barra superior (B/N) */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 w-[min(900px,92vw)] pt-[env(safe-area-inset-top)]">
        <div className="flex items-center gap-2 bg-white text-black rounded-xl shadow-lg border border-black/10 px-2 py-2">
          <div className="flex-1">
            <Autocomplete onLoad={onAutoLoad} onPlaceChanged={onPlaceChanged}>
              <input
                type="text"
                placeholder="Buscar lugares…"
                className="w-full rounded-lg border border-black/10 bg-white text-black
                           placeholder-black/50 px-3 py-2 text-sm outline-none
                           focus:ring-2 focus:ring-black focus:border-black"
              />
            </Autocomplete>
          </div>
          <button
            onClick={() => setOpenReport(true)}
            className="shrink-0 rounded-lg border border-black/10 px-2.5 py-2 hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
            aria-label="Abrir reporte ambiental"
            title="Crear Reporte"
          >
            <CameraIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Toggles debajo de la barra */}
      <div className="absolute top-[80px] right-4 z-10 flex flex-col gap-2">
        {/* Heatmap */}
        <button
          onClick={() => setShowHeat((v) => !v)}
          aria-pressed={showHeat}
          title="Mapa de calor"
          className={`w-10 h-10 rounded-full border flex items-center justify-center
            focus:outline-none focus-visible:ring-2 focus-visible:ring-black
            ${showHeat ? "bg-black text-white border-black" : "bg-white text-black border-black/10 hover:bg-black/5"}`}
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
            <path d="M12 2c.7 2.9-1.4 4.4-2.9 6.2C7.3 10.3 7 12 7 13.5 7 17.1 9.9 20 13.5 20s6.5-2.9 6.5-6.5c0-2.6-1.3-4.3-2.6-5.7-1.2-1.3-2.4-2.5-2.4-4.8-1.5 1-2.4 2.2-2.7 3.7-.4 1.7.1 3.4 1.5 4.7-2.3-.1-4.3-1.5-5-3.6.1 2.2 1.1 3.9 2.8 5 1.3.9 2.8 1.3 4.4 1.2-1.1.9-2.5 1.5-4 1.5-3.3 0-6-2.7-6-6 0-1.5.7-3.2 2.1-4.9C9 3.9 10.2 3 12 2z" />
          </svg>
        </button>

        {/* Dirección del viento */}
        <button
          onClick={() => setShowWindDir((v) => !v)}
          aria-pressed={showWindDir}
          title="Dirección del viento"
          className={`w-10 h-10 rounded-full border flex items-center justify-center
            focus:outline-none focus-visible:ring-2 focus-visible:ring-black
            ${showWindDir ? "bg-black text-white border-black" : "bg-white text-black border-black/10 hover:bg-black/5"}`}
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 12h12" />
            <path d="M12 6l6 6-6 6" />
          </svg>
        </button>
      </div>

      {/* Mapa */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={initialZoom}
        onLoad={onMapLoad}
        onUnmount={onMapUnmount}
        options={{ disableDefaultUI: true, gestureHandling: "greedy", tilt: 67.5, heading: 0 }}
        onClick={() => setActivePinId(null)}
      >
        {marker && <MarkerF position={marker} />}

        {pins.map((p) => (
          <MarkerF
            key={p.id}
            position={p.position}
            icon={p.kind === "wind" ? icons.wind : icons.aqi}
            onClick={() => setActivePinId(p.id)}
          />
        ))}

        {/* Cascadas de flechas (salen de los pins de viento) */}
        {showWindDir &&
          windArrows.map((a) => (
            <OverlayViewF
              key={a.id}
              position={{ lat: a.lat, lng: a.lng }}
              mapPaneName="overlayMouseTarget"
              getPixelPositionOffset={(w, h) => ({ x: -w / 2, y: -h / 2 })}
            >
              <div
                className="pointer-events-none"
                style={{
                  transform: `rotate(${a.angle}deg) scale(${a.scale})`,
                  opacity: a.opacity,
                  filter: "drop-shadow(0 1px 1px rgba(0,0,0,.25))",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 12h12" stroke="black" strokeWidth="2" strokeLinecap="round" />
                  <path d="M12 6l6 6-6 6" fill="black" />
                </svg>
              </div>
            </OverlayViewF>
          ))}

        {activePin && (
          <OverlayViewF
            position={activePin.position}
            mapPaneName="floatPane"
            getPixelPositionOffset={(w, h) => ({ x: -(w / 2), y: -(h + 12) })}
          >
            <div className="relative">
              <div className="rounded-xl bg-white text-black border border-black/10 shadow-xl px-3 py-2 min-w-[200px]">
                <div className="text-[11px] uppercase tracking-wide text-black/60">
                  {activePin.kind === "wind" ? "Viento" : "Calidad de aire"}
                </div>
                <div className="mt-1 text-sm">
                  Viento: <span className="font-semibold">{activePin.windKmh} km/h</span>
                </div>
                <div className="text-sm">
                  AQI: <span className="font-semibold">{activePin.aqi}</span> ({aqiText(activePin.aqi)})
                </div>
              </div>
              <svg className="absolute left-1/2 -translate-x-1/2 -bottom-2" width="18" height="10" viewBox="0 0 18 10" aria-hidden="true">
                <path d="M0,0 L9,10 L18,0" fill="#FFFFFF" stroke="#0000001A" />
              </svg>
            </div>
          </OverlayViewF>
        )}
      </GoogleMap>

      <ReportDrawer open={openReport} onClose={() => setOpenReport(false)} initialCoords={center} />
    </div>
  );
}
