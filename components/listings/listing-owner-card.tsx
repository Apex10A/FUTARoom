import { Phone, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ListingOwner } from "@/lib/types/listing";

type ListingOwnerCardProps = {
  owner: ListingOwner;
};

export function ListingOwnerCard({ owner }: ListingOwnerCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="text-lg font-semibold text-foreground">Property owner</h2>
      <div className="mt-4 flex items-start gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <User className="size-5" />
        </div>
        <div>
          <p className="font-medium text-foreground">{owner.name}</p>
          {owner.responseLabel && (
            <p className="mt-1 text-sm text-muted-foreground">
              {owner.responseLabel}
            </p>
          )}
        </div>
      </div>
      <Button
        className="mt-4 w-full sm:w-auto"
        render={<a href={`tel:${owner.phone}`} />}
      >
        <Phone className="size-4" />
        Call {owner.phone}
      </Button>
    </div>
  );
}
