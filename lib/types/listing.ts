export type ListingOwner = {
  name: string;
  phone: string;
  responseLabel?: string;
};

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
  listedAt: string;
  distanceToGate?: string;
  description?: string;
  images?: string[];
  owner?: ListingOwner;
};
