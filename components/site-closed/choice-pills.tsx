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
                ? "border-[#0F6E56] bg-[#0F6E56] text-white"
                : "border-[#444441]/20 bg-white text-[#444441]/75 hover:border-[#0F6E56]/50 hover:text-[#0F6E56]"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
