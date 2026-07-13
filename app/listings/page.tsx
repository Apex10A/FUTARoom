import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

import { ListingsBrowseShell } from "@/components/listings/listings-browse-shell";
import { Button } from "@/components/ui/button";
import { countSearchFilters } from "@/lib/listings/filter-helpers";
import {
  filterPropertyBrowseItems,
  groupListingsForBrowse,
  sortPropertyBrowseItems,
} from "@/lib/listings/group-listings";
import { getApprovedListings } from "@/lib/listings/get-listing";
import { parseListingSearchParams } from "@/lib/listings/search-params";
import { parseListingSort } from "@/lib/listings/sort-listings";

type ListingsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ListingsPage({ searchParams }: ListingsPageProps) {
  const params = await searchParams;
  const filters = parseListingSearchParams(params);
  const sort = parseListingSort(filters.sort);
  const allListings = await getApprovedListings();
  const grouped = groupListingsForBrowse(allListings);
  const filtered = filterPropertyBrowseItems(grouped, filters);
  const listings = sortPropertyBrowseItems(filtered, sort);
  const filterCount = countSearchFilters(filters);

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
            {filterCount > 0
              ? ` · ${filterCount} filter${filterCount === 1 ? "" : "s"} applied`
              : ""}
            {" · "}
            One card per lodge — compare agent prices on the detail page
          </p>
        </div>
        <Button variant="outline" render={<Link href="/" />}>
          <Search className="size-4" />
          New search
        </Button>
      </div>

      <ListingsBrowseShell listings={listings} sort={sort} filters={filters} />
    </div>
  );
}
