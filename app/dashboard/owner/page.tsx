import { OwnerListingStats } from "@/components/dashboard/owner/owner-listing-stats";
import { OwnerListingsTable } from "@/components/dashboard/owner/owner-listings-table";
import {
  getOwnerListingStats,
  MOCK_OWNER_LISTINGS,
} from "@/lib/mock/owner-listings";

export default function OwnerDashboardPage() {
  const stats = getOwnerListingStats(MOCK_OWNER_LISTINGS);

  return (
    <div className="space-y-6">
      <OwnerListingStats
        total={stats.total}
        approved={stats.approved}
        pending={stats.pending}
        rejected={stats.rejected}
      />
      <OwnerListingsTable listings={MOCK_OWNER_LISTINGS} />
    </div>
  );
}
