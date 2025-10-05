async function getHealth() {
    const r = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/appdata`, { cache: "no-store" });
    const d = await r.json();
    return d.health || { tips: [] };
  }
  
  export default async function HealthPage() {
    const health = await getHealth();
    return (
      <div className="p-4 space-y-3">
        <h1 className="text-lg font-semibold">Ayuda</h1>
        <ul className="space-y-2">
          {health.tips.map((t, i) => (
            <li key={i} className="p-3 rounded-lg bg-white shadow text-sm">{t}</li>
          ))}
        </ul>
      </div>
    );
  }
  