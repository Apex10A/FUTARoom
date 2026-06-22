import Link from "next/link";
import { BadgeCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { HeroSearch } from "@/components/landing/hero-search";
import { PopularAreas } from "@/components/landing/popular-areas";
import { StatsStrip } from "@/components/landing/stats-strip";
import { FeatureCards } from "@/components/landing/feature-cards";
import { OwnerCta } from "@/components/landing/owner-cta";

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="border-b border-border bg-gradient-to-b from-secondary/50 via-secondary/20 to-background">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
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

          <HeroSearch />
          <PopularAreas />
        </div>
      </section>

      <StatsStrip />
      <FeatureCards />
      <OwnerCta />
    </div>
  );
}
