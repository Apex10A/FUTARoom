import { ListingCard } from "@/components/listings/listing-card";
import { ListingCardSkeleton } from "@/components/listings/listing-card-skeleton";
import type { Listing, PropertyBrowseItem } from "@/lib/types/listing";

type ListingGridProps = {
  listings: Array<Listing | PropertyBrowseItem>;
  loading?: boolean;
  skeletonCount?: number;
};

export function ListingGrid({
  listings,
  loading = false,
  skeletonCount = 6,
}: ListingGridProps) {
  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <ListingCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((listing) => (
        <ListingCard
          key={
            "propertyGroupId" in listing
              ? listing.propertyGroupId
              : listing.id
          }
          listing={listing}
        />
      ))}
    </div>
  );
}
