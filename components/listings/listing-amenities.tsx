import {
  Bath,
  Bolt,
  Car,
  Droplets,
  Shield,
  Snowflake,
  UtensilsCrossed,
  Wifi,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";

const AMENITY_ICONS: Record<string, LucideIcon> = {
  Water: Droplets,
  Security: Shield,
  WiFi: Wifi,
  Generator: Bolt,
  Kitchen: UtensilsCrossed,
  Borehole: Droplets,
  Parking: Car,
  AC: Snowflake,
};

type ListingAmenitiesProps = {
  amenities: string[];
};

export function ListingAmenities({ amenities }: ListingAmenitiesProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground">What this place offers</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {amenities.map((amenity) => {
          const Icon = AMENITY_ICONS[amenity] ?? Bath;
          return (
            <div
              key={amenity}
              className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3"
            >
              <Icon className="size-4 text-primary" />
              <span className="text-sm text-foreground">{amenity}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ListingMetaBadges({
  roomTypeLabel,
  areaLabel,
  verified,
}: {
  roomTypeLabel: string;
  areaLabel: string;
  verified: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="secondary">{roomTypeLabel}</Badge>
      <Badge variant="outline">{areaLabel}</Badge>
      {verified && <Badge className="bg-primary text-primary-foreground">Verified</Badge>}
    </div>
  );
}
