export const AMENITY_OPTIONS = [
  "Water",
  "Security",
  "WiFi",
  "Generator",
  "Kitchen",
  "Borehole",
  "Parking",
  "AC",
] as const;

export type AmenityOption = (typeof AMENITY_OPTIONS)[number];

export const LISTABLE_ROOM_TYPES = [
  { id: "single", label: "Single room" },
  { id: "self-contain", label: "Self-contain" },
  { id: "two-in-room", label: "2-in-a-room" },
  { id: "three-in-room", label: "3-in-a-room" },
  { id: "flat", label: "Flat / apartment" },
] as const;
