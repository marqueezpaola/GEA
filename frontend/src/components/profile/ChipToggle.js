"use client";

const BORDER = "border-[#4e656a]";
const PRIMARY_BG = "bg-[#5b6a6e]"; // mismo color que Bloqueo

export default function ChipToggle({ active = false, onToggle, children }) {
  return (
    <button
      type="button"
      onClick={() => onToggle?.(!active)}
      className={`px-3 py-1.5 rounded-xl border ${BORDER} transition
                  ${active ? `${PRIMARY_BG} text-white shadow-sm` : "bg-white text-black hover:bg-black/[0.03]"}`}
    >
      {children}
    </button>
  );
}
