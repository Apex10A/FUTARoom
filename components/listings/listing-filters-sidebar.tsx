"use client";

import { SlidersHorizontal } from "lucide-react";

import { ListingFiltersForm } from "@/components/listings/listing-filters-form";
import { Button } from "@/components/ui/button";
import {
  fromFilterSelectValues,
  toFilterSelectValues,
  type FilterSelectValues,
} from "@/lib/listings/filter-helpers";
import type { ListingSearchFilters } from "@/lib/listings/search-params";

type ListingFiltersSidebarProps = {
  filters: ListingSearchFilters;
  onApply: (updates: Partial<ListingSearchFilters>) => void;
  onClear: () => void;
};

export function ListingFiltersSidebar({
  filters,
  onApply,
  onClear,
}: ListingFiltersSidebarProps) {
  const values = toFilterSelectValues(filters);

  function handleChange(nextValues: FilterSelectValues) {
    onApply(fromFilterSelectValues(nextValues));
  }

  return (
    <aside className="hidden lg:block">
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Filters</h2>
          <Button variant="ghost" size="sm" onClick={onClear}>
            Clear
          </Button>
        </div>
        <ListingFiltersForm
          values={values}
          onChange={handleChange}
          idPrefix="sidebar"
        />
      </div>
    </aside>
  );
}

export function ListingFiltersMobileTrigger({
  filterCount,
  onOpen,
}: {
  filterCount: number;
  onOpen: () => void;
}) {
  return (
    <Button
      variant="outline"
      className="mb-4 w-full sm:w-auto lg:hidden"
      onClick={onOpen}
    >
      <SlidersHorizontal className="size-4" />
      Filters
      {filterCount > 0 && (
        <span className="rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
          {filterCount}
        </span>
      )}
    </Button>
  );
}
