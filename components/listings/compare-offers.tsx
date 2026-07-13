import Link from "next/link";
import { BadgeCheck, MessageCircle, Phone, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Listing } from "@/lib/types/listing";
import { formatNaira } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

type CompareOffersProps = {
  offers: Listing[];
  currentListingId: string;
};

function formatWhatsAppLink(phone: string): string {
  return `https://wa.me/${phone.replace(/\D/g, "")}`;
}

export function CompareOffers({ offers, currentListingId }: CompareOffersProps) {
  if (offers.length <= 1) {
    return null;
  }

  const cheapest = offers[0];
  const highest = offers[offers.length - 1];
  const savings = highest.pricePerYear - cheapest.pricePerYear;

  return (
    <section className="rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Compare offers
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {offers.length} agents list this lodge. Prices sorted lowest to
              highest.
            </p>
          </div>
          {savings > 0 && (
            <Badge className="gap-1 bg-primary/10 text-primary hover:bg-primary/10">
              <Sparkles className="size-3" />
              Save up to {formatNaira(savings)}/yr
            </Badge>
          )}
        </div>
      </div>

      <div className="divide-y divide-border">
        {offers.map((offer, index) => {
          const isCheapest = index === 0;
          const isCurrent = offer.id === currentListingId;
          const ownerName = offer.owner?.name ?? "Listed by agent";
          const ownerPhone = offer.owner?.phone;

          return (
            <div
              key={offer.id}
              className={cn(
                "flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between",
                isCurrent && "bg-primary/5"
              )}
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  {isCheapest && (
                    <Badge className="gap-1 bg-primary text-primary-foreground">
                      <BadgeCheck className="size-3" />
                      Best price
                    </Badge>
                  )}
                  {isCurrent && (
                    <Badge variant="secondary">Viewing this offer</Badge>
                  )}
                  {offer.verified && (
                    <Badge variant="outline">Verified</Badge>
                  )}
                </div>

                <div>
                  <p className="font-medium text-foreground">{ownerName}</p>
                  <p className="text-sm text-muted-foreground">
                    {offer.roomTypeLabel}
                    {ownerPhone ? ` · ${ownerPhone}` : ""}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-start gap-2 sm:items-end">
                <p className="text-xl font-semibold text-foreground">
                  {formatNaira(offer.pricePerYear)}
                  <span className="text-sm font-normal text-muted-foreground">
                    /yr
                  </span>
                </p>

                <div className="flex flex-wrap gap-2">
                  {ownerPhone ? (
                    <>
                      <Button
                        size="sm"
                        render={<a href={`tel:${ownerPhone}`} />}
                      >
                        <Phone className="size-4" />
                        Call
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        render={
                          <a
                            href={formatWhatsAppLink(ownerPhone)}
                            target="_blank"
                            rel="noopener noreferrer"
                          />
                        }
                      >
                        <MessageCircle className="size-4" />
                        WhatsApp
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" disabled>
                      Contact unavailable
                    </Button>
                  )}

                  {!isCurrent && (
                    <Button
                      size="sm"
                      variant="ghost"
                      render={<Link href={`/listings/${offer.id}`} />}
                    >
                      View offer
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-border bg-muted/30 px-5 py-3 text-xs text-muted-foreground">
        Visit the property before paying. FUTARoom compares listed prices — you
        choose who to contact.
      </div>
    </section>
  );
}
