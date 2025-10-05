"use client";
import { useEffect, useRef, useState } from "react";

const BORDER = "border-[#4e656a]";

/* Flecha elegante */
const Chevron = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

/**
 * Card colapsable con transición real de altura (slide down/up)
 * - Mide el contenido con ref y anima height.
 * - Muestra fallback si no hay items.
 */
export default function HealthAdviceList({ items = [], defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const innerRef = useRef(null);
  const [height, setHeight] = useState(0);

  // Función para recalcular altura
  const measure = () => {
    if (!innerRef.current) return;
    setHeight(open ? innerRef.current.scrollHeight : 0);
  };

  // Recalcula cuando cambia open o items
  useEffect(() => { measure(); }, [open, items]);

  // Recalcula si el contenido interno cambia de tamaño
  useEffect(() => {
    if (!innerRef.current) return;
    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(() => measure());
      ro.observe(innerRef.current);
      return () => ro.disconnect();
    }
  }, []);

  return (
    <section className={`rounded-2xl border ${BORDER} bg-white`}>
      {/* Cabecera con flecha */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full p-4 flex items-center justify-between"
        aria-expanded={open}
        aria-controls="advice-content"
      >
        <div className="text-base font-semibold text-black">Consejos de Salud</div>
        <Chevron className={`w-5 h-5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Contenedor animado */}
      <div
        id="advice-content"
        style={{ height }}
        className="overflow-hidden transition-[height] duration-300 ease-in-out"
      >
        <div ref={innerRef} className="px-4 pb-4">
          {items.length === 0 ? (
            <div className="text-[13px] text-black/90">Sin consejos por ahora.</div>
          ) : (
            <ul className="space-y-2">
              {items.map((it, i) => {
                const key = it.id ?? `${it.title || "advice"}-${i}`;
                return (
                  <li key={key} className={`rounded-xl border ${BORDER} p-3 bg-white flex gap-3`}>
                    <span className="w-8 h-8 rounded-full bg-black/[0.08] inline-block mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-black">{it.title}</div>
                      <div className="text-[13px] text-black/90">{it.text}</div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
