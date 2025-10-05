"use client";
import { useState } from "react";

const BORDER = "border-[#4e656a]";

export default function PreferencesModal({
  initialLanguage = "es",
  initialUnits = "metric",
  onSave,
  onClose
}) {
  const [lang, setLang] = useState(initialLanguage);
  const [units, setUnits] = useState(initialUnits);

  return (
    <div className="fixed inset-0 bg-black/30 grid place-items-center z-50">
      <div className={`w-[92%] max-w-md rounded-2xl border ${BORDER} bg-white p-4`}>
        <div className="text-base font-semibold text-black mb-3">Preferencias</div>

        <div className="mb-3">
          <label className="text-sm text-black">Idioma</label>
          <select
            className={`mt-1 w-full rounded-xl border ${BORDER} bg-white p-2 text-black`}
            value={lang}
            onChange={e => setLang(e.target.value)}
          >
            <option value="es">Español</option>
            <option value="en">English</option>
            <option value="pt">Português</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-black">Unidades</label>
          <div className="mt-1 flex gap-2">
            {["metric","imperial"].map(u => (
              <button
                key={u}
                className={`px-3 py-1.5 rounded-xl border ${BORDER}
                           ${units===u ? "bg-black text-white" : "bg-white text-black"}`}
                onClick={() => setUnits(u)}
              >
                {u==="metric" ? "Métrico (°C, km/h, µg/m³)" : "Imperial (°F, mph, ppm)"}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button className={`px-3 py-1.5 rounded-xl border ${BORDER}`} onClick={onClose}>Cancelar</button>
          <button
            className={`px-3 py-1.5 rounded-xl border ${BORDER} bg-black text-white`}
            onClick={() => onSave?.({ preferences: { language: lang, units } })}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
