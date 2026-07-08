"use client";

import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/use-favorites";
import { cn } from "@/lib/utils";

type FavoriteButtonProps = {
  listingId: string;
  className?: string;
  size?: "default" | "icon";
};

export function FavoriteButton({
  listingId,
  className,
  size = "icon",
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite, ready } = useFavorites();
  const saved = isFavorite(listingId);

  return (
    <Button
      type="button"
      variant="secondary"
      size={size}
      className={cn(
        "bg-background/90 shadow-sm hover:bg-background",
        className
      )}
      aria-label={saved ? "Remove from saved listings" : "Save listing"}
      aria-pressed={saved}
      disabled={!ready}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void toggleFavorite(listingId);
      }}
    >
      <Heart
        className={cn("size-4", saved && "fill-primary text-primary")}
      />
      {size === "default" && (
        <span>{saved ? "Saved" : "Save listing"}</span>
      )}
    </Button>
  );
}
