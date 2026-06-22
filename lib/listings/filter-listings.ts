import type { ListingSearchFilters } from "@/lib/listings/search-params";
import type { Listing } from "@/lib/types/listing";

export function filterListings(
  listings: Listing[],
  filters: ListingSearchFilters
): Listing[] {
  return listings.filter((listing) => {
    if (filters.area && listing.areaId !== filters.area) {
      return false;
    }

    if (filters.maxPrice) {
      const max = Number(filters.maxPrice);
      if (!Number.isNaN(max) && listing.pricePerYear > max) {
        return false;
      }
    }

    if (filters.roomType && listing.roomTypeId !== filters.roomType) {
      return false;
    }

    return true;
  });
}
