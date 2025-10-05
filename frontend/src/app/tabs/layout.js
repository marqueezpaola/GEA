// src/app/tabs/layout.js
import TabBar from "../../components/tabs/TabBar";

export const metadata = { title: "GEA App" };

export default function TabsLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Deja espacio inferior: primero usa --tabbar-h; si no existe, usa safe-area + 64px */}
      <div className="pb-[var(--tabbar-h,calc(env(safe-area-inset-bottom)+64px))]">
        {children}
      </div>
      <TabBar />
    </div>
  );
}
