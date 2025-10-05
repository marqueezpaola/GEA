"use client";
import { useMemo } from "react";
import { useUserLocation } from "../../hooks/useUserLocation";
const BORDER = "border-[#4e656a]";

function haversineKm(a, b) {
  if (!a || !b) return null;
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s1 = Math.sin(dLat/2)**2 + Math.cos(toRad(a.lat))*Math.cos(toRad(b.lat))*Math.sin(dLng/2)**2;
  const c = 2 * Math.atan2(Math.sqrt(s1), Math.sqrt(1 - s1));
  return R * c;
}

export default function SafePlaces({ poi = [] }) {
  const { pos } = useUserLocation();

  const items = useMemo(() => {
    if (!pos) return poi;
    return [...poi]
      .map(p => ({ ...p, distanceKm: haversineKm(pos, { lat: p.lat, lng: p.lng }) }))
      .sort((a, b) => (a.distanceKm ?? 1e9) - (b.distanceKm ?? 1e9))
      .slice(0, 6);
  }, [pos, poi]);

  return (
    <section className="space-y-2">
      <h2 className="text-base font-semibold text-black">Zonas seguras y puntos de interés</h2>
      <ul className="space-y-2">
        {items.map((p, i) => (
          <li key={i} className={`p-4 rounded-2xl border ${BORDER} bg-white`}>
            <div className="flex justify-between text-sm">
              <div className="font-medium text-black">{p.name}</div>
              <div className="text-black/90">{p.distanceKm ? `${p.distanceKm.toFixed(1)} km` : ""}</div>
            </div>
            <div className="text-[13px] text-black/90">{p.type === "hospital" ? "Hospital/Centro de salud" : "Refugio/Zona segura"}</div>
            <div className="mt-2 flex items-center gap-3 text-sm">
              {p.phone && <a href={`tel:${p.phone}`} className="underline text-black">Llamar</a>}
              {"lat" in p && "lng" in p && <a href={`https://www.google.com/maps?q=${p.lat},${p.lng}`} target="_blank" className="underline text-black">Navegar</a>}
              {"aqi" in p && <span className="text-black">AQI: {p.aqi}</span>}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
