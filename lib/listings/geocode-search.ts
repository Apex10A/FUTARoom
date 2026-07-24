export type GeocodeResult = {
  displayName: string;
  latitude: number;
  longitude: number;
};

/** Rough bounding box around Akure + FUTA environs (lon1,lat1,lon2,lat2) */
const AKURE_VIEWBOX = "5.00,7.05,5.35,7.40";

/**
 * Free-text address/landmark search using OpenStreetMap's public Nominatim
 * geocoder, scoped to the Akure area. This only helps an owner jump the map
 * roughly to the right spot — they still confirm the exact location by
 * dragging the pin, since many lodges and compounds around FUTA aren't
 * individually mapped and won't return a match.
 */
export async function searchAkureAddress(
  query: string
): Promise<GeocodeResult[]> {
  const trimmed = query.trim();
  if (trimmed.length < 3) {
    return [];
  }

  const params = new URLSearchParams({
    q: trimmed,
    format: "jsonv2",
    limit: "6",
    countrycodes: "ng",
    viewbox: AKURE_VIEWBOX,
    bounded: "1",
  });

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?${params.toString()}`,
      { headers: { Accept: "application/json" } }
    );

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as Array<{
      display_name: string;
      lat: string;
      lon: string;
    }>;

    return data
      .map((item) => ({
        displayName: item.display_name,
        latitude: Number(item.lat),
        longitude: Number(item.lon),
      }))
      .filter(
        (item) => Number.isFinite(item.latitude) && Number.isFinite(item.longitude)
      );
  } catch {
    return [];
  }
}
