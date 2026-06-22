import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

import { ListingBrowseView } from "@/components/listings/listing-browse-view";
import {
  ListingsEmptyState,
} from "@/components/listings/listings-empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAreaLabel } from "@/lib/constants/areas";
import {
  getBudgetLabel,
  getRoomTypeLabel,
} from "@/lib/constants/listing-filters";
import { getSortLabel } from "@/lib/constants/listing-sort";
import { filterListings } from "@/lib/listings/filter-listings";
import { MOCK_LISTINGS } from "@/lib/mock/listings";
import { parseListingSearchParams } from "@/lib/listings/search-params";
import { parseListingSort, sortListings } from "@/lib/listings/sort-listings";

type ListingsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ListingsPage({ searchParams }: ListingsPageProps) {
  const params = await searchParams;
  const filters = parseListingSearchParams(params);
  const sort = parseListingSort(filters.sort);
  const filtered = filterListings(MOCK_LISTINGS, filters);
  const listings = sortListings(filtered, sort);

  const activeFilters = [
    filters.area && {
      label: "Area",
      value: getAreaLabel(filters.area) ?? filters.area,
    },
    filters.maxPrice && {
      label: "Budget",
      value: getBudgetLabel(filters.maxPrice) ?? filters.maxPrice,
    },
    filters.roomType && {
      label: "Room type",
      value: getRoomTypeLabel(filters.roomType) ?? filters.roomType,
    },
    sort !== "newest" && {
      label: "Sort",
      value: getSortLabel(sort) ?? sort,
    },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="mb-2 -ml-2"
            render={<Link href="/" />}
          >
            <ArrowLeft className="size-4" />
            Back to home
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Browse listings
          </h1>
          <p className="mt-1 text-muted-foreground">
            {listings.length}{" "}
            {listings.length === 1 ? "property" : "properties"} available
            {activeFilters.length > 0 ? " matching your search" : ""}
          </p>
        </div>
        <Button variant="outline" render={<Link href="/" />}>
          <Search className="size-4" />
          New search
        </Button>
      </div>

      {activeFilters.length > 0 && (
        <div className="mb-6 rounded-xl border border-border bg-card p-4">
          <p className="text-sm font-medium text-foreground">Active filters</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <Badge key={filter.label} variant="secondary">
                {filter.label}: {filter.value}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {listings.length > 0 ? (
        <ListingBrowseView
          key={`${sort}-${filters.area ?? ""}-${filters.maxPrice ?? ""}-${filters.roomType ?? ""}`}
          listings={listings}
          sort={sort}
          filters={filters}
        />
      ) : (
        <ListingsEmptyState />
      )}
    </div>
  );
}
