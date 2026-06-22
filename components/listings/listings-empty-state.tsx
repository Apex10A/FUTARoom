import Link from "next/link";
import { SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ListingsEmptyState() {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-muted/30 px-6 py-14 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <SearchX className="size-7" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-foreground">
        No listings match your search
      </h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Try widening your budget, picking a different area, or changing the room
        type to see more available properties.
      </p>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <Button render={<Link href="/" />}>
          <SearchX className="size-4" />
          Adjust search
        </Button>
        <Button variant="outline" render={<Link href="/listings" />}>
          View all listings
        </Button>
      </div>
    </div>
  );
}
