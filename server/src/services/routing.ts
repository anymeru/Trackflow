import { config } from "../config/env";

export interface RouteResult {
  distanceKm: number;
  durationSeconds: number;
}

export async function getRoute(
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number
): Promise<RouteResult | null> {
  try {
    const url = `${config.osrmBaseUrl}/route/v1/driving/${originLng},${originLat};${destLng},${destLat}?overview=false`;

    const response = await fetch(url);
    if (!response.ok) return null;

    const data = (await response.json()) as {
      code: string;
      routes: Array<{ distance: number; duration: number }>;
    };

    if (data.code !== "Ok" || !data.routes.length) return null;

    return {
      distanceKm: data.routes[0].distance / 1000,
      durationSeconds: data.routes[0].duration,
    };
  } catch {
    return null;
  }
}

export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
