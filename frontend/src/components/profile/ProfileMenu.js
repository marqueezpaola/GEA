"use client";
import { useEffect, useRef, useState } from "react";

const BORDER = "border-[#4e656a]";

/* Iconos (SVG, formales) */
const Dots = ({ className="" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/>
  </svg>
);
const Gear = ({ className="" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7">
    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.17a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.17a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 7.12 3.3l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.17a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c0 .66.39 1.26 1 1.51.16.07.33.12.51.12H21a2 2 0 0 1 0 4h-.17c-.18 0-.35.05-.51.12A1.65 1.65 0 0 0 19.4 15Z"/>
  </svg>
);
const WifiOff = ({ className="" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7">
    <path d="M16.72 5.78A10.94 10.94 0 0 0 12 5c-3.08 0-5.88 1.25-7.94 3.28M1 1l22 22"/>
    <path d="M8.53 9.53A7.07 7.07 0 0 1 12 9c1.36 0 2.62.38 3.69 1.04M5.34 12.66A10 10 0 0 1 12 11c2.02 0 3.9.6 5.46 1.63M12 20h.01"/>
  </svg>
);
const Message = ({ className="" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7">
    <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/>
  </svg>
);
const Lock = ({ className="" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7">
    <rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const Logout = ({ className="" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>
  </svg>
);

function Item({ Icon, text, onClick }) {
  return (
    <button
      role="menuitem"
      className="w-full text-left px-3 py-2 rounded-xl hover:bg-black/[0.04] flex items-center gap-2"
      onClick={onClick}
    >
      <Icon className="w-5 h-5" /> <span className="text-black">{text}</span>
    </button>
  );
}

export default function ProfileMenu({
  onOpenPreferences,
  onOpenOffline,
  onOpenChangePassword,
  onFeedback,
  onLogout
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
        className={`p-2 rounded-xl border ${BORDER} hover:bg-black/[0.04] text-black`}
        title="Menú"
      >
        <Dots className="w-5 h-5" />
      </button>

      {open && (
        <div
          role="menu"
          className={`absolute right-0 mt-2 w-60 rounded-2xl border ${BORDER} bg-white p-1 shadow-sm z-20`}
        >
          <Item Icon={Gear} text="Preferencias" onClick={() => { setOpen(false); onOpenPreferences?.(); }} />
          <Item Icon={WifiOff} text="Sin conexión" onClick={() => { setOpen(false); onOpenOffline?.(); }} />
          <Item Icon={Lock} text="Cambiar contraseña" onClick={() => { setOpen(false); onOpenChangePassword?.(); }} />
          <Item Icon={Message} text="Enviar comentarios" onClick={() => { setOpen(false); onFeedback?.(); }} />
          <Item Icon={Logout} text="Cerrar sesión" onClick={() => { setOpen(false); onLogout?.(); }} />
        </div>
      )}
    </div>
  );
}
