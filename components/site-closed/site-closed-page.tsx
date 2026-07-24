import { PrePlatformSurveyForm } from "@/components/site-closed/pre-platform-survey-form";

export function SiteClosedPage() {
  return (
    <section className="min-h-full bg-[#0a100e]">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
        <div className="mb-6 space-y-2 text-center sm:mb-8">
          <h2 className="text-xl font-semibold leading-snug text-white sm:text-3xl">
            Help us decide what to build next
          </h2>
          <p className="text-sm text-white/55 sm:text-base">
            8 quick questions about how you search for lodges around FUTA
            today. No sign-up needed.
          </p>
        </div>
        <PrePlatformSurveyForm />
      </div>
    </section>
  );
}
