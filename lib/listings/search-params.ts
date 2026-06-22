export type ListingSearchFilters = {
  area?: string;
  maxPrice?: string;
  roomType?: string;
};

export function buildListingsHref(filters: ListingSearchFilters): string {
  const params = new URLSearchParams();

  if (filters.area && filters.area !== "any") {
    params.set("area", filters.area);
  }
  if (filters.maxPrice && filters.maxPrice !== "any") {
    params.set("maxPrice", filters.maxPrice);
  }
  if (filters.roomType && filters.roomType !== "any") {
    params.set("roomType", filters.roomType);
  }

  const query = params.toString();
  return query ? `/listings?${query}` : "/listings";
}

export function parseListingSearchParams(
  params: Record<string, string | string[] | undefined>
): ListingSearchFilters {
  const get = (key: string) => {
    const value = params[key];
    return typeof value === "string" ? value : undefined;
  };

  return {
    area: get("area"),
    maxPrice: get("maxPrice"),
    roomType: get("roomType"),
  };
}
