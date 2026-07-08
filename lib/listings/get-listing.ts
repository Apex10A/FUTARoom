import {
  fetchApprovedListings,
  fetchListingById,
  fetchSimilarListings,
} from "@/lib/listings/supabase-listings";
import type { Listing } from "@/lib/types/listing";

/** Server-side: load an approved listing from Supabase. */
export async function getListingById(id: string): Promise<Listing | null> {
  return fetchListingById(id);
}

/** Server-side: similar listings in the same area from Supabase. */
export async function getSimilarListings(
  listing: Listing,
  limit = 3
): Promise<Listing[]> {
  return fetchSimilarListings(listing, limit);
}

/** Server-side: all approved listings for browse / featured sections. */
export async function getApprovedListings(): Promise<Listing[]> {
  return fetchApprovedListings();
}
