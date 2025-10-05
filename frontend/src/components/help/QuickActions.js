"use client";
import { useEffect, useRef, useState } from "react";

const BORDER = "border-[#4e656a]";

/* Iconos elegantes (SVG inline) */
const Shield = ({ className="" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7">
    <path d="M12 3l6 2v5c0 4.5-3.3 8.2-6 9-2.7-.8-6-4.5-6-9V5l6-2z" />
  </svg>
);
const Cross = ({ className="" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7">
    <path d="M9 3v6H3v6h6v6h6v-6h6V9h-6V3z" />
  </svg>
);
const Flame = ({ className="" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7">
    <path d="M12 3s-2 3-2 5a3 3 0 1 0 6 0c0-2-2-5-2-5Z" />
    <path d="M6 13a6 6 0 1 0 12 0c0-3-3-6-3-6s.5 2-1 3-3-1-3-1-5 3-5 4z" />
  </svg>
);
const AlertTri = ({ className="" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.3 3.7 2.8 17a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0z" />
    <path d="M12 9v5M12 18h.01" />
  </svg>
);

function Tile({ label, icon, phone }) {
  return (
    <a
      href={phone ? `tel:${phone}` : "#"}
      onClick={(e) => { if (!phone) e.preventDefault(); }}
      className={`rounded-2xl border ${BORDER} p-4 hover:bg-black/[0.02] transition block`}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-black/[0.05] grid place-items-center shrink-0">
          {icon}
        </div>
        <div className="text-sm">
          <div className="font-medium text-black">{label}</div>
          <div className="text-[13px] text-black">{phone || "—"}</div>
        </div>
      </div>
    </a>
  );
}

function LongPressSOS({ onTrigger }) {
  const [count, setCount] = useState(null);
  const timer = useRef(null);

  const start = () => {
    if (timer.current) return;
    setCount(3);
    timer.current = setInterval(() => {
      setCount((c) => {
        if (c === 1) { clear(); onTrigger?.(); return null; }
        return (c ?? 3) - 1;
      });
    }, 1000);
  };
  const clear = () => { clearInterval(timer.current); timer.current = null; setCount(null); };
  useEffect(() => () => clear(), []);

  return (
    <button
      onMouseDown={start} onMouseUp={clear} onMouseLeave={clear}
      onTouchStart={start} onTouchEnd={clear} onTouchCancel={clear}
      className={`w-full rounded-2xl border ${BORDER} p-6 text-center hover:bg-black/[0.02] block`}
      aria-label="SOS – mantener presionado para activar"
    >
      <div className="text-lg font-semibold text-black flex items-center gap-2 justify-center">
        <AlertTri className="w-5 h-5" /> SOS
      </div>
      <div className="text-xs text-black/90">Mantén presionado 3 s</div>
      {count !== null && <div className="mt-1 text-lg font-semibold text-black">{count}</div>}
    </button>
  );
}

export default function QuickActions({ numbers = [] }) {
  const byType = (t) => numbers.find(n => n.type === t);

  const triggerSOS = () => {
    alert("SOS (demo): se enviaría tu ubicación a contactos y se llamaría al número local de emergencias.");
  };

  return (
    <section className={`rounded-2xl border ${BORDER} p-4 bg-white`}>
      <h2 className="text-base font-semibold text-black mb-3">Acciones rápidas</h2>

      <LongPressSOS onTrigger={triggerSOS} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
        <Tile label="Policía"              icon={<Shield className="w-5 h-5" />} phone={byType("police")?.phone} />
        <Tile label="Ambulancia/Salud"     icon={<Cross  className="w-5 h-5" />} phone={byType("ambulance")?.phone} />
        <Tile label="Bomberos"             icon={<Flame  className="w-5 h-5" />} phone={byType("fire")?.phone} />
        <Tile label="Ambiental / Def. Civil" icon={<AlertTri className="w-5 h-5" />} phone={(byType("environment")||byType("civil"))?.phone} />
      </div>
    </section>
  );
}
