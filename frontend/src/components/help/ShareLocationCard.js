"use client";
import { useState } from "react";
import { useUserLocation } from "../../hooks/useUserLocation";
const BORDER = "border-[#4e656a]";

export default function ShareLocationCard() {
  const { pos, error } = useUserLocation();
  const [status, setStatus] = useState("");

  const share = async () => {
    if (!pos) { setStatus(error || "Activa la ubicación"); return; }
    const url = `https://maps.google.com/?q=${pos.lat},${pos.lng}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Mi ubicación", text: "Estoy aquí", url });
        setStatus("Ubicación compartida");
      } else {
        await navigator.clipboard.writeText(url);
        setStatus("Enlace copiado");
      }
    } catch {
      setStatus("No se pudo compartir");
    }
    setTimeout(() => setStatus(""), 2000);
  };

  return (
    <section className={`rounded-2xl border ${BORDER} p-4 bg-white`}>
      <div className="text-base font-semibold text-black">Compartir Ubicación</div>
      <p className="text-[13px] text-black/90 mb-3">
        En caso de emergencia, tu ubicación se compartirá con servicios de emergencia o contactos.
      </p>
      <button
        onClick={share}
        className={`w-full py-3 rounded-xl border ${BORDER} bg-white text-black hover:bg-black/[0.03]`}
      >
        Compartir Ahora
      </button>
      {status && <div className="text-xs text-black/90 mt-2">{status}</div>}
    </section>
  );
}
