"use client";

const BORDER = "border-[#4e656a]";
const PRIMARY_BG = "bg-[#5b6a6e]"; // mismo color que Bloqueo

export default function Toggle({
  checked = false,
  onChange,
  label,
  description = "",
}) {
  return (
    <div className={`rounded-2xl border ${BORDER} bg-white p-3 flex items-start justify-between gap-3`}>
      <div className="min-w-0">
        {label && <div className="font-medium text-black">{label}</div>}
        {description && <div className="text-[13px] text-black/80">{description}</div>}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange?.(!checked)}
        className={`relative w-12 h-7 rounded-full transition-colors ${checked ? PRIMARY_BG : "bg-black/20"}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-6 w-6 bg-white rounded-full shadow transform transition
                      ${checked ? "translate-x-5" : ""}`}
        />
      </button>
    </div>
  );
}
