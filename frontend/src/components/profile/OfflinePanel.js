"use client";
import { useEffect, useMemo, useState } from "react";

const BORDER = "border-[#4e656a]";

function nextHours(n=3) {
  const out = [];
  const now = new Date();
  for (let i=1;i<=n;i++){
    const t = new Date(now.getTime()+i*3600*1000);
    out.push(`${t.getHours().toString().padStart(2,"0")}:00`);
  }
  return out;
}

// Genera datos aproximados a partir de un valor base
function approxSeries(base=82) {
  return [0, -3, -6].map((d,i) => Math.max(0, base + d));
}

export default function OfflinePanel({ onClose }) {
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  const [baseAQI] = useState(82); // demo: podrías tomar último valor real
  const hours = useMemo(() => nextHours(3), []);
  const series = useMemo(() => approxSeries(baseAQI), [baseAQI]);

  useEffect(() => {
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/30 grid place-items-center z-50">
      <div className={`w-[92%] max-w-md rounded-2xl border ${BORDER} bg-white p-4`}>
        <div className="text-base font-semibold text-black mb-2">Sin conexión</div>
        <div className="text-[13px] text-black/80 mb-4">
          Estado actual: <span className="font-medium">{isOnline ? "En línea" : "Sin conexión"}</span>.  
          Cuando no haya internet, mostraremos <b>datos aproximados</b> para las próximas 3 horas.
        </div>

        <div className={`rounded-2xl border ${BORDER} bg-white p-3`}>
          <div className="text-sm font-medium text-black mb-1">Próximas 3 horas (aprox.)</div>
          <ul className="text-sm text-black/90 space-y-1">
            {hours.map((h, i) => (
              <li key={h} className="flex justify-between">
                <span>{h}</span>
                <span>AQI ≈ <b className="text-black">{series[i]}</b></span>
              </li>
            ))}
          </ul>
          <div className="mt-2 text-[12px] text-black/70">
            *Estimación local basada en la última lectura disponible.
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button className={`px-3 py-1.5 rounded-xl border ${BORDER}`} onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}
