"use client";

import { useEffect, useMemo, useState } from "react";
import Collapsible from "../../../components/ui/Collapsible.js";
import ProfileHeader from "../../../components/profile/ProfileHeader.js";
import Toggle from "../../../components/profile/Toggle.js";
import ChipToggle from "../../../components/profile/ChipToggle.js";
import RegistrationSummary from "../../../components/profile/RegistrationSummary.js";
import { User, ShieldHeart, ShieldCheck, Bell, Gear, Accessibility, Download, FileText } from "../../../components/ui/Icons.js";

const BORDER = "border-[#4e656a]";

// helpers
async function fetchProfile() {
  const r = await fetch("/api/profile", { cache: "no-store" });
  const data = r.ok ? await r.json() : {};
  if (!data.registration) {
    try {
      const r2 = await fetch("/api/appdata", { cache: "no-store" });
      if (r2.ok) {
        const appdata = await r2.json();
        if (appdata && appdata.registration) data.registration = appdata.registration;
      }
    } catch {}
  }
  return data;
}
async function patchProfile(patch) {
  const r = await fetch("/api/profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch)
  });
  return r.ok ? r.json() : null;
}
function SaveBar({ onSave, disabled }) {
  return (
    <div className="flex justify-end">
      <button
        disabled={disabled}
        onClick={onSave}
        className={`px-3 py-1.5 rounded-xl border ${BORDER}
                    ${disabled ? "opacity-50 cursor-not-allowed" : "bg-black text-white"}`}
      >
        Guardar
      </button>
    </div>
  );
}

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [dirty, setDirty] = useState(false);

  useEffect(() => { fetchProfile().then(setProfile); }, []);
  const ready = useMemo(() => !!profile, [profile]);

  if (!ready) return <div className="p-4 text-black">Cargando…</div>;

  const update = (patch) => {
    setProfile(p => {
      const next = structuredClone(p);
      const m = (a, b) => {
        if (Array.isArray(a)) return Array.isArray(b) ? b : a;
        if (typeof a === "object" && a) {
          const out = { ...a };
          for (const k of Object.keys(b || {})) out[k] = m(a?.[k], b[k]);
          return out;
        }
        return b ?? a;
      };
      setDirty(true);
      return m(next, patch);
    });
  };

  const save = async () => {
    const saved = await patchProfile(profile);
    if (saved) { setProfile(saved); setDirty(false); }
  };

  return (
    <div className="p-4 space-y-6 bg-white">

      {/* Header */}
      <ProfileHeader
        profile={profile}
        onSave={async (p) => { update(p); await save(); }}
        onPatch={(p) => update(p)}
        onPersist={save}
      />

      {/* >>> NUEVO: DATOS DE REGISTRO con flecha <<< */}
      <Collapsible title="Datos de registro" icon={<FileText className="w-5 h-5" />} defaultOpen={true}>
        <RegistrationSummary registration={profile.registration} />
      </Collapsible>

      {/* Perfil de Salud */}
      <Collapsible title="Perfil de Salud" icon={<ShieldHeart className="w-5 h-5" />} defaultOpen={true}>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-black">Edad</label>
            <select
              className={`mt-1 w-full rounded-xl border ${BORDER} bg-white p-2 text-black`}
              value={profile.age}
              onChange={e => update({ age: Number(e.target.value) })}
            >
              {Array.from({ length: 83 }, (_, i) => 18 + i).map(n => (
                <option key={n} value={n}>{n} años</option>
              ))}
            </select>
          </div>

          <Toggle
            checked={profile.health.respiratory}
            onChange={v => update({ health: { respiratory: v } })}
            label="Condiciones respiratorias"
            description="Asma, EPOC, bronquitis crónica"
          />
          <Toggle
            checked={profile.health.allergies}
            onChange={v => update({ health: { allergies: v } })}
            label="Alergias"
            description="Polen, polvo, contaminantes"
          />
          <Toggle
            checked={profile.health.chronic}
            onChange={v => update({ health: { chronic: v } })}
            label="Enfermedades crónicas"
            description="Diabetes, hipertensión, cardiopatías"
          />
          <Toggle
            checked={profile.health.colorBlindness}
            onChange={v => update({ health: { colorBlindness: v } })}
            label="Daltonismo"
            description="Dificultad para distinguir colores"
          />
          <SaveBar onSave={save} disabled={!dirty} />
        </div>
      </Collapsible>

      {/* Controles de Privacidad */}
      <Collapsible title="Controles de Privacidad" icon={<ShieldCheck className="w-5 h-5" />} defaultOpen={false}>
        <div className="space-y-3">
          <Toggle
            checked={profile.privacy.shareAnonymous}
            onChange={v => update({ privacy: { shareAnonymous: v } })}
            label="Compartir datos anónimos"
            description="Ayuda a mejorar predicciones y salud comunitaria"
          />
          <Toggle
            checked={profile.privacy.locationTracking}
            onChange={v => update({ privacy: { locationTracking: v } })}
            label="Seguimiento de ubicación"
            description="Permite recomendaciones personalizadas"
          />
          <Toggle
            checked={profile.privacy.publicReports}
            onChange={v => update({ privacy: { publicReports: v } })}
            label="Reportes públicos"
            description="Tus reportes serán visibles para otros usuarios"
          />
          <SaveBar onSave={save} disabled={!dirty} />
        </div>
      </Collapsible>

      {/* Preferencias de Notificaciones */}
      <Collapsible title="Preferencias de Notificaciones" icon={<Bell className="w-5 h-5" />} defaultOpen={false}>
        <div className="space-y-3">
          <Toggle
            checked={profile.notifications.envAlerts}
            onChange={v => update({ notifications: { envAlerts: v } })}
            label="Alertas ambientales"
            description="Cambios críticos en la calidad del aire"
          />
          <Toggle
            checked={profile.notifications.healthRecs}
            onChange={v => update({ notifications: { healthRecs: v } })}
            label="Recomendaciones de salud"
            description="Consejos personalizados"
          />
          <Toggle
            checked={profile.notifications.communityUpdates}
            onChange={v => update({ notifications: { communityUpdates: v } })}
            label="Actualizaciones de la comunidad"
          />
          <Toggle
            checked={profile.notifications.medReminders}
            onChange={v => update({ notifications: { medReminders: v } })}
            label="Recordatorios de medicación"
          />
          <Toggle
            checked={profile.notifications.doNotDisturb}
            onChange={v => update({ notifications: { doNotDisturb: v } })}
            label="No molestar"
            description="Silencia notificaciones en horarios de descanso"
          />
          <SaveBar onSave={save} disabled={!dirty} />
        </div>
      </Collapsible>

      {/* Preferencias de la App */}
      <Collapsible title="Preferencias de la App" icon={<Gear className="w-5 h-5" />} defaultOpen={false}>
        <div className="space-y-4">
          <div className="text-sm font-medium text-black">Capas de mapa por defecto</div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(profile.preferences.layers).map(([k, v]) => (
              <ChipToggle
                key={k}
                active={v}
                onToggle={(nv) => update({ preferences: { layers: { [k]: nv } } })}
              >
                {k === "wind" ? "Viento"
                  : k === "rain" ? "Lluvia/Nubes"
                  : k === "fires" ? "Incendios"
                  : k === "pollution" ? "Contaminación"
                  : k === "accidents" ? "Accidentes"
                  : "Estaciones"}
              </ChipToggle>
            ))}
          </div>

          <div>
  <div className="text-sm font-medium text-black mb-2">Unidades de medida</div>
  <div className="flex gap-2">
    {["metric", "imperial"].map(u => (
      <button
        key={u}
        className={`px-3 py-1.5 rounded-xl border ${BORDER}
                    ${profile.preferences.units === u
                      ? "bg-[#5b6a6e] text-white shadow-sm"
                      : "bg-white text-black hover:bg-black/[0.03]"}`
        }
        onClick={() => update({ preferences: { units: u } })}
      >
        {u === "metric" ? "Métrico (°C, km/h, µg/m³)" : "Imperial (°F, mph, ppm)"}
      </button>
    ))}
  </div>
