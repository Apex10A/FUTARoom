"use client";

import Link from "next/link";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ActiveFilter } from "@/lib/listings/filter-helpers";
import { buildListingsHref } from "@/lib/listings/search-params";
import type { ListingSearchFilters } from "@/lib/listings/search-params";

type ListingFilterChipsProps = {
  activeFilters: ActiveFilter[];
  filters: ListingSearchFilters;
};

export function ListingFilterChips({
  activeFilters,
  filters,
}: ListingFilterChipsProps) {
  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 rounded-xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-foreground">Active filters</p>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          render={<Link href={buildListingsHref({ sort: filters.sort })} />}
        >
          Clear all
        </Button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {activeFilters.map((filter) => (
          <Badge
            key={filter.key}
            variant="secondary"
            className="gap-1 pr-1.5"
          >
            {filter.label}: {filter.value}
            <Link
              href={filter.href}
              className="rounded-full p-0.5 hover:bg-muted"
              aria-label={`Remove ${filter.label} filter`}
            >
              <X className="size-3" />
            </Link>
          </Badge>
        ))}
      </div>
    </div>
  );
}
