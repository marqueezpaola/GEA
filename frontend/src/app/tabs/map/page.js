// src/app/tabs/map/page.js

import MapView from "../../../components/maps/MapView";

export const metadata = { title: "Mapa - GEA" };

export default function MapTabPage() {
  return (
    <div className="relative w-full h-[calc(100dvh-var(--tabbar-h,64px))]">
      <MapView />
    </div>
  );
}
