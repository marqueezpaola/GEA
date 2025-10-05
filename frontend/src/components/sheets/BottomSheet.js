"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const ALTURA_PLEGADO = 84; // px visibles cuando está plegado

export default function BottomSheet() {
  const sheetRef = useRef(null);
  const dragRef = useRef(null);
  const yMaxRef = useRef(0);   // distancia máxima (colapsado)
  const startYRef = useRef(0); // posición Y del pointer al iniciar drag
  const startPosRef = useRef(0); // y al iniciar drag
  const [y, setY] = useState(0); // translateY actual
  const [dragging, setDragging] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const computeCollapsedY = useCallback(() => {
    const el = sheetRef.current;
    if (!el) return 0;
    const h = el.offsetHeight; // alto del sheet en expandido (entre top y bottom)
    return Math.max(0, h - ALTURA_PLEGADO);
  }, []);

  const recalc = useCallback(() => {
    const yCollapsed = computeCollapsedY();
    yMaxRef.current = yCollapsed;
    setY(expanded ? 0 : yCollapsed);
  }, [computeCollapsedY, expanded]);

  useEffect(() => {
    recalc();
    const onResize = () => recalc();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [recalc]);

  useEffect(() => {
    const id = setTimeout(recalc, 0); // espera layout inicial
    return () => clearTimeout(id);
  }, [recalc]);

  const onPointerDown = (e) => {
    setDragging(true);
    startYRef.current = e.clientY ?? (e.touches?.[0]?.clientY || 0);
    startPosRef.current = y;
    dragRef.current?.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!dragging) return;
    const cur = e.clientY ?? (e.touches?.[0]?.clientY || 0);
    const delta = cur - startYRef.current;
    const next = Math.min(Math.max(0, startPosRef.current + delta), yMaxRef.current);
    setY(next);
  };

  const onPointerUp = () => {
    if (!dragging) return;
    setDragging(false);
    const snapToCollapsed = y > yMaxRef.current * 0.5;
    setExpanded(!snapToCollapsed);
    setY(snapToCollapsed ? yMaxRef.current : 0);
  };

  return (
    <div
      ref={sheetRef}
      className="fixed inset-x-0 z-20"
      // detrás del footer, delante del mapa
      style={{
        // ✅ queda una sola definición de `top`
        top: "max(35vh, calc(env(safe-area-inset-top) + 12px))",
        bottom: "var(--tabbar-h, 64px)", // si no existe la var, usa 64px
        transform: `translateY(${y}px)`,
        transition: dragging ? "none" : "transform 220ms cubic-bezier(0.2,0,0,1)",
      }}
    >
      <div className="mx-auto max-w-[900px] h-full px-2">
        <div
          ref={dragRef}
          className="relative h-full rounded-t-2xl bg-white text-black shadow-2xl border border-black/10 overflow-hidden"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onTouchStart={(e) => onPointerDown(e.touches[0])}
          onTouchMove={(e) => onPointerMove(e.touches[0])}
          onTouchEnd={onPointerUp}
          style={{ touchAction: "none", willChange: "transform" }}
        >
          {/* Handle / Cabecera */}
          <div className="sticky top-0 z-10 bg-white border-b border-black/10">
            <div className="flex items-center justify-center py-2">
              <span className="h-1.5 w-12 rounded-full bg-black/20" />
            </div>

            {/* Resumen (plegado) */}
            <div className="flex items-center justify-between px-4 py-3">
              <div className="min-w-0">
                <div className="text-[11px] uppercase tracking-wide text-black/60">
                  Alerta
                </div>
                <div className="font-medium text-black truncate">
                  Calidad de aire
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] uppercase tracking-wide text-black/60">
                  Valor
                </div>
                <div className="text-xl font-semibold text-black">
                  57
                </div>
              </div>
            </div>
          </div>

          {/* Contenido extendido */}
          <div className="p-4 space-y-3 bg-white">
            <p className="text-sm text-black/80">
              Índice de calidad del aire (AQI) “57”: estado moderado. Personas sensibles con precaución.
            </p>
            <ul className="text-sm text-black/80 list-disc pl-5 space-y-1 marker:text-black/40">
              <li>Recomendación: limitar actividad física intensa al aire libre.</li>
              <li>Consejo: usar mascarilla si presentas síntomas respiratorios.</li>
              <li>Próxima actualización: 15 min.</li>
            </ul>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-lg border border-black/10 p-3">
                <div className="text-xs text-black/60">PM2.5</div>
                <div className="text-lg font-semibold">22 μg/m³</div>
              </div>
              <div className="rounded-lg border border-black/10 p-3">
                <div className="text-xs text-black/60">PM10</div>
                <div className="text-lg font-semibold">45 μg/m³</div>
              </div>
              <div className="rounded-lg border border-black/10 p-3">
                <div className="text-xs text-black/60">O₃</div>
                <div className="text-lg font-semibold">68 ppb</div>
              </div>
              <div className="rounded-lg border border-black/10 p-3">
                <div className="text-xs text-black/60">CO</div>
                <div className="text-lg font-semibold">0.6 ppm</div>
              </div>
            </div>

            {/* respiro inferior para no quedar bajo el footer */}
            <div className="h-10" />
            <div className="pb-[env(safe-area-inset-bottom)]" />
          </div>
        </div>
      </div>
    </div>
  );
}
