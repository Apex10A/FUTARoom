import { FeaturedListings } from "@/components/landing/featured-listings";
import { FeatureCards } from "@/components/landing/feature-cards";
import { LandingHero } from "@/components/landing/landing-hero";
import { OwnerCta } from "@/components/landing/owner-cta";
import { StatsStrip } from "@/components/landing/stats-strip";

export default function Home() {
  return (
    <div className="flex flex-col">
      <LandingHero />
      <StatsStrip />
      <FeaturedListings />
      <FeatureCards />
      <OwnerCta />
    </div>
  );
}
