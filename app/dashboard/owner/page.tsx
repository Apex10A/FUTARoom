import { OwnerListingStats } from "@/components/dashboard/owner/owner-listing-stats";
import { OwnerListingsTable } from "@/components/dashboard/owner/owner-listings-table";
import {
  fetchOwnerListings,
  getOwnerListingStats,
} from "@/lib/listings/owner-listings";

export default async function OwnerDashboardPage() {
  const listings = await fetchOwnerListings();
  const stats = getOwnerListingStats(listings);

  return (
    <div className="space-y-6">
      <OwnerListingStats
        total={stats.total}
        approved={stats.approved}
        pending={stats.pending}
        rejected={stats.rejected}
      />
      <OwnerListingsTable listings={listings} />
    </div>
  );
}
