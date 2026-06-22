import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ListingGrid } from "@/components/listings/listing-grid";
import { Button } from "@/components/ui/button";
import { MOCK_LISTINGS } from "@/lib/mock/listings";

const FEATURED_LISTINGS = MOCK_LISTINGS.filter((listing) => listing.verified).slice(
  0,
  3
);

export function FeaturedListings() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Featured listings
          </h2>
          <p className="mt-1 text-muted-foreground">
            Verified lodges students are viewing right now.
          </p>
        </div>
        <Button variant="outline" render={<Link href="/listings" />}>
          View all
          <ArrowRight className="size-4" />
        </Button>
      </div>
      <ListingGrid listings={FEATURED_LISTINGS} />
    </section>
  );
}
