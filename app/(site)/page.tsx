import { FeaturedListings } from "@/components/landing/featured-listings";
import { HowItWorksPath } from "@/components/landing/how-it-works-path";
import { LandingHero } from "@/components/landing/landing-hero";
import { OwnerCta } from "@/components/landing/owner-cta";
import { StatsStrip } from "@/components/landing/stats-strip";

export default function Home() {
  return (
    <div className="flex flex-col">
      <LandingHero />
      <StatsStrip />
      <HowItWorksPath />
      <FeaturedListings />
      <OwnerCta />
    </div>
  );
}
