"use client";
import { useEffect, useRef, useState } from "react";

const BORDER = "border-[#4e656a]";

const ChevronDown = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

/**
 * Collapsible con:
 * - header botón accesible
 * - flecha que rota
 * - transición real de altura (slide)
 * Props:
 *  - title: string | ReactNode
 *  - icon?: ReactNode (opcional)
 *  - defaultOpen?: boolean
 */
export default function Collapsible({ title, icon, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  const innerRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!innerRef.current) return;
    setHeight(open ? innerRef.current.scrollHeight : 0);
  }, [open, children]);

  return (
    <section className={`rounded-2xl border ${BORDER} bg-white`}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full p-4 flex items-center justify-between"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2 text-black">
          {icon ? <span className="w-5 h-5">{icon}</span> : null}
          <span className="text-base font-semibold">{title}</span>
        </div>
        <ChevronDown className={`w-5 h-5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <div style={{ height }} className="overflow-hidden transition-[height] duration-300 ease-in-out">
        <div ref={innerRef} className="px-4 pb-4">
          {children}
        </div>
      </div>
    </section>
  );
}
