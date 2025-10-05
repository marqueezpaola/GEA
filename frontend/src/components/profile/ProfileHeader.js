"use client";
import { useState } from "react";
import ProfileMenu from "./ProfileMenu.js";
import PreferencesModal from "./PreferencesModal.js";
import OfflinePanel from "./OfflinePanel.js";
import ChangePasswordModal from "./ChangePasswordModal.js";

const BORDER = "border-[#4e656a]";

const Pencil = ({ className="" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);

export default function ProfileHeader({ profile, onSave, onPatch, onPersist }) {
  const [openEdit, setOpenEdit] = useState(false);
  const [name, setName] = useState(profile.name || "");
  const [email, setEmail] = useState(profile.email || "");
  const [showPrefs, setShowPrefs] = useState(false);
  const [showOffline, setShowOffline] = useState(false);
  const [showChangePass, setShowChangePass] = useState(false);

  return (
    <section className={`rounded-2xl border ${BORDER} bg-white p-4`}>
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 rounded-full border border-black/20 grid place-items-center text-sm text-black/70">
          Foto
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-lg font-semibold text-black truncate">{profile.name}</div>
          <div className="text-[13px] text-black/80 truncate">{profile.email}</div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className={`p-2 rounded-xl border ${BORDER} hover:bg-black/[0.04]`}
            onClick={() => { setName(profile.name || ""); setEmail(profile.email || ""); setOpenEdit(true); }}
            title="Editar perfil"
          >
            <Pencil className="w-5 h-5" />
          </button>

          <ProfileMenu
            onOpenPreferences={() => setShowPrefs(true)}
            onOpenOffline={() => setShowOffline(true)}
            onOpenChangePassword={() => setShowChangePass(true)}
            onFeedback={() => alert("Gracias por tus comentarios (demo).")}
            onLogout={() => alert("Cerrar sesión (demo).")}
          />
        </div>
      </div>

      {/* Modal Editar */}
      {openEdit && (
        <div className="fixed inset-0 bg-black/30 grid place-items-center z-50">
          <div className={`w-[92%] max-w-md rounded-2xl border ${BORDER} bg-white p-4`}>
            <div className="text-base font-semibold text-black mb-3">Editar Perfil</div>

            <label className="text-sm text-black">Nombre</label>
            <input
              className={`w-full rounded-xl border ${BORDER} bg-white p-2 text-black mb-2`}
              value={name} onChange={e => setName(e.target.value)}
            />

            <label className="text-sm text-black">Correo</label>
            <input
              className={`w-full rounded-xl border ${BORDER} bg-white p-2 text-black`}
              value={email} onChange={e => setEmail(e.target.value)}
            />

            <div className="mt-4 flex justify-end gap-2">
              <button className={`px-3 py-1.5 rounded-xl border ${BORDER}`} onClick={() => setOpenEdit(false)}>Cancelar</button>
              <button
                className={`px-3 py-1.5 rounded-xl border ${BORDER} bg-black text-white`}
                onClick={async () => { await onSave?.({ name, email }); setOpenEdit(false); }}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preferencias */}
      {showPrefs && (
        <PreferencesModal
          initialLanguage={profile?.preferences?.language ?? "es"}
          initialUnits={profile?.preferences?.units ?? "metric"}
          onClose={() => setShowPrefs(false)}
          onSave={async (patch) => {
            await onPatch?.(patch);
            await onPersist?.();
            setShowPrefs(false);
          }}
        />
      )}

      {/* Sin conexión */}
      {showOffline && <OfflinePanel onClose={() => setShowOffline(false)} />}

      {/* Cambiar contraseña */}
      {showChangePass && (
        <ChangePasswordModal
          initialEmail={profile?.email || ""}
          onClose={() => setShowChangePass(false)}
          onDone={() => console.log("password-changed-demo")}
        />
      )}
    </section>
  );
}
