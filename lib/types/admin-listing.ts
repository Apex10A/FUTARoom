import type { ListingStatus } from "@/lib/types/owner-listing";

export type AdminListing = {
  id: string;
  title: string;
  areaId: string;
  areaLabel: string;
  pricePerYear: number;
  roomTypeLabel: string;
  status: ListingStatus;
  listedAt: string;
  imageUrl: string;
  ownerName: string;
  ownerPhone: string;
};

export type AdminListingTab = "pending" | "approved" | "rejected" | "all";