</div>
          <SaveBar onSave={save} disabled={!dirty} />
        </div>
      </Collapsible>

      {/* Accesibilidad */}
      <Collapsible title="Opciones de Accesibilidad" icon={<Accessibility className="w-5 h-5" />} defaultOpen={false}>
        <div className="space-y-3">
          <Toggle
            checked={profile.accessibility.highContrast}
            onChange={v => update({ accessibility: { highContrast: v } })}
            label="Modo alto contraste"
            description="Mejora la visibilidad"
          />
          <Toggle
            checked={profile.accessibility.largeText}
            onChange={v => update({ accessibility: { largeText: v } })}
            label="Texto grande"
            description="Aumenta el tamaño del texto"
          />
          <SaveBar onSave={save} disabled={!dirty} />
        </div>
      </Collapsible>

      {/* Cuenta */}
      <Collapsible title="Cuenta" icon={<User className="w-5 h-5" />} defaultOpen={false}>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-black">Correo electrónico</label>
            <input
              value={profile.email}
              onChange={e => update({ email: e.target.value })}
              className={`mt-1 w-full rounded-xl border ${BORDER} bg-white p-2 text-black`}
            />
          </div>
          <div className="flex gap-2">
            <button className={`px-3 py-1.5 rounded-xl border ${BORDER}`}>Cambiar contraseña</button>
            <button
              className={`px-3 py-1.5 rounded-xl border ${BORDER} text-red-600`}
              onClick={() => {
                if (confirm("¿Eliminar cuenta y datos locales? Esta acción no se puede deshacer.")) {
                  update({
                    name: "Usuario Demo", email: "demo@correo.com",
                    health: { respiratory: false, allergies: false, chronic: false, colorBlindness: false }
                  });
                  save();
                }
              }}
            >
              Eliminar cuenta
            </button>
          </div>
          <SaveBar onSave={save} disabled={!dirty} />
        </div>
      </Collapsible>

      {/* Exportar Datos */}
      <Collapsible title="Exportar Datos" icon={<Download className="w-5 h-5" />} defaultOpen={false}>
        <div className="space-y-3">
          {[
            { id: "exposure", title: "Historial de Exposición Ambiental", desc: "Datos de calidad del aire, ubicaciones y tiempo de exposición." },
            { id: "correlations", title: "Correlaciones de Salud", desc: "Relación entre condiciones ambientales y síntomas." },
            { id: "reports", title: "Reportes Ciudadanos", desc: "Reportes enviados y estado de verificación." }
          ].map((card) => (
            <div key={card.id} className={`rounded-2xl border ${BORDER} p-3`}>
              <div className="text-sm font-medium text-black">{card.title}</div>
              <div className="text-[13px] text-black/80">{card.desc}</div>
              <div className="mt-2 flex gap-2">
                <button
                  className={`px-3 py-1.5 rounded-xl border ${BORDER}`}
                  onClick={() => {
                    const rows = [["tipo","valor","fecha"],["AQI",82,"2025-01-01"],["PM2.5",35,"2025-01-01"]];
                    const csv = rows.map(r => r.map(x => `"${String(x).replace(/"/g,'""')}"`).join(",")).join("\n");
                    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url; a.download = `${card.id}.csv`; a.click();
                    URL.revokeObjectURL(url);
                  }}
                >CSV</button>
                <button
                  className={`px-3 py-1.5 rounded-xl border ${BORDER}`}
                  onClick={() => {
                    const blob = new Blob([JSON.stringify({ profile, sample: true }, null, 2)], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url; a.download = `${card.id}.json`; a.click();
                    URL.revokeObjectURL(url);
                  }}
                >JSON</button>
              </div>
            </div>
          ))}
        </div>
      </Collapsible>

      <SaveBar onSave={save} disabled={!dirty} />
    </div>
  );
}
