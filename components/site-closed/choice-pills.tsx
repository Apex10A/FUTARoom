"use client";

import { cn } from "@/lib/utils";

type ChoicePillsProps<T extends string> = {
  options: { value: T; label: string }[];
  value: T | null;
  onChange: (value: T) => void;
  className?: string;
};

export function ChoicePills<T extends string>({
  options,
  value,
  onChange,
  className,
}: ChoicePillsProps<T>) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {options.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-full border px-4 py-2.5 text-sm font-medium transition-colors sm:py-2",
              isActive
                ? "border-[#E8B84A] bg-[#E8B84A]/15 text-[#E8B84A]"
                : "border-white/15 bg-white/5 text-white/70 hover:border-white/30 hover:text-white"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
