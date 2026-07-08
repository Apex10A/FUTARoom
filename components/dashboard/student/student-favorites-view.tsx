"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

import { ListingGrid } from "@/components/listings/listing-grid";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/use-favorites";
import { fetchFavoriteListings } from "@/lib/favorites/supabase-favorites";
import type { Listing } from "@/lib/types/listing";

export function StudentFavoritesView() {
  const { favoriteIds, ready, error, removeFavorite } = useFavorites();
  const [listings, setListings] = useState<Listing[]>([]);
  const [listingsReady, setListingsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadListings() {
      if (!ready) {
        return;
      }

      setListingsReady(false);

      if (favoriteIds.length === 0) {
        if (!cancelled) {
          setListings([]);
          setListingsReady(true);
        }
        return;
      }

      const results = await fetchFavoriteListings(favoriteIds);

      if (!cancelled) {
        setListings(results);
        setListingsReady(true);
      }
    }

    void loadListings();

    return () => {
      cancelled = true;
    };
  }, [favoriteIds, ready]);

  if (!ready || !listingsReady) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        Loading your saved listings...
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-muted/30 px-6 py-14 text-center">
        <Heart className="size-10 text-muted-foreground" />
        <h2 className="mt-4 text-lg font-semibold text-foreground">
          No saved listings yet
        </h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Tap the heart on any listing to save it here and compare options
          before you contact an owner.
        </p>
        <Button className="mt-6" render={<Link href="/listings" />}>
          Browse listings
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {listings.length} saved {listings.length === 1 ? "listing" : "listings"}
        </p>
        <p className="text-xs text-muted-foreground">
          Synced to your FUTARoom account
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <ListingGrid listings={listings} />

      <div className="rounded-xl border border-border bg-muted/30 p-4">
        <p className="text-sm font-medium text-foreground">Quick actions</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {listings.map((listing) => (
            <Button
              key={listing.id}
              variant="outline"
              size="sm"
              onClick={() => void removeFavorite(listing.id)}
            >
              Remove {listing.title}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
