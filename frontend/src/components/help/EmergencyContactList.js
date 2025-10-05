"use client";
import { useState } from "react";

const BORDER = "border-[#4e656a]";

const Phone = ({ className="" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.9.32 1.78.6 2.62a2 2 0 0 1-.45 2.11L8.1 9.56a16 16 0 0 0 6.34 6.34l1.12-1.11a2 2 0 0 1 2.11-.45c.84.28 1.72.48 2.62.6A2 2 0 0 1 22 16.92z" />
  </svg>
);

const Copy = ({ className="" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

export default function EmergencyContactList({ items = [] }) {
  const [msg, setMsg] = useState("");

  // Fallback robusto de copiado
  const copyText = async (text) => {
    if (!text) return;

    let ok = false;

    // 1) API moderna si hay contexto seguro
    try {
      const secure = typeof window !== "undefined" && window.isSecureContext === true;
      if (secure && navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        ok = true;
      }
    } catch {
      ok = false;
    }

    // 2) Fallback con textarea + execCommand
    if (!ok) {
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        ta.setSelectionRange(0, text.length);
        ok = document.execCommand("copy");
        document.body.removeChild(ta);
      } catch {
        ok = false;
      }
    }

    // 3) Último recurso: prompt para copiar manualmente (sin mostrar error)
    if (!ok) {
      window.prompt("Copia el número:", text);
      return; // no mostramos mensaje negativo
    }

    // Toast solo de éxito
    setMsg("Número copiado");
    setTimeout(() => setMsg(""), 1200);
  };

  return (
    <section className={`rounded-2xl border ${BORDER} p-4 bg-white`}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-base font-semibold text-black">Contactos de Emergencia</div>
          <div className="text-[13px] text-black/90">Toca copiar o llamar</div>
        </div>
        {/* aria-live para accesibilidad del toast */}
        <div className="text-[12px]" aria-live="polite">
          {msg && <span className="px-2 py-1 rounded border border-black/10">{msg}</span>}
        </div>
      </div>

      <ul className="divide-y divide-black/10">
        {items.map((it, i) => {
          const key = it.id ?? `${it.type || "item"}-${it.phone || "nophone"}-${i}`;
          return (
            <li key={key} className="py-2 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="text-sm font-medium text-black truncate">{it.label}</div>
                <div className="text-[13px] text-black truncate">{it.phone || "—"}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {it.phone && (
                  <a
                    href={`tel:${it.phone}`}
                    className="px-2 py-1 rounded-xl border border-black/15 hover:bg-black/[0.03] text-sm flex items-center gap-1"
                  >
                    <Phone className="w-4 h-4" /> Llamar
                  </a>
                )}
                {it.phone && (
                  <button
                    type="button"
                    onClick={() => copyText(it.phone)}
                    className="px-2 py-1 rounded-xl border border-black/15 hover:bg-black/[0.03] text-sm flex items-center gap-1"
                  >
                    <Copy className="w-4 h-4" /> Copiar
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
