import { getRoute, haversineDistance } from "./routing";

export async function calculateEta(
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number,
  avgSpeedKmh: number
): Promise<{ eta: Date; distanceKm: number }> {
  const route = await getRoute(originLat, originLng, destLat, destLng);
  const distanceKm = route ? route.distanceKm : haversineDistance(originLat, originLng, destLat, destLng);

  const travelTimeHours = distanceKm / avgSpeedKmh;
  const eta = new Date(Date.now() + travelTimeHours * 3600000);

  return { eta, distanceKm };
}
