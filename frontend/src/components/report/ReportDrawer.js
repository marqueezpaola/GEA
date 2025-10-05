// src/components/report/ReportDrawer.jsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

const INCIDENT_TYPES = [
  { id: "air",    title: "Calidad del aire",    sub: "Humo, smog, olores fuertes",  icon: AirIcon },
  { id: "fire",   title: "Incendio",            sub: "Fuego, humo de incendio",     icon: FireIcon },
  { id: "hazard", title: "Condición peligrosa", sub: "Derrames, químicos, residuos",icon: HazardIcon },
  { id: "weather",title: "Evento climático",    sub: "Tormenta, granizo, viento",    icon: WeatherIcon },
  { id: "noise",  title: "Contaminación sonora",sub: "Ruido excesivo, obras",        icon: NoiseIcon },
  { id: "water",  title: "Contaminación del agua", sub: "Agua sucia, derrames",      icon: WaterIcon },
];

const SEVERITIES = [
  { id: "low",     label: "Bajo",      sub: "Molestia menor, no urgente",        icon: DotIcon },
  { id: "medium",  label: "Moderado",  sub: "Requiere atención no inmediata",    icon: DotIcon },
  { id: "high",    label: "Alto",      sub: "Atención pronta",                   icon: AlertIcon },
  { id: "critical",label: "Crítico",   sub: "Emergencia inmediata",              icon: AlertIcon },
];

const MIN_DESC = 20;

