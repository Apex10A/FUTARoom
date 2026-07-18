import {
  mapListingRow,
  type ListingRow,
} from "@/lib/listings/map-listing-row";
import { createClient } from "@/lib/supabase/server";
import type { Listing } from "@/lib/types/listing";

const LISTING_SELECT = `
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
  video_url,
  listed_at,
  property_group_id,
  listing_images ( url, sort_order ),
  owner:profiles!listings_owner_id_fkey ( full_name, phone )
`;

export async function fetchApprovedListings(): Promise<Listing[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("listings")
    .select(LISTING_SELECT)
    .eq("status", "approved")
    .order("listed_at", { ascending: false });

  if (error) {
    console.error("fetchApprovedListings:", error.message);
    return [];
  }

  return (data ?? []).map((row) => mapListingRow(row as ListingRow));
}

export async function fetchListingById(id: string): Promise<Listing | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("listings")
    .select(LISTING_SELECT)
    .eq("id", id)
    .eq("status", "approved")
    .maybeSingle();

  if (error) {
    console.error("fetchListingById:", error.message);
    return null;
  }

  if (!data) {
    return null;
  }

  return mapListingRow(data as ListingRow);
}

export async function fetchOffersForPropertyGroup(
  propertyGroupId: string
): Promise<Listing[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("listings")
    .select(LISTING_SELECT)
    .eq("status", "approved")
    .eq("property_group_id", propertyGroupId)
    .order("price_per_year", { ascending: true });

  if (error) {
    console.error("fetchOffersForPropertyGroup:", error.message);
    return [];
  }

  return (data ?? []).map((row) => mapListingRow(row as ListingRow));
}

export async function fetchSimilarListings(
  listing: Listing,
  limit = 3
): Promise<Listing[]> {
  const supabase = await createClient();
  const propertyGroupId = listing.propertyGroupId ?? listing.id;

  const { data, error } = await supabase
    .from("listings")
    .select(LISTING_SELECT)
    .eq("status", "approved")
    .eq("area_id", listing.areaId)
    .neq("property_group_id", propertyGroupId)
    .order("listed_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("fetchSimilarListings:", error.message);
    return [];
  }

  return (data ?? []).map((row) => mapListingRow(row as ListingRow));
}
