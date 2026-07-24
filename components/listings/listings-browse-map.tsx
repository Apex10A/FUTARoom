"use client";

import dynamic from "next/dynamic";

import type { PropertyBrowseItem } from "@/lib/types/listing";
import { toListingMapPins } from "@/lib/listings/to-map-pins";

const ListingMap = dynamic(
  () =>
    import("@/components/listings/listing-map").then((mod) => mod.ListingMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[420px] items-center justify-center rounded-xl border border-white/10 bg-muted/30 text-sm text-muted-foreground">
        Loading map…
      </div>
    ),
  }
);

type ListingsBrowseMapProps = {
  listings: PropertyBrowseItem[];
};

export function ListingsBrowseMap({ listings }: ListingsBrowseMapProps) {
  const pins = toListingMapPins(listings);

  if (pins.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/15 bg-muted/20 px-6 py-12 text-center text-sm text-muted-foreground">
        No map pins yet. Run the coordinate migration and seed script in Supabase
        to simulate lodge locations.
      </div>
    );
  }

  return (
    <ListingMap
      key={listings.map((listing) => listing.propertyGroupId).join(",")}
      pins={pins}
      heightClassName="h-[480px] lg:h-[560px]"
    />
  );
}
