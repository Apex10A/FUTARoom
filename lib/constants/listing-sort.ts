export const LISTING_SORT_OPTIONS = [
  { id: "newest", label: "Newest first" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
] as const;

export type ListingSort = (typeof LISTING_SORT_OPTIONS)[number]["id"];

export const DEFAULT_LISTING_SORT: ListingSort = "newest";

export const LISTINGS_PAGE_SIZE = 6;

export function getSortLabel(sort: string): string | undefined {
  return LISTING_SORT_OPTIONS.find((option) => option.id === sort)?.label;
}

export function isListingSort(value: string): value is ListingSort {
  return LISTING_SORT_OPTIONS.some((option) => option.id === value);
}
