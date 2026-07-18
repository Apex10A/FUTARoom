import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ListingGrid } from "@/components/listings/listing-grid";
import { SectionHeading } from "@/components/landing/section-heading";
import { Button } from "@/components/ui/button";
import { groupListingsForBrowse } from "@/lib/listings/group-listings";
import { getApprovedListings } from "@/lib/listings/get-listing";

export async function FeaturedListings() {
  const allListings = await getApprovedListings();
  const grouped = groupListingsForBrowse(allListings);
  const featured = grouped.filter((listing) => listing.verified).slice(0, 3);

  if (featured.length === 0) {
    return null;
  }

  return (
    <section className="bg-background py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <SectionHeading
            title="Featured listings"
            subtitle="Verified lodges students are viewing right now. Compare agent prices where multiple offers exist."
            align="left"
            theme="dark"
          />
          <div className="mt-6 flex justify-start sm:justify-end">
            <Button
              variant="outline"
              className="border-white/15 bg-white/5 hover:bg-white/10"
              render={<Link href="/listings" />}
            >
              View all
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
        <ListingGrid listings={featured} />
      </div>
    </section>
  );
}
