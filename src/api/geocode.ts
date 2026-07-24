import client from "./client";

export interface GeocodeResult {
  lat: number;
  lng: number;
  displayName: string;
}

export async function geocodeAddress(
  query: string
): Promise<GeocodeResult[]> {
  const { data } = await client.get<GeocodeResult[]>("/geocode", {
    params: { q: query },
  });
  return data;
}
