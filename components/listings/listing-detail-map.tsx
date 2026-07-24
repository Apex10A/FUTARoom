"use client";

import dynamic from "next/dynamic";

import type { ListingMapPin } from "@/lib/listings/to-map-pins";
import { formatNaira } from "@/lib/utils/format";

const ListingMap = dynamic(
  () =>
    import("@/components/listings/listing-map").then((mod) => mod.ListingMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[280px] items-center justify-center rounded-xl border border-white/10 bg-muted/30 text-sm text-muted-foreground">
        Loading map…
      </div>
    ),
  }
);

type ListingDetailMapProps = {
  listing: {
    id: string;
    title: string;
    areaLabel: string;
    latitude?: number;
    longitude?: number;
    pricePerYear: number;
  };
};

export function ListingDetailMap({ listing }: ListingDetailMapProps) {
  if (listing.latitude == null || listing.longitude == null) {
    return null;
  }

  const pin: ListingMapPin = {
    id: listing.id,
    title: listing.title,
    areaLabel: listing.areaLabel,
    latitude: listing.latitude,
    longitude: listing.longitude,
    priceLabel: formatNaira(listing.pricePerYear),
    href: `/listings/${listing.id}`,
  };

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Location</h2>
      <ListingMap
        pins={[pin]}
        zoom={15}
        heightClassName="h-[280px] sm:h-[320px]"
      />
    </div>
  );
}
