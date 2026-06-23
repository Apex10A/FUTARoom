"use client";

import { useCallback, useEffect, useState } from "react";

import {
  readFavoriteIds,
  writeFavoriteIds,
} from "@/lib/favorites/storage";

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setFavoriteIds(readFavoriteIds());
    setReady(true);
  }, []);

  const isFavorite = useCallback(
    (listingId: string) => favoriteIds.includes(listingId),
    [favoriteIds]
  );

  const toggleFavorite = useCallback((listingId: string) => {
    setFavoriteIds((current) => {
      const exists = current.includes(listingId);
      const next = exists
        ? current.filter((id) => id !== listingId)
        : [...current, listingId];
      writeFavoriteIds(next);
      return next;
    });
  }, []);

  const removeFavorite = useCallback((listingId: string) => {
    setFavoriteIds((current) => {
      const next = current.filter((id) => id !== listingId);
      writeFavoriteIds(next);
      return next;
    });
  }, []);

  return {
    favoriteIds,
    ready,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    count: favoriteIds.length,
  };
}
