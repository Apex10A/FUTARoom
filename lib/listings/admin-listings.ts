"use client";

import { createClient } from "@/lib/supabase/client";
import type { AdminListing } from "@/lib/types/admin-listing";
import type { ListingStatus } from "@/lib/types/owner-listing";

type AdminListingRow = {
  id: string;
  title: string;
  area_id: string;
  area_label: string;
  price_per_year: number;
  room_type_label: string;
  status: ListingStatus;
  image_url: string;
  listed_at: string;
  owner?: { full_name: string; phone: string | null } | { full_name: string; phone: string | null }[] | null;
};

function resolveOwner(
  owner: AdminListingRow["owner"]
): { full_name: string; phone: string | null } | undefined {
  if (!owner) return undefined;
  return Array.isArray(owner) ? owner[0] : owner;
}

function mapAdminListingRow(row: AdminListingRow): AdminListing {
  const owner = resolveOwner(row.owner);

  return {
    id: row.id,
    title: row.title,
    areaId: row.area_id,
    areaLabel: row.area_label,
    pricePerYear: row.price_per_year,
    roomTypeLabel: row.room_type_label,
    status: row.status,
    listedAt: row.listed_at,
    imageUrl: row.image_url,
    ownerName: owner?.full_name ?? "Unknown owner",
    ownerPhone: owner?.phone ?? "Not provided",
  };
}

const ADMIN_LISTING_SELECT = `
  id,
  title,
  area_id,
  area_label,
  price_per_year,
  room_type_label,
  status,
  image_url,
  listed_at,
  owner:profiles!listings_owner_id_fkey ( full_name, phone )
`;

async function requireAdmin() {
  const supabase = createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { supabase, error: "Sign in as an admin to manage listings." };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    return { supabase, error: profileError.message };
  }

  if (profile?.role !== "admin") {
    return { supabase, error: "Only admin accounts can access moderation." };
  }

  return { supabase, error: undefined };
}

export function getAdminListingStats(listings: AdminListing[]) {
  return {
    total: listings.length,
    pending: listings.filter((item) => item.status === "pending").length,
    approved: listings.filter((item) => item.status === "approved").length,
    rejected: listings.filter((item) => item.status === "rejected").length,
    owners: new Set(listings.map((item) => item.ownerName)).size,
  };
}

export async function fetchAdminListings(): Promise<{
  listings: AdminListing[];
  error?: string;
}> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) {
    return { listings: [], error: authError };
  }

  const { data, error } = await supabase
    .from("listings")
    .select(ADMIN_LISTING_SELECT)
    .order("listed_at", { ascending: false });

  if (error) {
    return { listings: [], error: error.message };
  }

  return {
    listings: (data ?? []).map((row) => mapAdminListingRow(row as AdminListingRow)),
  };
}

export async function updateListingStatus(
  listingId: string,
  status: ListingStatus
): Promise<{ error?: string }> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) {
    return { error: authError };
  }

  const { error } = await supabase
    .from("listings")
    .update({
      status,
      verified: status === "approved",
    })
    .eq("id", listingId);

  if (error) {
    return { error: error.message };
  }

  return {};
}
