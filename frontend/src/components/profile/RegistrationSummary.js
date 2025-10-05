// src/components/profile/RegistrationSummary.js
"use client";

import { useMemo, useState } from "react";
import EditRequestModal from "./EditRequestModal.js";

const BORDER     = "border-[#4e656a]";
const BLOCK_BG   = "bg-[#5b6a6e]";   // Bloqueo: plomo profundo claro
const BLOCK_TEXT = "text-white";     // Texto contrastado
const DEP_BG     = "bg-[#eef2f3]";   // Dependientes: plomo claro suave

/* Iconos sobrios (SVG inline) */
const User = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
  </svg>
);
const Mail = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </svg>
);
const MapPin = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M12 22s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z" />
    <circle cx="12" cy="11" r="3" />
  </svg>
);
const Lock = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const FileText = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <path d="M16 13H8M16 17H8M10 9H8" />
  </svg>
);

function Chip({ children }) {
  return (
    <span className="inline-block rounded-full px-2 py-[2px] text-[11px] border border-black/20 text-black">
      {children}
    </span>
  );
}

/** Solo contenido; el borde externo lo pone el Collapsible padre. */
export default function RegistrationSummary({ registration }) {
  const [openEdit, setOpenEdit] = useState(false);

  const safe = useMemo(() => {
    const r = registration || {};
    return {
      readOnly: !!r.readOnly,
      account: r.account || {},
      notificationPreferences: r.notificationPreferences || { channels: {}, topics: {} },
      location: r.location || {},
      terms: r.terms || {},
      dependents: Array.isArray(r.dependents) ? r.dependents : [],
    };
  }, [registration]);

  return (
    <section className="bg-white p-3">
      {/* Acciones (derecha) */}
      <div className="flex items-center justify-end gap-2 mb-3">
        {safe.readOnly && <Chip>Solo lectura</Chip>}
        <button
          type="button"
          onClick={() => setOpenEdit(true)}
          className={`px-3 py-1.5 rounded-xl border ${BORDER} hover:bg-black/[0.04] text-sm`}
          title="Solicitar edición"
        >
          Solicitar edición
        </button>
      </div>

      {/* Cuenta */}
      <div className={`rounded-xl border ${BORDER} bg-white p-3 mb-3`}>
        <div className="flex items-center gap-2 mb-2">
          <User className="w-4 h-4" />
          <div className="font-medium text-black text-sm">Cuenta</div>
        </div>
        <div className="grid gap-1 text-[13px]">
          <div><span className="font-medium">Nombre: </span>{safe.account.fullName || "—"}</div>
          <div><span className="font-medium">Usuario: </span>{safe.account.username || "—"}</div>
          <div className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /><span>{safe.account.email || "—"}</span></div>
          <div><span className="font-medium">Rol: </span>{safe.account.role || "—"}</div>
        </div>
      </div>

      {/* Notificaciones y ubicación */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className={`rounded-xl border ${BORDER} bg-white p-3`}>
          <div className="font-medium text-black text-sm mb-2">Notificaciones</div>
          <div className="flex flex-wrap gap-2">
            {safe.notificationPreferences.channels?.inApp && <Chip>En app</Chip>}
            {safe.notificationPreferences.channels?.email && <Chip>Correo</Chip>}
            {safe.notificationPreferences.channels?.sms && <Chip>SMS</Chip>}
          </div>
          <div className="mt-2 text-[13px]">
            <div className="font-medium">Temas</div>
            <ul className="list-disc list-inside">
              {safe.notificationPreferences.topics?.airQualityRealtime && <li>Calidad del aire en tiempo real</li>}
              {safe.notificationPreferences.topics?.pollutionAlerts && <li>Alertas de contaminación</li>}
              {safe.notificationPreferences.topics?.healthTips && <li>Consejos de salud</li>}
            </ul>
          </div>
        </div>

        <div className={`rounded-xl border ${BORDER} bg-white p-3`}>
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4" />
            <div className="font-medium text-black text-sm">Ubicación</div>
          </div>
          <div className="text-[13px]">
            <div><span className="font-medium">Ciudad: </span>{safe.location.city || "—"}</div>
            <div><span className="font-medium">País: </span>{safe.location.country || "—"}</div>
            <div className="mt-1">
              {safe.location.personalizedAlertsEnabled ? <Chip>Alertas personalizadas activas</Chip> : <Chip>Alertas por ubicación desactivadas</Chip>}
            </div>
          </div>
        </div>
      </div>

      {/* Términos y Bloqueo */}
      <div className="grid gap-3 sm:grid-cols-2 mt-3">
        <div className={`rounded-xl border ${BORDER} bg-white p-3`}>
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4" />
            <div className="font-medium text-black text-sm">Términos</div>
          </div>
          <div className="text-[13px]">
            <div><span className="font-medium">Aceptados: </span>{safe.terms.accepted ? "Sí" : "No"}</div>
            <div><span className="font-medium">Versión: </span>{safe.terms.version || "—"}</div>
            <div><span className="font-medium">Fecha: </span>{safe.terms.acceptedAt || "—"}</div>
          </div>
        </div>

        {/* Bloqueo – fondo plomo profundo claro y texto contrastado */}
        <div className={`rounded-xl border ${BORDER} ${BLOCK_BG} p-3`}>
          <div className={`flex items-center gap-2 mb-2 ${BLOCK_TEXT}`}>
            <Lock className="w-4 h-4" />
            <div className="font-medium text-sm">Bloqueo</div>
          </div>
          <div className={`text-[13px] ${BLOCK_TEXT}`}>
            {safe.readOnly ? (
              <>
                Este registro no puede modificarse directamente.
                <br />
                Puedes solicitar edición.
              </>
            ) : (
              "Este registro es editable."
            )}
          </div>
        </div>
      </div>

      {/* Dependientes – fondo plomo claro (soluciona el “recorte” visual) */}
      <div className={`rounded-xl border ${BORDER} ${DEP_BG} p-3 mt-3 overflow-hidden`}>
        <div className="font-medium text-black text-sm mb-2">Dependientes</div>
        {safe.dependents.length === 0 && <div className="text-[13px]">Sin dependientes registrados.</div>}
        {safe.dependents.map((d) => (
          <div key={d.id} className={`rounded-xl border ${BORDER} bg-white p-3 mb-2`}>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium">{d.fullName}</span>
              {d.isMinor && <Chip>Menor de edad</Chip>}
              {d.notifications?.allowed === false && <Chip>Notificaciones vía tutor</Chip>}
            </div>
            <div className="mt-1 text-[13px]">
              <div>
                <span className="font-medium">Condiciones: </span>
                {d.medicalInfo?.hasRespiratoryCondition
                  ? Object.entries(d.medicalInfo.conditions || {})
                      .filter(([, v]) => v)
                      .map(([k]) => k)
                      .join(", ")
                  : "Ninguna"}
              </div>
              {d.medicalInfo?.usesMedication &&
                Array.isArray(d.medicalInfo.medications) &&
                d.medicalInfo.medications.length > 0 && (
                  <div>
                    <span className="font-medium">Medicaciones: </span>
                    {d.medicalInfo.medications.join(", ")}
                  </div>
                )}
            </div>
          </div>
        ))}
      </div>

      {openEdit && (
        <EditRequestModal
          onClose={() => setOpenEdit(false)}
          onSubmit={(payload) => {
            console.log("Solicitud de edición (demo):", payload);
            alert("Solicitud enviada. Nos pondremos en contacto (demo).");
            setOpenEdit(false);
          }}
        />
      )}
    </section>
  );
}
