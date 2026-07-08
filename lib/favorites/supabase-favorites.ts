"use client";

import {
  mapListingRow,
  type ListingRow,
} from "@/lib/listings/map-listing-row";
import { createClient } from "@/lib/supabase/client";
import type { Listing } from "@/lib/types/listing";

const LEGACY_FAVORITES_KEY = "futaroom:favorites";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuid(value: string): boolean {
  return UUID_REGEX.test(value);
}

const FAVORITE_LISTING_SELECT = `
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
  listed_at
`;

export function readLegacyFavoriteIds(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(LEGACY_FAVORITES_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (id): id is string => typeof id === "string" && isUuid(id)
    );
  } catch {
    return [];
  }
}

export function clearLegacyFavoriteIds() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(LEGACY_FAVORITES_KEY);
}

export async function fetchFavoriteIds(userId: string): Promise<string[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("favorites")
    .select("listing_id, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => row.listing_id);
}

export async function addFavorite(
  userId: string,
  listingId: string
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("favorites").insert({
    user_id: userId,
    listing_id: listingId,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function removeFavorite(
  userId: string,
  listingId: string
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", userId)
    .eq("listing_id", listingId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function migrateLegacyFavorites(userId: string): Promise<string[]> {
  const legacyIds = readLegacyFavoriteIds();

  if (legacyIds.length === 0) {
    return fetchFavoriteIds(userId);
  }

  const existing = await fetchFavoriteIds(userId);
  const toAdd = legacyIds.filter((id) => !existing.includes(id));

  if (toAdd.length > 0) {
    const supabase = createClient();
    const { error } = await supabase.from("favorites").insert(
      toAdd.map((listing_id) => ({
        user_id: userId,
        listing_id,
      }))
    );

    if (error) {
      throw new Error(error.message);
    }
  }

  clearLegacyFavoriteIds();
  return fetchFavoriteIds(userId);
}

export async function fetchFavoriteListings(ids: string[]): Promise<Listing[]> {
  if (ids.length === 0) {
    return [];
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("listings")
    .select(FAVORITE_LISTING_SELECT)
    .in("id", ids)
    .eq("status", "approved");

  if (error) {
    console.error("fetchFavoriteListings:", error.message);
    return [];
  }

  const byId = new Map(
    (data ?? []).map((row) => [
      row.id,
      mapListingRow(row as ListingRow),
    ])
  );

  return ids
    .map((id) => byId.get(id))
    .filter((listing): listing is Listing => listing !== undefined);
}
