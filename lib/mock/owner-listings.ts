import type { OwnerListing } from "@/lib/types/owner-listing";

export const MOCK_OWNER_LISTINGS: OwnerListing[] = [
  {
    id: "lst-010",
    title: "South Gate Premium Self-Contain",
    areaId: "south-gate",
    areaLabel: "South Gate",
    pricePerYear: 180000,
    roomTypeLabel: "Self-contain",
    status: "approved",
    listedAt: "2026-06-01",
    imageUrl:
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&q=80",
  },
  {
    id: "lst-002",
    title: "Peaceful Heights",
    areaId: "south-gate",
    areaLabel: "South Gate",
    pricePerYear: 120000,
    roomTypeLabel: "Self-contain",
    status: "approved",
    listedAt: "2026-05-20",
    imageUrl:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
  },
  {
    id: "lst-owner-pending",
    title: "New Block Extension — South Gate",
    areaId: "south-gate",
    areaLabel: "South Gate",
    pricePerYear: 105000,
    roomTypeLabel: "Single room",
    status: "pending",
    listedAt: "2026-06-18",
    imageUrl:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
  },
  {
    id: "lst-owner-rejected",
    title: "Quick Stay Lodge",
    areaId: "ibule",
    areaLabel: "Ibule",
    pricePerYear: 45000,
    roomTypeLabel: "3-in-a-room",
    status: "rejected",
    listedAt: "2026-06-10",
    imageUrl:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80",
  },
];

export function getOwnerListingStats(listings: OwnerListing[]) {
  return {
    total: listings.length,
    approved: listings.filter((item) => item.status === "approved").length,
    pending: listings.filter((item) => item.status === "pending").length,
    rejected: listings.filter((item) => item.status === "rejected").length,
  };
}
