"use client";

import { useCallback, useEffect, useState } from "react";

import {
  readModerationOverrides,
  writeModerationOverride,
} from "@/lib/admin/moderation-storage";
import {
  applyStatusOverrides,
  MOCK_ADMIN_LISTINGS,
} from "@/lib/mock/admin-listings";
import type { AdminListing } from "@/lib/types/admin-listing";
import type { ListingStatus } from "@/lib/types/owner-listing";

export function useAdminModeration() {
  const [listings, setListings] = useState<AdminListing[]>(MOCK_ADMIN_LISTINGS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const overrides = readModerationOverrides();
    setListings(applyStatusOverrides(MOCK_ADMIN_LISTINGS, overrides));
    setReady(true);
  }, []);

  const updateStatus = useCallback((listingId: string, status: ListingStatus) => {
    writeModerationOverride(listingId, status);
    setListings((current) =>
      current.map((listing) =>
        listing.id === listingId ? { ...listing, status } : listing
      )
    );
  }, []);

  const approve = useCallback(
    (listingId: string) => updateStatus(listingId, "approved"),
    [updateStatus]
  );

  const reject = useCallback(
    (listingId: string) => updateStatus(listingId, "rejected"),
    [updateStatus]
  );

  return {
    listings,
    ready,
    approve,
    reject,
    updateStatus,
  };
}
