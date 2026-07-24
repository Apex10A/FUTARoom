"use client";

import { cn } from "@/lib/utils";
import type { PriorityItem } from "@/lib/types/survey";

const PRIORITY_ITEMS: { id: PriorityItem; label: string }[] = [
  { id: "price", label: "Price" },
  { id: "distance_to_gate", label: "Distance to gate" },
  { id: "room_type", label: "Room type" },
  { id: "amenities", label: "Amenities (water/light)" },
  { id: "safety", label: "Safety of area" },
];

type PriorityRankerProps = {
  ranking: PriorityItem[];
  onChange: (ranking: PriorityItem[]) => void;
};

export function PriorityRanker({ ranking, onChange }: PriorityRankerProps) {
  function toggleItem(id: PriorityItem) {
    if (ranking.includes(id)) {
      onChange(ranking.filter((item) => item !== id));
      return;
    }
    onChange([...ranking, id]);
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-2">
        {PRIORITY_ITEMS.map((item) => {
          const rank = ranking.indexOf(item.id);
          const isRanked = rank !== -1;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleItem(item.id)}
              className={cn(
                "flex items-center gap-3 rounded-lg border px-3.5 py-3 text-left text-sm font-medium leading-snug transition-colors sm:px-4",
                isRanked
                  ? "border-[#E8B84A]/50 bg-[#E8B84A]/10 text-white"
                  : "border-white/15 bg-white/5 text-white/70 hover:border-white/30 hover:text-white"
              )}
            >
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                  isRanked
                    ? "bg-[#E8B84A] text-[#0a100e]"
                    : "border border-white/20 text-white/40"
                )}
              >
                {isRanked ? rank + 1 : ""}
              </span>
              {item.label}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-white/45">
        Tap in order, most important first. Tap again to remove.{" "}
        {ranking.length > 0 && ranking.length < PRIORITY_ITEMS.length && (
          <span className="text-[#E8B84A]">
            {PRIORITY_ITEMS.length - ranking.length} left to rank.
          </span>
        )}
      </p>
    </div>
  );
}
