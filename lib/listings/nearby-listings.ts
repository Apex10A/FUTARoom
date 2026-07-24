"use client";

import { groupListingsForBrowse } from "@/lib/listings/group-listings";
import { hasListingCoordinates } from "@/lib/listings/listing-coordinates";
import { mapListingRow, type ListingRow } from "@/lib/listings/map-listing-row";
import { createClient } from "@/lib/supabase/client";
import { formatNaira } from "@/lib/utils/format";

export type NearbyListingPin = {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  priceLabel: string;
};

const NEARBY_LISTING_SELECT = `
  id,
  owner_id,
  title,
  description,
  area_id,
  area_label,
  room_type_id,
  room_type_label,
  price_per_year,
  distance_to_gate,
  latitude,
  longitude,
  amenities,
  verified,
  image_url,
  listed_at,
  property_group_id
`;

/**
 * Approved, already-pinned listings in the same area — shown as reference
 * pins while an owner is placing a new one, so they can see real lodges
 * already on FUTARoom nearby (something the base OSM tiles can't show).
 */
export async function fetchNearbyListings(
  areaId: string
): Promise<NearbyListingPin[]> {
  if (!areaId) {
    return [];
  }

  const supabase = createClient();

  const { data, error } = await supabase
    .from("listings")
    .select(NEARBY_LISTING_SELECT)
    .eq("status", "approved")
    .eq("area_id", areaId);

  if (error) {
    console.error("fetchNearbyListings:", error.message);
    return [];
  }

  const listings = (data ?? []).map((row) => mapListingRow(row as ListingRow));
  const grouped = groupListingsForBrowse(listings).filter(hasListingCoordinates);

  return grouped.map((item) => ({
    id: item.propertyGroupId,
    title: item.title,
    latitude: item.latitude!,
    longitude: item.longitude!,
    priceLabel:
      item.offerCount > 1
        ? `from ${formatNaira(item.minPricePerYear)}`
        : formatNaira(item.pricePerYear),
  }));
}
