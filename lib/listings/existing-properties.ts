"use client";

import { groupListingsForBrowse } from "@/lib/listings/group-listings";
import { mapListingRow, type ListingRow } from "@/lib/listings/map-listing-row";
import { createClient } from "@/lib/supabase/client";
import type { Listing } from "@/lib/types/listing";

export type ExistingPropertyOption = {
  propertyGroupId: string;
  title: string;
  areaId: string;
  areaLabel: string;
  roomTypeId: string;
  roomTypeLabel: string;
  description: string;
  amenities: string[];
  distanceToGate?: string;
  imageUrl: string;
  minPrice: number;
  offerCount: number;
  templateListingId: string;
};

const EXISTING_PROPERTY_SELECT = `
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
  amenities,
  verified,
  image_url,
  listed_at,
  property_group_id
`;

export async function fetchExistingProperties(): Promise<ExistingPropertyOption[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("listings")
    .select(EXISTING_PROPERTY_SELECT)
    .eq("status", "approved")
    .order("title", { ascending: true });

  if (error) {
    console.error("fetchExistingProperties:", error.message);
    return [];
  }

  const listings = (data ?? []).map((row) => mapListingRow(row as ListingRow));
  const grouped = groupListingsForBrowse(listings);

  return grouped.map((item) => ({
    propertyGroupId: item.propertyGroupId,
    title: item.title,
    areaId: item.areaId,
    areaLabel: item.areaLabel,
    roomTypeId: item.roomTypeId,
    roomTypeLabel: item.roomTypeLabel,
    description: item.description ?? "",
    amenities: item.amenities,
    distanceToGate: item.distanceToGate,
    imageUrl: item.imageUrl,
    minPrice: item.minPricePerYear,
    offerCount: item.offerCount,
    templateListingId: item.displayListingId,
  }));
}

export function getExistingPropertyTemplate(
  properties: ExistingPropertyOption[],
  propertyGroupId: string
): ExistingPropertyOption | undefined {
  return properties.find(
    (property) => property.propertyGroupId === propertyGroupId
  );
}

export type CreateListingMode = "new" | "existing";
