"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

// Iconos inline (heredan currentColor)
const ICONS = {
  map: ({ className = "" }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M9 18l-6 3V6l6-3 6 3 6-3v15l-6 3-6-3z" />
      <path d="M9 3v15M15 6v15" />
    </svg>
  ),
  // Usamos "help" en vez de corazón
  help: ({ className = "" }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M9.2 9.5a2.8 2.8 0 1 1 4.6 2.2c-.9.6-1.6 1.1-1.6 2.1v.4" />
      <circle cx="12" cy="17.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  // Dejado por compatibilidad: no se usa, pero no estorba
  heart: ({ className = "" }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M12 21s-7-4.5-7-10a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.5-7 10-7 10z" />
    </svg>
  ),
  bell: ({ className = "" }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M15 17H9a5 5 0 0 1-5-5V9a7 7 0 1 1 14 0v3a5 5 0 0 1-5 5z" />
      <path d="M10 21a2 2 0 0 0 4 0" />
    </svg>
  ),
  user: ({ className = "" }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  ),
};

// Tabs finales
const TABS = [
  { href: "/tabs/map", label: "Mapa", icon: "map" },
  { href: "/tabs", label: "Ayuda", icon: "help" }, // raíz de Ayuda
  { href: "/tabs/alerts", label: "Alertas", icon: "bell", badge: true },
  { href: "/tabs/profile", label: "Perfil", icon: "user" },
];

export default function TabBar() {
  const pathname = usePathname();
  const [alertCount, setAlertCount] = useState(0);
  const ref = useRef(null);

  // Publica la altura real en --tabbar-h (útil para Map/Sheets)
  useEffect(() => {
    const setVar = () => {
      const h = ref.current?.offsetHeight || 64;
      document.documentElement.style.setProperty("--tabbar-h", `${h}px`);
    };
    setVar();
    const ro = new ResizeObserver(setVar);
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  // Badge de alertas
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/appdata/alerts-count", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const ct = res.headers.get("content-type") || "";
        const data = ct.includes("application/json") ? await res.json() : { count: 0 };
        if (alive) setAlertCount(Number(data.count) || 0);
      } catch {
        if (alive) setAlertCount(0);
      }
    })();
    return () => { alive = false; };
  }, []);

  // Activo especial para Ayuda (/tabs y /tabs/help; incluye /tabs/health por compatibilidad)
  const isActive = (href) => {
    if (href === "/tabs") {
      return (
        pathname === "/tabs" ||
        pathname.startsWith("/tabs/help") ||
        pathname.startsWith("/tabs/health")
      );
    }
    return pathname.startsWith(href);
  };

  return (
    <nav
      ref={ref}
      aria-label="Barra de navegación inferior"
      className="fixed bottom-0 inset-x-0 z-30
                 bg-white text-black border-t border-black/10
                 pb-[calc(env(safe-area-inset-bottom)+8px)] pt-2"
    >
      <ul className="flex justify-around items-center">
        {TABS.map(({ href, label, icon, badge }) => {
          const active = isActive(href);
          const Icon = ICONS[icon];
          return (
            <li key={href}>
              <Link
                href={href}
                prefetch={false}
                aria-current={active ? "page" : undefined}
                title={label}
                className="flex flex-col items-center gap-1 px-4 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
              >
                <div className={`relative transition-opacity ${active ? "opacity-100" : "opacity-60 hover:opacity-100"}`}>
                  <Icon className="w-6 h-6" aria-hidden="true" />
                  {badge && alertCount > 0 && (
                    <span
                      className="absolute -top-2 -right-2 rounded-full px-1.5 py-0.5 text-[10px]
                                 bg-[#5b6a6e] text-white ring-1 ring-white"
                      aria-label={`${alertCount} alertas`}
                    >
                      {alertCount}
                    </span>
                  )}
                </div>
                <span className="text-xs">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
