export function haversineKm(a, b) {
    if (!a || !b) return null;
    const toRad = (x) => (x * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const s1 = Math.sin(dLat/2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng/2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(s1), Math.sqrt(1-s1));
    return R * c;
  }
  