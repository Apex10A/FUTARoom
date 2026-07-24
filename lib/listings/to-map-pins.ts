import type { PropertyBrowseItem } from "@/lib/types/listing";
import { hasListingCoordinates } from "@/lib/listings/listing-coordinates";
import { formatNaira } from "@/lib/utils/format";

export type ListingMapPin = {
  id: string;
  title: string;
  areaLabel: string;
  latitude: number;
  longitude: number;
  priceLabel: string;
  href: string;
  offerCount?: number;
};

export function toListingMapPins(
  listings: PropertyBrowseItem[]
): ListingMapPin[] {
  return listings
    .filter(hasListingCoordinates)
    .map((listing) => ({
      id: listing.propertyGroupId,
      title: listing.title,
      areaLabel: listing.areaLabel,
      latitude: listing.latitude!,
      longitude: listing.longitude!,
      priceLabel:
        listing.offerCount > 1
          ? `from ${formatNaira(listing.minPricePerYear)}`
          : formatNaira(listing.pricePerYear),
      href: `/listings/${listing.displayListingId}`,
      offerCount: listing.offerCount,
    }));
}
