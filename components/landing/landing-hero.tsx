import Image from "next/image";
import Link from "next/link";
import { BadgeCheck } from "lucide-react";

import { HeroSearch } from "@/components/landing/hero-search";
import { PopularAreas } from "@/components/landing/popular-areas";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LANDING_HERO } from "@/lib/constants/landing";

export function LandingHero() {
  return (
    <section className="relative min-h-[88vh] overflow-hidden">
      <Image
        src={LANDING_HERO.imageUrl}
        alt={LANDING_HERO.imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/25"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20"
      />

      <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-center px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <div className="max-w-2xl space-y-6">
          <Badge className="gap-1 border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/15">
            <BadgeCheck className="size-3" />
            Verified listings for FUTA students
          </Badge>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Find your lodge near{" "}
              <span className="text-[#E8B84A]">FUTA</span>
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
              Compare agent prices by area, check amenities, and contact agents
              directly — without scrolling through endless WhatsApp broadcasts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground shadow-lg shadow-black/20 hover:bg-primary/90"
              render={<Link href="/listings" />}
            >
              Browse lodges
            </Button>
            <p className="text-sm text-white/70">
              Search South Gate, West Gate, Ibule & more
            </p>
          </div>
        </div>

        <div className="mt-10 w-full max-w-4xl">
          <HeroSearch />
        </div>

        <div className="mt-8">
          <PopularAreas variant="hero" />
        </div>
      </div>
    </section>
  );
}
