"use client";
import { useUserLocation } from "../../hooks/useUserLocation";

const BORDER = "border-[#4e656a]";

const MapPin = ({ className="" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7">
    <path d="M12 22s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

export default function LiveLocationStatus() {
  const { pos, error } = useUserLocation();

  return (
    <section className={`rounded-2xl border ${BORDER} p-4 bg-white`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-black/[0.05] grid place-items-center">
          <MapPin className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="text-base font-semibold text-black">Ubicación en tiempo real</div>
          <div className="text-[13px] text-black/90">
            {pos
              ? <>Lat {pos.lat.toFixed(5)}, Lng {pos.lng.toFixed(5)}{pos.accuracy ? <> · ±{Math.round(pos.accuracy)}m</> : null}</>
              : error ? error : "Activando geolocalización…"}
          </div>
        </div>
      </div>
    </section>
  );
}
