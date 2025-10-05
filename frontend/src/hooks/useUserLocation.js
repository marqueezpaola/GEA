"use client";
import { useEffect, useState } from "react";

export function useUserLocation() {
  const [pos, setPos] = useState(null);   // {lat, lng, accuracy}
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!("geolocation" in navigator)) { setError("Geolocalización no disponible"); return; }
    const id = navigator.geolocation.watchPosition(
      (p) => setPos({ lat: p.coords.latitude, lng: p.coords.longitude, accuracy: p.coords.accuracy }),
      (e) => setError(e.message),
      { enableHighAccuracy: true, maximumAge: 15_000, timeout: 10_000 }
    );
    return () => navigator.geolocation.clearWatch(id);
  }, []);

  return { pos, error };
}
