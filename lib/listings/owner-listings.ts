import { createClient } from "@/lib/supabase/server";
import type { OwnerListing } from "@/lib/types/owner-listing";

type OwnerListingRow = {
  id: string;
  title: string;
  area_id: string;
  area_label: string;
  price_per_year: number;
  room_type_label: string;
  status: OwnerListing["status"];
  image_url: string;
  listed_at: string;
};

function mapOwnerListingRow(row: OwnerListingRow): OwnerListing {
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
  };
}

export function getOwnerListingStats(listings: OwnerListing[]) {
  return {
    total: listings.length,
    approved: listings.filter((item) => item.status === "approved").length,
    pending: listings.filter((item) => item.status === "pending").length,
    rejected: listings.filter((item) => item.status === "rejected").length,
  };
}

export async function fetchOwnerListings(): Promise<OwnerListing[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("listings")
    .select(
      "id, title, area_id, area_label, price_per_year, room_type_label, status, image_url, listed_at"
    )
    .eq("owner_id", user.id)
    .order("listed_at", { ascending: false });

  if (error) {
    console.error("fetchOwnerListings:", error.message);
    return [];
  }

  return (data ?? []).map((row) => mapOwnerListingRow(row as OwnerListingRow));
}
