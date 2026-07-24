import { FeaturedListings } from "@/components/landing/featured-listings";
import { HowItWorksPath } from "@/components/landing/how-it-works-path";
import { LandingHero } from "@/components/landing/landing-hero";
import { OwnerCta } from "@/components/landing/owner-cta";
import { StatsStrip } from "@/components/landing/stats-strip";
import { SiteClosedPage } from "@/components/site-closed/site-closed-page";
import { isSiteClosed } from "@/lib/site-status";

export default function Home() {
  if (isSiteClosed()) {
    return <SiteClosedPage />;
  }

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
