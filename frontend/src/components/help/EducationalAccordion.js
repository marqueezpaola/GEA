"use client";
import { useState } from "react";
const BORDER = "border-[#4e656a]";

export default function EducationalAccordion({ items = [] }) {
  const [open, setOpen] = useState(null);

  return (
    <section className={`rounded-2xl border ${BORDER} p-4 bg-white`}>
      <div className="text-base font-semibold text-black mb-1">Contenido Educativo</div>
      <p className="text-[13px] text-black/90 mb-3">Procedimientos de emergencia y protección</p>

      <ul className="space-y-2">
        {items.map((it, idx) => {
          const active = open === idx;
          return (
            <li key={it.id} className={`rounded-xl border ${BORDER} p-3 ${active ? "bg-black/[0.02]" : "bg-white"}`}>
              <button
                onClick={() => setOpen(active ? null : idx)}
                className="w-full text-left flex items-center justify-between"
              >
                <div>
                  <div className="text-sm font-medium text-black">{it.title}</div>
                  <div className="text-[13px] text-black/90">{it.subtitle}</div>
                </div>
                <span className="text-lg text-black">{active ? "▴" : "▾"}</span>
              </button>

              {active && (
                <ul className="list-disc pl-5 mt-2 text-[13px] text-black/90 space-y-1">
                  {it.items.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
