import Link from "next/link";
import { ArrowRight, BadgeCheck, MapPin, Shield } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="border-b border-border bg-gradient-to-b from-secondary/40 to-background">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
          <Badge variant="secondary" className="gap-1">
            <BadgeCheck className="size-3" />
            Verified listings for FUTA students
          </Badge>

          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl sm:leading-tight">
              Find your lodge near{" "}
              <span className="text-primary">FUTA</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Search hostels and private lodges around campus. Compare prices by
              area, check amenities, and contact owners without agents.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" render={<Link href="/listings" />}>
              Browse listings
              <ArrowRight className="size-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              render={<Link href="/register" />}
            >
              List your property
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MapPin className="size-5" />
            </div>
            <h2 className="font-semibold text-foreground">Search by area</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              South Gate, North Gate, Ibule, and other popular student areas
              around FUTA.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Shield className="size-5" />
            </div>
            <h2 className="font-semibold text-foreground">Verified listings</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Every listing is reviewed before it goes live so students get
              accurate prices and details.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BadgeCheck className="size-5" />
            </div>
            <h2 className="font-semibold text-foreground">Direct contact</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Message property owners directly — no middlemen, no surprise fees.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
