import { PrePlatformSurveyForm } from "@/components/site-closed/pre-platform-survey-form";

export function SiteClosedPage() {
  return (
    <section className="min-h-screen bg-[#F1EFE8]">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
        <div className="mb-6 space-y-2 text-center sm:mb-8">
          <h2 className="text-xl font-bold leading-snug text-[#0F6E56] sm:text-3xl">
            Hi, I&apos;m building a new platform to help students find lodges to stay around FUTA
          </h2>
          <p className="text-sm text-[#444441]/75 sm:text-base">
            I&apos;ve already built the core of the platform, but I need to know what features to add next.
          </p>
        </div>
        <PrePlatformSurveyForm />
      </div>
    </section>
  );
}