export default function ReportDrawer({ open, onClose, initialCoords }) {
  // Siempre declarar hooks en el mismo orden:
  const [mounted, setMounted] = useState(false);          // 1
  const [preview, setPreview] = useState(null);           // 2
  const [file, setFile] = useState(null);                 // 3
  const [incidentType, setIncidentType] = useState("");   // 4
  const [severity, setSeverity] = useState("");           // 5
  const [coords, setCoords] = useState(initialCoords || null); // 6
  const [accuracy, setAccuracy] = useState(null);         // 7
  const [address, setAddress] = useState("");             // 8
  const [desc, setDesc] = useState("");                   // 9

  const fileInputRef = useRef(null);
  const firstFocusRef = useRef(null);

  // Montado en cliente (para usar portal con document.body)
  useEffect(() => setMounted(true), []);

  // Bloquear scroll del body al abrir
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (open) {
      document.body.style.overflow = "hidden";
      setTimeout(() => firstFocusRef.current?.focus(), 10);
    } else {
      document.body.style.overflow = prev || "";
    }
    return () => (document.body.style.overflow = prev || "");
  }, [open]);

  // Cerrar con ESC
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Adoptar coords iniciales si cambian
  useEffect(() => {
    if (initialCoords) setCoords(initialCoords);
  }, [initialCoords]);

  // Galería
  const onPickFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(url);
  };
  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  // GPS
  const useGPS = () => {
    if (!navigator?.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setAccuracy(pos.coords.accuracy);
      },
      () => {},
      { enableHighAccuracy: true, timeout: 6000, maximumAge: 30000 }
    );
  };

  const canSend = useMemo(
    () => !!file && !!incidentType && !!severity && !!coords && desc.trim().length >= MIN_DESC,
    [file, incidentType, severity, coords, desc]
  );

  const onSubmit = (e) => {
    e.preventDefault();
    if (!canSend) return;
    const payload = {
      incidentType,
      severity,
      coords,
      accuracy,
      address: address.trim() || null,
      description: desc.trim(),
      fileName: file?.name || null,
    };
    console.log("Reporte listo para enviar:", payload);
    onClose?.();
  };

  // Render: usar portal sólo cuando mounted === true
  if (!mounted) return null;

  return createPortal(
    <div className={`fixed inset-0 z-[9999] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-white text-black border-l border-black/10 shadow-2xl
                    transition-transform duration-300 will-change-transform ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-black/10">
          <button
            ref={firstFocusRef}
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-lg px-2 py-1 hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            ✕
          </button>
          <div>
            <h2 className="text-base font-semibold leading-none">Reportar Incidente</h2>
            <p className="text-xs text-black/60 mt-1">Documenta problemas ambientales</p>
          </div>
          <div className="text-xs text-black/60">Seguro</div>
        </div>

        {/* Contenido scrollable */}
        <form onSubmit={onSubmit} className="h-full overflow-y-auto">
          {/* Fotografía */}
          <section className="p-4">
            <h3 className="text-sm font-semibold mb-2">
              Fotografía del incidente <span className="text-black/50">*</span>
            </h3>
            <div className="rounded-xl border border-dashed border-black/20 p-3">
              <div
                className="rounded-lg overflow-hidden bg-black/90 aspect-[4/3] grid place-items-center cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
                aria-label="Tomar fotografía o seleccionar de la galería"
              >
                {preview ? (
                  <img src={preview} alt="Vista previa" className="w-full h-full object-contain bg-white" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-white/80">
                    <CameraIcon className="w-8 h-8" />
                    <div className="text-sm">Tomar fotografía</div>
                    <div className="text-xs text-white/60">Documenta el incidente ambiental</div>
                  </div>
                )}
              </div>
              <div className="mt-3 flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onPickFile}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-lg px-3 py-2 bg-black text-white hover:bg-black/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
                >
                  Galería
                </button>
                <button
                  type="button"
                  disabled
                  className="rounded-lg px-3 py-2 bg-black/10 text-black/50 cursor-not-allowed"
                  title="Capturar (no implementado)"
                >
                  Capturar
                </button>
              </div>
            </div>
          </section>

          {/* Tipo de incidente */}
          <section className="px-4 pb-1">
            <h3 className="text-sm font-semibold mb-2">
              Tipo de incidente <span className="text-black/50">*</span>
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {INCIDENT_TYPES.map(({ id, title, sub, icon: Icon }) => {
                const active = incidentType === id;
                return (
                  <button
                    type="button"
                    key={id}
                    onClick={() => setIncidentType(id)}
                    className={`w-full text-left rounded-xl border px-3 py-3 transition
                                ${active ? "border-black ring-1 ring-black" : "border-black/15 hover:bg-black/5"}`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-sm font-medium">{title}</div>
                        <div className="text-xs text-black/60">{sub}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Ubicación */}
          <section className="p-4">
            <h3 className="text-sm font-semibold mb-2">
              Ubicación del incidente <span className="text-black/50">*</span>
            </h3>

            <div className="rounded-xl border border-black/15 p-3 mb-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Coordenadas GPS</div>
                <button
                  type="button"
                  onClick={useGPS}
                  className="text-xs rounded-lg px-2 py-1 border border-black/20 hover:bg-black/5"
                >
                  Usar ubicación actual
                </button>
              </div>
              <div className="mt-1 text-sm text-black/70">
                {coords ? (
                  <>
                    Lat: <b>{coords.lat.toFixed(6)}</b>, Lng: <b>{coords.lng.toFixed(6)}</b>
                    {accuracy ? <> · Precisión: ±{Math.round(accuracy)}m</> : null}
                  </>
                ) : (
                  <span className="text-black/50">Sin coordenadas. Pulsa “Usar ubicación actual”.</span>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-black/15 p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium">Dirección</div>
                <span className="text-xs text-black/60">Editar manualmente</span>
              </div>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ubicación actual"
                className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
              />
              <div className="mt-2 rounded-lg border border-black/10 bg-black/5 h-32 grid place-items-center text-xs text-black/60">
                Vista previa del mapa
              </div>
            </div>
          </section>

          {/* Severidad */}
          <section className="p-4">
            <h3 className="text-sm font-semibold mb-2">
              Nivel de severidad <span className="text-black/50">*</span>
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {SEVERITIES.map(({ id, label, sub, icon: Icon }) => {
                const active = severity === id;
                return (
                  <button
                    type="button"
                    key={id}
                    onClick={() => setSeverity(id)}
                    className={`text-left rounded-xl border px-3 py-3 transition
                                ${active ? "border-black ring-1 ring-black" : "border-black/15 hover:bg-black/5"}`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="w-5 h-5 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium">{label}</div>
                        <div className="text-xs text-black/60">{sub}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Descripción */}
          <section className="px-4 pb-4">
            <h3 className="text-sm font-semibold mb-2">
              Descripción detallada <span className="text-black/50">*</span>
            </h3>
            <textarea
              rows={5}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Describe el incidente con el mayor detalle posible…"
              maxLength={500}
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2
                          ${desc.trim().length && desc.trim().length < MIN_DESC ? "border-black/30 focus:ring-black" : "border-black/15 focus:ring-black"}`}
            />
            <div className="flex items-center justify-between mt-1 text-xs">
              <span className={desc.trim().length < MIN_DESC ? "text-black/70" : "text-black/50"}>
                Mínimo {MIN_DESC} caracteres {desc.trim().length ? `(${Math.max(MIN_DESC - desc.trim().length, 0)} restantes)` : ""}
              </span>
              <span className="text-black/50">{desc.length}/500</span>
            </div>

            <div className="mt-3 rounded-xl border border-black/15 bg-black/5 p-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <InfoIcon className="w-4 h-4" />
                Preguntas guía
              </div>
              <ul className="mt-1 list-disc pl-5 text-sm text-black/80 space-y-1 marker:text-black/40">
                <li>¿Qué observaste exactamente?</li>
                <li>¿Cuándo comenzó el incidente?</li>
                <li>¿Hay olores o sonidos particulares?</li>
                <li>¿Afecta a personas o animales cercanos?</li>
                <li>¿Es la primera vez que ocurre aquí?</li>
              </ul>
            </div>
          </section>

          {/* Enviar */}
          <div className="px-4 pb-5">
            <button
              type="submit"
              disabled={!canSend}
              className="w-full rounded-lg px-4 py-3 bg-black text-white disabled:opacity-40"
              title={canSend ? "Enviar reporte" : "Completa los campos obligatorios"}
            >
              Enviar reporte ✈️
            </button>
            <p className="mt-2 text-[11px] leading-relaxed text-black/60">
              Al enviar este reporte, confirmas que la información proporcionada es veraz y aceptas que sea compartida con las autoridades ambientales correspondientes.
            </p>
          </div>

          <div className="h-[calc(var(--tabbar-h,64px)+8px)]" />
        </form>
      </aside>
    </div>,
    document.body
  );
}

