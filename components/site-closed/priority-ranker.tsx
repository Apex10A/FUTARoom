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
                  ? "border-[#0F6E56] bg-[#E1F5EE] text-[#04342C]"
                  : "border-[#444441]/20 bg-white text-[#444441]/75 hover:border-[#0F6E56]/40 hover:text-[#0F6E56]"
              )}
            >
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                  isRanked
                    ? "bg-[#0F6E56] text-white"
                    : "border border-[#444441]/25 text-[#444441]/40"
                )}
              >
                {isRanked ? rank + 1 : ""}
              </span>
              {item.label}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-[#444441]/60">
        Tap in order, most important first. Tap again to remove.{" "}
        {ranking.length > 0 && ranking.length < PRIORITY_ITEMS.length && (
          <span className="text-[#0F6E56]">
            {PRIORITY_ITEMS.length - ranking.length} left to rank.
          </span>
        )}
      </p>
    </div>
  );
}
