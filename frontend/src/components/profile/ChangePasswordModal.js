"use client";
import { useMemo, useState } from "react";

const BORDER = "border-[#4e656a]";
const CODE = "12345"; // código demo

const Mail = ({ className="" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7">
    <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><path d="m22 6-10 7L2 6"/>
  </svg>
);
const Key = ({ className="" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7">
    <circle cx="7" cy="14" r="3"/><path d="M10 14h10l-3-3 3-3"/>
  </svg>
);
const Lock = ({ className="" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7">
    <rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

export default function ChangePasswordModal({ initialEmail = "", onClose, onDone }) {
  const [step, setStep] = useState(0); // 0: correo, 1: código, 2: nueva pass
  const [email, setEmail] = useState(initialEmail);
  const [inputCode, setInputCode] = useState("");
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const [error, setError] = useState("");

  const title = useMemo(() => (
    step === 0 ? "Enviar código" : step === 1 ? "Verificar código" : "Nueva contraseña"
  ), [step]);

  const sendCode = () => {
    // Demo: “envía” el código al correo
    if (!email || !/\S+@\S+\.\S+/.test(email)) { setError("Correo inválido"); return; }
    setError("");
    alert(`Código enviado a ${email} (demo). Usa el código: ${CODE}`);
    setStep(1);
  };

  const verify = () => {
    if (inputCode.trim() !== CODE) { setError("Código incorrecto"); return; }
    setError("");
    setStep(2);
  };

  const save = () => {
    if (pass1.length < 6) { setError("La contraseña debe tener al menos 6 caracteres"); return; }
    if (pass1 !== pass2) { setError("Las contraseñas no coinciden"); return; }
    setError("");
    // No guardamos la contraseña real en disco (demo).
    alert("Contraseña actualizada (demo).");
    onDone?.();
    onClose?.();
  };

  return (
    <div className="fixed inset-0 bg-black/30 grid place-items-center z-50">
      <div className={`w-[92%] max-w-md rounded-2xl border ${BORDER} bg-white p-4`}>
        <div className="text-base font-semibold text-black mb-3">{title}</div>

        {step === 0 && (
          <div>
            <label className="text-sm text-black flex items-center gap-2 mb-1">
              <Mail className="w-4 h-4" /> Correo
            </label>
            <input
              className={`w-full rounded-xl border ${BORDER} bg-white p-2 text-black`}
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tucorreo@ejemplo.com"
            />
            {error && <div className="mt-2 text-[13px] text-red-600">{error}</div>}

            <div className="mt-4 flex justify-end gap-2">
              <button className={`px-3 py-1.5 rounded-xl border ${BORDER}`} onClick={onClose}>Cancelar</button>
              <button className={`px-3 py-1.5 rounded-xl border ${BORDER} bg-black text-white`} onClick={sendCode}>
                Enviar código
              </button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <label className="text-sm text-black flex items-center gap-2 mb-1">
              <Key className="w-4 h-4" /> Código (teórico) enviado
            </label>
            <input
              className={`w-full rounded-xl border ${BORDER} bg-white p-2 text-black`}
              value={inputCode}
              onChange={e => setInputCode(e.target.value)}
              placeholder="Ingresa el código (12345)"
            />
            {error && <div className="mt-2 text-[13px] text-red-600">{error}</div>}

            <div className="mt-4 flex justify-end gap-2">
              <button className={`px-3 py-1.5 rounded-xl border ${BORDER}`} onClick={onClose}>Cancelar</button>
              <button className={`px-3 py-1.5 rounded-xl border ${BORDER} bg-black text-white`} onClick={verify}>
                Verificar
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <label className="text-sm text-black flex items-center gap-2 mb-1">
              <Lock className="w-4 h-4" /> Nueva contraseña
            </label>
            <input
              type="password"
              className={`w-full rounded-xl border ${BORDER} bg-white p-2 text-black mb-2`}
              value={pass1}
              onChange={e => setPass1(e.target.value)}
              placeholder="Escribe tu nueva contraseña"
            />
            <input
              type="password"
              className={`w-full rounded-xl border ${BORDER} bg-white p-2 text-black`}
              value={pass2}
              onChange={e => setPass2(e.target.value)}
              placeholder="Repite la contraseña"
            />
            {error && <div className="mt-2 text-[13px] text-red-600">{error}</div>}

            <div className="mt-4 flex justify-end gap-2">
              <button className={`px-3 py-1.5 rounded-xl border ${BORDER}`} onClick={onClose}>Cancelar</button>
              <button className={`px-3 py-1.5 rounded-xl border ${BORDER} bg-black text-white`} onClick={save}>
                Guardar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
