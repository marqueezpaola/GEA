"use client";
import { useState } from "react";
const BORDER = "border-[#4e656a]";

export default function EditRequestModal({ onClose, onSubmit }) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");

  return (
    <div className="fixed inset-0 bg-black/30 grid place-items-center z-50">
      <div className={`w-[92%] max-w-md rounded-2xl border ${BORDER} bg-white p-4`}>
        <div className="text-base font-semibold text-black mb-3">Solicitud de edición</div>

        <label className="text-sm text-black">Motivo</label>
        <input
          className={`w-full rounded-xl border ${BORDER} bg-white p-2 text-black mb-2`}
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="Ej.: Error en nombre, agregar dependiente, etc."
        />

        <label className="text-sm text-black">Detalles</label>
        <textarea
          className={`w-full rounded-xl border ${BORDER} bg-white p-2 text-black min-h-[110px]`}
          value={details}
          onChange={e => setDetails(e.target.value)}
          placeholder="Describe qué deseas corregir."
        />

        <div className="mt-4 flex justify-end gap-2">
          <button className={`px-3 py-1.5 rounded-xl border ${BORDER}`} onClick={onClose}>Cancelar</button>
          <button
            className={`px-3 py-1.5 rounded-xl border ${BORDER} bg-black text-white`}
            onClick={() => onSubmit?.({ reason, details, requestedAt: new Date().toISOString() })}
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
