"use client";
import Collapsible from "../ui/Collapsible.js";

const BORDER = "border-[#4e656a]";

/* Iconos */
const Mask = ({ className="" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="9" width="18" height="6" rx="3" />
    <path d="M3 12H1M23 12h-2M8 12h8" />
  </svg>
);
const Sun = ({ className="" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);
const HomeAir = ({ className="" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11l9-7 9 7" /><path d="M5 10v9h14v-9" /><path d="M7 16c2-2 4 2 6 0s4 0 4 0" />
  </svg>
);
const Bottle = ({ className="" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7">
    <path d="M10 2h4v4H10z" /><path d="M9 6h6v14a3 3 0 0 1-6 0z" />
  </svg>
);
const Pills = ({ className="" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="8" height="8" rx="2" /><rect x="13" y="13" width="8" height="8" rx="2" />
    <path d="M13 7h8M7 13v8" />
  </svg>
);

const items = [
  { id: "mask",  icon: <Mask className="w-5 h-5" />,  title: "Usa barbijo N95",     text: "En días de humo o alto AQI, reduce la exposición." },
  { id: "sun",   icon: <Sun className="w-5 h-5" />,   title: "Bloqueador solar",    text: "Protege piel si estás al aire libre por periodos largos." },
  { id: "air",   icon: <HomeAir className="w-5 h-5" />,title: "Ventila y filtra",   text: "Mejora el aire interior con ventilación y filtrado." },
  { id: "h2o",   icon: <Bottle className="w-5 h-5" />, title: "Hidrátate",           text: "Toma 6–8 vasos de agua al día." },
  { id: "med",   icon: <Pills className="w-5 h-5" />,  title: "Medicación a mano",  text: "Lleva tus inhaladores/medicinas si tienes indicación." },
];

export default function DailyLivingContent() {
  return (
    <Collapsible title="Contenido para el día a día" defaultOpen={false}>
      <ul className="space-y-2">
        {items.map((it) => (
          <li key={it.id} className={`rounded-xl border ${BORDER} p-3 bg-white flex items-start gap-3`}>
            <div className="w-9 h-9 rounded-full bg-black/[0.05] grid place-items-center shrink-0">
              {it.icon}
            </div>
            <div>
              <div className="text-sm font-medium text-black">{it.title}</div>
              <div className="text-[13px] text-black/90">{it.text}</div>
            </div>
          </li>
        ))}
      </ul>
    </Collapsible>
  );
}
