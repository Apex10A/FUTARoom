import Image from "next/image";
import Link from "next/link";
import { Eye, Pencil } from "lucide-react";

import { ListingStatusBadge } from "@/components/dashboard/owner/listing-status-badge";
import { Button } from "@/components/ui/button";
import type { OwnerListing } from "@/lib/types/owner-listing";
import { formatListedDate, formatNaira } from "@/lib/utils/format";

type OwnerListingsTableProps = {
  listings: OwnerListing[];
};

export function OwnerListingsTable({ listings }: OwnerListingsTableProps) {
  if (listings.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/30 p-10 text-center">
        <p className="font-medium text-foreground">No listings yet</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Add your first property to reach students searching around FUTA.
        </p>
        <Button className="mt-4" render={<Link href="/dashboard/owner/listings/new" />}>
          Add listing
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border bg-muted/40 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Property</th>
              <th className="px-4 py-3 font-medium">Area</th>
              <th className="px-4 py-3 font-medium">Price / year</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Listed</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((listing) => (
              <tr key={listing.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative size-12 overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={listing.imageUrl}
                        alt={listing.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {listing.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {listing.roomTypeLabel}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {listing.areaLabel}
                </td>
                <td className="px-4 py-3 font-medium text-foreground">
                  {formatNaira(listing.pricePerYear)}
                </td>
                <td className="px-4 py-3">
                  <ListingStatusBadge status={listing.status} />
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatListedDate(listing.listedAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    {listing.status === "approved" && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        render={<Link href={`/listings/${listing.id}`} />}
                        aria-label="View listing"
                      >
                        <Eye className="size-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      disabled
                      aria-label="Edit listing (coming soon)"
                    >
                      <Pencil className="size-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
