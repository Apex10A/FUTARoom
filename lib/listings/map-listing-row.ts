import type { Listing, ListingOwner } from "@/lib/types/listing";

type ListingImageRow = {
  url: string;
  sort_order: number;
};

type OwnerProfileRow = {
  full_name: string;
  phone: string | null;
};

export type ListingRow = {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  area_id: string;
  area_label: string;
  room_type_id: string;
  room_type_label: string;
  price_per_year: number;
  distance_to_gate: string | null;
  amenities: string[];
  verified: boolean;
  image_url: string;
  listed_at: string;
  property_group_id?: string | null;
  listing_images?: ListingImageRow[] | null;
  owner?: OwnerProfileRow | OwnerProfileRow[] | null;
};

function resolveOwner(
  owner: ListingRow["owner"]
): OwnerProfileRow | undefined {
  if (!owner) {
    return undefined;
  }

  return Array.isArray(owner) ? owner[0] : owner;
}

export function mapListingRow(row: ListingRow): Listing {
  const images =
    row.listing_images
      ?.slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((image) => image.url) ?? [];

  const ownerProfile = resolveOwner(row.owner);
  const owner: ListingOwner | undefined = ownerProfile
    ? {
        name: ownerProfile.full_name,
        phone: ownerProfile.phone ?? "",
      }
    : undefined;

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    areaId: row.area_id,
    areaLabel: row.area_label,
    pricePerYear: row.price_per_year,
    roomTypeId: row.room_type_id,
    roomTypeLabel: row.room_type_label,
    amenities: row.amenities ?? [],
    verified: row.verified,
    imageUrl: row.image_url,
    listedAt: row.listed_at,
    distanceToGate: row.distance_to_gate ?? undefined,
    images: images.length > 0 ? images : [row.image_url],
    owner,
    propertyGroupId: row.property_group_id ?? row.id,
  };
}
