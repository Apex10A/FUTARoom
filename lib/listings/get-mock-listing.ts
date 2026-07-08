import { MOCK_LISTINGS } from "@/lib/mock/listings";
import { LISTING_DETAILS } from "@/lib/mock/listing-details";
import type { Listing } from "@/lib/types/listing";

/** Client-side fallback while favorites still use mock IDs in localStorage. */
export function getMockListingById(id: string): Listing | undefined {
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
