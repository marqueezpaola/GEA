import { headers } from "next/headers";

import LiveLocationStatus from "../../components/help/LiveLocationStatus.js";
import QuickActions from "../../components/help/QuickActions.js";
import EmergencyContactList from "../../components/help/EmergencyContactList.js";
import EmergencyInstructions from "../../components/help/EmergencyInstructions.js";
import ShareLocationCard from "../../components/help/ShareLocationCard.js";
import PointsOfInterest from "../../components/help/PointsOfInterest.js";
import DailyLivingContent from "../../components/help/DailyLivingContent.js";
import HealthAdviceList from "../../components/help/HealthAdviceList.js";

async function getHelp() {
  const h = await headers();
  const host  = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const base  = `${proto}://${host}`;

  const r = await fetch(`${base}/api/help`, { cache: "no-store" });
  if (!r.ok) return { emergencyNumbers: [], educational: [], healthAdvice: [], poi: [] };
  return r.json();
}

export default async function HelpPage() {
  const help = await getHelp();
  const poi = help.poi ?? help.safePlaces?.map(s => ({
    id: s.id,
    name: s.name,
    type: s.kind?.toLowerCase().includes("hospital") ? "hospital" : "shelter",
    lat: s.lat ?? null,
    lng: s.lon ?? null,
    phone: s.phone ?? "",
    aqi: s.aqi ?? null
  })) ?? [];

  return (
    <div className="p-4 space-y-6 bg-white">
      <LiveLocationStatus />
      <QuickActions numbers={help.emergencyNumbers} />
      <EmergencyContactList items={help.emergencyNumbers} />
      <EmergencyInstructions />
      <ShareLocationCard />
      <PointsOfInterest poi={poi} />
      <DailyLivingContent />
      <HealthAdviceList items={help.healthAdvice} />
    </div>
  );
}
