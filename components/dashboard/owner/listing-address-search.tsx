"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  searchAkureAddress,
  type GeocodeResult,
} from "@/lib/listings/geocode-search";
import { cn } from "@/lib/utils";

type ListingAddressSearchProps = {
  onSelect: (result: GeocodeResult) => void;
  className?: string;
};

/**
 * Address/landmark search box that jumps the location picker's map to a
 * matched spot via OpenStreetMap's Nominatim geocoder. The owner still has to
 * confirm and fine-tune the pin afterwards — a search match is a starting
 * point, not a guaranteed exact location.
 */
export function ListingAddressSearch({
  onSelect,
  className,
}: ListingAddressSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchedEmpty, setSearchedEmpty] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const trimmed = query.trim();
    if (trimmed.length < 3) {
      setResults([]);
      setIsSearching(false);
      setSearchedEmpty(false);
      return;
    }

    setIsSearching(true);
    debounceRef.current = setTimeout(() => {
      searchAkureAddress(trimmed).then((found) => {
        setResults(found);
        setIsSearching(false);
        setSearchedEmpty(found.length === 0);
        setOpen(true);
      });
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/40" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          onBlur={() => {
            setTimeout(() => setOpen(false), 150);
          }}
          placeholder="Search a nearby address or landmark…"
          className="h-12 border-white/15 bg-white/5 pl-11 text-base text-white placeholder:text-white/40 lg:h-14 lg:text-lg"
        />
        {isSearching && (
          <Loader2 className="absolute right-4 top-1/2 size-4 -translate-y-1/2 animate-spin text-white/40" />
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-white/15 bg-[#111a24] shadow-xl">
          {results.map((result, index) => (
            <button
              key={`${result.latitude}-${result.longitude}-${index}`}
              type="button"
              onClick={() => {
                onSelect(result);
                setQuery(result.displayName);
                setOpen(false);
              }}
              className="block w-full border-b border-white/5 px-4 py-3 text-left text-sm text-white/80 last:border-b-0 hover:bg-white/10"
            >
              {result.displayName}
            </button>
          ))}
        </div>
      )}

      {open && !isSearching && searchedEmpty && (
        <div className="absolute z-20 mt-2 w-full rounded-xl border border-white/15 bg-[#111a24] px-4 py-3 text-sm text-white/50 shadow-xl">
          No match found — this spot may not be mapped yet. Drag the pin
          manually, or describe a nearby landmark below.
        </div>
      )}
    </div>
  );
}
