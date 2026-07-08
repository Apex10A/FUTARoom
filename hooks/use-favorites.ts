"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import {
  addFavorite,
  fetchFavoriteIds,
  migrateLegacyFavorites,
  removeFavorite,
} from "@/lib/favorites/supabase-favorites";
import { createClient } from "@/lib/supabase/client";

export function useFavorites() {
  const router = useRouter();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadFavorites() {
      setReady(false);
      setError(null);

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (cancelled) {
        return;
      }

      if (!user) {
        setUserId(null);
        setFavoriteIds([]);
        setReady(true);
        return;
      }

      setUserId(user.id);

      try {
        const ids = await migrateLegacyFavorites(user.id);
        if (!cancelled) {
          setFavoriteIds(ids);
        }
      } catch (loadError) {
        if (!cancelled) {
          setFavoriteIds([]);
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Could not load saved listings."
          );
        }
      } finally {
        if (!cancelled) {
          setReady(true);
        }
      }
    }

    void loadFavorites();

    return () => {
      cancelled = true;
    };
  }, []);

  const requireAuth = useCallback(() => {
    const redirect = encodeURIComponent(
      `${window.location.pathname}${window.location.search}`
    );
    router.push(`/login?redirect=${redirect}`);
  }, [router]);

  const isFavorite = useCallback(
    (listingId: string) => favoriteIds.includes(listingId),
    [favoriteIds]
  );

  const toggleFavorite = useCallback(
    async (listingId: string) => {
      if (!userId) {
        requireAuth();
        return;
      }

      const exists = favoriteIds.includes(listingId);
      const previous = favoriteIds;
      const optimistic = exists
        ? favoriteIds.filter((id) => id !== listingId)
        : [listingId, ...favoriteIds];

      setFavoriteIds(optimistic);
      setError(null);

      try {
        if (exists) {
          await removeFavorite(userId, listingId);
        } else {
          await addFavorite(userId, listingId);
        }
      } catch (toggleError) {
        setFavoriteIds(previous);
        setError(
          toggleError instanceof Error
            ? toggleError.message
            : "Could not update saved listing."
        );
      }
    },
    [favoriteIds, requireAuth, userId]
  );

  const removeFavoriteById = useCallback(
    async (listingId: string) => {
      if (!userId) {
        return;
      }

      const previous = favoriteIds;
      setFavoriteIds((current) => current.filter((id) => id !== listingId));
      setError(null);

      try {
        await removeFavorite(userId, listingId);
      } catch (removeError) {
        setFavoriteIds(previous);
        setError(
          removeError instanceof Error
            ? removeError.message
            : "Could not remove saved listing."
        );
      }
    },
    [favoriteIds, userId]
  );

  return {
    favoriteIds,
    ready,
    isAuthenticated: Boolean(userId),
    error,
    isFavorite,
    toggleFavorite,
    removeFavorite: removeFavoriteById,
    count: favoriteIds.length,
  };
}
