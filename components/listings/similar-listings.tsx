import { ListingGrid } from "@/components/listings/listing-grid";
import type { Listing } from "@/lib/types/listing";

type SimilarListingsProps = {
  listings: Listing[];
  areaLabel: string;
};

export function SimilarListings({ listings, areaLabel }: SimilarListingsProps) {
  if (listings.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 border-t border-border pt-10">
      <h2 className="text-xl font-semibold text-foreground">
        More in {areaLabel}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Similar listings students are comparing in this area.
      </p>
      <div className="mt-6">
        <ListingGrid listings={listings} />
      </div>
    </section>
  );
}
