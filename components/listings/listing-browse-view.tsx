"use client";

import { LayoutGrid, Map } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ListingGrid } from "@/components/listings/listing-grid";
import { ListingsBrowseMap } from "@/components/listings/listings-browse-map";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LISTING_SORT_OPTIONS,
  LISTINGS_PAGE_SIZE,
  type ListingSort,
} from "@/lib/constants/listing-sort";
import type { ListingSearchFilters } from "@/lib/listings/search-params";
import { buildListingsHref } from "@/lib/listings/search-params";
import type { PropertyBrowseItem } from "@/lib/types/listing";

type ListingBrowseViewProps = {
  listings: PropertyBrowseItem[];
  sort: ListingSort;
  filters: ListingSearchFilters;
};

export function ListingBrowseView({
  listings,
  sort,
  filters,
}: ListingBrowseViewProps) {
  const router = useRouter();
  const [visibleCount, setVisibleCount] = useState(LISTINGS_PAGE_SIZE);
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  const visibleListings = listings.slice(0, visibleCount);
  const hasMore = visibleCount < listings.length;
  const remainingCount = listings.length - visibleCount;

  function handleSortChange(value: string | null) {
    if (!value) return;
    router.push(
      buildListingsHref({
        ...filters,
        sort: value as ListingSort,
      })
    );
  }

  function handleLoadMore() {
    setVisibleCount((count) =>
      Math.min(count + LISTINGS_PAGE_SIZE, listings.length)
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {viewMode === "map" ? listings.length : visibleListings.length}{" "}
          of {listings.length} results
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg border border-white/10 p-0.5">
            <Button
              type="button"
              size="sm"
              variant={viewMode === "grid" ? "default" : "ghost"}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="size-4" />
              Grid
            </Button>
            <Button
              type="button"
              size="sm"
              variant={viewMode === "map" ? "default" : "ghost"}
              onClick={() => setViewMode("map")}
            >
              <Map className="size-4" />
              Map
            </Button>
          </div>

          <Label htmlFor="listing-sort" className="text-sm text-muted-foreground">
            Sort by
          </Label>
          <Select value={sort} onValueChange={handleSortChange}>
            <SelectTrigger id="listing-sort" className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LISTING_SORT_OPTIONS.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {viewMode === "map" ? (
        <ListingsBrowseMap listings={listings} />
      ) : (
        <>
          <ListingGrid listings={visibleListings} />

          {hasMore && (
            <div className="flex justify-center pt-2">
              <Button variant="outline" onClick={handleLoadMore}>
                Load more ({remainingCount} remaining)
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
