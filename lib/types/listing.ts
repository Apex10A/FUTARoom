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
  videoUrl?: string;
  listedAt: string;
  distanceToGate?: string;
  /** Owner-supplied landmark for lodges that aren't well mapped on OSM */
  nearestLandmark?: string;
  description?: string;
  images?: string[];
  /** Owner-pinned map location, set when the listing was created */
  latitude?: number;
  longitude?: number;
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
