// src/app/api/profile/route.js
import { readAppData } from "../../../services/jsonapp.js";

const DEFAULT_PROFILE = {
  name: "Usuario Demo",
  email: "demo@correo.com",
  age: 30,
  health: {
    respiratory: false,
    allergies: false,
    chronic: false,
    colorBlindness: false
  },
  privacy: {
    shareAnonymous: true,
    locationTracking: true,
    publicReports: false
  },
  notifications: {
    envAlerts: true,
    healthRecs: true,
    communityUpdates: false,
    medReminders: false,
    doNotDisturb: false
  },
  preferences: {
    language: "es",
    layers: { wind: true, rain: false, fires: true, pollution: true, accidents: false, stations: true },
    units: "metric"
  },
  accessibility: {
    highContrast: false,
    largeText: false
  }
};

// Deep-merge pequeño
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

export async function GET() {
  const data = await readAppData();
  const profile = deepMerge(DEFAULT_PROFILE, data.profile || {});
  return Response.json(profile, { headers: { "Cache-Control": "no-store" } });
}

export async function PATCH(req) {
  const patch = await req.json();

  const fs = (await import("fs")).promises;
  const path = (await import("path")).default;
  const FILE = path.join(process.cwd(), "data", "app.json");

  // Leer actual
  let current = {};
  try {
    const raw = await fs.readFile(FILE, "utf-8");
    current = JSON.parse(raw);
  } catch {
    current = {};
  }

  // Merge y guardar
  const merged = {
    ...current,
    profile: deepMerge(current.profile || {}, patch)
  };

  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(merged, null, 2));

  return Response.json(merged.profile);
}
