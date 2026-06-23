import { Badge } from "@/components/ui/badge";
import {
  LISTING_STATUS_LABELS,
  type ListingStatus,
} from "@/lib/types/owner-listing";

const STATUS_VARIANT: Record<
  ListingStatus,
  "default" | "secondary" | "destructive"
> = {
  approved: "default",
  pending: "secondary",
  rejected: "destructive",
};

export function ListingStatusBadge({ status }: { status: ListingStatus }) {
  return (
    <Badge variant={STATUS_VARIANT[status]}>
      {LISTING_STATUS_LABELS[status]}
    </Badge>
  );
}
