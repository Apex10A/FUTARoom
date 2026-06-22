import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BadgeCheck, MapPin } from "lucide-react";
import type { Metadata } from "next";

import {
  ListingAmenities,
  ListingMetaBadges,
} from "@/components/listings/listing-amenities";
import { ListingContactCard } from "@/components/listings/listing-contact-card";
import { ListingGallery } from "@/components/listings/listing-gallery";
import { ListingOwnerCard } from "@/components/listings/listing-owner-card";
import { SimilarListings } from "@/components/listings/similar-listings";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getListingById,
  getSimilarListings,
} from "@/lib/listings/get-listing";

type ListingDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: ListingDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const listing = getListingById(id);

  if (!listing) {
    return { title: "Listing not found" };
  }

  return {
    title: listing.title,
    description:
      listing.description ??
      `${listing.roomTypeLabel} in ${listing.areaLabel} near FUTA.`,
  };
}

export default async function ListingDetailPage({
  params,
}: ListingDetailPageProps) {
  const { id } = await params;
  const listing = getListingById(id);

  if (!listing) {
    notFound();
  }

  const images = listing.images ?? [listing.imageUrl];
  const similar = getSimilarListings(listing);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Button
        variant="ghost"
        size="sm"
        className="mb-6 -ml-2"
        render={<Link href="/listings" />}
      >
        <ArrowLeft className="size-4" />
        Back to listings
      </Button>

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-10">
        <div className="space-y-8">
          <ListingGallery images={images} title={listing.title} />

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {listing.verified && (
                <Badge className="gap-1 bg-primary text-primary-foreground">
                  <BadgeCheck className="size-3" />
                  Verified listing
                </Badge>
              )}
              <ListingMetaBadges
                roomTypeLabel={listing.roomTypeLabel}
                areaLabel={listing.areaLabel}
                verified={false}
              />
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              {listing.title}
            </h1>

            <p className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="size-4 shrink-0" />
              {listing.areaLabel}
              {listing.distanceToGate && (
                <span>· {listing.distanceToGate}</span>
              )}
            </p>
          </div>

          {listing.description && (
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                About this property
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {listing.description}
              </p>
            </div>
          )}

          <ListingAmenities amenities={listing.amenities} />

          {listing.owner && <ListingOwnerCard owner={listing.owner} />}
        </div>

        <aside className="mt-8 lg:mt-0 lg:sticky lg:top-24">
          <ListingContactCard listing={listing} owner={listing.owner} />
        </aside>
      </div>

      <SimilarListings listings={similar} areaLabel={listing.areaLabel} />
    </div>
  );
}
