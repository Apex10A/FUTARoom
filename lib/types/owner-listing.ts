export type ListingStatus = "pending" | "approved" | "rejected";

export const LISTING_STATUS_LABELS: Record<ListingStatus, string> = {
  pending: "Pending review",
  approved: "Approved",
  rejected: "Rejected",
};

export type OwnerListing = {
  id: string;
  title: string;
  areaId: string;
  areaLabel: string;
  pricePerYear: number;
  roomTypeLabel: string;
  status: ListingStatus;
  listedAt: string;
  imageUrl: string;
};
