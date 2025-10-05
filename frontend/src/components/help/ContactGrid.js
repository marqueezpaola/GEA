"use client";
const BORDER = "border-[#4e656a]";

export default function ContactGrid({ items = [] }) {
  const badge = (r) => r === "official" ? "Oficial" : r ? "Comunidad" : null;

  return (
    <section className={`rounded-2xl border ${BORDER} p-4 bg-white`}>
      <div className="text-base font-semibold text-black">Contactos de Emergencia</div>
      <div className="text-[13px] text-black/90 mb-3">Toca para llamar inmediatamente</div>

      <div className="grid grid-cols-2 gap-3">
        {items.map((it) => (
          <a
            key={it.id}
            href={it.phone ? `tel:${it.phone}` : "#"}
            onClick={(e) => { if (!it.phone) e.preventDefault(); }}
            className={`rounded-2xl border ${BORDER} p-4 hover:bg-black/[0.02] transition`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-black/[0.04] grid place-items-center text-xl">
                {it.type === "ambulance" ? "➕" : it.type === "fire" ? "🔥" : it.type === "police" ? "🛡️" : "🛡️"}
              </div>
              <div className="text-sm">
                <div className="font-medium text-black">{it.label}</div>
                <div className="text-[13px] text-black">{it.phone || "—"}</div>
                <div className="text-[12px] text-black/90 mt-1 flex items-center gap-2">
                  <span>🕒 {it.eta || "—"}</span>
                  {badge(it.reliability) && <span>| {badge(it.reliability)}</span>}
                </div>
                {it.alt && <div className="text-[12px] text-black/90">Alternativo: {it.alt}</div>}
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
