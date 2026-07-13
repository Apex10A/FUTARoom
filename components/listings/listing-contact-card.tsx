import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";

import { FavoriteButton } from "@/components/listings/favorite-button";
import { Button } from "@/components/ui/button";
import type { Listing, ListingOwner } from "@/lib/types/listing";
import { formatListedDate, formatNaira } from "@/lib/utils/format";

type ListingContactCardProps = {
  listing: Listing;
  owner?: ListingOwner;
  offerCount?: number;
  cheapestPrice?: number;
};

export function ListingContactCard({
  listing,
  owner,
  offerCount = 1,
  cheapestPrice,
}: ListingContactCardProps) {
  const hasMultipleOffers = offerCount > 1;
  const isCheapest =
    hasMultipleOffers && cheapestPrice === listing.pricePerYear;

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-2xl font-semibold text-foreground">
          {formatNaira(listing.pricePerYear)}
        </p>
        <span className="text-sm text-muted-foreground">per year</span>
      </div>

      {hasMultipleOffers && (
        <p className="mt-2 text-sm text-primary">
          {isCheapest
            ? `Best price of ${offerCount} offers`
            : `One of ${offerCount} offers · from ${formatNaira(cheapestPrice ?? listing.pricePerYear)}`}
        </p>
      )}

      <p className="mt-1 text-sm text-muted-foreground">
        Listed {formatListedDate(listing.listedAt)}
      </p>

      {listing.distanceToGate && (
        <p className="mt-3 text-sm text-muted-foreground">
          {listing.distanceToGate} from campus gate
        </p>
      )}

      <div className="mt-5 flex flex-col gap-2">
        {owner ? (
          <>
            <Button
              size="lg"
              className="w-full"
              render={<a href={`tel:${owner.phone}`} />}
            >
              <Phone className="size-4" />
              Contact {hasMultipleOffers ? "this agent" : "owner"}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full"
              render={
                <a
                  href={`https://wa.me/${owner.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              <MessageCircle className="size-4" />
              WhatsApp {hasMultipleOffers ? "agent" : "owner"}
            </Button>
          </>
        ) : (
          <Button size="lg" className="w-full" disabled>
            Contact unavailable
          </Button>
        )}

        {hasMultipleOffers && (
          <p className="text-center text-xs text-muted-foreground">
            Compare all {offerCount} offers in the section below
          </p>
        )}

        <FavoriteButton
          listingId={listing.id}
          size="default"
          className="w-full justify-center bg-muted hover:bg-muted"
        />

        <Button
          variant="ghost"
          className="w-full"
          render={<Link href="/listings" />}
        >
          Browse more listings
        </Button>
      </div>
    </div>
  );
}
