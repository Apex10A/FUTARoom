import { getAreaCentroid } from "@/lib/constants/futa-geo";

/** Deterministic offset so simulated pins spread within ~600 m of an area center */
function hashSeed(seed: string): number {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) | 0;
  }
  return Math.abs(hash);
}

function jitterFromSeed(seed: string, axis: "lat" | "lng"): number {
  const hash = hashSeed(`${seed}:${axis}`);
  const normalized = (hash % 10_000) / 10_000 - 0.5;
  return normalized * 0.012;
}

/** Simulated coordinates for demo / supervisor seed data */
export function simulateListingCoordinates(
  areaId: string,
  seed: string
): { latitude: number; longitude: number } {
  const centroid = getAreaCentroid(areaId);

  return {
    latitude: centroid.lat + jitterFromSeed(seed, "lat"),
    longitude: centroid.lng + jitterFromSeed(seed, "lng"),
  };
}

export function hasListingCoordinates(listing: {
  latitude?: number | null;
  longitude?: number | null;
}): listing is { latitude: number; longitude: number } {
  return (
    typeof listing.latitude === "number" &&
    typeof listing.longitude === "number" &&
    Number.isFinite(listing.latitude) &&
    Number.isFinite(listing.longitude)
  );
}
