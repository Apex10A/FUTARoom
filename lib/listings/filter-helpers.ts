import { getAreaLabel } from "@/lib/constants/areas";
import {
  getBudgetLabel,
  getRoomTypeLabel,
} from "@/lib/constants/listing-filters";
import {
  DEFAULT_LISTING_SORT,
  getSortLabel,
} from "@/lib/constants/listing-sort";
import type { ListingSearchFilters } from "@/lib/listings/search-params";
import { buildListingsHref } from "@/lib/listings/search-params";

export type ActiveFilter = {
  key: "area" | "maxPrice" | "roomType" | "sort";
  label: string;
  value: string;
  href: string;
};

export type FilterSelectValues = {
  area: string;
  maxPrice: string;
  roomType: string;
};

export function toFilterSelectValues(
  filters: ListingSearchFilters
): FilterSelectValues {
  return {
    area: filters.area ?? "any",
    maxPrice: filters.maxPrice ?? "any",
    roomType: filters.roomType ?? "any",
  };
}

export function fromFilterSelectValues(
  values: FilterSelectValues
): Pick<ListingSearchFilters, "area" | "maxPrice" | "roomType"> {
  return {
    area: values.area === "any" ? undefined : values.area,
    maxPrice: values.maxPrice === "any" ? undefined : values.maxPrice,
    roomType: values.roomType === "any" ? undefined : values.roomType,
  };
}

export function getActiveFilters(
  filters: ListingSearchFilters,
  sort: string
): ActiveFilter[] {
  const active: ActiveFilter[] = [];

  if (filters.area) {
    active.push({
      key: "area",
      label: "Area",
      value: getAreaLabel(filters.area) ?? filters.area,
      href: buildListingsHref({ ...filters, area: undefined }),
    });
  }

  if (filters.maxPrice) {
    active.push({
      key: "maxPrice",
      label: "Budget",
      value: getBudgetLabel(filters.maxPrice) ?? filters.maxPrice,
      href: buildListingsHref({ ...filters, maxPrice: undefined }),
    });
  }

  if (filters.roomType) {
    active.push({
      key: "roomType",
      label: "Room type",
      value: getRoomTypeLabel(filters.roomType) ?? filters.roomType,
      href: buildListingsHref({ ...filters, roomType: undefined }),
    });
  }

  if (sort !== DEFAULT_LISTING_SORT) {
    active.push({
      key: "sort",
      label: "Sort",
      value: getSortLabel(sort) ?? sort,
      href: buildListingsHref({ ...filters, sort: undefined }),
    });
  }

  return active;
}

export function countSearchFilters(filters: ListingSearchFilters): number {
  return [filters.area, filters.maxPrice, filters.roomType].filter(Boolean).length;
}
