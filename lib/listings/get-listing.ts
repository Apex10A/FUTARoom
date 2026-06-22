import { MOCK_LISTINGS } from "@/lib/mock/listings";
import { LISTING_DETAILS } from "@/lib/mock/listing-details";
import type { Listing } from "@/lib/types/listing";

export function getListingById(id: string): Listing | undefined {
  const listing = MOCK_LISTINGS.find((item) => item.id === id);
  if (!listing) {
    return undefined;
  }

  const details = LISTING_DETAILS[id];
  if (!details) {
    return listing;
  }

  return {
    ...listing,
    ...details,
    images: details.images ?? [listing.imageUrl],
  };
}

export function getSimilarListings(
  listing: Listing,
  limit = 3
): Listing[] {
  return MOCK_LISTINGS
    .filter(
      (item) =>
        item.id !== listing.id && item.areaId === listing.areaId
    )
    .slice(0, limit)
    .map((item) => getListingById(item.id)!);
}
