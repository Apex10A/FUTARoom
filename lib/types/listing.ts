export type Listing = {
  id: string;
  title: string;
  areaId: string;
  areaLabel: string;
  pricePerYear: number;
  roomTypeId: string;
  roomTypeLabel: string;
  amenities: string[];
  verified: boolean;
  imageUrl: string;
  distanceToGate?: string;
};
