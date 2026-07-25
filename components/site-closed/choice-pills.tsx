"use client";

import { cn } from "@/lib/utils";

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];

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
    <div className={cn("flex flex-col gap-2", className)}>
      {options.map((option, index) => {
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg border px-3.5 py-3 text-left text-sm font-medium leading-snug transition-colors sm:px-4",
              isActive
                ? "border-[#0F6E56] bg-[#E1F5EE] text-[#04342C]"
                : "border-[#444441]/20 bg-white text-[#444441]/80 hover:border-[#0F6E56]/40 hover:text-[#0F6E56]"
            )}
          >
            <span
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                isActive
                  ? "bg-[#0F6E56] text-white"
                  : "border border-[#444441]/25 text-[#444441]/50"
              )}
            >
              {OPTION_LETTERS[index] ?? index + 1}
            </span>
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
