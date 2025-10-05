"use client";
const BORDER = "border-[#4e656a]";

export default function EmergencyInstructions() {
  const steps = [
    { t: "Mantén la calma y evalúa la situación", s: "Respira profundo y determina el tipo de emergencia." },
    { t: "Llama al número de emergencia apropiado", s: "Usa los botones de arriba para llamar directamente." },
    { t: "Proporciona información clara", s: "Ubicación exacta, tipo de emergencia y número de personas afectadas." },
    { t: "Sigue las instrucciones del operador", s: "No cuelgues hasta que te lo indiquen." },
    { t: "Mantente en lugar seguro", s: "Espera a los servicios en un punto visible y seguro." }
  ];

  return (
    <section className={`rounded-2xl border ${BORDER} p-4 bg-white`}>
      <div className="text-base font-semibold text-black mb-2">Instrucciones de Emergencia</div>
      <ol className="space-y-2">
        {steps.map((x, i) => (
          <li key={i} className="text-sm">
            <div className="font-medium text-black">{i + 1}. {x.t}</div>
            <div className="text-[13px] text-black/90">{x.s}</div>
          </li>
        ))}
      </ol>
    </section>
  );
}
