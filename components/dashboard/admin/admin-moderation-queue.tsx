"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Eye, X } from "lucide-react";
import { useMemo, useState } from "react";

import { ListingStatusBadge } from "@/components/dashboard/owner/listing-status-badge";
import { AdminStats } from "@/components/dashboard/admin/admin-stats";
import { Button } from "@/components/ui/button";
import { useAdminModeration } from "@/hooks/use-admin-moderation";
import { getAdminListingStats } from "@/lib/listings/admin-listings";
import type { AdminListingTab } from "@/lib/types/admin-listing";
import { formatListedDate, formatNaira } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

const TABS: { id: AdminListingTab; label: string }[] = [
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
  { id: "all", label: "All" },
];

export function AdminModerationQueue() {
  const { listings, ready, loadError, actionError, busyId, approve, reject } =
    useAdminModeration();
  const [activeTab, setActiveTab] = useState<AdminListingTab>("pending");
  const [lastAction, setLastAction] = useState<string | null>(null);

  const stats = getAdminListingStats(listings);

  const filtered = useMemo(() => {
    if (activeTab === "all") return listings;
    return listings.filter((listing) => listing.status === activeTab);
  }, [listings, activeTab]);

  async function handleApprove(id: string, title: string) {
    const ok = await approve(id);
    if (ok) {
      setLastAction(`Approved "${title}" — now live on browse`);
    }
  }

  async function handleReject(id: string, title: string) {
    const ok = await reject(id);
    if (ok) {
      setLastAction(`Rejected "${title}"`);
    }
  }

  if (!ready) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        Loading moderation queue...
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-8 text-center">
        <p className="font-medium text-foreground">Could not load moderation queue</p>
        <p className="mt-2 text-sm text-muted-foreground">{loadError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminStats
        total={stats.total}
        pending={stats.pending}
        approved={stats.approved}
        rejected={stats.rejected}
        owners={stats.owners}
      />

      {lastAction && (
        <div className="rounded-lg border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-foreground">
          {lastAction}
        </div>
      )}

      {actionError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {actionError}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const count =
            tab.id === "all"
              ? listings.length
              : listings.filter((item) => item.status === tab.id).length;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label} ({count})
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/30 p-10 text-center">
          <p className="font-medium text-foreground">No listings in this queue</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Switch tabs to review other submission statuses.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((listing) => (
            <article
              key={listing.id}
              className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-lg bg-muted sm:h-32 sm:w-40">
                  <Image
                    src={listing.imageUrl}
                    alt={listing.title}
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {listing.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {listing.areaLabel} · {listing.roomTypeLabel} ·{" "}
                        {formatNaira(listing.pricePerYear)}/yr
                      </p>
                    </div>
                    <ListingStatusBadge status={listing.status} />
                  </div>

                  <div className="grid gap-2 text-sm sm:grid-cols-2">
                    <p className="text-muted-foreground">
                      Owner:{" "}
                      <span className="text-foreground">{listing.ownerName}</span>
                    </p>
                    <p className="text-muted-foreground">
                      Phone:{" "}
                      <span className="text-foreground">{listing.ownerPhone}</span>
                    </p>
                    <p className="text-muted-foreground">
                      Submitted:{" "}
                      <span className="text-foreground">
                        {formatListedDate(listing.listedAt)}
                      </span>
                    </p>
                    <p className="text-muted-foreground">
                      Listing ID:{" "}
                      <span className="font-mono text-foreground">{listing.id}</span>
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {listing.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          disabled={busyId === listing.id}
                          onClick={() =>
                            void handleApprove(listing.id, listing.title)
                          }
                        >
                          <Check className="size-4" />
                          {busyId === listing.id ? "Saving..." : "Approve"}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={busyId === listing.id}
                          onClick={() =>
                            void handleReject(listing.id, listing.title)
                          }
                        >
                          <X className="size-4" />
                          Reject
                        </Button>
                      </>
                    )}

                    {listing.status === "approved" && (
                      <Button
                        size="sm"
                        variant="outline"
                        render={<Link href={`/listings/${listing.id}`} />}
                      >
                        <Eye className="size-4" />
                        View live listing
                      </Button>
                    )}

                    {listing.status === "rejected" && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busyId === listing.id}
                        onClick={() =>
                          void handleApprove(listing.id, listing.title)
                        }
                      >
                        <Check className="size-4" />
                        {busyId === listing.id ? "Saving..." : "Approve anyway"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
