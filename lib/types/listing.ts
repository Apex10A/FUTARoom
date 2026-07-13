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
  /** Shared group ID when multiple agents list the same lodge */
  propertyGroupId?: string | null;
};

/** One card in browse — may represent multiple agent offers */
export type PropertyBrowseItem = Listing & {
  propertyGroupId: string;
  offerCount: number;
  minPricePerYear: number;
  maxPricePerYear: number;
  /** Cheapest offer — used for /listings/[id] link */
  displayListingId: string;
};
