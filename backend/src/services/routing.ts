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

import { haversineDistance } from "../utils/geo";
export { haversineDistance };
