export type FutaArea = {
  id: string;
  label: string;
  description?: string;
};

export const FUTA_AREAS: FutaArea[] = [
  { id: "south-gate", label: "South Gate", description: "Close to main student axis" },
  { id: "north-gate", label: "North Gate" },
  { id: "west-gate", label: "West Gate" },
  { id: "alagbaka", label: "Alagbaka" },
  { id: "lafe", label: "Lafe" },
  { id: "oke-odu", label: "Oke Odu" },
  { id: "ibule", label: "Ibule" },
  { id: "apatapiti", label: "Apatapiti" },
  { id: "ondo-road", label: "Ondo Road" },
  { id: "akure-town", label: "Akure Township" },
  { id: "futa-community", label: "FUTA Community" },
];

export const POPULAR_AREAS = FUTA_AREAS.slice(0, 5);

export function getAreaLabel(id: string): string | undefined {
  return FUTA_AREAS.find((area) => area.id === id)?.label;
}
