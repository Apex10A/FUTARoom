import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function ListingNotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center sm:px-6">
      <h1 className="text-2xl font-semibold text-foreground">
        Listing not found
      </h1>
      <p className="mt-2 text-muted-foreground">
        This property may have been removed or the link is incorrect.
      </p>
      <Button className="mt-6" render={<Link href="/listings" />}>
        Browse all listings
      </Button>
    </div>
  );
}
