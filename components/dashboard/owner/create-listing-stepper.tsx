import type { CreateListingStep } from "@/lib/validations/listing-form";
import { CREATE_LISTING_PAGE } from "@/lib/constants/create-listing-layout";
import { cn } from "@/lib/utils";
const STEPS: { id: CreateListingStep; label: string }[] = [
  { id: "type", label: "Listing type" },
  { id: "basics", label: "Basic info" },
  { id: "details", label: "Details" },
  { id: "media", label: "Media" },
  { id: "review", label: "Review" },
];

type CreateListingStepperProps = {
  currentStep: CreateListingStep;
};

export function CreateListingStepper({ currentStep }: CreateListingStepperProps) {
  const currentIndex = STEPS.findIndex((step) => step.id === currentStep);

  return (
    <div className="border-b border-white/10">
      <div className={cn(CREATE_LISTING_PAGE, "flex gap-1 overflow-x-auto sm:gap-0")}>
        {STEPS.map((step, index) => {
          const isActive = step.id === currentStep;
          const isComplete = index < currentIndex;

          return (
            <div
              key={step.id}
              className="relative min-w-[6rem] flex-1 px-2 py-5 text-center sm:min-w-0 sm:px-4"
            >
              {isActive && (
                <span className="absolute inset-x-2 bottom-0 h-0.5 bg-[#E8B84A] sm:inset-x-4" />
              )}
              <p
                className={cn(
                  "text-xs font-semibold uppercase tracking-[0.16em] sm:text-sm",
                  isActive
                    ? "text-[#E8B84A]"
                    : isComplete
                      ? "text-white/70"
                      : "text-white/35"
                )}
              >
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
