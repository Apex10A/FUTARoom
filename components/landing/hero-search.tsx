"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FUTA_AREAS } from "@/lib/constants/areas";
import { BUDGET_OPTIONS, ROOM_TYPES } from "@/lib/constants/listing-filters";
import { buildListingsHref } from "@/lib/listings/search-params";

export function HeroSearch() {
  const router = useRouter();
  const [area, setArea] = useState("any");
  const [maxPrice, setMaxPrice] = useState("any");
  const [roomType, setRoomType] = useState("any");

  function handleAreaChange(value: string | null) {
    setArea(value ?? "any");
  }

  function handleBudgetChange(value: string | null) {
    setMaxPrice(value ?? "any");
  }

  function handleRoomTypeChange(value: string | null) {
    setRoomType(value ?? "any");
  }

  function handleSearch() {
    router.push(
      buildListingsHref({
        area: area === "any" ? undefined : area,
        maxPrice: maxPrice === "any" ? undefined : maxPrice,
        roomType: roomType === "any" ? undefined : roomType,
      })
    );
  }

  return (
    <div className="w-full max-w-4xl">
      <div className="rounded-2xl border border-white/15 bg-white/5 p-3 shadow-xl shadow-black/30">
        <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end">
          <div className="space-y-1.5">
            <Label htmlFor="hero-area" className="text-xs text-white/60">
              Area
            </Label>
            <Select value={area} onValueChange={handleAreaChange}>
              <SelectTrigger id="hero-area" className="w-full">
                <SelectValue placeholder="Select area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">All areas</SelectItem>
                {FUTA_AREAS.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="hero-budget"
              className="text-xs text-white/60"
            >
              Max budget (per year)
            </Label>
            <Select value={maxPrice} onValueChange={handleBudgetChange}>
              <SelectTrigger id="hero-budget" className="w-full">
                <SelectValue placeholder="Any budget" />
              </SelectTrigger>
              <SelectContent>
                {BUDGET_OPTIONS.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="hero-room-type"
              className="text-xs text-white/60"
            >
              Room type
            </Label>
            <Select value={roomType} onValueChange={handleRoomTypeChange}>
              <SelectTrigger id="hero-room-type" className="w-full">
                <SelectValue placeholder="Any room type" />
              </SelectTrigger>
              <SelectContent>
                {ROOM_TYPES.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            size="lg"
            className="h-10 w-full md:w-auto md:min-w-[120px]"
            onClick={handleSearch}
          >
            <Search className="size-4" />
            Search
          </Button>
        </div>
      </div>
    </div>
  );
}
