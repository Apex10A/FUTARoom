"use client";

import { useRouter } from "next/navigation";

import { ListingBrowseView } from "@/components/listings/listing-browse-view";
import { ListingFilterChips } from "@/components/listings/listing-filter-chips";
import { ListingFiltersSheet } from "@/components/listings/listing-filters-sheet";
import { ListingFiltersSidebar } from "@/components/listings/listing-filters-sidebar";
import { ListingsEmptyState } from "@/components/listings/listings-empty-state";
import type { ListingSort } from "@/lib/constants/listing-sort";
import { getActiveFilters } from "@/lib/listings/filter-helpers";
import type { ListingSearchFilters } from "@/lib/listings/search-params";
import { buildListingsHref } from "@/lib/listings/search-params";
import type { Listing } from "@/lib/types/listing";

type ListingsBrowseShellProps = {
  listings: Listing[];
  sort: ListingSort;
  filters: ListingSearchFilters;
};

export function ListingsBrowseShell({
  listings,
  sort,
  filters,
}: ListingsBrowseShellProps) {
  const router = useRouter();
  const activeFilters = getActiveFilters(filters, sort);

  function applyFilters(updates: Partial<ListingSearchFilters>) {
    router.push(
      buildListingsHref({
        ...filters,
        ...updates,
        sort,
      })
    );
  }

  function clearFilters() {
    router.push(buildListingsHref({ sort }));
  }

  return (
    <>
      <ListingFilterChips activeFilters={activeFilters} filters={filters} />

      {listings.length > 0 ? (
        <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-8">
          <ListingFiltersSidebar
            filters={filters}
            onApply={applyFilters}
            onClear={clearFilters}
          />

          <div>
            <ListingFiltersSheet
              filters={filters}
              onApply={applyFilters}
              onClear={clearFilters}
            />
            <ListingBrowseView
              key={`${sort}-${filters.area ?? ""}-${filters.maxPrice ?? ""}-${filters.roomType ?? ""}`}
              listings={listings}
              sort={sort}
              filters={filters}
            />
          </div>
        </div>
      ) : (
        <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-8">
          <ListingFiltersSidebar
            filters={filters}
            onApply={applyFilters}
            onClear={clearFilters}
          />
          <div>
            <ListingFiltersSheet
              filters={filters}
              onApply={applyFilters}
              onClear={clearFilters}
            />
            <ListingsEmptyState />
          </div>
        </div>
      )}
    </>
  );
}
