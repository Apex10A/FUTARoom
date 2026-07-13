import type { ListingSort } from "@/lib/constants/listing-sort";
import type { Listing, PropertyBrowseItem } from "@/lib/types/listing";

function getGroupKey(listing: Listing): string {
  return listing.propertyGroupId ?? listing.id;
}

/** Collapse multiple agent offers into one browse card per lodge */
export function groupListingsForBrowse(listings: Listing[]): PropertyBrowseItem[] {
  const groups = new Map<string, Listing[]>();

  for (const listing of listings) {
    const key = getGroupKey(listing);
    const existing = groups.get(key) ?? [];
    existing.push(listing);
    groups.set(key, existing);
  }

  return Array.from(groups.entries()).map(([groupId, offers]) => {
    const sortedByPrice = [...offers].sort(
      (a, b) => a.pricePerYear - b.pricePerYear
    );
    const cheapest = sortedByPrice[0];
    const prices = offers.map((offer) => offer.pricePerYear);
    const newestListedAt = offers
      .map((offer) => offer.listedAt)
      .sort()
      .reverse()[0];

    return {
      ...cheapest,
      propertyGroupId: groupId,
      offerCount: offers.length,
      minPricePerYear: Math.min(...prices),
      maxPricePerYear: Math.max(...prices),
      displayListingId: cheapest.id,
      listedAt: newestListedAt,
      verified: offers.some((offer) => offer.verified),
    };
  });
}

export function filterPropertyBrowseItems(
  items: PropertyBrowseItem[],
  filters: {
    area?: string;
    maxPrice?: string;
    roomType?: string;
  }
): PropertyBrowseItem[] {
  return items.filter((item) => {
    if (filters.area && item.areaId !== filters.area) {
      return false;
    }

    if (filters.maxPrice) {
      const max = Number(filters.maxPrice);
      if (!Number.isNaN(max) && item.minPricePerYear > max) {
        return false;
      }
    }

    if (filters.roomType && item.roomTypeId !== filters.roomType) {
      return false;
    }

    return true;
  });
}

export function sortPropertyBrowseItems(
  items: PropertyBrowseItem[],
  sort: ListingSort
): PropertyBrowseItem[] {
  const copy = [...items];

  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => a.minPricePerYear - b.minPricePerYear);
    case "price-desc":
      return copy.sort((a, b) => b.maxPricePerYear - a.maxPricePerYear);
    case "newest":
      return copy.sort((a, b) => b.listedAt.localeCompare(a.listedAt));
    default:
      return copy;
  }
}

/** All approved offers for the same lodge group */
export function getOffersInGroup(
  listings: Listing[],
  propertyGroupId: string
): Listing[] {
  return listings
    .filter((listing) => getGroupKey(listing) === propertyGroupId)
    .sort((a, b) => a.pricePerYear - b.pricePerYear);
}
