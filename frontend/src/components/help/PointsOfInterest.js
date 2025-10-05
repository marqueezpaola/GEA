"use client";
import { useMemo } from "react";
import { useUserLocation } from "../../hooks/useUserLocation";
import Collapsible from "../ui/Collapsible.js";

const BORDER = "border-[#4e656a]";

const Hospital = ({ className="" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7">
    <rect x="3" y="7" width="18" height="14" rx="2" />
    <path d="M12 10v6M9 13h6" />
    <path d="M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
  </svg>
);
const Shelter = ({ className="" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 10v10h14V10" />
  </svg>
);

function haversineKm(a, b) {
  if (!a || !b || a.lat == null || a.lng == null || b.lat == null || b.lng == null) return null;
  const toRad = (x) => (x * Math.PI) / 180; const R = 6371;
  const dLat = toRad(b.lat - a.lat), dLng = toRad(b.lng - a.lng);
  const s1 = Math.sin(dLat/2)**2 + Math.cos(toRad(a.lat))*Math.cos(toRad(b.lat))*Math.sin(dLng/2)**2;
  const c = 2 * Math.atan2(Math.sqrt(s1), Math.sqrt(1 - s1));
  return R * c;
}

export default function PointsOfInterest({ poi = [] }) {
  const { pos } = useUserLocation();

  const items = useMemo(() => {
    const list = poi.map(p => ({
      ...p,
      distanceKm: pos ? haversineKm(pos, { lat: p.lat ?? null, lng: p.lng ?? null }) : null
    }));
    return list.sort((a,b) => (a.distanceKm ?? 1e9) - (b.distanceKm ?? 1e9)).slice(0, 6);
  }, [poi, pos]);

  return (
    <Collapsible title="Puntos de interés" defaultOpen={false}>
      {items.length === 0 ? (
        <div className="text-[13px] text-black/90">Sin puntos de interés. Activa la ubicación para ordenar por cercanía.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items.map((p, i) => {
            const key = p.id ?? `${p.name || "poi"}-${p.lat ?? "x"}-${p.lng ?? "y"}-${i}`;
            return (
              <div key={key} className={`p-4 rounded-2xl border ${BORDER} bg-white`}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-black/[0.05] grid place-items-center">
                    {p.type === "hospital" ? <Hospital className="w-5 h-5" /> : <Shelter className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-black truncate">{p.name}</div>
                    <div className="text-[13px] text-black/90 truncate">
                      {p.type === "hospital" ? "Hospital / Centro de salud" : "Refugio / Zona segura"}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                      {p.phone && <a href={`tel:${p.phone}`} className="underline text-black">Llamar</a>}
                      {p.lat != null && p.lng != null &&
                        <a href={`https://www.google.com/maps?q=${p.lat},${p.lng}`} target="_blank" className="underline text-black">Navegar</a>}
                      {"aqi" in p && <span className="text-black">AQI: {p.aqi}</span>}
                      {p.distanceKm != null && <span className="text-black">{p.distanceKm.toFixed(1)} km</span>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Collapsible>
  );
}
