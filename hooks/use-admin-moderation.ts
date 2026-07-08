"use client";

import { useCallback, useEffect, useState } from "react";

import {
  fetchAdminListings,
  updateListingStatus,
} from "@/lib/listings/admin-listings";
import type { AdminListing } from "@/lib/types/admin-listing";
import type { ListingStatus } from "@/lib/types/owner-listing";

export function useAdminModeration() {
  const [listings, setListings] = useState<AdminListing[]>([]);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadListings = useCallback(async () => {
    setReady(false);
    const result = await fetchAdminListings();
    setListings(result.listings);
    setLoadError(result.error ?? null);
    setReady(true);
  }, []);

  useEffect(() => {
    void loadListings();
  }, [loadListings]);

  const updateStatus = useCallback(
    async (listingId: string, status: ListingStatus) => {
      setBusyId(listingId);
      setActionError(null);

      const result = await updateListingStatus(listingId, status);

      setBusyId(null);

      if (result.error) {
        setActionError(result.error);
        return false;
      }

      setListings((current) =>
        current.map((listing) =>
          listing.id === listingId ? { ...listing, status } : listing
        )
      );

      return true;
    },
    []
  );

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
    loadError,
    actionError,
    busyId,
    approve,
    reject,
    reload: loadListings,
  };
}
