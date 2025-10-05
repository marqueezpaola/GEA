// src/app/tabs/alerts/page.js
"use client";

import { useEffect, useState } from "react";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/appdata", { cache: "no-store" });
        const data = await res.json();
        if (alive) setAlerts(Array.isArray(data.alerts) ? data.alerts : []);
      } catch {
        if (alive) setAlerts([]);
      }
    })();
    return () => { alive = false; };
  }, []);

  if (alerts === null) return <div className="p-4 text-sm text-black/60">Cargando alertas…</div>;
  if (!alerts.length) return <div className="p-4 text-sm text-black/70">Sin alertas por ahora.</div>;

  return (
    <div className="p-4 space-y-3">
      {alerts.map((a, i) => (
        <div key={a.id || i} className="rounded-xl border border-black/10 p-3 bg-white">
          <div className="text-sm font-semibold">{a.title || "Alerta"}</div>
          <div className="text-xs text-black/60">{a.time || a.date || ""}</div>
          <div className="mt-1 text-sm">{a.description || a.desc || ""}</div>
        </div>
      ))}
      <div className="h-[calc(var(--tabbar-h,64px)+8px)]" />
    </div>
  );
}
