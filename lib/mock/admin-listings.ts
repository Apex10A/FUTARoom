import type { AdminListing } from "@/lib/types/admin-listing";
import type { ListingStatus } from "@/lib/types/owner-listing";

export const MOCK_ADMIN_LISTINGS: AdminListing[] = [
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
    ownerName: "Mr. Adebayo",
    ownerEmail: "adebayo@example.com",
    ownerPhone: "+2348012345678",
  },
  {
    id: "lst-admin-pending-1",
    title: "Sunrise Lodge Annex",
    areaId: "north-gate",
    areaLabel: "North Gate",
    pricePerYear: 98000,
    roomTypeLabel: "2-in-a-room",
    status: "pending",
    listedAt: "2026-06-19",
    imageUrl:
      "https://images.unsplash.com/photo-1574643150339-04e90be74463?w=800&q=80",
    ownerName: "Mrs. Akintola",
    ownerEmail: "akintola@example.com",
    ownerPhone: "+2348112345678",
  },
  {
    id: "lst-admin-pending-2",
    title: "Ibule Corner Self-Contain",
    areaId: "ibule",
    areaLabel: "Ibule",
    pricePerYear: 135000,
    roomTypeLabel: "Self-contain",
    status: "pending",
    listedAt: "2026-06-20",
    imageUrl:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
    ownerName: "Mrs. Fasanya",
    ownerEmail: "fasanya@example.com",
    ownerPhone: "+2348056789012",
  },
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
    ownerName: "Mr. Praise Properties",
    ownerEmail: "praise.properties@example.com",
    ownerPhone: "+2348101234567",
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
    ownerName: "Mrs. Ogunleye",
    ownerEmail: "ogunleye@example.com",
    ownerPhone: "+2348023456789",
  },
  {
    id: "lst-008",
    title: "FUTA Community Hostel",
    areaId: "futa-community",
    areaLabel: "FUTA Community",
    pricePerYear: 110000,
    roomTypeLabel: "Single room",
    status: "approved",
    listedAt: "2026-05-28",
    imageUrl:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    ownerName: "Mrs. Eze",
    ownerEmail: "eze@example.com",
    ownerPhone: "+2348089012345",
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
    ownerName: "Mr. Ibrahim",
    ownerEmail: "ibrahim@example.com",
    ownerPhone: "+2348045678901",
  },
  {
    id: "lst-admin-rejected-1",
    title: "Unverified Budget Rooms",
    areaId: "akure-town",
    areaLabel: "Akure Township",
    pricePerYear: 40000,
    roomTypeLabel: "3-in-a-room",
    status: "rejected",
    listedAt: "2026-06-08",
    imageUrl:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
    ownerName: "Mr. Bello",
    ownerEmail: "bello@example.com",
    ownerPhone: "+2348090123456",
  },
];

export function getAdminListingStats(listings: AdminListing[]) {
  return {
    total: listings.length,
    pending: listings.filter((item) => item.status === "pending").length,
    approved: listings.filter((item) => item.status === "approved").length,
    rejected: listings.filter((item) => item.status === "rejected").length,
    owners: new Set(
      listings.map((item) => item.ownerEmail || item.ownerName)
    ).size,
  };
}

export function applyStatusOverrides(
  listings: AdminListing[],
  overrides: Record<string, ListingStatus>
): AdminListing[] {
  return listings.map((listing) => ({
    ...listing,
    status: overrides[listing.id] ?? listing.status,
  }));
}
