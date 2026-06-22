"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FUTA_AREAS } from "@/lib/constants/areas";
import {
  BUDGET_OPTIONS,
  ROOM_TYPES,
} from "@/lib/constants/listing-filters";
import type { FilterSelectValues } from "@/lib/listings/filter-helpers";

type ListingFiltersFormProps = {
  values: FilterSelectValues;
  onChange: (values: FilterSelectValues) => void;
  idPrefix?: string;
};

export function ListingFiltersForm({
  values,
  onChange,
  idPrefix = "filter",
}: ListingFiltersFormProps) {
  function update<K extends keyof FilterSelectValues>(
    key: K,
    value: string | null
  ) {
    onChange({ ...values, [key]: value ?? "any" });
  }

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor={`${idPrefix}-area`} className="text-sm">
          Area
        </Label>
        <Select
          value={values.area}
          onValueChange={(value) => update("area", value)}
        >
          <SelectTrigger id={`${idPrefix}-area`} className="w-full">
            <SelectValue placeholder="All areas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">All areas</SelectItem>
            {FUTA_AREAS.map((area) => (
              <SelectItem key={area.id} value={area.id}>
                {area.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`${idPrefix}-budget`} className="text-sm">
          Max budget (per year)
        </Label>
        <Select
          value={values.maxPrice}
          onValueChange={(value) => update("maxPrice", value)}
        >
          <SelectTrigger id={`${idPrefix}-budget`} className="w-full">
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
        <Label htmlFor={`${idPrefix}-room`} className="text-sm">
          Room type
        </Label>
        <Select
          value={values.roomType}
          onValueChange={(value) => update("roomType", value)}
        >
          <SelectTrigger id={`${idPrefix}-room`} className="w-full">
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
    </div>
  );
}
