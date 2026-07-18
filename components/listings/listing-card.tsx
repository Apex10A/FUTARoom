import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, MapPin, Play, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { FavoriteButton } from "@/components/listings/favorite-button";
import { isListingVideoPlaceholder } from "@/lib/constants/listing-media";
import type { Listing, PropertyBrowseItem } from "@/lib/types/listing";
import { formatNaira } from "@/lib/utils/format";

type ListingCardProps = {
  listing: Listing | PropertyBrowseItem;
};

function isGroupedListing(
  listing: Listing | PropertyBrowseItem
): listing is PropertyBrowseItem {
  return "offerCount" in listing && listing.offerCount > 1;
}

export function ListingCard({ listing }: ListingCardProps) {
  const grouped = isGroupedListing(listing);
  const href = grouped
    ? `/listings/${listing.displayListingId}`
    : `/listings/${listing.id}`;
  const favoriteId = grouped ? listing.displayListingId : listing.id;
  const showVideoBadge =
    Boolean(listing.videoUrl) &&
    isListingVideoPlaceholder(listing.imageUrl);

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={listing.imageUrl}
          alt={listing.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {listing.verified && (
          <Badge
            className="absolute left-3 top-3 gap-1 bg-primary text-primary-foreground shadow-sm"
          >
            <BadgeCheck className="size-3" />
            Verified
          </Badge>
        )}
        {grouped && (
          <Badge
            variant="secondary"
            className="absolute bottom-3 left-3 gap-1 bg-background/95 shadow-sm"
          >
            <Users className="size-3" />
            {listing.offerCount} offers
          </Badge>
        )}
        {showVideoBadge && (
          <Badge className="absolute bottom-3 right-3 gap-1 bg-background/95 text-foreground shadow-sm">
            <Play className="size-3 fill-current" />
            Video tour
          </Badge>
        )}
        <FavoriteButton
          listingId={favoriteId}
          className="absolute right-3 top-3"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold leading-snug text-foreground group-hover:text-primary">
              {listing.title}
            </h3>
            <div className="shrink-0 text-right">
              {grouped ? (
                <>
                  <p className="text-xs text-muted-foreground">From</p>
                  <p className="text-sm font-semibold text-foreground">
                    {formatNaira(listing.minPricePerYear)}
                    <span className="text-xs font-normal text-muted-foreground">
                      /yr
                    </span>
                  </p>
                </>
              ) : (
                <p className="text-sm font-semibold text-foreground">
                  {formatNaira(listing.pricePerYear)}
                  <span className="text-xs font-normal text-muted-foreground">
                    /yr
                  </span>
                </p>
              )}
            </div>
          </div>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" />
            {listing.areaLabel}
            {listing.distanceToGate && (
              <span className="text-muted-foreground/80">
                · {listing.distanceToGate}
              </span>
            )}
          </p>
          {grouped && listing.minPricePerYear !== listing.maxPricePerYear && (
            <p className="text-xs font-medium text-primary">
              {formatNaira(listing.minPricePerYear)} –{" "}
              {formatNaira(listing.maxPricePerYear)} · Compare agent prices
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{listing.roomTypeLabel}</Badge>
          {listing.amenities.slice(0, 2).map((amenity) => (
            <Badge key={amenity} variant="outline" className="text-xs">
              {amenity}
            </Badge>
          ))}
        </div>
      </div>
    </Link>
  );
}