/* ============== ICONOS B/N ============== */
function CameraIcon(props){ return (
  <svg viewBox="0 0 24 24" {...props} fill="none" stroke="currentColor" strokeWidth="1.7">
    <rect x="3" y="7" width="18" height="12" rx="2" />
    <path d="M9 7l1.7-2h3.6L16 7" />
    <circle cx="12" cy="13" r="3.2" />
  </svg>
);}
function AirIcon(props){ return (
  <svg viewBox="0 0 24 24" {...props} fill="none" stroke="currentColor" strokeWidth="1.7">
    <path d="M3 9c4-3 7-3 11 0M3 13c5-3 8-3 13 0M10 6c3-2 5-2 8 0" />
  </svg>
);}
function FireIcon(props){ return (
  <svg viewBox="0 0 24 24" {...props} fill="none" stroke="currentColor" strokeWidth="1.7">
    <path d="M12 3c3 4 1 6 1 6s3-1 4 2c1 3-1 7-5 7s-6-3-6-6 3-5 6-9z" />
  </svg>
);}
function HazardIcon(props){ return (
  <svg viewBox="0 0 24 24" {...props} fill="none" stroke="currentColor" strokeWidth="1.7">
    <path d="M12 3l9 16H3L12 3z" /><path d="M12 10v4m0 3v.01" />
  </svg>
);}
function WeatherIcon(props){ return (
  <svg viewBox="0 0 24 24" {...props} fill="none" stroke="currentColor" strokeWidth="1.7">
    <path d="M4 15a4 4 0 1 1 3.5-6 5 5 0 1 1 8.5 5" />
    <path d="M8 19l2 2M12 19l2 2M16 19l2 2" />
  </svg>
);}
function NoiseIcon(props){ return (
  <svg viewBox="0 0 24 24" {...props} fill="none" stroke="currentColor" strokeWidth="1.7">
    <path d="M5 9v6l4-3 6 5V4l-6 5-4-3z" /><path d="M18 8a5 5 0 0 1 0 8" />
  </svg>
);}
function WaterIcon(props){ return (
  <svg viewBox="0 0 24 24" {...props} fill="none" stroke="currentColor" strokeWidth="1.7">
    <path d="M12 3c4 6 7 8 7 12a7 7 0 1 1-14 0c0-4 3-6 7-12z" />
  </svg>
);}
function DotIcon(props){ return (
  <svg viewBox="0 0 24 24" {...props} fill="currentColor"><circle cx="12" cy="12" r="3"/></svg>
);}
function AlertIcon(props){ return (
  <svg viewBox="0 0 24 24" {...props} fill="none" stroke="currentColor" strokeWidth="1.7">
    <path d="M12 3l9 16H3L12 3z" /><path d="M12 10v4m0 3v.01" />
  </svg>
);}
function InfoIcon(props){ return (
  <svg viewBox="0 0 24 24" {...props} fill="none" stroke="currentColor" strokeWidth="1.7">
    <circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h2v4h-2z"/>
  </svg>
);}
