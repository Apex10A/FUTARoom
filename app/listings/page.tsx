import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAreaLabel } from "@/lib/constants/areas";
import {
  getBudgetLabel,
  getRoomTypeLabel,
} from "@/lib/constants/listing-filters";
import { parseListingSearchParams } from "@/lib/listings/search-params";

type ListingsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ListingsPage({ searchParams }: ListingsPageProps) {
  const params = await searchParams;
  const filters = parseListingSearchParams(params);

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
            Listing grid and filters coming soon — your search is wired up.
          </p>
        </div>
        <Button variant="outline" render={<Link href="/" />}>
          <Search className="size-4" />
          New search
        </Button>
      </div>

      {activeFilters.length > 0 ? (
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm font-medium text-foreground">Active filters</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <Badge key={filter.label} variant="secondary">
                {filter.label}: {filter.value}
              </Badge>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center">
          <p className="text-muted-foreground">
            No filters applied. Use the search bar on the home page to narrow
            results by area, budget, or room type.
          </p>
          <Button className="mt-4" render={<Link href="/" />}>
            Search from home
          </Button>
        </div>
      )}
    </div>
  );
}
