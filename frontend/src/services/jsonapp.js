// src/services/jsonapp.js

import fs from "fs/promises";
import path from "path";

// Archivo JSON donde se guarda el estado de la app
const FILE = path.join(process.cwd(), "data", "app.json");

// ---- DEFAULTS (incluye healthAdvice) ----
export const DEFAULT_DATA = {
  profile: {
    name: "Usuario Demo",
    email: "demo@correo.com",
    city: "Cochabamba",
    conditions: [],
    avatarUrl: ""
  },
  health: {
    tips: ["Recuerda hidratarte.", "Evita el humo de incendios."]
  },
  alerts: [],
  help: {
    emergencyNumbers: [
      { id: "police",      label: "Policía",                 type: "police",      phone: "110" },
      { id: "ambulance",   label: "Ambulancia / Salud",      type: "ambulance",   phone: "168", alt: "118" },
      { id: "fire",        label: "Bomberos",                type: "fire",        phone: "119" },
      { id: "environment", label: "ABT (quemas/incendios)",  type: "environment", phone: "800-100-118", whatsapp: "677-00422" }
    ],
    safePlaces: [
      { id: "hrsjdd",  name: "Hospital Regional San Juan de Dios", type: "hospital", lat: -21.52957, lng: -64.72609, aqi: 82, phone: "" },
      { id: "obrero7", name: "Hospital Obrero N°7 – CNS",          type: "hospital", phone: "+591 4 6633601", aqi: 60 }
    ],
    educational: [
      {
        id: "resp",
        title: "Emergencia Respiratoria",
        subtitle: "Qué hacer ante dificultades respiratorias por contaminación",
        items: [
          "Busca aire limpio y usa mascarilla N95.",
          "Evita ejercicio al aire libre y mantente hidratado.",
          "Si hay sibilancias o dolor torácico, busca atención médica."
        ]
      },
      {
        id: "contam",
        title: "Protección contra Contaminación",
        subtitle: "Medidas en días de alta contaminación",
        items: [
          "Cierra ventanas y filtra aire en interiores.",
          "Evita quemas y polvo; usa gafas si hay viento.",
          "Prioriza a niños, mayores y personas con asma/EPOC."
        ]
      }
    ],
    // CONSEJOS DE SALUD (GENERALES)
    healthAdvice: [
      { id: "aqi",     title: "Revisa el AQI antes de salir",            text: "Planifica actividades cuando el índice de calidad del aire sea mejor." },
      { id: "mask",    title: "Usa barbijo respirador (N95/KN95)",       text: "Ajuste bien sellado al rostro; evita mascarillas sueltas en días de humo." },
      { id: "vent",    title: "Ventila cuando el aire esté mejor",       text: "Abre ventanas en horas con mejor AQI; ciérralas en picos de contaminación." },
      { id: "filter",  title: "Filtra el aire interior",                  text: "Purificador HEPA o filtros MERV-13+ para reducir PM2.5 en casa." },
      { id: "routes",  title: "Prefiere rutas con menos tráfico",         text: "Evita avenidas y horas pico; elige calles internas o parques." },
      { id: "activity",title: "Ejercicio con AQI favorable",              text: "Reduce intensidad o muévelo a interiores cuando el aire esté crítico." },
      { id: "exposure",title: "Reduce exposición en picos",               text: "Sella rendijas, limita tiempo al aire libre y evita polvo/humo." },
      { id: "hydrate", title: "Hidrátate y cuida la garganta",            text: "Toma 6–8 vasos de agua al día; ayuda a mantener vías respiratorias." },
      { id: "vulnerable",title:"Protege a grupos vulnerables",            text: "Niños, mayores, embarazadas y personas con asma/EPOC requieren más cuidado." },
      { id: "vehicle", title: "Si vas en automóvil",                      text: "Activa recirculación y mantén filtros de cabina en buen estado." },
      { id: "symptoms",title: "Atiende señales de alarma",                text: "Dificultad respiratoria o dolor torácico requieren evaluación médica." },
      { id: "clean",   title: "Limpieza que no levante polvo",            text: "Usa paño húmedo o aspiradora con HEPA; evita barrer en seco." }
    ]
  }
};

// Deep-merge sencillo para combinar defaults + archivo
function deepMerge(a, b) {
  if (Array.isArray(a)) return Array.isArray(b) ? b : a;
  if (a && typeof a === "object") {
    const out = { ...a };
    const keys = new Set([ ...Object.keys(a), ...Object.keys(b || {}) ]);
    for (const k of keys) out[k] = deepMerge(a[k], b?.[k]);
    return out;
  }
  return b ?? a;
}

async function ensureFile() {
  const dir = path.dirname(FILE);
  await fs.mkdir(dir, { recursive: true });
  try {
    await fs.access(FILE);
  } catch {
    await fs.writeFile(FILE, JSON.stringify(DEFAULT_DATA, null, 2));
  }
}

export async function readAppData() {
  await ensureFile();
  try {
    const raw = await fs.readFile(FILE, "utf-8");
    const fileData = raw ? JSON.parse(raw) : {};
    return deepMerge(DEFAULT_DATA, fileData);
  } catch {
    return DEFAULT_DATA;
  }
}

export async function writeAppData(nextData) {
  await ensureFile();
  const data = nextData && typeof nextData === "object" ? nextData : DEFAULT_DATA;
  await fs.writeFile(FILE, JSON.stringify(data, null, 2));
  return data;
}
