"use client";

import { useEffect, useState } from "react";

import { ListingFiltersForm } from "@/components/listings/listing-filters-form";
import { ListingFiltersMobileTrigger } from "@/components/listings/listing-filters-sidebar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  countSearchFilters,
  fromFilterSelectValues,
  toFilterSelectValues,
  type FilterSelectValues,
} from "@/lib/listings/filter-helpers";
import type { ListingSearchFilters } from "@/lib/listings/search-params";

type ListingFiltersSheetProps = {
  filters: ListingSearchFilters;
  onApply: (updates: Partial<ListingSearchFilters>) => void;
  onClear: () => void;
};

export function ListingFiltersSheet({
  filters,
  onApply,
  onClear,
}: ListingFiltersSheetProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<FilterSelectValues>(
    toFilterSelectValues(filters)
  );

  useEffect(() => {
    if (open) {
      setDraft(toFilterSelectValues(filters));
    }
  }, [open, filters]);

  function handleApply() {
    onApply(fromFilterSelectValues(draft));
    setOpen(false);
  }

  function handleClear() {
    onClear();
    setOpen(false);
  }

  const filterCount = countSearchFilters(filters);

  return (
    <>
      <ListingFiltersMobileTrigger
        filterCount={filterCount}
        onOpen={() => setOpen(true)}
      />

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-full sm:max-w-sm">
          <SheetHeader>
            <SheetTitle>Filter listings</SheetTitle>
          </SheetHeader>

          <div className="px-4">
            <ListingFiltersForm
              values={draft}
              onChange={setDraft}
              idPrefix="mobile"
            />
          </div>

          <SheetFooter>
            <Button className="w-full" onClick={handleApply}>
              Show results
            </Button>
            <Button variant="outline" className="w-full" onClick={handleClear}>
              Clear filters
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
