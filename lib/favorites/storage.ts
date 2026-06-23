const FAVORITES_KEY = "futaroom:favorites";
const PROFILE_KEY = "futaroom:student-profile";

const DEFAULT_FAVORITE_IDS = ["lst-001", "lst-008", "lst-010"];

export function readFavoriteIds(): string[] {
  if (typeof window === "undefined") {
    return DEFAULT_FAVORITE_IDS;
  }

  try {
    const raw = window.localStorage.getItem(FAVORITES_KEY);
    if (!raw) {
      window.localStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(DEFAULT_FAVORITE_IDS)
      );
      return DEFAULT_FAVORITE_IDS;
    }

    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : DEFAULT_FAVORITE_IDS;
  } catch {
    return DEFAULT_FAVORITE_IDS;
  }
}

export function writeFavoriteIds(ids: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
}

export function readStudentProfile<T>(fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeStudentProfile<T>(profile: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}
