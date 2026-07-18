import { Building2, Layers } from "lucide-react";

import type { CreateListingFormData } from "@/lib/validations/listing-form";
import { CREATE_LISTING_FORM } from "@/lib/constants/create-listing-layout";
import { LANDING_THEME } from "@/lib/constants/landing";
import { cn } from "@/lib/utils";
const MODES = [
  {
    id: "new" as const,
    icon: Building2,
    title: "New lodge",
    description:
      "List a property for the first time on FUTARoom. Add the lodge name, area, price, and your contact details.",
  },
  {
    id: "existing" as const,
    icon: Layers,
    title: "Offer on existing lodge",
    description:
      "Another agent already listed this lodge? Add your price offer so students can compare and contact you directly.",
  },
];

type ListingModeCardsProps = {
  value: CreateListingFormData["listingMode"];
  onChange: (mode: CreateListingFormData["listingMode"]) => void;
};

export function ListingModeCards({ value, onChange }: ListingModeCardsProps) {
  return (
    <div className={cn(CREATE_LISTING_FORM, "grid gap-5 sm:grid-cols-2 lg:gap-6")}>
      {MODES.map((mode) => {
        const selected = value === mode.id;
        const Icon = mode.icon;

        return (
          <button
            key={mode.id}
            type="button"
            onClick={() => onChange(mode.id)}
            className={cn(
              "rounded-2xl border p-6 text-left transition-all cursor-pointer lg:p-8",
              selected
                ? "border-[#E8B84A]/50 bg-[#E8B84A]/10 ring-1 ring-[#E8B84A]/30"
                : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
            )}
          >
            <div
              className={cn(
                "mb-5 flex size-14 items-center justify-center rounded-xl",
                selected
                  ? "bg-[#E8B84A]/20 text-[#E8B84A]"
                  : "bg-primary/15 text-primary"
              )}
            >
              <Icon className="size-6" />
            </div>
            <p
              className="text-lg font-semibold lg:text-xl"
              style={selected ? { color: LANDING_THEME.accent } : undefined}
            >
              {mode.title}
            </p>
            <p className="mt-2 text-base leading-relaxed text-white/60 lg:text-lg">
              {mode.description}
            </p>
          </button>
        );
      })}
    </div>
  );}
