import type { ListingStatus } from "@/lib/types/owner-listing";

const MODERATION_KEY = "futaroom:admin-moderation";

export function readModerationOverrides(): Record<string, ListingStatus> {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(MODERATION_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, ListingStatus>;
    return parsed ?? {};
  } catch {
    return {};
  }
}

export function writeModerationOverride(
  listingId: string,
  status: ListingStatus
) {
  if (typeof window === "undefined") return;

  const current = readModerationOverrides();
  current[listingId] = status;
  window.localStorage.setItem(MODERATION_KEY, JSON.stringify(current));
}

export function clearModerationOverrides() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(MODERATION_KEY);
}
