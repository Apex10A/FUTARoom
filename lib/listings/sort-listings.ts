import {
  DEFAULT_LISTING_SORT,
  type ListingSort,
  isListingSort,
} from "@/lib/constants/listing-sort";
import type { Listing } from "@/lib/types/listing";

export function sortListings(
  listings: Listing[],
  sort: ListingSort = DEFAULT_LISTING_SORT
): Listing[] {
  const copy = [...listings];

  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => a.pricePerYear - b.pricePerYear);
    case "price-desc":
      return copy.sort((a, b) => b.pricePerYear - a.pricePerYear);
    case "newest":
      return copy.sort((a, b) => b.listedAt.localeCompare(a.listedAt));
    default:
      return copy;
  }
}

export function parseListingSort(value: string | undefined): ListingSort {
  if (value && isListingSort(value)) {
    return value;
  }
  return DEFAULT_LISTING_SORT;
}
