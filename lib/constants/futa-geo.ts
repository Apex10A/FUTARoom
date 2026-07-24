/** FUTA Akure campus — approximate center for map defaults */
export const FUTA_CAMPUS = {
  lat: 7.2574,
  lng: 5.141,
  label: "FUTA Campus",
} as const;

/** Approximate area centroids for simulated lodge pins */
export const FUTA_AREA_CENTROIDS: Record<string, { lat: number; lng: number }> =
  {
    "south-gate": { lat: 7.252, lng: 5.138 },
    "north-gate": { lat: 7.262, lng: 5.142 },
    "west-gate": { lat: 7.258, lng: 5.132 },
    alagbaka: { lat: 7.268, lng: 5.152 },
    lafe: { lat: 7.235, lng: 5.142 },
    "oke-odu": { lat: 7.25, lng: 5.175 },
    ibule: { lat: 7.245, lng: 5.155 },
    apatapiti: { lat: 7.24, lng: 5.148 },
    "ondo-road": { lat: 7.248, lng: 5.165 },
    "akure-town": { lat: 7.252, lng: 5.195 },
    "futa-community": { lat: 7.259, lng: 5.145 },
  };

export function getAreaCentroid(areaId: string): { lat: number; lng: number } {
  return FUTA_AREA_CENTROIDS[areaId] ?? FUTA_CAMPUS;
}
